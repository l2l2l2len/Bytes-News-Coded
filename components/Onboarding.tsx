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
    // Changed bg-[#020617] to bg-black/60 backdrop-blur-sm to reveal the 3D shapes
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-6 bg-black/60 backdrop-blur-[2px] animate-enter">
      
      {/* Main Card */}
      <div className="relative z-10 w-full max-w-[480px] p-10 rounded-[32px] bg-[#020617]/80 backdrop-blur-xl border border-white/10 shadow-2xl flex flex-col items-center text-center">
        
        {/* Step 1: Intro */}
        {step === 1 && (
        <div className="flex flex-col items-center space-y-8 animate-enter w-full">
            <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-2xl flex items-center justify-center text-4xl font-bold text-white shadow-lg shadow-cyan-500/20 mb-2">
               B
            </div>
            
            <div className="space-y-4">
            <h1 className="font-display text-4xl font-bold text-white tracking-tight">System Online.</h1>
            <p className="text-slate-400 text-lg font-medium leading-relaxed">
                Calibrating your <span className="text-white">neural feed</span> for <br/> maximum signal-to-noise ratio.
            </p>
            </div>
            
            <button 
            onClick={next} 
            className="w-full py-4 mt-4 bg-white text-black font-bold text-sm uppercase tracking-widest hover:bg-cyan-50 transition-all rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.2)]"
            >
            Initialize
            </button>
        </div>
        )}

        {/* Step 2: Topics */}
        {step === 2 && (
        <div className="w-full animate-enter">
            <h2 className="font-display text-3xl font-bold text-white mb-2">Vectors</h2>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-8">Select Data Streams</p>
            
            <div className="flex flex-wrap gap-3 justify-center mb-10">
            {topicsList.map(t => (
                <button 
                key={t}
                onClick={() => toggleTopic(t)}
                className={`
                    px-4 py-3 rounded-lg text-sm font-bold transition-all border
                    ${prefs.topics.includes(t) 
                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.2)]' 
                    : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/30 hover:text-white'}
                `}
                >
                {t}
                </button>
            ))}
            </div>

            <button 
            disabled={prefs.topics.length < 3} 
            onClick={next} 
            className="w-full py-4 bg-white text-black font-bold text-sm uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed hover:bg-cyan-50 transition-all rounded-xl"
            >
            Confirm
            </button>
        </div>
        )}

        {/* Step 3: Density */}
        {step === 3 && (
        <div className="w-full animate-enter">
            <h2 className="font-display text-3xl font-bold text-white mb-2">Resolution</h2>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-8">Information Density</p>
            
            <div className="space-y-4 mb-10">
            {['Ultra quick (10s)', 'Brief summaries', 'Deep dives'].map(style => (
                <button 
                key={style}
                onClick={() => { setPrefs(p => ({...p, readingStyle: style.split(' (')[0] as any})); next(); }}
                className={`
                    w-full p-5 flex justify-between items-center text-left transition-all border rounded-xl
                    ${prefs.readingStyle === style.split(' (')[0] 
                    ? 'bg-indigo-500/20 border-indigo-400 text-indigo-300' 
                    : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/30 hover:bg-white/10'}
                `}
                >
                <span className="font-bold text-base">{style}</span>
                {prefs.readingStyle === style.split(' (')[0] && <div className="w-2 h-2 bg-indigo-400 rounded-full shadow-[0_0_10px_rgba(129,140,248,0.8)]" />}
                </button>
            ))}
            </div>
        </div>
        )}

        {/* Step 4: Loading */}
        {step === 4 && (
        <div className="flex flex-col items-center justify-center py-10 animate-enter">
            <div className="relative w-20 h-20 mb-8">
                <div className="absolute inset-0 border-4 border-white/10 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <h2 className="font-display text-xl font-bold text-white">Synthesizing</h2>
            <p className="text-xs font-mono text-cyan-400 mt-2 tracking-widest animate-pulse">BUILDING_FEED_PROTOCOL...</p>
            {setTimeout(() => onComplete(prefs), 2000) && null}
        </div>
        )}

      </div>
    </div>
  );
};

export default Onboarding;