import { GoogleGenerativeAI } from '@google/generative-ai';
import { BASE_SYSTEM_PROMPT, MIDWIFE_MODE_PROMPT } from './systemPrompt';
import { RetrievalService } from './retrieval';

// Simple check for Gemini API key
const getApiKey = () => {
  return process.env.GEMINI_API_KEY || '';
};

export class GeminiService {
  /**
   * Generates a streaming response from Gemini, injecting database context and safety guardrails.
   * Exposes raw chunks for SSE (Server-Sent Events).
   */
  public static async *generateChatStream(
    message: string,
    history: { role: 'user' | 'model'; text: string }[],
    userProfile: {
      stage: string;
      trimester: string | null;
      weeksPostpartum: number | null;
      goals: string[];
      dueOrBirthDate: string | null;
      completedExercises?: string[];
    },
    useMidwifeMode: boolean
  ): AsyncGenerator<string, void, unknown> {
    const apiKey = getApiKey();
    if (!apiKey) {
      // Return a graceful error message or a simulated stream if API key is missing during local setup
      yield "System Note: GEMINI_API_KEY is not configured on the backend. Please add it to your .env file.\n\n";
      yield "This is a simulated wellness companion response to help you verify features: Make sure to rest, stay hydrated, and follow your customized daily plan!";
      return;
    }

    const { stage, trimester, weeksPostpartum, goals, dueOrBirthDate, completedExercises } = userProfile;

    // 1. Retrieve related database context
    const dbContext = RetrievalService.retrieveContext(message, stage, trimester, weeksPostpartum);

    // 2. Build full system prompt
    let systemInstruction = BASE_SYSTEM_PROMPT;
    if (useMidwifeMode) {
      systemInstruction += "\n" + MIDWIFE_MODE_PROMPT;
    }

    // Add profile data directly to system instructions for context memory
    const todayStr = new Date().toDateString();
    systemInstruction += `
---
### USER PROFILE CONTEXT
- Current Time: ${todayStr}
- Stage: ${stage.toUpperCase()}
- Trimester: ${trimester || 'N/A'}
- Weeks Postpartum: ${weeksPostpartum || 'N/A'}
- Estimated Due Date / Birth Date: ${dueOrBirthDate || 'N/A'}
- User Health Goals: ${goals.join(', ') || 'General Wellness'}
- Completed Exercise IDs: ${(completedExercises || []).join(', ') || 'None yet'}

---
### LOCAL RETRIEVED REFERENCE DATABASE
Use the following database records to personalize, explain, or structure safety checks. If raw facts do not exist here, state clearly that the database does not contain this information and advise consulting a doctor.
${dbContext}
`;

    // 3. Format history for Google Generative AI
    // The SDK expects contents in format: { role: 'user' | 'model', parts: [{ text: string }] }
    const contents: any[] = [];
    
    // Add history
    for (const h of history) {
      contents.push({
        role: h.role === 'model' ? 'model' : 'user',
        parts: [{ text: h.text }],
      });
    }

    // Add current user message
    contents.push({
      role: 'user',
      parts: [{ text: message }],
    });

    // 4. Invoke API with retry logic (retry once on failure)
    let retries = 1;
    let success = false;
    let responseStream: any = null;

    while (retries >= 0 && !success) {
      try {
        const ai = new GoogleGenerativeAI(apiKey);
        // Using recommended medium model 'gemini-1.5-flash' for quick streaming
        const model = ai.getGenerativeModel({
          model: 'gemini-1.5-flash',
          systemInstruction: systemInstruction,
        });

        // Request streaming content
        const result = await model.generateContentStream({
          contents,
          generationConfig: {
            temperature: 0.4, // lower temp for more consistent/factual guidance
            maxOutputTokens: 1024,
          },
        });

        responseStream = result.stream;
        success = true;
      } catch (err: any) {
        console.error(`Gemini Service Error (Retries remaining: ${retries}):`, err.message || err);
        if (retries === 0) {
          throw new Error("Unable to contact Gemini AI Service. Please check connectivity or try again later.");
        }
        retries--;
        // Wait 1 second before retrying
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    // 5. Yield stream chunks
    if (responseStream) {
      for await (const chunk of responseStream) {
        const text = chunk.text();
        if (text) {
          yield text;
        }
      }
    }
  }

  /**
   * Generates a Personalized Daily Wellness Plan using Gemini
   */
  public static async generateDailyPlan(
    userProfile: {
      stage: string;
      trimester: string | null;
      weeksPostpartum: number | null;
      goals: string[];
      dueOrBirthDate: string | null;
      completedExercises?: string[];
    },
    energyLevel: number,
    painLevel: number,
    preferences: string
  ): Promise<string> {
    const apiKey = getApiKey();
    if (!apiKey) {
      return JSON.stringify({
        exercise: "Gentle pelvic floor tilts & breathing exercises (5 mins)",
        hydration: "Drink 2.5 Liters of water today",
        stretch: "Cat-Cow Stretch & Upper Back Opener",
        breathing: "4-7-8 Relaxation breath (3 cycles)",
        reminder: "Remember your iron and folate prenatal vitamins!",
        motivationalMessage: "Simulated Plan: Listen to your body and move at your own gentle pace today, Mama!"
      });
    }

    const { stage, trimester, weeksPostpartum, goals } = userProfile;
    const dbContext = RetrievalService.retrieveContext("daily plan exercise stretch", stage, trimester, weeksPostpartum);

    const systemPrompt = `
You are Wellora AI, a maternal wellness companion.
Generate a structured, personalized Daily Wellness Plan for a mother based on her current details.
You must return a valid JSON object ONLY. Do not write markdown, code blocks, or conversational text.
The JSON object must match this schema:
{
  "exercise": "Specifically named safe exercises, durations, and instructions",
  "hydration": "Water intake target in liters/cups and why it matters today",
  "stretch": "Specific stretch safe for their stage/pain area",
  "breathing": "Recommended breathing style (e.g. cooling breath, paced breathing) with counts",
  "reminder": "Special customized safety or checklist reminder",
  "motivationalMessage": "A calm, warm, reassuring message of encouragement"
}

Constraints:
- Consult the local safe exercises database context. Do not invent exercises that violate these parameters.
- If pain level is high (>6/10), keep plans extremely minimal (e.g., breathing, hydration, resting stretches only).
- Keep descriptions concise and practical.
`;

    const userPrompt = `
Create a plan for:
- Stage: ${stage} (${trimester ? trimester + ' trimester' : weeksPostpartum + ' weeks postpartum'})
- Goals: ${goals.join(', ')}
- Energy Level: ${energyLevel}/10
- Pain Level: ${painLevel}/10
- Preferences/Pain notes: ${preferences || 'None'}

Database reference safe exercises:
${dbContext}
`;

    try {
      const ai = new GoogleGenerativeAI(apiKey);
      const model = ai.getGenerativeModel({ model: 'gemini-1.5-flash' });
      
      const result = await model.generateContent({
        contents: [
          { role: 'user', parts: [{ text: systemPrompt + "\n\n" + userPrompt }] }
        ],
        generationConfig: {
          temperature: 0.2, // low temp for structured json
          responseMimeType: 'application/json'
        }
      });

      return result.response.text() || "{}";
    } catch (err) {
      console.error("Error generating daily plan with Gemini:", err);
      // Fallback response
      return JSON.stringify({
        exercise: "Gentle 10-minute walk & pelvic floor activations",
        hydration: "2.5 Liters of water, sipped slowly throughout the day",
        stretch: "Safe side-lying stretches and hip openers",
        breathing: "Calming abdominal breathing (5 minutes)",
        reminder: "Avoid physical straining. Take regular seated rests.",
        motivationalMessage: "Take it one gentle step at a time today, mama. You are doing amazing work."
      });
    }
  }
}
