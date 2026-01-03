
import React from 'react';

interface HowItWorksProps {
  onNavigate: (page: string) => void;
}

const HowItWorks: React.FC<HowItWorksProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-[#fff1f2] text-[#4a044e]">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 px-4 md:px-8 py-4 bg-white/80 backdrop-blur-md border-b border-rose-100">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2 hover:opacity-70 transition-opacity"
            aria-label="Go back to home"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            <span className="font-serif-display text-2xl font-bold text-[#831843]">Bytes.</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-20 px-4 md:px-8">
        <div className="max-w-3xl mx-auto">

          {/* Hero */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-serif-display font-bold text-[#4a044e] mb-4">
              How Bytes Works
            </h1>
            <p className="text-lg text-[#831843]/70 max-w-xl mx-auto">
              A step-by-step guide to getting the most out of your personalized news feed.
            </p>
          </div>

          {/* Steps */}
          <div className="space-y-8 mb-16">

            {/* Step 1 */}
            <div className="glass-card rounded-3xl p-8 relative overflow-hidden">
              <div className="absolute top-6 right-6 w-16 h-16 flex items-center justify-center bg-[#831843]/10 rounded-2xl">
                <span className="text-4xl font-serif-display font-bold text-[#831843]/40">1</span>
              </div>
              <h2 className="text-2xl font-serif-display font-bold text-[#4a044e] mb-4 pr-20">
                Open Bytes Instantly
              </h2>
              <p className="text-[#831843]/80 leading-relaxed mb-4">
                No downloads. No sign-ups. Just visit Bytes in your browser and you're ready to go. The app works on any device - phone, tablet, or computer.
              </p>
              <div className="flex items-center gap-3 text-sm text-[#831843]/60">
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  No account needed
                </span>
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Works offline after first load
                </span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="glass-card rounded-3xl p-8 relative overflow-hidden">
              <div className="absolute top-6 right-6 w-16 h-16 flex items-center justify-center bg-[#831843]/10 rounded-2xl">
                <span className="text-4xl font-serif-display font-bold text-[#831843]/40">2</span>
              </div>
              <h2 className="text-2xl font-serif-display font-bold text-[#4a044e] mb-4 pr-20">
                Enter Your Name
              </h2>
              <p className="text-[#831843]/80 leading-relaxed mb-4">
                Tell us what to call you. This is completely optional and stored only on your device - we never see it. If you prefer, leave it blank and stay anonymous.
              </p>
              <div className="bg-white/60 rounded-2xl p-4 border border-rose-100 max-w-xs">
                <span className="text-sm text-[#831843]/50 block mb-1">Example greeting:</span>
                <span className="font-serif-display text-lg font-bold text-[#4a044e]">Hello, Alex</span>
              </div>
            </div>

            {/* Step 3 */}
            <div className="glass-card rounded-3xl p-8 relative overflow-hidden">
              <div className="absolute top-6 right-6 w-16 h-16 flex items-center justify-center bg-[#831843]/10 rounded-2xl">
                <span className="text-4xl font-serif-display font-bold text-[#831843]/40">3</span>
              </div>
              <h2 className="text-2xl font-serif-display font-bold text-[#4a044e] mb-4 pr-20">
                Choose Your Interests
              </h2>
              <p className="text-[#831843]/80 leading-relaxed mb-4">
                Select from categories like AI & Tech, Business, Science, World News, and more. You can also type in specific interests like "SpaceX" or "Climate Science" for more targeted content.
              </p>
              <div className="flex flex-wrap gap-2">
                {['AI & Tech', 'Startups', 'Science', 'Climate'].map(topic => (
                  <span key={topic} className="px-3 py-1.5 bg-[#831843] text-white rounded-full text-xs font-bold">
                    {topic}
                  </span>
                ))}
                <span className="px-3 py-1.5 border border-rose-200 text-[#831843]/70 rounded-full text-xs font-bold">
                  + Add more
                </span>
              </div>
            </div>

            {/* Step 4 */}
            <div className="glass-card rounded-3xl p-8 relative overflow-hidden">
              <div className="absolute top-6 right-6 w-16 h-16 flex items-center justify-center bg-[#831843]/10 rounded-2xl">
                <span className="text-4xl font-serif-display font-bold text-[#831843]/40">4</span>
              </div>
              <h2 className="text-2xl font-serif-display font-bold text-[#4a044e] mb-4 pr-20">
                Swipe Through Your Feed
              </h2>
              <p className="text-[#831843]/80 leading-relaxed mb-4">
                Your personalized news feed appears as full-screen cards. Simply swipe up (or scroll) to move to the next story. Each card shows the headline, a brief summary, and the source.
              </p>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-white shadow flex items-center justify-center">
                    <svg className="w-4 h-4 text-rose-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <span className="text-[#831843]/70">Like</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-white shadow flex items-center justify-center">
                    <svg className="w-4 h-4 text-[#831843]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                  </div>
                  <span className="text-[#831843]/70">Save</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-white shadow flex items-center justify-center">
                    <svg className="w-4 h-4 text-[#831843]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </div>
                  <span className="text-[#831843]/70">Share</span>
                </div>
              </div>
            </div>

            {/* Step 5 */}
            <div className="glass-card rounded-3xl p-8 relative overflow-hidden">
              <div className="absolute top-6 right-6 w-16 h-16 flex items-center justify-center bg-[#831843]/10 rounded-2xl">
                <span className="text-4xl font-serif-display font-bold text-[#831843]/40">5</span>
              </div>
              <h2 className="text-2xl font-serif-display font-bold text-[#4a044e] mb-4 pr-20">
                Tap to Expand, Tap Again to Read Full Story
              </h2>
              <p className="text-[#831843]/80 leading-relaxed mb-4">
                Tap any story card to expand and see the full summary. If you want to read the complete original article, tap the "Full Story" button to open the source in a new tab.
              </p>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#831843] text-white rounded-full text-sm font-bold">
                Full Story
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>
            </div>

            {/* Step 6 */}
            <div className="glass-card rounded-3xl p-8 relative overflow-hidden">
              <div className="absolute top-6 right-6 w-16 h-16 flex items-center justify-center bg-[#831843]/10 rounded-2xl">
                <span className="text-4xl font-serif-display font-bold text-[#831843]/40">6</span>
              </div>
              <h2 className="text-2xl font-serif-display font-bold text-[#4a044e] mb-4 pr-20">
                Customize Anytime
              </h2>
              <p className="text-[#831843]/80 leading-relaxed mb-4">
                Tap your profile icon to open Settings. Here you can add or remove interests, search for specific topics, and refresh your feed with the latest news.
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#831843]/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-[#831843]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <span className="text-sm text-[#831843]/70">Search or filter topics</span>
              </div>
            </div>

          </div>

          {/* Tips Section */}
          <div className="glass-card rounded-3xl p-8 mb-12">
            <h2 className="text-2xl font-serif-display font-bold text-[#4a044e] mb-6 text-center">
              Pro Tips
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  icon: '⚡',
                  tip: 'Tap the Live button to fetch the freshest news on demand.'
                },
                {
                  icon: '💾',
                  tip: 'Your preferences are automatically saved and will be there when you return.'
                },
                {
                  icon: '📱',
                  tip: 'Add Bytes to your home screen for quick access like a native app.'
                },
                {
                  icon: '🔄',
                  tip: 'The more specific your interests, the more relevant your feed becomes.'
                }
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="text-2xl">{item.icon}</span>
                  <p className="text-sm text-[#831843]/80">{item.tip}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <button
              onClick={() => onNavigate('home')}
              className="px-10 py-4 bg-[#831843] text-white rounded-full font-bold uppercase tracking-wider hover:bg-[#be185d] transition-colors shadow-lg"
            >
              Start Reading Now
            </button>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-rose-100 bg-white/50 py-8 px-4">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-serif-display text-xl font-bold text-[#831843]">Bytes.</span>
            <span className="text-sm text-[#831843]/50">© 2025</span>
          </div>
          <div className="flex items-center gap-6 text-sm">
            <button onClick={() => onNavigate('about')} className="text-[#831843]/70 hover:text-[#831843] transition-colors">About</button>
            <button onClick={() => onNavigate('privacy')} className="text-[#831843]/70 hover:text-[#831843] transition-colors">Privacy</button>
            <button onClick={() => onNavigate('terms')} className="text-[#831843]/70 hover:text-[#831843] transition-colors">Terms</button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HowItWorks;
