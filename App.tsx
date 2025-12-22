
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
  // Ordered Buckets State: Ensures Batch 0 is always first
  const [newsBuckets, setNewsBuckets] = useState<Record<number, Byte[]>>({});
  const nextBatchIndex = useRef(0);
  
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState<boolean>(true);
  const [selectedTopics, setSelectedTopics] = useState<string[]>(['US News', 'World', 'AI & Tech', 'Business', 'Science', 'Finance', 'Culture']);
  const [searchTerm, setSearchTerm] = useState('');
  const [userName, setUserName] = useState('');
  
  const [streamStatus, setStreamStatus] = useState<string>(''); 
  const [isStreaming, setIsStreaming] = useState(false);
  
  const feedRef = useRef<HTMLDivElement>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);

  // Flatten buckets for rendering - Ensures strictly ordered feed
  const news = useMemo(() => {
    return Object.keys(newsBuckets)
      .map(Number)
      .sort((a, b) => a - b) 
      .flatMap(key => newsBuckets[key]);
  }, [newsBuckets]);

  // Dynamic Batch Generation: Prioritize Custom Topics
  const getDynamicBatches = useCallback(() => {
    const standardLabels = (DEFAULT_CATEGORIES || []).map(c => c.label);
    const customTopics = selectedTopics.filter(t => !standardLabels.includes(t));
    const standardTopics = selectedTopics.filter(t => standardLabels.includes(t));
    
    // Batch 0: Breaking + Custom User Topics (High Priority)
    const batch0 = ['Breaking News', ...customTopics];
    
    const chunks: string[][] = [batch0];
    
    if (standardTopics.length <= 4) {
        if(standardTopics.length > 0) chunks.push(standardTopics);
        chunks.push(['Global Markets', 'Technology']);
        chunks.push(['Culture', 'Science']);
    } else {
        const chunkSize = Math.ceil(standardTopics.length / 3);
        for (let i = 0; i < standardTopics.length; i += chunkSize) {
            chunks.push(standardTopics.slice(i, i + chunkSize));
        }
    }

    while (chunks.length < 5) {
        chunks.push(['Trending', 'Innovation']);
    }
    
    return chunks.slice(0, 5); 
  }, [selectedTopics]);

  const startNewsStream = useCallback(async (isRefresh = false) => {
    if (isStreaming) return;
    
    setIsStreaming(true);
    setStreamStatus(userName ? `Curating for ${userName}...` : 'Initializing...');
    
    // Reset buckets if full refresh
    if (isRefresh) {
        setNewsBuckets({}); 
        nextBatchIndex.current = 5;
        feedRef.current?.scrollTo({ top: 0, behavior: 'instant' });
    }

    const batches = getDynamicBatches();

    // STEP 1: Fetch BATCH 0 (High Priority) FIRST
    // This ensures we have data at the top immediately.
    try {
        const batch0News = await fetchRealTimeNews(batches[0]);
        // Note: fetchRealTimeNews now returns fallback data if API fails, so batch0News is never empty.
        setNewsBuckets(prev => ({ ...prev, 0: batch0News }));
        
        // Only scroll to top if refresh
        if (isRefresh && feedRef.current) {
            feedRef.current.scrollTop = 0;
        }
    } catch (e) {
        console.error("Critical batch failed, using default", e);
        setNewsBuckets({ 0: PAPERS });
    }

    // STEP 2: Background Fetch for remaining batches
    setStreamStatus('Expanding coverage...');
    const remainingBatches = batches.slice(1);
    
    const fetchPromises = remainingBatches.map(async (batchTopics, i) => {
        try {
            const actualIndex = i + 1;
            await new Promise(r => setTimeout(r, i * 200)); 
            const newBytes = await fetchRealTimeNews(batchTopics);
            
            setNewsBuckets(prev => ({
                ...prev,
                [actualIndex]: newBytes
            }));
        } catch (error) {
            // Silently fail secondary batches or use fallback
            console.error(`Batch ${i+1} failed`, error);
        }
    });

    await Promise.all(fetchPromises);
    setStreamStatus('');
    setIsStreaming(false);
  }, [getDynamicBatches, isStreaming, userName]);

  // Handle topic changes from Drawer
  const toggleTopic = (topic: string) => {
    setSelectedTopics(prev => {
        const newTopics = prev.includes(topic) ? prev.filter(t => t !== topic) : [...prev, topic];
        
        const prefs = JSON.parse(localStorage.getItem('bytes_prefs') || '{}');
        localStorage.setItem('bytes_prefs', JSON.stringify({...prefs, topics: newTopics}));

        // Trigger refresh if the feed was empty or "quiet"
        if (news.length <= 1) {
             // We need to wait for state update in next render, but for now we can force a logic check
             // Actually, useEffect will handle this if we add a dependency, but that causes loops.
             // We'll rely on the user clicking "Curate Feed" button initially, 
             // but if they are in the drawer and add a topic, let's force a refresh.
        }
        return newTopics;
    });
  };

  // Effect: Watch for topic changes. If feed is empty and topics added, auto-refresh.
  useEffect(() => {
    if (news.length === 0 && selectedTopics.length > 0 && initialized.current && !isStreaming) {
        startNewsStream(true);
    }
  }, [selectedTopics, news.length]); // Intentionally not including isStreaming/startNewsStream to avoid loops

  const handleLoadMore = useCallback(async () => {
      if (isStreaming) return;
      setIsStreaming(true);
      
      const idx1 = nextBatchIndex.current++;
      const allBatches = getDynamicBatches();
      const randomBatch1 = allBatches[Math.floor(Math.random() * allBatches.length)];

      try {
          const res1 = await fetchRealTimeNews(randomBatch1);
          setNewsBuckets(prev => ({ ...prev, [idx1]: res1 }));
      } catch (err) {
          console.error("Load more failed", err);
      } finally {
          setIsStreaming(false);
      }
  }, [isStreaming, getDynamicBatches]);

  useEffect(() => {
      const observer = new IntersectionObserver(
          (entries) => {
              if (entries[0].isIntersecting && !isStreaming && news.length > 3) {
                  handleLoadMore();
              }
          },
          { threshold: 0.1, rootMargin: '200px' } 
      );
      if (loadMoreRef.current) observer.observe(loadMoreRef.current);
      return () => observer.disconnect();
  }, [news.length, isStreaming, handleLoadMore]);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const storedPrefs = localStorage.getItem('bytes_prefs');
    if (storedPrefs) {
      const prefs = JSON.parse(storedPrefs) as UserPreferences;
      if (prefs.topics?.length > 0) setSelectedTopics(prefs.topics);
      if (prefs.userName) setUserName(prefs.userName);
      setShowOnboarding(false); 
      // Force start stream immediately
      setTimeout(() => startNewsStream(true), 100);
    } else {
        setShowOnboarding(true);
    }
  }, []); // Run once on mount

  const handleRefresh = () => {
    startNewsStream(true);
  };

  const handleOnboardingComplete = (prefs: UserPreferences) => {
    setShowOnboarding(false);
    setSelectedTopics(prefs.topics);
    if (prefs.userName) setUserName(prefs.userName);
    localStorage.setItem('bytes_onboarded', 'true');
    localStorage.setItem('bytes_prefs', JSON.stringify(prefs));
    setTimeout(() => startNewsStream(true), 300);
  };

  const updateBucketItem = (id: string, modifier: (item: Byte) => Byte) => {
    setNewsBuckets(prev => {
        const next = { ...prev };
        let found = false;
        for (const key of Object.keys(next)) {
            const numKey = Number(key);
            const originalList = next[numKey];
            const idx = originalList.findIndex(item => item.id === id);
            if (idx !== -1) {
                const newList = [...originalList];
                newList[idx] = modifier(newList[idx]);
                next[numKey] = newList;
                found = true;
                break;
            }
        }
        return found ? next : prev;
    });
  };

  const handleLike = (id: string) => updateBucketItem(id, item => ({ 
      ...item, isLiked: !item.isLiked, likes: item.isLiked ? item.likes - 1 : item.likes + 1 
  }));

  const handleSave = (id: string) => updateBucketItem(id, item => ({ ...item, isSaved: !item.isSaved }));

  const filteredNews = useMemo(() => {
    return news.filter(byte => {
      if (byte.id.startsWith('live-') || byte.id.startsWith('fallback-') || byte.id.startsWith('byte-')) return true; 
      const matchesTopic = selectedTopics.includes(byte.category) || selectedTopics.length === 0;
      const matchesSearch = searchTerm === '' || 
        byte.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        byte.abstract.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesTopic && matchesSearch;
    });
  }, [news, selectedTopics, searchTerm]);

  return (
    <div className="relative h-[100dvh] w-full overflow-hidden text-[#4a044e] bg-[#fff1f2]">
      <InteractiveBackground />
      
      {showOnboarding ? (
        <Onboarding onComplete={handleOnboardingComplete} />
      ) : (
        <>
          <div className="relative z-10 w-full h-full">
            <Navbar 
                onProfileClick={() => setIsDrawerOpen(true)}
                onSearchClick={() => setIsDrawerOpen(true)}
                onNotifyClick={() => {}}
                onLiveClick={handleRefresh}
                isLiveLoading={isStreaming}
                userName={userName}
            />

            <div 
                ref={feedRef}
                className="h-[100dvh] w-full overflow-y-scroll snap-y snap-mandatory no-scrollbar overscroll-none"
                style={{ scrollBehavior: 'auto' }} 
            >
                {filteredNews.length > 0 ? (
                  <>
                    {filteredNews.map((byte, index) => (
                        <NewsSlide 
                          key={`${byte.id}-${index}`} 
                          byte={byte} 
                          onLike={handleLike} 
                          onSave={handleSave} 
                        />
                    ))}
                  </>
                ) : (
                    <div className="h-[100dvh] w-full flex flex-col items-center justify-center text-center p-8 snap-center">
                         {isStreaming ? (
                            <div className="flex flex-col items-center">
                                <div className="w-16 h-16 rounded-full border-4 border-[#831843]/10 border-t-[#831843] animate-spin mb-4"></div>
                                <h3 className="text-xl font-serif-display font-bold text-[#831843] animate-pulse">
                                    {streamStatus || "Syncing your feed..."}
                                </h3>
                            </div>
                         ) : (
                            <div className="glass-panel p-8 rounded-[32px] max-w-sm w-full mx-auto shadow-xl">
                                <h3 className="text-3xl font-serif-display font-bold text-[#831843] mb-3">Feed Offline.</h3>
                                <p className="text-[#831843]/60 text-sm mb-8">Reconnect to global wire.</p>
                                <button 
                                  onClick={handleRefresh}
                                  className="px-8 py-4 rounded-full bg-[#831843] text-white font-bold text-xs uppercase tracking-widest shadow-lg hover:scale-105 transition-transform"
                                >
                                  Retry Connection
                                </button>
                            </div>
                         )}
                    </div>
                )}

                {filteredNews.length > 0 && (
                    <div ref={loadMoreRef} className="h-[20dvh] w-full flex flex-col items-center justify-center gap-3 snap-center text-[#831843]/50 pb-20">
                        {isStreaming && (
                            <>
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 bg-[#be185d] rounded-full animate-pulse"></span>
                                    <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Syncing...</span>
                                </div>
                                <div className="w-24 h-1 bg-[#831843]/10 rounded-full overflow-hidden">
                                    <div className="h-full bg-[#be185d] animate-progress-indeterminate"></div>
                                </div>
                            </>
                        )}
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
      
      <style>{`
        @keyframes progress-indeterminate {
            0% { width: 0%; margin-left: 0%; }
            50% { width: 50%; margin-left: 25%; }
            100% { width: 0%; margin-left: 100%; }
        }
        .animate-progress-indeterminate {
            animation: progress-indeterminate 1.5s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default App;
