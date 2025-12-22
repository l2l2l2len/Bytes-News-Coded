
import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import Navbar from './components/Navbar';
import NewsSlide from './components/NewsSlide';
import CurateDrawer from './components/CurateDrawer';
import Onboarding from './components/Onboarding';
import InteractiveBackground from './components/InteractiveBackground';
import { PAPERS, DEFAULT_CATEGORIES } from './constants';
import { fetchRealTimeNews } from './services/geminiService';
import { Byte, UserPreferences } from './types';

const App: React.FC = () => {
  const [newsBuckets, setNewsBuckets] = useState<Record<number, Byte[]>>({});
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState<boolean>(true);
  const [storedPrefs, setStoredPrefs] = useState<UserPreferences | null>(null);
  const [selectedTopics, setSelectedTopics] = useState<string[]>(['US News', 'World', 'AI & Tech', 'Business', 'Science']);
  const [searchTerm, setSearchTerm] = useState('');
  const [userName, setUserName] = useState('');
  const [streamStatus, setStreamStatus] = useState<string>(''); 
  const [isStreaming, setIsStreaming] = useState(false);
  const feedRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);

  const news = useMemo(() => {
    return Object.keys(newsBuckets)
      .map(Number)
      .sort((a, b) => a - b) 
      .flatMap(key => newsBuckets[key]);
  }, [newsBuckets]);

  const getDynamicBatches = useCallback(() => {
    const customTopics = selectedTopics.filter(t => !DEFAULT_CATEGORIES.some(c => c.label === t));
    const batch0 = ['Breaking News', ...customTopics.slice(0, 2)];
    const batch1 = selectedTopics.filter(t => !batch0.includes(t)).slice(0, 3);
    return [batch0, batch1, ['Global Trends', 'Innovation']];
  }, [selectedTopics]);

  const startNewsStream = useCallback(async (isRefresh = false) => {
    if (isStreaming) return;
    setIsStreaming(true);
    setStreamStatus('Syncing feed...');
    if (isRefresh) {
        setNewsBuckets({}); 
        if (feedRef.current) feedRef.current.scrollTop = 0;
    }

    const batches = getDynamicBatches();

    // 1. Fetch Batch 0 (Top) FIRST
    try {
        const b0 = await fetchRealTimeNews(batches[0]);
        setNewsBuckets(prev => ({ ...prev, 0: b0 }));
    } catch (e) {
        setNewsBuckets({ 0: PAPERS.slice(0, 4) });
    }

    // 2. Load others in background with stagger to respect quota
    const others = batches.slice(1);
    others.forEach(async (topics, i) => {
        await new Promise(r => setTimeout(r, (i + 1) * 2000));
        const bX = await fetchRealTimeNews(topics);
        setNewsBuckets(prev => ({ ...prev, [i+1]: bX }));
    });

    setStreamStatus('');
    setIsStreaming(false);
  }, [getDynamicBatches, isStreaming]);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    const prefsStr = localStorage.getItem('bytes_prefs');
    if (prefsStr) {
      const prefs = JSON.parse(prefsStr);
      setStoredPrefs(prefs);
    }
  }, []);

  const handleOnboardingComplete = (prefs: UserPreferences) => {
    setSelectedTopics(prefs.topics);
    setUserName(prefs.userName || '');
    localStorage.setItem('bytes_prefs', JSON.stringify(prefs));
    setShowOnboarding(false);
    setTimeout(() => startNewsStream(true), 100);
  };

  const handleLike = (id: string) => {
    setNewsBuckets(prev => {
        const next = {...prev};
        Object.keys(next).forEach(k => {
            const numK = Number(k);
            next[numK] = next[numK].map(item => item.id === id ? {...item, isLiked: !item.isLiked, likes: item.isLiked ? item.likes - 1 : item.likes + 1} : item);
        });
        return next;
    });
  };

  const handleSave = (id: string) => {
    setNewsBuckets(prev => {
        const next = {...prev};
        Object.keys(next).forEach(k => {
            const numK = Number(k);
            next[numK] = next[numK].map(item => item.id === id ? {...item, isSaved: !item.isSaved} : item);
        });
        return next;
    });
  };

  const filteredNews = useMemo(() => {
    return news.filter(byte => {
      const matchesSearch = searchTerm === '' || byte.title.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    });
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
            onLiveClick={() => startNewsStream(true)} 
            isLiveLoading={isStreaming} 
            userName={userName} 
          />
          <div ref={feedRef} className="h-[100dvh] w-full overflow-y-scroll snap-y snap-mandatory no-scrollbar">
            {filteredNews.length > 0 ? (
                filteredNews.map((byte, idx) => <NewsSlide key={`${byte.id}-${idx}`} byte={byte} onLike={handleLike} onSave={handleSave} />)
            ) : (
                <div className="h-full flex items-center justify-center p-8 text-center snap-center">
                    <div className="glass-panel p-8 rounded-[40px] shadow-xl">
                        <h3 className="text-2xl font-serif-display font-bold text-[#831843] mb-4">Syncing with sources...</h3>
                        <div className="w-16 h-1 bg-[#831843]/10 rounded-full mx-auto overflow-hidden"><div className="h-full bg-[#831843] animate-progress"></div></div>
                    </div>
                </div>
            )}
            {filteredNews.length > 0 && isStreaming && (
                <div className="h-[20vh] flex items-center justify-center snap-center pb-20 opacity-50"><span className="text-[10px] font-bold uppercase tracking-widest">Syncing more...</span></div>
            )}
          </div>
        </div>
      )}
      <CurateDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} selectedTopics={selectedTopics} onTopicToggle={(t) => setSelectedTopics(p => p.includes(t) ? p.filter(x => x !== t) : [...p, t])} onSearch={setSearchTerm} />
      <style>{`
        @keyframes progress { 0% { width: 0%; transform: translateX(-100%); } 100% { width: 100%; transform: translateX(100%); } }
        .animate-progress { animation: progress 1.5s infinite linear; }
        .animate-fade-in { animation: fade-in 0.8s ease-out forwards; }
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
    </div>
  );
};

export default App;
