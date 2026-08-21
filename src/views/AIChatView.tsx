import React, { useState, useRef, useEffect } from 'react';
import { API_BASE_URL } from '../config';
import { useUserProfile } from '../context/UserProfileContext';
import { MessageSquare, Send, Trash2, Heart, AlertCircle } from 'lucide-react';

export const AIChatView: React.FC = () => {
  const { profile, upgradeToPro, acknowledgeAiDisclaimer, token } = useUserProfile();

  // Chat state
  const [messages, setMessages] = useState<{ role: 'user' | 'model'; text: string }[]>(() => {
    const saved = localStorage.getItem('wellora_ai_chat');
    return saved ? JSON.parse(saved) : [];
  });
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [midwifeMode, setMidwifeMode] = useState(false);
  const [disclaimerChecked, setDisclaimerChecked] = useState(false);
  const [emergencyAlert, setEmergencyAlert] = useState<{ active: boolean; query: string } | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Save chat to localStorage
  useEffect(() => {
    localStorage.setItem('wellora_ai_chat', JSON.stringify(messages));
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, []);

  // Emergency keywords list
  const EMERGENCY_KEYWORDS = [
    'heavy bleeding',
    'bleeding',
    'seizure',
    'loss of consciousness',
    'unconscious',
    'difficulty breathing',
    'shortness of breath',
    'chest pain',
    'reduced fetal movement',
    'no movement',
    'baby not moving',
    'blue baby',
    'high fever',
    'convulsions',
    'severe cramping'
  ];

  // Helper to detect emergency keywords
  const detectEmergency = (text: string): boolean => {
    const cleanText = text.toLowerCase().trim();
    return EMERGENCY_KEYWORDS.some(keyword => cleanText.includes(keyword));
  };

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    // Reset emergency status
    setEmergencyAlert(null);

    // Client-side emergency filter
    if (detectEmergency(textToSend)) {
      setEmergencyAlert({
        active: true,
        query: textToSend
      });
      setInput('');
      return;
    }

    const newMessages = [...messages, { role: 'user' as const, text: textToSend }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    // Create a placeholder message for streaming
    setMessages(prev => [...prev, { role: 'model', text: '' }]);

    try {
      // Setup payload matching backend requirements
      const response = await fetch(`${API_BASE_URL}/api/ai/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          message: textToSend,
          history: messages, // pass history
          userProfile: profile,
          useMidwifeMode: midwifeMode
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Server responded with status ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let accumulatedText = '';

      if (!reader) {
        throw new Error("Failed to read streaming body.");
      }

      setLoading(false);

      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        if (value) {
          const chunk = decoder.decode(value, { stream: !done });
          accumulatedText += chunk;

          // Update the streaming model message
          setMessages(prev => {
            const updated = [...prev];
            if (updated.length > 0) {
              updated[updated.length - 1] = {
                role: 'model',
                text: accumulatedText
              };
            }
            return updated;
          });
        }
      }
    } catch (error: any) {
      console.error("AI Chat Error:", error);
      // Replace last empty/partial message with error details
      setMessages(prev => {
        const updated = [...prev];
        if (updated.length > 0) {
          updated[updated.length - 1] = {
            role: 'model',
            text: `Sorry, mama. I encountered an error connecting to my wellness library: ${error.message || 'Please check your connection and try again.'}`
          };
        }
        return updated;
      });
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    if (window.confirm("Are you sure you want to clear your conversation history?")) {
      setMessages([]);
      setEmergencyAlert(null);
      localStorage.removeItem('wellora_ai_chat');
    }
  };

  // 1. Upgrade Flow (If user is Free)
  if (!profile.isPro) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-6 flex flex-col items-center justify-center text-center bg-white rounded-3xl border border-amber-200/50 shadow-sm animate-fade-in">
        <div className="w-20 h-20 rounded-2xl overflow-hidden mb-6 shadow-md border-2 border-amber-300">
          <img src="/images/Ask wellora AI.png" alt="Ask Wellora AI" className="w-full h-full object-cover" />
        </div>
        <h1 className="font-serif text-3xl font-bold text-wellora-mocha">Unlock Wellora AI</h1>
        <p className="text-sm text-wellora-mocha/60 mt-3 max-w-md leading-relaxed">
          Get personalized maternal wellness guidance, exercises, custom daily nutrition tracking, baby sleep guides, and vaccine schedules powered by AI.
        </p>
        <button
          onClick={upgradeToPro}
          className="mt-8 px-8 py-3.5 bg-gradient-to-r from-amber-500 to-yellow-600 text-white font-bold rounded-full hover:shadow-md transition-all text-xs"
        >
          Upgrade to Wellora Pro
        </button>
      </div>
    );
  }

  // 2. Disclaimer Check (Before first chat)
  if (!profile.acknowledgedAiDisclaimer) {
    return (
      <div className="max-w-2xl mx-auto py-8 px-6 bg-white rounded-3xl border border-amber-200/50 shadow-sm animate-fade-in">
        <div className="flex items-center gap-2 mb-4 text-amber-600 border-b border-amber-100 pb-3">
          <img src="/images/Ask wellora AI.png" alt="Wellora AI" className="w-7 h-7 rounded-full object-cover border border-amber-300" />
          <h2 className="font-serif text-xl font-bold text-wellora-mocha">Wellora AI Safeguard Agreement</h2>
        </div>

        <div className="space-y-4 text-xs text-wellora-mocha/80 leading-relaxed max-h-96 overflow-y-auto pr-2">
          <p className="font-bold text-wellora-mocha">
            Please acknowledge the following safety directives before chatting with Wellora AI:
          </p>
          <div className="p-4 bg-amber-50/50 border border-amber-200/60 rounded-2xl space-y-2">
            <p>
              <strong>Not a Clinical Tool:</strong> Wellora AI provides educational wellness information only. It does not diagnose, treat, or manage medical conditions.
            </p>
            <p>
              <strong>Consult Care Providers:</strong> The AI recommendations are not replacements for professional assessments by your OB-GYN, midwife, or pediatrician.
            </p>
            <p>
              <strong>Emergency Instruction:</strong> If you experience symptoms such as cramping, bleeding, severe pain, or reduced fetal movement, do not rely on the AI. Seek immediate in-person clinical assistance.
            </p>
          </div>
          <p>
            By ticking the box below, you acknowledge that you understand these limits and agree to consult professionals for medical advice.
          </p>
        </div>

        <div className="mt-6 flex items-start gap-2.5">
          <input
            type="checkbox"
            id="acknowledge"
            checked={disclaimerChecked}
            onChange={(e) => setDisclaimerChecked(e.target.checked)}
            className="mt-0.5 w-4 h-4 rounded border-wellora-rose/30 text-wellora-terracotta focus:ring-wellora-terracotta"
          />
          <label htmlFor="acknowledge" className="text-xs text-wellora-mocha/70 select-none">
            I acknowledge that Wellora AI is an educational wellness companion, not a doctor, and I agree to seek professional medical care when appropriate.
          </label>
        </div>

        <button
          onClick={acknowledgeAiDisclaimer}
          disabled={!disclaimerChecked}
          className="w-full mt-6 py-3 bg-wellora-terracotta text-white font-bold rounded-full shadow-sm hover:bg-wellora-terracotta/95 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-xs"
        >
          Acknowledge & Start Chatting
        </button>
      </div>
    );
  }

  // 3. AI Chat Interface
  const suggestedQuestions = [
    "Can I exercise at 18 weeks?",
    "Why does my lower back hurt?",
    "Healthy snacks for week 30",
    "How do I burp my baby?",
    "Is walking good in pregnancy?"
  ];

  return (
    <div className="max-w-2xl mx-auto flex flex-col h-[78vh] bg-white rounded-3xl border border-wellora-rose/15 shadow-sm overflow-hidden animate-fade-in">

      {/* Header */}
      <header className="px-6 py-4 bg-amber-50/60 border-b border-amber-200/50 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-amber-300 shadow-sm">
            <img src="/images/Ask wellora AI.png" alt="Ask Wellora AI" className="w-full h-full object-cover" />
          </div>
          <div>
            <h2 className="font-serif text-sm font-bold text-wellora-mocha">Wellora AI Companion</h2>
            <span className="text-[10px] text-amber-600 block font-semibold">Maternal Wellness Guide • Gold</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Midwife Mode Toggle */}
          <div className="flex items-center gap-1.5 bg-wellora-rose/10 px-2.5 py-1 rounded-full border border-wellora-rose/20">
            <Heart className={`w-3.5 h-3.5 ${midwifeMode ? 'text-wellora-terracotta fill-current' : 'text-wellora-mocha/40'}`} />
            <label className="text-[9px] font-bold text-wellora-mocha select-none cursor-pointer flex items-center gap-1">
              Midwife Tone
              <input
                type="checkbox"
                checked={midwifeMode}
                onChange={(e) => setMidwifeMode(e.target.checked)}
                className="sr-only"
              />
              <span className={`w-6 h-3 bg-gray-200 rounded-full relative inline-block transition-colors ${midwifeMode ? 'bg-wellora-terracotta' : ''}`}>
                <span className={`w-2.5 h-2.5 bg-white rounded-full absolute top-px left-px transition-transform ${midwifeMode ? 'transform translate-x-3' : ''}`} />
              </span>
            </label>
          </div>

          <button
            onClick={handleClearChat}
            className="p-1.5 rounded-full hover:bg-wellora-rose/15 text-wellora-mocha/50 hover:text-wellora-mocha transition-all"
            title="Clear Chat History"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin">
        {messages.length === 0 && !emergencyAlert && (
          <div className="h-full flex flex-col items-center justify-center text-center text-wellora-mocha/50 p-6 space-y-3">
            <MessageSquare className="w-10 h-10 text-wellora-rose/30" />
            <p className="text-xs max-w-xs leading-relaxed">
              Hello, Mama! I'm your Wellora wellness coach. Ask me questions about exercise safety, postpartum care, nutrition, or baby vaccines.
            </p>
          </div>
        )}

        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-scale-up`}
          >
            <div className="flex gap-2 max-w-[85%] items-start">
              {msg.role === 'model' && (
                <div className="w-6 h-6 rounded-full overflow-hidden border border-amber-300 flex-shrink-0 mt-0.5">
                  <img src="/images/Ask wellora AI.png" alt="Wellora AI" className="w-full h-full object-cover" />
                </div>
              )}
              <div
                className={`px-4 py-2.5 rounded-2xl text-xs leading-relaxed ${msg.role === 'user'
                    ? 'bg-wellora-terracotta text-white rounded-tr-none'
                    : 'bg-amber-50/60 text-wellora-mocha border border-amber-200/50 rounded-tl-none'
                  }`}
                style={{ whiteSpace: 'pre-line' }}
              >
                {msg.text || (loading && idx === messages.length - 1 ? (
                  <span className="flex gap-1 items-center py-1">
                    <span className="w-1.5 h-1.5 bg-wellora-mocha/40 rounded-full animate-bounce" />
                    <span className="w-1.5 h-1.5 bg-wellora-mocha/40 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 bg-wellora-mocha/40 rounded-full animate-bounce [animation-delay:0.4s]" />
                  </span>
                ) : '')}
              </div>
            </div>
          </div>
        ))}

        {/* Emergency Alert Card (Client-side Keyword trigger) */}
        {emergencyAlert && (
          <div className="bg-red-50 border-2 border-red-200 rounded-3xl p-5 text-red-800 space-y-3 shadow-sm animate-scale-up">
            <div className="flex items-center gap-2 text-red-700">
              <AlertCircle className="w-5 h-5 fill-red-100" />
              <h3 className="font-serif text-sm font-bold">Urgent Medical Warning</h3>
            </div>
            <p className="text-xs leading-relaxed">
              You mentioned "<strong>{emergencyAlert.query}</strong>". This symptom may require immediate medical attention.
              Please contact your OB-GYN, midwife, or call emergency services (e.g. 911) immediately. Do not delay care.
            </p>
            <div className="flex gap-3 pt-2">
              <a
                href="tel:911"
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-full text-[10px] font-bold shadow-sm transition-all"
              >
                Call Emergency (911)
              </a>
              <button
                onClick={() => setEmergencyAlert(null)}
                className="px-4 py-2 bg-white border border-red-200 text-[10px] font-bold rounded-full text-red-800 hover:bg-red-100/50 transition-all"
              >
                Dismiss Warning
              </button>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Questions */}
      {messages.length === 0 && !emergencyAlert && (
        <div className="px-6 py-2 border-t border-wellora-rose/10 flex-shrink-0">
          <span className="text-[9px] uppercase font-bold text-wellora-mocha/40 tracking-wider">Suggested Questions</span>
          <div className="flex flex-wrap gap-1.5 mt-1.5">
            {suggestedQuestions.map((q, i) => (
              <button
                key={i}
                onClick={() => handleSend(q)}
                className="px-2.5 py-1 bg-wellora-beige/40 hover:bg-wellora-rose/15 border border-wellora-rose/10 text-wellora-mocha rounded-full text-[10px] font-medium transition-all"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend(input);
        }}
        className="p-4 bg-wellora-beige/10 border-t border-wellora-rose/15 flex gap-2 items-center flex-shrink-0"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={midwifeMode ? "Ask your midwife companion gently..." : "Ask Wellora AI about exercises, nutrition, vaccine schedules..."}
          className="flex-1 px-4 py-2.5 text-xs bg-white border border-wellora-rose/25 rounded-2xl focus:ring-1 focus:ring-wellora-terracotta focus:outline-none text-wellora-mocha"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="w-9 h-9 rounded-2xl bg-wellora-terracotta text-white flex items-center justify-center hover:bg-wellora-terracotta/95 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};
