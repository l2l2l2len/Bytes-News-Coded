
import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import Navbar from './components/Navbar';
import NewsSlide from './components/NewsSlide';
import CurateDrawer from './components/CurateDrawer';
import Onboarding from './components/Onboarding';
import InteractiveBackground from './components/InteractiveBackground';
import { getCachedNews, fetchRealTimeNews } from './services/geminiService';
import { Byte, UserPreferences } from './types';

const App: React.FC = () => {
  const [news, setNews] = useState<Byte[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState<boolean>(true);
  const [storedPrefs, setStoredPrefs] = useState<UserPreferences | null>(null);
  const [selectedTopics, setSelectedTopics] = useState<string[]>(['US News', 'World', 'AI & Tech', 'Business', 'Science']);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const feedRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);

  const startSync = useCallback(async (force = false) => {
    if (isSyncing) return;
    setIsSyncing(true);

    try {
      const liveNews = await fetchRealTimeNews(selectedTopics, force);
      setNews(liveNews);
    } catch (e) {
      console.error("Sync failed", e);
    } finally {
      setIsSyncing(false);
    }
  }, [selectedTopics, isSyncing]);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    
    const prefsStr = localStorage.getItem('bytes_prefs');
    if (prefsStr) {
      const prefs = JSON.parse(prefsStr);
      setStoredPrefs(prefs);
      setSelectedTopics(prefs.topics);
      setShowOnboarding(false);
      
      // Load cache first, then sync
      const cache = getCachedNews();
      if (cache.length > 0) {
        setNews(cache);
      }
      startSync();
    }
  }, [startSync]);

  const handleOnboardingComplete = (prefs: UserPreferences) => {
    localStorage.setItem('bytes_prefs', JSON.stringify(prefs));
    setStoredPrefs(prefs);
    setSelectedTopics(prefs.topics);
    setShowOnboarding(false);
    startSync();
  };

  const handleLike = (id: string) => {
    setNews(prev => prev.map(item => item.id === id ? {...item, isLiked: !item.isLiked, likes: item.isLiked ? item.likes - 1 : item.likes + 1} : item));
  };

  const handleSave = (id: string) => {
    setNews(prev => prev.map(item => item.id === id ? {...item, isSaved: !item.isSaved} : item));
  };

  const filteredNews = useMemo(() => {
    return news.filter(byte => 
      searchTerm === '' || 
      byte.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      byte.abstract.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [news, searchTerm]);

  return (
    <div className="relative h-[100dvh] w-full overflow-hidden text-[#4a044e] bg-[#fff1f2]">
      <InteractiveBackground />
      
      {showOnboarding ? (
        <Onboarding onComplete={handleOnboardingComplete} existingPrefs={storedPrefs} />
      ) : (
        <div className="relative z-10 w-full h-full animate-fade-in">
          <Navbar 
            onProfileClick={() => setIsDrawerOpen(true)} 
            onSearchClick={() => setIsDrawerOpen(true)} 
            onNotifyClick={() => {}} 
            onLiveClick={() => startSync(true)} 
            isLiveLoading={isSyncing} 
            userName={storedPrefs?.userName} 
          />

          {/* Sync Status Overlay */}
          <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[60] pointer-events-none">
            {isSyncing && (
              <div className="bg-white/60 backdrop-blur-md px-4 py-1.5 rounded-full shadow-lg border border-white/40 flex items-center gap-2 animate-bounce">
                <div className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse"></div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-rose-900">Syncing Intelligence...</span>
              </div>
            )}
          </div>

          <div ref={feedRef} className="h-[100dvh] w-full overflow-y-scroll snap-y snap-mandatory no-scrollbar">
            {filteredNews.length > 0 ? (
                <>
                  {filteredNews.map((byte, idx) => (
                    <NewsSlide key={`${byte.id}-${idx}`} byte={byte} onLike={handleLike} onSave={handleSave} />
                  ))}
                  <div className="h-[100dvh] w-full flex items-center justify-center snap-center p-12 text-center">
                    <div className="glass-card p-8 rounded-[40px] shadow-2xl">
                      <h3 className="text-2xl font-serif-display font-bold text-[#4a044e] mb-2">That's all for now.</h3>
                      <p className="text-xs text-[#831843]/60 mb-6 uppercase tracking-widest font-bold">Refreshed every 15 minutes</p>
                      <button 
                        onClick={() => startSync(true)}
                        className="px-8 py-3 bg-[#831843] text-white rounded-full text-[10px] font-bold uppercase tracking-[0.2em] shadow-xl active:scale-95 transition-transform"
                      >
                        Refresh Feed
                      </button>
                    </div>
                  </div>
                </>
            ) : (
                <div className="h-full flex items-center justify-center p-8 text-center snap-center">
                    <div className="glass-panel p-10 rounded-[48px] shadow-2xl max-w-xs w-full">
                        <div className="w-12 h-12 bg-rose-100 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                          <svg className="w-6 h-6 text-[#831843] animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        </div>
                        <h3 className="text-xl font-serif-display font-bold text-[#831843] mb-2">Scanning the Globe</h3>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-[#831843]/40">Zero data found locally • Fetching real-time</p>
                    </div>
                </div>
            )}
          </div>
        </div>
      )}
      
      <CurateDrawer 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
        selectedTopics={selectedTopics} 
        onTopicToggle={(t) => {
          const next = selectedTopics.includes(t) ? selectedTopics.filter(x => x !== t) : [...selectedTopics, t];
          setSelectedTopics(next);
          // If they update topics, trigger a sync
          setTimeout(() => startSync(true), 100);
        }} 
        onSearch={setSearchTerm} 
      />

      <style>{`
        .animate-fade-in { animation: fade-in 0.8s ease-out forwards; }
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
    </div>
  );
};

export default App;
