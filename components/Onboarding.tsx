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
    }, 800); // Allow exit animation to play
  };

  useEffect(() => {
    if (step === 4) {
      const timer = setTimeout(handleComplete, 2500);
      return () => clearTimeout(timer);
    }
  }, [step]);

  return (
    <div className={`fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden transition-opacity duration-700 ${isExiting ? 'opacity-0' : 'opacity-100'}`}>
      
      {/* 1. VIBRANT NEON BACKGROUND (Deep Indigo, not Black) */}
      <div className="absolute inset-0 bg-indigo-950">
        {/* Animated Gradient Orbs */}
        <div className="absolute top-[-20%] left-[-10%] w-[80vw] h-[80vw] bg-fuchsia-600/40 rounded-full blur-[100px] animate-pulse mix-blend-screen" style={{ animationDuration: '4s' }}></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[80vw] h-[80vw] bg-cyan-500/40 rounded-full blur-[100px] animate-pulse mix-blend-screen" style={{ animationDuration: '7s' }}></div>
        <div className="absolute top-[40%] left-[30%] w-[60vw] h-[60vw] bg-violet-600/40 rounded-full blur-[120px] animate-pulse mix-blend-screen" style={{ animationDuration: '10s' }}></div>
        
        {/* Grid Overlay for Synthwave feel */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_100%)]"></div>
      </div>

      {/* 2. MAIN CARD */}
      <div className="relative z-10 w-full max-w-lg mx-4">
        
        {/* Glass Container with Neon Glow Border */}
        <div className="relative bg-white/5 backdrop-blur-2xl border border-white/20 rounded-[40px] p-8 md:p-12 shadow-[0_0_50px_-10px_rgba(167,139,250,0.3)] overflow-hidden">
            
            {/* Top Shine Effect */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-50"></div>

            {/* Step 1: Welcome */}
            {step === 1 && (
                <div className="flex flex-col items-center text-center animate-float-up">
                    <div className="w-24 h-24 mb-8 rounded-full bg-gradient-to-tr from-cyan-400 to-fuchsia-500 p-[2px] shadow-[0_0_30px_rgba(232,121,249,0.5)]">
                        <div className="w-full h-full rounded-full bg-indigo-950 flex items-center justify-center">
                            <span className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-cyan-400 to-fuchsia-500">B</span>
                        </div>
                    </div>
                    
                    <h1 className="text-5xl font-bold text-white mb-4 tracking-tight drop-shadow-lg">
                        Bytes<span className="text-cyan-400">.</span>
                    </h1>
                    <p className="text-lg text-indigo-200 mb-10 font-medium leading-relaxed">
                        The future of news is <span className="text-cyan-300 font-bold drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">fast</span>, <span className="text-fuchsia-300 font-bold drop-shadow-[0_0_10px_rgba(232,121,249,0.5)]">focused</span>, and <span className="text-white font-bold">yours</span>.
                    </p>

                    <button 
                        onClick={handleNext}
                        className="group relative px-10 py-4 bg-transparent overflow-hidden rounded-full transition-all hover:scale-105"
                    >
                        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-cyan-500 via-fuchsia-500 to-cyan-500 animate-gradient-x opacity-80 group-hover:opacity-100"></div>
                        <span className="relative z-10 font-bold text-white uppercase tracking-[0.2em] text-sm">Initialize System</span>
                    </button>
                </div>
            )}

            {/* Step 2: Topics (Neon Selection) */}
            {step === 2 && (
                <div className="animate-float-up">
                    <h2 className="text-3xl font-bold text-white mb-2 text-center">Data Streams</h2>
                    <p className="text-indigo-300 text-xs font-bold uppercase tracking-widest text-center mb-8">Select 3+ Interest Vectors</p>

                    <div className="flex flex-wrap gap-3 justify-center mb-10">
                        {topicsList.map(t => {
                            const isSelected = prefs.topics.includes(t);
                            return (
                                <button 
                                    key={t}
                                    onClick={() => toggleTopic(t)}
                                    className={`
                                        relative px-5 py-3 rounded-xl text-sm font-bold transition-all duration-300 border
                                        ${isSelected 
                                            ? 'bg-cyan-400 border-cyan-400 text-indigo-950 shadow-[0_0_20px_rgba(34,211,238,0.6)] scale-105' 
                                            : 'bg-white/5 border-white/10 text-indigo-200 hover:bg-white/10 hover:border-white/30'}
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
                        className="w-full py-4 rounded-xl font-bold text-sm uppercase tracking-widest transition-all disabled:opacity-50 disabled:grayscale
                        bg-gradient-to-r from-fuchsia-600 to-violet-600 text-white shadow-[0_0_30px_rgba(192,38,211,0.4)] hover:shadow-[0_0_50px_rgba(192,38,211,0.6)] hover:scale-[1.02]"
                    >
                        Confirm Vectors
                    </button>
                </div>
            )}

            {/* Step 3: Density */}
            {step === 3 && (
                <div className="animate-float-up">
                    <h2 className="text-3xl font-bold text-white mb-2 text-center">Resolution</h2>
                    <p className="text-indigo-300 text-xs font-bold uppercase tracking-widest text-center mb-8">Select Information Density</p>

                    <div className="space-y-4 mb-10">
                        {['Ultra quick (10s)', 'Brief summaries', 'Deep dives'].map(style => {
                            const val = style.split(' (')[0];
                            const isSelected = prefs.readingStyle === val;
                            return (
                                <button 
                                    key={style}
                                    onClick={() => { setPrefs(p => ({...p, readingStyle: val as any})); handleNext(); }}
                                    className={`
                                        w-full p-6 flex justify-between items-center text-left transition-all border rounded-2xl group
                                        ${isSelected 
                                            ? 'bg-fuchsia-500/20 border-fuchsia-500 text-white shadow-[0_0_20px_rgba(232,121,249,0.2)]' 
                                            : 'bg-white/5 border-white/10 text-indigo-200 hover:bg-white/10 hover:border-white/30'}
                                    `}
                                >
                                    <span className="font-bold text-lg">{style}</span>
                                    <div className={`
                                        w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors
                                        ${isSelected ? 'border-fuchsia-400 bg-fuchsia-400' : 'border-white/30 group-hover:border-white/60'}
                                    `}>
                                        {isSelected && <div className="w-2 h-2 bg-white rounded-full" />}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Step 4: Loading / Synthesis */}
            {step === 4 && (
                <div className="flex flex-col items-center justify-center py-12 animate-float-up">
                    <div className="relative w-24 h-24 mb-8">
                        {/* Spinning Neon Rings */}
                        <div className="absolute inset-0 border-4 border-white/10 rounded-full"></div>
                        <div className="absolute inset-0 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
                        <div className="absolute inset-2 border-4 border-fuchsia-500 border-b-transparent rounded-full animate-spin-reverse"></div>
                    </div>
                    
                    <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">Synthesizing Feed</h2>
                    <div className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce"></span>
                        <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce delay-100"></span>
                        <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce delay-200"></span>
                    </div>
                </div>
            )}

        </div>
        
        {/* Footer Text */}
        <div className="text-center mt-6 opacity-60">
             <p className="text-[10px] text-indigo-300 uppercase tracking-widest">Powered by Gemini 2.5</p>
        </div>

      </div>

      <style>{`
        @keyframes spin-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        .animate-spin-reverse {
          animation: spin-reverse 1s linear infinite;
        }
        @keyframes gradient-x {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }
        .animate-gradient-x {
            background-size: 200% 200%;
            animation: gradient-x 3s ease infinite;
        }
        @keyframes float-up {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-float-up {
          animation: float-up 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default Onboarding;