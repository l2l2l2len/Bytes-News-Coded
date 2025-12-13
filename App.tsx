import React, { useState, useEffect, useMemo, useRef } from 'react';
import Navbar from './components/Navbar';
import NewsSlide from './components/NewsSlide';
import CurateDrawer from './components/CurateDrawer';
import Onboarding from './components/Onboarding';
import InteractiveBackground from './components/InteractiveBackground';
import { PAPERS } from './constants';
import { Byte, UserPreferences } from './types';

const App: React.FC = () => {
  const [news, setNews] = useState<Byte[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState<boolean>(true);
  const [selectedTopics, setSelectedTopics] = useState<string[]>(['US News', 'World', 'AI & Tech', 'Business', 'Science', 'Finance', 'Culture']);
  const [searchTerm, setSearchTerm] = useState('');
  const feedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('bytes_onboarded') === 'true';
    if (hasSeenOnboarding) {
      setShowOnboarding(false);
    }
    const storedPrefs = localStorage.getItem('bytes_prefs');
    if (storedPrefs) {
      const prefs = JSON.parse(storedPrefs) as UserPreferences;
      if (prefs.topics && prefs.topics.length > 0) {
        setSelectedTopics(prefs.topics);
      }
    }
    
    setNews(PAPERS.map(p => ({ ...p, isLiked: false, isSaved: false })));
  }, []);

  const handleOnboardingComplete = (prefs: UserPreferences) => {
    setShowOnboarding(false);
    setSelectedTopics(prefs.topics);
    localStorage.setItem('bytes_onboarded', 'true');
    localStorage.setItem('bytes_prefs', JSON.stringify(prefs));
  };

  const handleLike = (id: string) => {
    setNews(prev => prev.map(item => 
      item.id === id ? { ...item, isLiked: !item.isLiked, likes: item.isLiked ? item.likes - 1 : item.likes + 1 } : item
    ));
  };

  const handleSave = (id: string) => {
    setNews(prev => prev.map(item => 
      item.id === id ? { ...item, isSaved: !item.isSaved } : item
    ));
  };

  const toggleTopic = (topic: string) => {
    setSelectedTopics(prev => 
      prev.includes(topic) ? prev.filter(t => t !== topic) : [...prev, topic]
    );
  };

  const filteredNews = useMemo(() => {
    return news.filter(byte => {
      const matchesTopic = selectedTopics.includes(byte.category);
      const matchesSearch = searchTerm === '' || 
        byte.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        byte.abstract.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesTopic && matchesSearch;
    });
  }, [news, selectedTopics, searchTerm]);

  return (
    <div className="relative h-screen overflow-hidden flex flex-col items-center">
      {/* Dynamic Background */}
      <InteractiveBackground />
      
      {showOnboarding ? (
        <Onboarding onComplete={handleOnboardingComplete} />
      ) : (
        <>
          {/* Main Content Area - Scales down when drawer is open */}
          <div 
            className={`
              relative z-10 w-full h-full flex flex-col items-center transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]
              ${isDrawerOpen ? 'scale-95 opacity-50 blur-[2px] translate-x-[-20px] pointer-events-none' : 'scale-100 opacity-100 translate-x-0'}
            `}
            style={{ transformOrigin: 'center center' }}
          >
            <Navbar 
                onProfileClick={() => setIsDrawerOpen(true)}
                onSearchClick={() => setIsDrawerOpen(true)}
                onNotifyClick={() => alert('No new notifications')}
            />

            <div 
                ref={feedRef}
                className="feed-container w-full h-full pt-20"
            >
                {filteredNews.length > 0 ? (
                filteredNews.map(byte => (
                    <NewsSlide 
                    key={byte.id} 
                    byte={byte} 
                    onLike={handleLike} 
                    onSave={handleSave} 
                    />
                ))
                ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-8">
                    <div className="w-20 h-20 rounded-full bg-white/50 flex items-center justify-center mb-6 shadow-sm">
                      <svg className="w-10 h-10 text-[#FF7043]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-display font-bold text-[#3E2723] mb-2">It's quiet here.</h3>
                    <p className="text-sm text-[#795548] mb-8 leading-relaxed max-w-xs mx-auto">Try expanding your curation settings to see more stories.</p>
                    <button 
                    onClick={() => setIsDrawerOpen(true)}
                    className="px-8 py-4 rounded-full bg-[#3E2723] text-white font-bold text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-lg"
                    >
                    Adjust Curation
                    </button>
                </div>
                )}
            </div>
          </div>

          <CurateDrawer 
            isOpen={isDrawerOpen} 
            onClose={() => setIsDrawerOpen(false)}
            selectedTopics={selectedTopics}
            onTopicToggle={toggleTopic}
            onSearch={setSearchTerm}
          />
        </>
      )}
    </div>
  );
};

export default App;