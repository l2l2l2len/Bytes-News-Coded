import React, { useState, useEffect } from 'react';
import { UserPreferences } from '../types';

interface OnboardingProps {
  onComplete: (prefs: UserPreferences) => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [isExiting, setIsExiting] = useState(false);
  const [prefs, setPrefs] = useState<UserPreferences>({
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

  const topicsList = ['AI & Tech', 'Startups', 'Global Markets', 'Policy', 'Geopolitics', 'Climate', 'Culture', 'Science', 'Finance', 'Health'];

  const toggleTopic = (topic: string) => {
    setPrefs(p => ({
      ...p,
      topics: p.topics.includes(topic) ? p.topics.filter(t => t !== topic) : [...p.topics, topic]
    }));
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

  useEffect(() => {
    if (step === 4) {
      const timer = setTimeout(handleComplete, 2500);
      return () => clearTimeout(timer);
    }
  }, [step]);

  return (
    <div className={`fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden transition-opacity duration-700 ${isExiting ? 'opacity-0' : 'opacity-100'}`}>
      
      {/* 1. Main Floating Card (Light Glass) */}
      <div className="relative z-10 w-full max-w-md mx-6">
        
        {/* Card Body */}
        <div className="glass-card rounded-[40px] p-8 md:p-12 transition-all duration-500 animate-fade-in-up shadow-2xl">
            
            {/* Step 1: Welcome / "Get Started" */}
            {step === 1 && (
                <div className="flex flex-col items-center text-center">
                    <div className="w-20 h-20 mb-8 flex items-center justify-center bg-white shadow-lg text-[#831843] rounded-3xl transform -rotate-3 border border-rose-100">
                         <span className="font-serif-display text-4xl font-bold">V</span>
                    </div>
                    
                    <h1 className="text-4xl font-serif-display font-bold text-[#4a044e] mb-3 tracking-tight drop-shadow-sm">
                        Volv.
                    </h1>
                    <p className="text-[#831843]/70 mb-10 font-sans text-sm leading-relaxed max-w-xs mx-auto">
                        Intelligent news, distilled for the modern mind. Experience clarity in 9 seconds.
                    </p>

                    <div className="w-full space-y-3">
                        <button 
                            onClick={handleNext}
                            className="w-full py-4 bg-[#831843] text-white rounded-full font-bold text-xs uppercase tracking-widest shadow-lg hover:scale-[1.02] transition-transform"
                        >
                            Get Started
                        </button>
                        <button className="w-full py-4 bg-white text-[#831843] border border-rose-200 rounded-full font-bold text-xs uppercase tracking-widest hover:bg-rose-50 transition-colors">
                            Log In
                        </button>
                    </div>
                    
                    <p className="mt-8 text-[10px] text-[#831843]/40">By continuing you agree to our Terms.</p>
                </div>
            )}

            {/* Step 2: Topics Selection */}
            {step === 2 && (
                <div className="flex flex-col h-full">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-serif-display font-bold text-[#4a044e] mb-2">Your Interests</h2>
                        <p className="text-[#831843]/60 text-xs font-medium">Select 3 topics to tailor your feed</p>
                    </div>

                    <div className="flex flex-wrap gap-2.5 justify-center mb-10">
                        {topicsList.map(t => {
                            const isSelected = prefs.topics.includes(t);
                            return (
                                <button 
                                    key={t}
                                    onClick={() => toggleTopic(t)}
                                    className={`
                                        px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 border
                                        ${isSelected 
                                            ? 'bg-[#831843] text-white border-[#831843] shadow-md transform scale-105' 
                                            : 'bg-white border-rose-200 text-[#831843]/80 hover:bg-rose-50'}
                                    `}
                                >
                                    {t}
                                </button>
                            );
                        })}
                    </div>

                    <button 
                        onClick={handleNext}
                        disabled={prefs.topics.length < 3}
                        className="w-full py-4 rounded-full font-bold text-xs uppercase tracking-widest transition-all disabled:opacity-30 disabled:cursor-not-allowed
                        bg-[#831843] text-white shadow-lg hover:shadow-xl hover:scale-[1.01]"
                    >
                        Continue
                    </button>
                </div>
            )}

            {/* Step 3: Density Preference */}
            {step === 3 && (
                <div>
                     <div className="text-center mb-8">
                        <h2 className="text-2xl font-serif-display font-bold text-[#4a044e] mb-2">Reading Style</h2>
                        <p className="text-[#831843]/60 text-xs font-medium">How much depth do you need today?</p>
                    </div>

                    <div className="space-y-3 mb-10">
                        {['Ultra quick (10s)', 'Brief summaries', 'Deep dives'].map(style => {
                            const val = style.split(' (')[0];
                            const isSelected = prefs.readingStyle === val;
                            return (
                                <button 
                                    key={style}
                                    onClick={() => { setPrefs(p => ({...p, readingStyle: val as any})); handleNext(); }}
                                    className={`
                                        w-full p-5 flex justify-between items-center text-left transition-all border rounded-[24px]
                                        ${isSelected 
                                            ? 'bg-rose-100 border-rose-200 text-[#4a044e] shadow-sm' 
                                            : 'bg-white border-rose-100 text-[#831843]/60 hover:bg-rose-50'}
                                    `}
                                >
                                    <span className={`font-bold text-base`}>{style}</span>
                                    <div className={`
                                        w-5 h-5 rounded-full border flex items-center justify-center transition-colors
                                        ${isSelected ? 'border-[#831843] bg-[#831843]' : 'border-rose-300'}
                                    `}>
                                        {isSelected && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Step 4: Personalization Spinner */}
            {step === 4 && (
                <div className="flex flex-col items-center justify-center py-12">
                    <div className="relative w-16 h-16 mb-8">
                        <svg className="animate-spin w-full h-full text-[#be185d]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    </div>
                    
                    <h2 className="text-xl font-serif-display font-bold text-[#4a044e] mb-2">Curating Feed</h2>
                    <p className="text-xs text-[#831843]/60 uppercase tracking-widest animate-pulse">Designing your experience...</p>
                </div>
            )}

        </div>
        
        {/* Footer Branding */}
        <div className="text-center mt-8">
             <p className="text-[9px] text-[#4a044e]/40 uppercase tracking-[0.2em] font-bold">Powered by Gemini</p>
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