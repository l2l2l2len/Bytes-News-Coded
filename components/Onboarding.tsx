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

  const topicsList = ['AI & Tech', 'Startups', 'Global Markets', 'Policy & Regulation', 'Geopolitics', 'Climate', 'Culture', 'Science', 'Finance', 'Health'];

  const toggleTopic = (topic: string) => {
    setPrefs(p => ({
      ...p,
      topics: p.topics.includes(topic) ? p.topics.filter(t => t !== topic) : [...p.topics, topic]
    }));
  };

  const next = () => setStep(s => s + 1);

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-8 text-center animate-fade-in-up bg-[#FFFFFF]/30 backdrop-blur-sm">
      <div className="max-app-width w-full h-full flex flex-col justify-center">
        
        {/* Step 1: Welcome */}
        {step === 1 && (
          <div className="space-y-12 animate-fade-in-up">
            <div className="space-y-4">
              <div className="w-16 h-16 bg-[#232323] rounded-2xl mx-auto flex items-center justify-center text-white font-display text-4xl shadow-xl rotate-3">B</div>
              <h1 className="text-4xl font-display font-bold">Bytes</h1>
              <p className="text-xl text-[#232323]/60 font-medium">News, decoded into fast, clear bytes.</p>
            </div>
            <button onClick={next} className="w-full py-5 bg-[#232323] text-white font-bold rounded-3xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg">
              Get started
            </button>
          </div>
        )}

        {/* Step 2: Topics */}
        {step === 2 && (
          <div className="space-y-8 animate-fade-in-up">
            <div className="space-y-2">
              <h2 className="text-3xl font-display font-bold">What do you care about?</h2>
              <p className="text-sm text-[#232323]/50">Select 3–7 topics to tailor your feed.</p>
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              {topicsList.map(t => (
                <button 
                  key={t}
                  onClick={() => toggleTopic(t)}
                  className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest border transition-all pill-chip ${
                    prefs.topics.includes(t) ? 'bg-[#232323] text-white border-[#232323]' : 'bg-white/50 text-[#232323]/60 border-[#F0E0D2]'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            <div className="h-1 bg-[#232323]/5 w-full rounded-full overflow-hidden">
              <div className="h-full bg-[#D9B77E] transition-all duration-500" style={{ width: `${(prefs.topics.length / 7) * 100}%` }} />
            </div>
            <button 
              disabled={prefs.topics.length < 3} 
              onClick={next} 
              className="w-full py-5 bg-[#232323] text-white font-bold rounded-3xl disabled:opacity-20 shadow-lg"
            >
              Continue
            </button>
          </div>
        )}

        {/* Step 3: Style */}
        {step === 3 && (
          <div className="space-y-8 animate-fade-in-up">
            <h2 className="text-3xl font-display font-bold">Reading Style?</h2>
            <div className="space-y-3">
              {['Ultra quick (10–20s reads)', 'Brief summaries', 'Occasional deep dives'].map(style => (
                <button 
                  key={style}
                  onClick={() => { setPrefs(p => ({...p, readingStyle: style.split(' (')[0] as any})); next(); }}
                  className="w-full p-6 soft-card rounded-2xl flex justify-between items-center group transition-all"
                >
                  <span className="font-bold text-sm">{style}</span>
                  <div className={`w-5 h-5 rounded-full border-2 ${prefs.readingStyle === style.split(' (')[0] ? 'bg-[#D9B77E] border-[#D9B77E]' : 'border-[#F0E0D2]'}`} />
                </button>
              ))}
            </div>
            <p className="text-xs text-[#232323]/40 italic">This affects the length and density of your cards.</p>
          </div>
        )}

        {/* Step 4: Tone */}
        {step === 4 && (
          <div className="space-y-8 animate-fade-in-up">
            <h2 className="text-3xl font-display font-bold">Choose your tone.</h2>
            <div className="space-y-3">
              {['Straight facts', 'More explanation', 'Context & opinion'].map(tone => (
                <button 
                  key={tone}
                  onClick={() => { setPrefs(p => ({...p, tone: tone as any})); next(); }}
                  className="w-full p-6 soft-card rounded-2xl flex justify-between items-center transition-all"
                >
                  <span className="font-bold text-sm">{tone}</span>
                  <div className={`w-5 h-5 rounded-full border-2 ${prefs.tone === tone ? 'bg-[#D9B77E] border-[#D9B77E]' : 'border-[#F0E0D2]'}`} />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 5: Trust/Constraints */}
        {step === 5 && (
          <div className="space-y-8 animate-fade-in-up">
            <h2 className="text-3xl font-display font-bold">Trust & Constraints</h2>
            <div className="space-y-3">
              {[
                { key: 'noClickbait', label: 'No clickbait' },
                { key: 'fewerCelebrity', label: 'Fewer celebrity stories' },
                { key: 'expertSources', label: 'More expert sources' },
                { key: 'safeMode', label: 'Safe mode (No sensitive content)' }
              ].map(item => (
                <div key={item.key} className="p-5 soft-card rounded-2xl flex justify-between items-center">
                  <span className="font-bold text-sm">{item.label}</span>
                  <button 
                    onClick={() => setPrefs(p => ({...p, constraints: {...p.constraints, [item.key]: !(p.constraints as any)[item.key]}}))}
                    className={`w-12 h-6 rounded-full relative transition-colors ${ (prefs.constraints as any)[item.key] ? 'bg-[#D9B77E]' : 'bg-[#232323]/10'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${ (prefs.constraints as any)[item.key] ? 'left-7' : 'left-1'}`} />
                  </button>
                </div>
              ))}
            </div>
            <button onClick={next} className="w-full py-5 bg-[#232323] text-white font-bold rounded-3xl shadow-lg">Finalize setup</button>
          </div>
        )}

        {/* Step 6: Loading */}
        {step === 6 && (
          <div className="space-y-8 animate-fade-in-up flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-[#D9B77E] border-t-transparent rounded-full animate-spin" />
            <h2 className="text-2xl font-display font-bold">Building your feed...</h2>
            <p className="text-sm text-[#232323]/50">Curating the intelligent layer.</p>
            {setTimeout(() => onComplete(prefs), 2000) && null}
          </div>
        )}

      </div>
    </div>
  );
};

export default Onboarding;