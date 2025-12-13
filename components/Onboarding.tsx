import React, { useState } from 'react';
import { UserPreferences } from '../types';

interface OnboardingProps {
  onComplete: (prefs: UserPreferences) => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
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

  const next = () => setStep(s => s + 1);

  return (
    // Backdrop is now clearer to see the background
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-6 bg-white/10 backdrop-blur-[2px] animate-enter">
      
      {/* Main Card - Super Glassy */}
      <div className="relative z-10 w-full max-w-[480px] p-10 rounded-[32px] bg-white/40 backdrop-blur-xl border border-white/50 shadow-[0_30px_60px_-15px_rgba(30,27,75,0.15)] flex flex-col items-center text-center">
        
        {/* Step 1: Intro */}
        {step === 1 && (
        <div className="flex flex-col items-center space-y-8 animate-enter w-full">
            <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-4xl font-bold text-white shadow-lg shadow-indigo-500/30 mb-2">
               B
            </div>
            
            <div className="space-y-4">
            <h1 className="font-display text-5xl font-bold text-indigo-950 tracking-tight">Bytes</h1>
            <p className="text-indigo-900/60 text-lg font-medium leading-relaxed">
                News, decoded into <span className="text-indigo-950 font-bold">fast, clear bytes</span>.
            </p>
            </div>
            
            <button 
            onClick={next} 
            className="w-full py-4 mt-4 bg-indigo-950 text-white font-bold text-sm uppercase tracking-widest hover:bg-black hover:scale-[1.02] transition-all rounded-xl shadow-xl shadow-indigo-900/10"
            >
            Get Started
            </button>
        </div>
        )}

        {/* Step 2: Topics */}
        {step === 2 && (
        <div className="w-full animate-enter">
            <h2 className="font-display text-3xl font-bold text-indigo-950 mb-2">Vectors</h2>
            <p className="text-indigo-900/50 text-xs font-bold uppercase tracking-widest mb-8">Select Data Streams</p>
            
            <div className="flex flex-wrap gap-3 justify-center mb-10">
            {topicsList.map(t => (
                <button 
                key={t}
                onClick={() => toggleTopic(t)}
                className={`
                    px-4 py-3 rounded-lg text-sm font-bold transition-all border
                    ${prefs.topics.includes(t) 
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-600/20' 
                    : 'bg-white/40 border-white/60 text-indigo-900/60 hover:bg-white/60 hover:text-indigo-900'}
                `}
                >
                {t}
                </button>
            ))}
            </div>

            <button 
            disabled={prefs.topics.length < 3} 
            onClick={next} 
            className="w-full py-4 bg-indigo-950 text-white font-bold text-sm uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed hover:bg-black transition-all rounded-xl shadow-lg"
            >
            Confirm
            </button>
        </div>
        )}

        {/* Step 3: Density */}
        {step === 3 && (
        <div className="w-full animate-enter">
            <h2 className="font-display text-3xl font-bold text-indigo-950 mb-2">Resolution</h2>
            <p className="text-indigo-900/50 text-xs font-bold uppercase tracking-widest mb-8">Information Density</p>
            
            <div className="space-y-4 mb-10">
            {['Ultra quick (10s)', 'Brief summaries', 'Deep dives'].map(style => (
                <button 
                key={style}
                onClick={() => { setPrefs(p => ({...p, readingStyle: style.split(' (')[0] as any})); next(); }}
                className={`
                    w-full p-5 flex justify-between items-center text-left transition-all border rounded-xl
                    ${prefs.readingStyle === style.split(' (')[0] 
                    ? 'bg-indigo-100/50 border-indigo-400 text-indigo-800' 
                    : 'bg-white/40 border-white/60 text-indigo-900/60 hover:bg-white/60 hover:text-indigo-900'}
                `}
                >
                <span className="font-bold text-base">{style}</span>
                {prefs.readingStyle === style.split(' (')[0] && <div className="w-2 h-2 bg-indigo-500 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]" />}
                </button>
            ))}
            </div>
        </div>
        )}

        {/* Step 4: Loading */}
        {step === 4 && (
        <div className="flex flex-col items-center justify-center py-10 animate-enter">
            <div className="relative w-20 h-20 mb-8">
                <div className="absolute inset-0 border-4 border-indigo-100 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <h2 className="font-display text-xl font-bold text-indigo-950">Synthesizing</h2>
            <p className="text-xs font-mono text-indigo-500 mt-2 tracking-widest animate-pulse">BUILDING_FEED_PROTOCOL...</p>
            {setTimeout(() => onComplete(prefs), 2000) && null}
        </div>
        )}

      </div>
    </div>
  );
};

export default Onboarding;