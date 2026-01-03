
import React from 'react';

interface PrivacyProps {
  onNavigate: (page: string) => void;
}

const Privacy: React.FC<PrivacyProps> = ({ onNavigate }) => {
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

          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-serif-display font-bold text-[#4a044e] mb-4">
              Privacy Policy
            </h1>
            <p className="text-[#831843]/60 text-sm">Last updated: January 2025</p>
          </div>

          <div className="glass-card rounded-3xl p-8 md:p-10 space-y-8">

            <section>
              <h2 className="text-xl font-serif-display font-bold text-[#4a044e] mb-4">
                Our Privacy Commitment
              </h2>
              <p className="text-[#831843]/80 leading-relaxed">
                Bytes is built with privacy at its core. We designed this application to work entirely without collecting, storing, or transmitting any personal data. Your privacy is not just a feature - it's the foundation of how Bytes operates.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-serif-display font-bold text-[#4a044e] mb-4">
                No Account Required
              </h2>
              <p className="text-[#831843]/80 leading-relaxed">
                Unlike most news applications, Bytes does not require you to create an account, provide an email address, or sign up in any way. You can start using Bytes immediately without providing any personal information.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-serif-display font-bold text-[#4a044e] mb-4">
                Local Data Storage
              </h2>
              <p className="text-[#831843]/80 leading-relaxed mb-4">
                All your preferences and saved articles are stored locally in your browser using localStorage. This data never leaves your device and is not accessible to us or any third party.
              </p>
              <p className="text-[#831843]/80 leading-relaxed">
                The data stored locally includes:
              </p>
              <ul className="list-disc list-inside text-[#831843]/80 mt-2 space-y-1">
                <li>Your name (optional, for personalized greetings)</li>
                <li>Selected news topics and interests</li>
                <li>Liked and saved articles</li>
                <li>Reading preferences</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-serif-display font-bold text-[#4a044e] mb-4">
                No Tracking or Analytics
              </h2>
              <p className="text-[#831843]/80 leading-relaxed">
                Bytes does not use cookies, tracking pixels, fingerprinting, or any other tracking technologies. We do not track your reading habits, browsing patterns, or any other behavioral data.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-serif-display font-bold text-[#4a044e] mb-4">
                Third-Party Services
              </h2>
              <p className="text-[#831843]/80 leading-relaxed mb-4">
                Bytes uses the following third-party services to provide news content:
              </p>
              <ul className="list-disc list-inside text-[#831843]/80 space-y-2">
                <li><strong>Google Gemini AI:</strong> Used to curate and summarize news content. Requests are made directly from your browser to Google's API without any identifying information.</li>
                <li><strong>Unsplash:</strong> Used for article imagery. No personal data is shared.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-serif-display font-bold text-[#4a044e] mb-4">
                External Links
              </h2>
              <p className="text-[#831843]/80 leading-relaxed">
                When you click "Full Story" to read the complete article, you will be directed to the original news source's website. These external websites have their own privacy policies, which we encourage you to review.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-serif-display font-bold text-[#4a044e] mb-4">
                Clearing Your Data
              </h2>
              <p className="text-[#831843]/80 leading-relaxed">
                Since all data is stored locally in your browser, you can clear it at any time by:
              </p>
              <ul className="list-disc list-inside text-[#831843]/80 mt-2 space-y-1">
                <li>Using the "Reset My Interests" option in the app</li>
                <li>Clearing your browser's localStorage for this site</li>
                <li>Using your browser's "Clear browsing data" feature</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-serif-display font-bold text-[#4a044e] mb-4">
                Children's Privacy
              </h2>
              <p className="text-[#831843]/80 leading-relaxed">
                Bytes is designed for general audiences. Since we do not collect any personal information, there are no special provisions for children's data.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-serif-display font-bold text-[#4a044e] mb-4">
                Changes to This Policy
              </h2>
              <p className="text-[#831843]/80 leading-relaxed">
                If we make changes to this privacy policy, we will update the "Last updated" date at the top of this page. Your continued use of Bytes after any changes indicates acceptance of the updated policy.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-serif-display font-bold text-[#4a044e] mb-4">
                Contact
              </h2>
              <p className="text-[#831843]/80 leading-relaxed">
                If you have any questions about this privacy policy or how Bytes handles data, you can reach us through our GitHub repository.
              </p>
            </section>

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
            <button onClick={() => onNavigate('terms')} className="text-[#831843]/70 hover:text-[#831843] transition-colors">Terms</button>
            <button onClick={() => onNavigate('how-it-works')} className="text-[#831843]/70 hover:text-[#831843] transition-colors">How It Works</button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Privacy;
