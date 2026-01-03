
import React from 'react';

interface AboutProps {
  onNavigate: (page: string) => void;
}

const About: React.FC<AboutProps> = ({ onNavigate }) => {
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

          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center bg-white shadow-xl text-[#831843] rounded-2xl border border-rose-100">
              <span className="font-serif-display text-4xl font-bold">B</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-serif-display font-bold text-[#4a044e] mb-4">
              About Bytes
            </h1>
            <p className="text-lg md:text-xl text-[#831843]/70 max-w-2xl mx-auto leading-relaxed">
              Intelligent news, distilled. Experience clarity in 9 seconds.
            </p>
          </div>

          {/* Mission Section */}
          <section className="mb-16">
            <div className="glass-card rounded-3xl p-8 md:p-10">
              <h2 className="text-2xl md:text-3xl font-serif-display font-bold text-[#4a044e] mb-6">
                Our Mission
              </h2>
              <p className="text-[#831843]/80 leading-relaxed mb-4">
                In a world drowning in information, Bytes cuts through the noise. We believe that staying informed shouldn't mean spending hours scrolling through endless feeds of repetitive content and clickbait headlines.
              </p>
              <p className="text-[#831843]/80 leading-relaxed mb-4">
                Bytes uses advanced AI to curate, summarize, and deliver the news that matters to you - in bite-sized pieces you can digest in seconds, not minutes. Our goal is simple: keep you informed without overwhelming you.
              </p>
              <p className="text-[#831843]/80 leading-relaxed">
                No login required. No accounts to create. No personal data collected. Just open Bytes and start reading. Your preferences are stored locally on your device, giving you complete control over your data.
              </p>
            </div>
          </section>

          {/* How It Works */}
          <section className="mb-16">
            <h2 className="text-2xl md:text-3xl font-serif-display font-bold text-[#4a044e] mb-8 text-center">
              How Bytes Works
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  step: '1',
                  title: 'Choose Your Interests',
                  description: 'Select topics that matter to you - from tech and science to world news and business.'
                },
                {
                  step: '2',
                  title: 'AI Curates Your Feed',
                  description: 'Our AI scans thousands of sources to find the most relevant, high-quality news for your interests.'
                },
                {
                  step: '3',
                  title: 'Read in Seconds',
                  description: 'Each story is distilled into a clear, concise summary. Swipe through your personalized feed effortlessly.'
                }
              ].map((item) => (
                <div key={item.step} className="glass-card rounded-2xl p-6 text-center">
                  <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center bg-[#831843] text-white rounded-full font-bold text-lg">
                    {item.step}
                  </div>
                  <h3 className="text-lg font-bold text-[#4a044e] mb-2">{item.title}</h3>
                  <p className="text-sm text-[#831843]/70">{item.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Features */}
          <section className="mb-16">
            <h2 className="text-2xl md:text-3xl font-serif-display font-bold text-[#4a044e] mb-8 text-center">
              Why Choose Bytes
            </h2>
            <div className="space-y-4">
              {[
                {
                  icon: '🔒',
                  title: 'Privacy First',
                  description: 'No accounts, no tracking, no personal data collection. Your preferences stay on your device.'
                },
                {
                  icon: '⚡',
                  title: 'Instant Access',
                  description: 'Start reading immediately. No sign-up forms, no email verification, no friction.'
                },
                {
                  icon: '🎯',
                  title: 'Personalized Feed',
                  description: 'AI-powered curation based on your interests delivers exactly what you want to read.'
                },
                {
                  icon: '📱',
                  title: 'Beautiful Experience',
                  description: 'Designed for modern readers with an immersive, distraction-free interface.'
                },
                {
                  icon: '🌍',
                  title: 'Real-Time News',
                  description: 'Fresh content from trusted sources, updated throughout the day.'
                },
                {
                  icon: '💾',
                  title: 'Save for Later',
                  description: 'Bookmark articles and they stay saved locally in your browser.'
                }
              ].map((feature) => (
                <div key={feature.title} className="glass-card rounded-2xl p-5 flex items-start gap-4">
                  <span className="text-2xl">{feature.icon}</span>
                  <div>
                    <h3 className="font-bold text-[#4a044e] mb-1">{feature.title}</h3>
                    <p className="text-sm text-[#831843]/70">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Open Source */}
          <section className="mb-16">
            <div className="glass-card rounded-3xl p-8 md:p-10 text-center">
              <h2 className="text-2xl md:text-3xl font-serif-display font-bold text-[#4a044e] mb-4">
                Free & Open
              </h2>
              <p className="text-[#831843]/80 leading-relaxed mb-6">
                Bytes is completely free to use with no premium tiers or locked features.
                We believe quality news consumption should be accessible to everyone.
              </p>
              <button
                onClick={() => onNavigate('home')}
                className="px-8 py-3 bg-[#831843] text-white rounded-full font-bold text-sm uppercase tracking-wider hover:bg-[#be185d] transition-colors"
              >
                Start Reading
              </button>
            </div>
          </section>

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
            <button onClick={() => onNavigate('privacy')} className="text-[#831843]/70 hover:text-[#831843] transition-colors">Privacy</button>
            <button onClick={() => onNavigate('terms')} className="text-[#831843]/70 hover:text-[#831843] transition-colors">Terms</button>
            <button onClick={() => onNavigate('how-it-works')} className="text-[#831843]/70 hover:text-[#831843] transition-colors">How It Works</button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default About;
