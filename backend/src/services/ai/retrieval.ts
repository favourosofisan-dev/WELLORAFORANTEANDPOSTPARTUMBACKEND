import { EXERCISES, VACCINES, CARE_ARTICLES, LABOR_PREP_GUIDES, Exercise, Vaccine, CareArticle, LaborPrepGuide } from '../../data/mockData';

export class RetrievalService {
  /**
   * Search for exercises safe for a specific stage/trimester/postpartum status
   */
  public static getExercisesForContext(stage: string, trimester: string | null, weeksPostpartum: number | null): Exercise[] {
    if (stage === 'pregnant') {
      const trim = trimester || 'First';
      return EXERCISES.filter(ex => ex.isPregnancySafe && ex.targetTrimesters.includes(trim as any));
    } else if (stage === 'labour') {
      return EXERCISES.filter(ex => ex.category === 'Breathing' || ex.category === 'Labor Preparation');
    } else if (stage === 'postpartum') {
      const weeks = weeksPostpartum || 6;
      let postpartumTag: '0-6' | '6-12' | '3+' = '6-12';
      if (weeks <= 6) postpartumTag = '0-6';
      else if (weeks <= 12) postpartumTag = '6-12';
      else postpartumTag = '3+';
      return EXERCISES.filter(ex => ex.isPostpartumSafe && ex.targetPostpartumWeeks.includes(postpartumTag));
    }
    // Caregiver or other
    return EXERCISES.filter(ex => ex.category === 'Breathing' || ex.category === 'Mobility');
  }

  /**
   * Search exercises by query text
   */
  public static searchExercises(query: string): Exercise[] {
    const q = query.toLowerCase();
    return EXERCISES.filter(ex => 
      ex.title.toLowerCase().includes(q) ||
      ex.category.toLowerCase().includes(q) ||
      ex.benefits.toLowerCase().includes(q) ||
      (ex.description && ex.description.toLowerCase().includes(q))
    ).slice(0, 3); // limit context payload size
  }

  /**
   * Find specific vaccine schedule details
   */
  public static getVaccines(): Vaccine[] {
    return VACCINES;
  }

  public static getVaccineByName(name: string): Vaccine | undefined {
    const n = name.toLowerCase();
    return VACCINES.find(v => v.name.toLowerCase().includes(n) || n.includes(v.name.toLowerCase()));
  }

  /**
   * Search care articles (baby care, nutrition, hydration)
   */
  public static searchCareArticles(query: string): CareArticle[] {
    const q = query.toLowerCase();
    return CARE_ARTICLES.filter(art => 
      art.title.toLowerCase().includes(q) ||
      art.category.toLowerCase().includes(q) ||
      art.summary.toLowerCase().includes(q) ||
      art.tips.some(t => t.toLowerCase().includes(q))
    ).slice(0, 2);
  }

  /**
   * Get labor preparation guides
   */
  public static searchLaborPrepGuides(query: string): LaborPrepGuide[] {
    const q = query.toLowerCase();
    return LABOR_PREP_GUIDES.filter(g =>
      g.title.toLowerCase().includes(q) ||
      g.category.toLowerCase().includes(q) ||
      g.description.toLowerCase().includes(q) ||
      g.instructions.some(i => i.toLowerCase().includes(q))
    ).slice(0, 2);
  }

  /**
   * Get standard medical disclaimer
   */
  public static getMedicalDisclaimer(): string {
    return `Wellora Mama is an educational wellness platform and does NOT provide clinical medical diagnosis, triage treatment, or obstetric therapy. The exercises, timelines, schedules, and tips represent fitness and wellness recommendations compiled for informational purposes. They are not a replacement for advice from your OB-GYN, midwife, or pediatrician. Always consult a healthcare provider before changing physical activities. Urgent warnings: Stop exercising immediately if you feel localized pelvic girdle friction, sudden abdominal cramping, lightheaded dizziness, shortness of breath, headache, vaginal bleeding, or chest pressure. If emergency symptoms occur, contact emergency medical services immediately.`;
  }

  /**
   * Get standard legal info
   */
  public static getLegalInfo(): string {
    return `Wellora Mama operates as a private fitness tracker and informational application. Personal health records, baby names, vaccination schedules, and exercise completions are stored securely on the user's local profile and are handled in compliance with privacy guidelines. AI services are powered by Google Gemini and are restricted to Pro subscribers.`;
  }

  /**
   * Aggregate context from local database for a user prompt
   */
  public static retrieveContext(prompt: string, stage: string, trimester: string | null, weeksPostpartum: number | null): string {
    const lowerPrompt = prompt.toLowerCase();
    const contextChunks: string[] = [];

    // Always append disclaimers in retrieval context for safety
    contextChunks.push(`[LOCAL DATABASE MEDICAL DISCLAIMER]\n${this.getMedicalDisclaimer()}`);

    // Exercise keyword detection
    if (lowerPrompt.includes('exercis') || lowerPrompt.includes('stretch') || lowerPrompt.includes('posture') || lowerPrompt.includes('work') || lowerPrompt.includes('back hurt') || lowerPrompt.includes('pain') || lowerPrompt.includes('walk')) {
      const contextExercises = this.getExercisesForContext(stage, trimester, weeksPostpartum);
      const searchResults = this.searchExercises(prompt);
      
      const combined = Array.from(new Set([...contextExercises.slice(0, 2), ...searchResults]));
      if (combined.length > 0) {
        contextChunks.push(`[LOCAL DATABASE EXERCISES SAFE FOR STAGE ${stage.toUpperCase()}]\n` + combined.map(e => 
          `- ID: ${e.id}\n  Title: ${e.title}\n  Category: ${e.category}\n  Duration: ${e.duration}\n  Benefits: ${e.benefits}\n  Instructions: ${e.instructions.join(' ')}\n  Safety Warnings: ${e.safetyWarnings.join(' ')}`
        ).join('\n'));
      }
    }

    // Vaccine keyword detection
    if (lowerPrompt.includes('vaccin') || lowerPrompt.includes('immuniz') || lowerPrompt.includes('shot') || lowerPrompt.includes('schedule')) {
      const match = VACCINES.map(v => 
        `- Name: ${v.name}\n  Recommended Milestone: ${v.ageMilestone}\n  Months Offset: ${v.monthsOffset} months\n  Description: ${v.description}`
      ).join('\n');
      contextChunks.push(`[LOCAL DATABASE OFFICIAL VACCINATION SCHEDULE]\n${match}`);
    }

    // Baby care or sleep or burping keyword detection
    if (lowerPrompt.includes('baby') || lowerPrompt.includes('infant') || lowerPrompt.includes('burp') || lowerPrompt.includes('sleep') || lowerPrompt.includes('bath') || lowerPrompt.includes('teeth') || lowerPrompt.includes('feed')) {
      const articles = this.searchCareArticles(prompt);
      if (articles.length > 0) {
        contextChunks.push(`[LOCAL DATABASE BABY CARE GUIDES]\n` + articles.map(a =>
          `- Title: ${a.title}\n  Category: ${a.category}\n  Summary: ${a.summary}\n  Details: ${a.content.join(' ')}\n  Tips: ${a.tips.join(' ')}`
        ).join('\n'));
      }
    }

    // Nutrition or eat or food or coffee or pineapple keyword detection
    if (lowerPrompt.includes('eat') || lowerPrompt.includes('drink') || lowerPrompt.includes('food') || lowerPrompt.includes('nutrit') || lowerPrompt.includes('pineapple') || lowerPrompt.includes('coffee') || lowerPrompt.includes('snack') || lowerPrompt.includes('crav')) {
      const articles = this.searchCareArticles('Nutrition');
      const searchResults = this.searchCareArticles(prompt);
      const combined = Array.from(new Set([...articles, ...searchResults]));
      if (combined.length > 0) {
        contextChunks.push(`[LOCAL DATABASE NUTRITION GUIDES]\n` + combined.map(a =>
          `- Title: ${a.title}\n  Category: ${a.category}\n  Summary: ${a.summary}\n  Details: ${a.content.join(' ')}\n  Tips: ${a.tips.join(' ')}`
        ).join('\n'));
      }
    }

    // Labor coping or preparation keyword detection
    if (stage === 'labour' || lowerPrompt.includes('labor') || lowerPrompt.includes('labour') || lowerPrompt.includes('contraction') || lowerPrompt.includes('push') || lowerPrompt.includes('breathing')) {
      const guides = this.searchLaborPrepGuides(prompt);
      if (guides.length > 0) {
        contextChunks.push(`[LOCAL DATABASE LABOR COPING GUIDES]\n` + guides.map(g =>
          `- Title: ${g.title}\n  Category: ${g.category}\n  Description: ${g.description}\n  Instructions: ${g.instructions.join(' ')}`
        ).join('\n'));
      }
    }

    return contextChunks.join('\n\n');
  }
}
