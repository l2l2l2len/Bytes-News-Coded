
import React, { useState, useEffect, useRef } from 'react';
import { UserPreferences } from '../types';

interface OnboardingProps {
  onComplete: (prefs: UserPreferences) => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [isExiting, setIsExiting] = useState(false);
  const [customTopic, setCustomTopic] = useState('');
  
  const [prefs, setPrefs] = useState<UserPreferences>({
    userName: '',
    topics: [],
    readingStyle: 'Brief summaries',
    tone: 'Straight facts',
    constraints: {
      noClickbait: true,
      fewerCelebrity: false,
      expertSources: true,
      safeMode: false
    }
  });

  const nameInputRef = useRef<HTMLInputElement>(null);
  const topicInputRef = useRef<HTMLInputElement>(null);

  // Suggested defaults
  const topicsList = ['AI & Tech', 'Startups', 'Global Markets', 'Science', 'Culture'];

  const toggleTopic = (topic: string) => {
    setPrefs(p => ({
      ...p,
      topics: p.topics.includes(topic) ? p.topics.filter(t => t !== topic) : [...p.topics, topic]
    }));
  };

  const addCustomTopic = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (customTopic.trim() && !prefs.topics.includes(customTopic.trim())) {
      toggleTopic(customTopic.trim());
      setCustomTopic('');
    }
  };

  const handleNext = () => {
     setStep(s => s + 1);
  };

  const handleComplete = () => {
    setIsExiting(true);
    setTimeout(() => {
        onComplete(prefs);
    }, 800);
  };

  // Auto-focus logic
  useEffect(() => {
    if (step === 2) {
      setTimeout(() => nameInputRef.current?.focus(), 100);
    }
    if (step === 3) {
      setTimeout(() => topicInputRef.current?.focus(), 100);
    }
    if (step === 4) {
      const timer = setTimeout(handleComplete, 3000);
      return () => clearTimeout(timer);
    }
  }, [step]);

  return (
    <div className={`fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden transition-opacity duration-700 ${isExiting ? 'opacity-0' : 'opacity-100'}`}>
      
      {/* 1. Main Floating Card (Light Glass) */}
      <div className="relative z-10 w-full max-w-[340px] md:max-w-md mx-6">
        
        {/* Card Body */}
        <div className="glass-card rounded-[32px] md:rounded-[40px] p-6 md:p-10 transition-all duration-500 animate-fade-in-up shadow-2xl ring-1 ring-white/60 min-h-[400px] flex flex-col">
            
            {/* Step 1: Welcome / "Get Started" */}
            {step === 1 && (
                <div className="flex flex-col items-center text-center my-auto">
                    <div className="w-16 h-16 md:w-20 md:h-20 mb-6 flex items-center justify-center bg-white shadow-lg text-[#831843] rounded-2xl transform -rotate-3 border border-rose-100">
                         <span className="font-serif-display text-3xl md:text-4xl font-bold">B</span>
                    </div>
                    
                    <h1 className="text-3xl md:text-5xl font-serif-display font-bold text-[#4a044e] mb-2 tracking-tight drop-shadow-sm">
                        Bytes.
                    </h1>
                    <p className="text-[#831843]/80 mb-8 font-sans text-[13px] md:text-sm leading-relaxed max-w-[240px] mx-auto font-medium">
                        Intelligent news, distilled. <br className="hidden md:block" /> Experience clarity in 9 seconds.
                    </p>

                    <div className="w-full space-y-3 px-2">
                        <button 
                            onClick={handleNext}
                            className="w-full py-3.5 bg-[#831843] text-white rounded-full font-bold text-[10px] md:text-xs uppercase tracking-[0.2em] shadow-lg hover:scale-[1.02] transition-transform active:scale-95"
                        >
                            Get Started
                        </button>
                    </div>
                </div>
            )}

            {/* Step 2: Name Input */}
            {step === 2 && (
                <div className="flex flex-col h-full my-auto">
                    <div className="text-center mb-8">
                         <h2 className="text-xl md:text-2xl font-serif-display font-bold text-[#4a044e] mb-2">First, an introduction.</h2>
                         <p className="text-[#831843]/60 text-[11px] md:text-xs font-medium">How should we address you?</p>
                    </div>

                    <div className="w-full px-2 mb-8">
                        <input
                            ref={nameInputRef}
                            type="text"
                            value={prefs.userName}
                            onChange={(e) => setPrefs({...prefs, userName: e.target.value})}
                            onKeyDown={(e) => e.key === 'Enter' && prefs.userName && handleNext()}
                            placeholder="Your Name"
                            className="w-full bg-white/50 border-b-2 border-[#831843]/20 px-4 py-3 text-center text-xl md:text-2xl font-serif-display text-[#4a044e] placeholder:text-[#831843]/30 focus:outline-none focus:border-[#831843] transition-colors rounded-t-lg"
                        />
                    </div>

                    <div className="mt-auto px-2">
                         <button 
                            onClick={handleNext}
                            disabled={!prefs.userName}
                            className="w-full py-3.5 rounded-full font-bold text-[10px] md:text-xs uppercase tracking-[0.2em] transition-all disabled:opacity-30 disabled:cursor-not-allowed
                            bg-[#831843] text-white shadow-lg hover:shadow-xl hover:scale-[1.01] active:scale-95"
                        >
                            Continue
                        </button>
                    </div>
                </div>
            )}

            {/* Step 3: Topics Selection with Custom Input */}
            {step === 3 && (
                <div className="flex flex-col h-full">
                    <div className="text-center mb-4">
                        <h2 className="text-xl md:text-2xl font-serif-display font-bold text-[#4a044e] mb-1">
                           Hello, {prefs.userName}.
                        </h2>
                        <p className="text-[#831843]/60 text-[11px] md:text-xs font-medium">What dominates your curiosity?</p>
                    </div>

                    {/* Custom Input */}
                    <form onSubmit={addCustomTopic} className="mb-4 relative">
                        <input
                            ref={topicInputRef}
                            type="text"
                            value={customTopic}
                            onChange={(e) => setCustomTopic(e.target.value)}
                            placeholder="Type a specific interest..."
                            className="w-full bg-white/80 border border-rose-200 rounded-xl px-4 py-3 pr-10 text-sm font-medium text-[#4a044e] placeholder:text-[#831843]/40 focus:outline-none focus:border-[#831843] focus:ring-1 focus:ring-[#831843] transition-all"
                        />
                        <button 
                            type="submit"
                            disabled={!customTopic.trim()}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-[#831843] disabled:opacity-30 hover:bg-rose-50 rounded-lg transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                        </button>
                    </form>

                    {/* Selected & Suggested Topics */}
                    <div className="flex flex-wrap gap-2 justify-center mb-6 overflow-y-auto max-h-[160px] p-1">
                        {/* Render Selected First */}
                        {prefs.topics.map(t => (
                            <button 
                                key={t}
                                onClick={() => toggleTopic(t)}
                                className="px-3 py-1.5 rounded-full text-[10px] font-bold transition-all duration-300 border uppercase tracking-wide bg-[#831843] text-white border-[#831843] shadow-md transform scale-100 hover:scale-105"
                            >
                                {t} ✕
                            </button>
                        ))}
                        
                        {/* Render Suggestions that aren't selected */}
                        {topicsList.filter(t => !prefs.topics.includes(t)).map(t => (
                            <button 
                                key={t}
                                onClick={() => toggleTopic(t)}
                                className="px-3 py-1.5 rounded-full text-[10px] font-bold transition-all duration-300 border uppercase tracking-wide bg-white border-rose-200 text-[#831843]/70 hover:bg-rose-50 hover:border-rose-300"
                            >
                                {t}
                            </button>
                        ))}
                    </div>

                    <div className="mt-auto px-2">
                         <button 
                            onClick={handleNext}
                            disabled={prefs.topics.length < 1}
                            className="w-full py-3.5 rounded-full font-bold text-[10px] md:text-xs uppercase tracking-[0.2em] transition-all disabled:opacity-30 disabled:cursor-not-allowed
                            bg-[#831843] text-white shadow-lg hover:shadow-xl hover:scale-[1.01] active:scale-95"
                        >
                            {prefs.topics.length === 0 ? 'Select at least 1' : `Continue with ${prefs.topics.length}`}
                        </button>
                    </div>
                </div>
            )}

            {/* Step 4: Personalization Spinner */}
            {step === 4 && (
                <div className="flex flex-col items-center justify-center my-auto">
                    <div className="relative w-12 h-12 md:w-16 md:h-16 mb-6">
                        <svg className="animate-spin w-full h-full text-[#be185d]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    </div>
                    
                    <h2 className="text-lg md:text-xl font-serif-display font-bold text-[#4a044e] mb-1">
                        Designing for {prefs.userName}
                    </h2>
                    <p className="text-[10px] text-[#831843]/60 uppercase tracking-[0.2em] animate-pulse font-bold text-center">
                        Synthesizing {prefs.topics.slice(0, 2).join(', ')}...
                    </p>
                </div>
            )}

        </div>
        
        {/* Footer Branding */}
        <div className="text-center mt-6">
             <p className="text-[9px] text-[#4a044e]/40 uppercase tracking-[0.2em] font-bold">Powered by Solo Studios</p>
        </div>

      </div>

      <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
};

export default Onboarding;
