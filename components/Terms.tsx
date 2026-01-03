
import React from 'react';

interface TermsProps {
  onNavigate: (page: string) => void;
}

const Terms: React.FC<TermsProps> = ({ onNavigate }) => {
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
              Terms of Service
            </h1>
            <p className="text-[#831843]/60 text-sm">Last updated: January 2025</p>
          </div>

          <div className="glass-card rounded-3xl p-8 md:p-10 space-y-8">

            <section>
              <h2 className="text-xl font-serif-display font-bold text-[#4a044e] mb-4">
                1. Acceptance of Terms
              </h2>
              <p className="text-[#831843]/80 leading-relaxed">
                By accessing and using Bytes ("the Service"), you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to these terms, please do not use the Service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-serif-display font-bold text-[#4a044e] mb-4">
                2. Description of Service
              </h2>
              <p className="text-[#831843]/80 leading-relaxed">
                Bytes is a free, open-access news aggregation and summarization service. The Service uses artificial intelligence to curate and present news content from various sources across the internet. Bytes provides summarized versions of news articles and links to original source material.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-serif-display font-bold text-[#4a044e] mb-4">
                3. No Account Required
              </h2>
              <p className="text-[#831843]/80 leading-relaxed">
                The Service is designed to be used without creating an account. All user preferences and data are stored locally on your device. You maintain full control over your data at all times.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-serif-display font-bold text-[#4a044e] mb-4">
                4. Content Disclaimer
              </h2>
              <p className="text-[#831843]/80 leading-relaxed mb-4">
                The news content presented through Bytes is sourced from third-party news providers and processed using AI summarization technology. Please note:
              </p>
              <ul className="list-disc list-inside text-[#831843]/80 space-y-2">
                <li>Bytes does not create original news content</li>
                <li>AI-generated summaries may not capture all nuances of original articles</li>
                <li>For complete and accurate information, we recommend reading the full original articles</li>
                <li>Bytes is not responsible for the accuracy of third-party content</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-serif-display font-bold text-[#4a044e] mb-4">
                5. Intellectual Property
              </h2>
              <p className="text-[#831843]/80 leading-relaxed">
                The Bytes name, logo, and interface design are protected intellectual property. News content and images are the property of their respective owners and are displayed under fair use for news aggregation purposes. Links to original sources are provided for all content.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-serif-display font-bold text-[#4a044e] mb-4">
                6. Acceptable Use
              </h2>
              <p className="text-[#831843]/80 leading-relaxed mb-4">
                You agree to use the Service only for lawful purposes and in accordance with these Terms. You agree not to:
              </p>
              <ul className="list-disc list-inside text-[#831843]/80 space-y-2">
                <li>Attempt to reverse engineer or extract data from the Service in an automated manner</li>
                <li>Use the Service to distribute malware or harmful content</li>
                <li>Interfere with or disrupt the Service or servers</li>
                <li>Misrepresent your affiliation with any person or entity</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-serif-display font-bold text-[#4a044e] mb-4">
                7. Service Availability
              </h2>
              <p className="text-[#831843]/80 leading-relaxed">
                Bytes is provided on an "as is" and "as available" basis. We do not guarantee uninterrupted or error-free service. We reserve the right to modify, suspend, or discontinue the Service at any time without notice.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-serif-display font-bold text-[#4a044e] mb-4">
                8. Limitation of Liability
              </h2>
              <p className="text-[#831843]/80 leading-relaxed">
                To the fullest extent permitted by law, Bytes shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses resulting from your use of the Service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-serif-display font-bold text-[#4a044e] mb-4">
                9. Third-Party Links
              </h2>
              <p className="text-[#831843]/80 leading-relaxed">
                The Service contains links to third-party websites and content. We are not responsible for the content, privacy policies, or practices of any third-party sites. Your use of third-party sites is at your own risk.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-serif-display font-bold text-[#4a044e] mb-4">
                10. Free Service
              </h2>
              <p className="text-[#831843]/80 leading-relaxed">
                Bytes is provided free of charge. There are no premium tiers, subscriptions, or hidden fees. The Service will remain free for all users.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-serif-display font-bold text-[#4a044e] mb-4">
                11. Changes to Terms
              </h2>
              <p className="text-[#831843]/80 leading-relaxed">
                We reserve the right to modify these Terms at any time. Changes will be effective immediately upon posting to the Service. Your continued use of the Service following the posting of revised Terms means you accept and agree to the changes.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-serif-display font-bold text-[#4a044e] mb-4">
                12. Governing Law
              </h2>
              <p className="text-[#831843]/80 leading-relaxed">
                These Terms shall be governed by and construed in accordance with applicable laws, without regard to conflict of law principles.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-serif-display font-bold text-[#4a044e] mb-4">
                13. Contact Information
              </h2>
              <p className="text-[#831843]/80 leading-relaxed">
                For any questions regarding these Terms of Service, please contact us through our GitHub repository.
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
            <button onClick={() => onNavigate('privacy')} className="text-[#831843]/70 hover:text-[#831843] transition-colors">Privacy</button>
            <button onClick={() => onNavigate('how-it-works')} className="text-[#831843]/70 hover:text-[#831843] transition-colors">How It Works</button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Terms;
