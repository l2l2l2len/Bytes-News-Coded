import React, { useState, useEffect, useMemo, useRef } from 'react';
import Navbar from './components/Navbar';
import NewsSlide from './components/NewsSlide';
import CurateDrawer from './components/CurateDrawer';
import Onboarding from './components/Onboarding';
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

  if (showOnboarding) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="relative h-screen bg-black overflow-hidden flex flex-col items-center">
      <Navbar 
        onProfileClick={() => setIsDrawerOpen(true)}
        onSearchClick={() => setIsDrawerOpen(true)}
        onNotifyClick={() => alert('No new notifications')}
      />

      <div 
        ref={feedRef}
        className="feed-container w-full max-w-full sm:max-w-[480px] bg-black shadow-2xl"
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
          <div className="h-full flex flex-col items-center justify-center text-center p-12 bg-[#111]">
            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
              <svg className="w-10 h-10 text-white/20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-2xl font-display font-black text-white mb-3 tracking-tight">Feed is empty</h3>
            <p className="text-sm text-white/40 mb-10 leading-relaxed font-medium">Try expanding your curation or refining your search terms.</p>
            <button 
              onClick={() => setIsDrawerOpen(true)}
              className="px-10 py-5 rounded-full bg-white text-black font-black text-[11px] uppercase tracking-[0.2em] hover:bg-[#D9B77E] transition-all active:scale-95"
            >
              Adjust Curation
            </button>
          </div>
        )}
      </div>

      <CurateDrawer 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)}
        selectedTopics={selectedTopics}
        onTopicToggle={toggleTopic}
        onSearch={setSearchTerm}
      />
    </div>
  );
};

export default App;