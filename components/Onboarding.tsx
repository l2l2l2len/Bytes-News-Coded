
import React, { useState, useEffect, useRef } from 'react';
import { UserPreferences } from '../types';

interface OnboardingProps {
  onComplete: (prefs: UserPreferences) => void;
  existingPrefs?: UserPreferences | null;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete, existingPrefs }) => {
  // Always start with step 0 if they have prefs, otherwise step 1
  const [step, setStep] = useState(existingPrefs ? 0 : 1);
  const [isExiting, setIsExiting] = useState(false);
  const [customTopic, setCustomTopic] = useState('');
  
  const [prefs, setPrefs] = useState<UserPreferences>(existingPrefs || {
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

  const handleNext = () => setStep(s => s + 1);

  const handleComplete = () => {
    setIsExiting(true);
    setTimeout(() => {
        onComplete(prefs);
    }, 800);
  };

  const handleReset = () => {
    setPrefs({
        userName: '',
        topics: [],
        readingStyle: 'Brief summaries',
        tone: 'Straight facts',
        constraints: { noClickbait: true, fewerCelebrity: false, expertSources: true, safeMode: false }
    });
    setStep(1);
  };

  useEffect(() => {
    if (step === 2) setTimeout(() => nameInputRef.current?.focus(), 100);
    if (step === 3) setTimeout(() => topicInputRef.current?.focus(), 100);
    if (step === 4) setTimeout(handleComplete, 2500);
  }, [step]);

  return (
    <div className={`fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden transition-opacity duration-700 ${isExiting ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
      
      <div className="relative z-10 w-full max-w-[340px] md:max-w-md mx-6">
        
        <div className="glass-card rounded-[32px] md:rounded-[40px] p-6 md:p-10 transition-all duration-500 animate-fade-in-up shadow-2xl ring-1 ring-white/60 min-h-[400px] flex flex-col justify-center">
            
            {/* Step 0: Welcome Back */}
            {step === 0 && (
                <div className="flex flex-col items-center text-center my-auto">
                    <div className="w-16 h-16 md:w-20 md:h-20 mb-6 flex items-center justify-center bg-white shadow-lg text-[#831843] rounded-2xl border border-rose-100">
                         <span className="font-serif-display text-3xl md:text-4xl font-bold">B</span>
                    </div>
                    <h1 className="text-2xl md:text-3xl font-serif-display font-bold text-[#4a044e] mb-2 tracking-tight">
                        Welcome back, <br/> {prefs.userName}.
                    </h1>
                    <p className="text-[#831843]/60 mb-8 font-sans text-xs uppercase tracking-widest font-bold">
                        Your feed is synced.
                    </p>
                    <div className="w-full space-y-3 px-2">
                        <button 
                            onClick={handleComplete}
                            className="w-full py-4 bg-[#831843] text-white rounded-full font-bold text-xs uppercase tracking-[0.2em] shadow-lg hover:scale-[1.02] transition-transform active:scale-95"
                        >
                            Open Feed
                        </button>
                        <button 
                            onClick={handleReset}
                            className="text-[10px] uppercase tracking-widest font-bold text-[#831843]/40 hover:text-[#831843] transition-colors mt-4"
                        >
                            Reset My Interests
                        </button>
                    </div>
                </div>
            )}

            {step === 1 && (
                <div className="flex flex-col items-center text-center my-auto">
                    <div className="w-16 h-16 md:w-20 md:h-20 mb-6 flex items-center justify-center bg-white shadow-lg text-[#831843] rounded-2xl transform -rotate-3 border border-rose-100">
                         <span className="font-serif-display text-3xl md:text-4xl font-bold">B</span>
                    </div>
                    <h1 className="text-3xl md:text-5xl font-serif-display font-bold text-[#4a044e] mb-2 tracking-tight">
                        Bytes.
                    </h1>
                    <p className="text-[#831843]/80 mb-8 font-sans text-[13px] md:text-sm leading-relaxed max-w-[240px] mx-auto font-medium">
                        Intelligent news, distilled. <br /> Experience clarity in 9 seconds.
                    </p>
                    <button 
                        onClick={handleNext}
                        className="w-full py-3.5 bg-[#831843] text-white rounded-full font-bold text-[10px] md:text-xs uppercase tracking-[0.2em] shadow-lg hover:scale-[1.02] transition-transform"
                    >
                        Get Started
                    </button>
                </div>
            )}

            {step === 2 && (
                <div className="flex flex-col h-full my-auto">
                    <div className="text-center mb-8">
                         <h2 className="text-xl md:text-2xl font-serif-display font-bold text-[#4a044e] mb-2">First, an introduction.</h2>
                         <p className="text-[#831843]/60 text-[11px] md:text-xs font-medium">How should we address you?</p>
                    </div>
                    <input
                        ref={nameInputRef}
                        type="text"
                        value={prefs.userName}
                        onChange={(e) => setPrefs({...prefs, userName: e.target.value})}
                        onKeyDown={(e) => e.key === 'Enter' && prefs.userName && handleNext()}
                        placeholder="Your Name"
                        className="w-full bg-white/50 border-b-2 border-[#831843]/20 px-4 py-3 text-center text-xl md:text-2xl font-serif-display text-[#4a044e] placeholder:text-[#831843]/30 focus:outline-none focus:border-[#831843] transition-colors"
                    />
                    <div className="mt-auto pt-8">
                         <button 
                            onClick={handleNext}
                            disabled={!prefs.userName}
                            className="w-full py-3.5 bg-[#831843] text-white rounded-full font-bold text-xs uppercase tracking-[0.2em] shadow-lg disabled:opacity-30"
                        >
                            Continue
                        </button>
                    </div>
                </div>
            )}

            {step === 3 && (
                <div className="flex flex-col h-full">
                    <div className="text-center mb-4">
                        <h2 className="text-xl md:text-2xl font-serif-display font-bold text-[#4a044e] mb-1">Curate your feed.</h2>
                        <p className="text-[#831843]/60 text-[11px] md:text-xs font-medium">What dominates your curiosity?</p>
                    </div>
                    <form onSubmit={addCustomTopic} className="mb-4 relative">
                        <input
                            ref={topicInputRef}
                            type="text"
                            value={customTopic}
                            onChange={(e) => setCustomTopic(e.target.value)}
                            placeholder="Type an interest (e.g. SpaceX)..."
                            className="w-full bg-white/80 border border-rose-200 rounded-xl px-4 py-3 pr-10 text-sm font-medium text-[#4a044e] focus:outline-none focus:border-[#831843]"
                        />
                        <button type="submit" disabled={!customTopic.trim()} className="absolute right-2 top-1/2 -translate-y-1/2 text-[#831843] p-1.5"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg></button>
                    </form>
                    <div className="flex flex-wrap gap-2 justify-center mb-6 overflow-y-auto max-h-[160px] no-scrollbar">
                        {prefs.topics.map(t => (
                            <button key={t} onClick={() => toggleTopic(t)} className="px-3 py-1.5 rounded-full text-[10px] font-bold bg-[#831843] text-white uppercase tracking-wide">{t} ✕</button>
                        ))}
                        {topicsList.filter(t => !prefs.topics.includes(t)).map(t => (
                            <button key={t} onClick={() => toggleTopic(t)} className="px-3 py-1.5 rounded-full text-[10px] font-bold border border-rose-200 text-[#831843]/70 uppercase tracking-wide">{t}</button>
                        ))}
                    </div>
                    <div className="mt-auto pt-4">
                         <button 
                            onClick={handleNext}
                            disabled={prefs.topics.length < 1}
                            className="w-full py-3.5 bg-[#831843] text-white rounded-full font-bold text-xs uppercase tracking-[0.2em] shadow-lg disabled:opacity-30"
                        >
                            Continue
                        </button>
                    </div>
                </div>
            )}

            {step === 4 && (
                <div className="flex flex-col items-center justify-center my-auto">
                    <div className="relative w-12 h-12 md:w-16 md:h-16 mb-6">
                        <svg className="animate-spin w-full h-full text-[#be185d]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    </div>
                    <h2 className="text-lg md:text-xl font-serif-display font-bold text-[#4a044e] mb-1">Synthesizing feed</h2>
                    <p className="text-[10px] text-[#831843]/60 uppercase tracking-[0.2em] font-bold text-center">Loading interests...</p>
                </div>
            )}
        </div>
      </div>
      <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up { animation: fade-in-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>
    </div>
  );
};

export default Onboarding;
