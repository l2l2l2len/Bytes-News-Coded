
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
  
  // Track unique IDs to prevent duplicates
  const loadedIds = useRef<Set<string>>(new Set());
  const topicCycleIndex = useRef(0);
  const nextBatchIndex = useRef(1);
  const feedRef = useRef<HTMLDivElement>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);

  const news = useMemo(() => {
    return Object.keys(newsBuckets)
      .map(Number)
      .sort((a, b) => a - b) 
      .flatMap(key => newsBuckets[key]);
  }, [newsBuckets]);

  // Filters out duplicates based on title/id and keeps global registry updated
  const deduplicate = useCallback((items: Byte[]) => {
    return items.filter(item => {
      // Create a simplified key to catch "same news different source" or API repeats
      const key = item.title.toLowerCase().trim().substring(0, 40);
      if (loadedIds.current.has(key)) return false;
      loadedIds.current.add(key);
      return true;
    });
  }, []);

  const getDynamicBatches = useCallback(() => {
    if (selectedTopics.length === 0) return [['Breaking News'], ['Global Trends']];
    
    // Group selected topics into logical pairs for the initial load
    const chunks: string[][] = [];
    for (let i = 0; i < selectedTopics.length; i += 2) {
      chunks.push(selectedTopics.slice(i, i + 2));
    }
    return chunks.length > 0 ? chunks : [['Breaking News']];
  }, [selectedTopics]);

  const startNewsStream = useCallback(async (isRefresh = false) => {
    if (isStreaming) return;
    setIsStreaming(true);
    setStreamStatus('Syncing feed...');
    
    if (isRefresh) {
        setNewsBuckets({}); 
        loadedIds.current.clear();
        nextBatchIndex.current = 1;
        topicCycleIndex.current = 0;
        if (feedRef.current) feedRef.current.scrollTop = 0;
    }

    const batches = getDynamicBatches();

    // 1. Fetch First Batch (Top Priority)
    try {
        const rawB0 = await fetchRealTimeNews(batches[0]);
        const b0 = deduplicate(rawB0);
        
        // If API returns nothing unique, inject static papers once
        const finalB0 = b0.length > 0 ? b0 : deduplicate(PAPERS.slice(0, 4));
        setNewsBuckets(prev => ({ ...prev, 0: finalB0 }));
    } catch (e) {
        setNewsBuckets({ 0: deduplicate(PAPERS.slice(0, 4)) });
    }

    // 2. Load one more batch in background to fill the screen
    if (batches.length > 1) {
        setTimeout(async () => {
            try {
                const rawB1 = await fetchRealTimeNews(batches[1]);
                const b1 = deduplicate(rawB1);
                if (b1.length > 0) {
                    setNewsBuckets(prev => ({ ...prev, 1: b1 }));
                    nextBatchIndex.current = 2;
                }
            } catch (err) {}
        }, 1500);
    }

    setStreamStatus('');
    setIsStreaming(false);
  }, [getDynamicBatches, isStreaming, deduplicate]);

  // Infinite Scroll Handler: Cycles through user interests for uniqueness
  const handleLoadMore = useCallback(async () => {
    if (isStreaming || selectedTopics.length === 0) return;
    setIsStreaming(true);

    // Pick the next topic in the user's interest list to ensure variety
    const topicToFetch = selectedTopics[topicCycleIndex.current % selectedTopics.length];
    topicCycleIndex.current++;
    
    const batchIdx = nextBatchIndex.current++;

    try {
      const rawNewNews = await fetchRealTimeNews([topicToFetch]);
      const uniqueNews = deduplicate(rawNewNews);
      
      if (uniqueNews.length > 0) {
        setNewsBuckets(prev => ({ ...prev, [batchIdx]: uniqueNews }));
      } else {
        // If API yielded no unique news for this topic, try one more time with a generic one
        const rawGlobal = await fetchRealTimeNews(['Global Innovation']);
        const uniqueGlobal = deduplicate(rawGlobal);
        if (uniqueGlobal.length > 0) {
          setNewsBuckets(prev => ({ ...prev, [batchIdx]: uniqueGlobal }));
        }
      }
    } catch (err) {
      console.error("Load more failed", err);
    } finally {
      setIsStreaming(false);
    }
  }, [isStreaming, selectedTopics, deduplicate]);

  // Intersection Observer for Infinite Scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isStreaming && news.length > 0) {
          handleLoadMore();
        }
      },
      { threshold: 0.1, rootMargin: '400px' }
    );
    if (loadMoreRef.current) observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [news.length, isStreaming, handleLoadMore]);

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
    if (!searchTerm) return news;
    return news.filter(byte => byte.title.toLowerCase().includes(searchTerm.toLowerCase()));
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
            
            {/* Load More Trigger */}
            <div ref={loadMoreRef} className="h-20 w-full flex items-center justify-center snap-center pb-20">
                {isStreaming && (
                    <div className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 bg-[#831843] rounded-full animate-bounce delay-0"></div>
                        <div className="w-1.5 h-1.5 bg-[#831843] rounded-full animate-bounce delay-150"></div>
                        <div className="w-1.5 h-1.5 bg-[#831843] rounded-full animate-bounce delay-300"></div>
                    </div>
                )}
            </div>
          </div>
        </div>
      )}
      <CurateDrawer 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
        selectedTopics={selectedTopics} 
        onTopicToggle={(t) => {
            setSelectedTopics(p => {
                const updated = p.includes(t) ? p.filter(x => x !== t) : [...p, t];
                // Refresh feed if topics changed significantly
                setTimeout(() => startNewsStream(true), 200);
                return updated;
            });
        }} 
        onSearch={setSearchTerm} 
      />
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
