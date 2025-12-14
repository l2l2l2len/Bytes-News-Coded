import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import Navbar from './components/Navbar';
import NewsSlide from './components/NewsSlide';
import CurateDrawer from './components/CurateDrawer';
import Onboarding from './components/Onboarding';
import { PAPERS } from './constants';
import { fetchRealTimeNews } from './services/geminiService';
import { Byte, UserPreferences } from './types';

const App: React.FC = () => {
  const [news, setNews] = useState<Byte[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState<boolean>(true);
  const [selectedTopics, setSelectedTopics] = useState<string[]>(['US News', 'World', 'AI & Tech', 'Business', 'Science', 'Finance', 'Culture']);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Loading States
  const [isLiveLoading, setIsLiveLoading] = useState(false);
  const [currentBatchIndex, setCurrentBatchIndex] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  
  const feedRef = useRef<HTMLDivElement>(null);

  // Define Batches: We only load one at a time to save API quota
  const BATCHES = useMemo(() => [
    ['Breaking News Global', 'World Politics'],      // Batch 0 (Initial)
    ['Technology Trends', 'Artificial Intelligence'], // Batch 1
    ['Financial Markets', 'Crypto & Web3'],          // Batch 2
    ['Science Breakthroughs', 'Health & Medicine'],  // Batch 3
    ['Entertainment', 'Internet Culture', 'Sports']   // Batch 4
  ], []);

  /**
   * Load a specific batch of news
   */
  const loadBatch = useCallback(async (batchIdx: number) => {
    if (!process.env.API_KEY) return;
    if (batchIdx >= BATCHES.length) {
      setHasMore(false);
      return;
    }

    setIsLiveLoading(true);

    try {
      const topics = BATCHES[batchIdx];
      const newBytes = await fetchRealTimeNews(topics);

      if (newBytes.length > 0) {
        setNews(prev => {
          const existingIds = new Set(prev.map(p => p.id));
          const uniqueNew = newBytes.filter(b => !existingIds.has(b.id));
          return [...prev, ...uniqueNew];
        });
      } else {
        // If a batch returns empty (or fails), allow trying next batch later
        if (batchIdx >= BATCHES.length - 1) {
             setHasMore(false);
        }
      }
    } catch (error) {
      console.error("Batch load failed", error);
    } finally {
      setIsLiveLoading(false);
    }
  }, [BATCHES]);

  // Initial Load
  useEffect(() => {
    // 1. Load preferences
    const hasSeenOnboarding = localStorage.getItem('bytes_onboarded') === 'true';
    if (hasSeenOnboarding) setShowOnboarding(false);
    
    const storedPrefs = localStorage.getItem('bytes_prefs');
    if (storedPrefs) {
      const prefs = JSON.parse(storedPrefs) as UserPreferences;
      if (prefs.topics?.length > 0) setSelectedTopics(prefs.topics);
    }
    
    // 2. Initialize with Static Data (Instant Paint)
    setNews(PAPERS.map(p => ({ ...p, isLiked: false, isSaved: false })));

    // 3. Fetch ONLY the first batch automatically
    const timer = setTimeout(() => {
      loadBatch(0);
    }, 1500); // Slight delay to ensure UI is ready

    return () => clearTimeout(timer);
  }, [loadBatch]);

  // Handlers
  const handleLoadMore = () => {
    const nextIdx = currentBatchIndex + 1;
    if (nextIdx < BATCHES.length) {
      setCurrentBatchIndex(nextIdx);
      loadBatch(nextIdx);
    } else {
      setHasMore(false);
    }
  };

  const handleRefresh = () => {
    // Reset to initial state
    setNews(PAPERS.map(p => ({ ...p, isLiked: false, isSaved: false })));
    setCurrentBatchIndex(0);
    setHasMore(true);
    loadBatch(0);
    feedRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOnboardingComplete = (prefs: UserPreferences) => {
    setShowOnboarding(false);
    setSelectedTopics(prefs.topics);
    localStorage.setItem('bytes_onboarded', 'true');
    localStorage.setItem('bytes_prefs', JSON.stringify(prefs));
    loadBatch(0);
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
      if (byte.id.startsWith('live-')) return true; // Always show live news
      const matchesTopic = selectedTopics.includes(byte.category) || selectedTopics.length === 0;
      const matchesSearch = searchTerm === '' || 
        byte.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        byte.abstract.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesTopic && matchesSearch;
    });
  }, [news, selectedTopics, searchTerm]);

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-gray-100">
      
      {showOnboarding ? (
        <Onboarding onComplete={handleOnboardingComplete} />
      ) : (
        <>
          <div 
            className={`
              relative z-10 w-full h-full transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] bg-gray-100
              ${isDrawerOpen ? 'scale-90 opacity-80 blur-[1px]' : 'scale-100 opacity-100'}
            `}
            style={{ transformOrigin: 'center bottom' }}
          >
            <Navbar 
                onProfileClick={() => setIsDrawerOpen(true)}
                onSearchClick={() => setIsDrawerOpen(true)}
                onNotifyClick={() => {}}
                onLiveClick={handleRefresh}
                isLiveLoading={isLiveLoading}
            />

            <div 
                ref={feedRef}
                className="feed-container px-4 md:px-0 max-w-2xl mx-auto pt-24 pb-12"
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

                    {/* LOAD MORE BUTTON */}
                    {hasMore ? (
                        <div className="flex justify-center py-8">
                            <button 
                                onClick={handleLoadMore}
                                disabled={isLiveLoading}
                                className="group relative overflow-hidden rounded-full bg-white px-8 py-3 shadow-md transition-all hover:scale-105 hover:shadow-lg disabled:opacity-70"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-gray-50 to-gray-100 opacity-0 transition-opacity group-hover:opacity-100" />
                                <div className="relative flex items-center gap-3">
                                    {isLiveLoading ? (
                                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-black" />
                                    ) : (
                                        <svg className="h-4 w-4 text-gray-400 transition-colors group-hover:text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 13l-7 7-7-7m14-8l-7 7-7-7" />
                                        </svg>
                                    )}
                                    <span className="text-xs font-bold uppercase tracking-widest text-gray-900">
                                        {isLiveLoading ? 'Curating...' : 'Load More News'}
                                    </span>
                                </div>
                            </button>
                        </div>
                    ) : (
                        <div className="flex justify-center py-12 opacity-50">
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
                                You're all caught up
                            </span>
                        </div>
                    )}
                  </>
                ) : (
                    <div className="h-full w-full flex flex-col items-center justify-center text-center p-8">
                        <h3 className="text-3xl font-serif-display font-bold text-black mb-2">No stories found.</h3>
                        <button 
                          onClick={() => setIsDrawerOpen(true)}
                          className="mt-8 px-8 py-4 rounded-full bg-black text-white font-bold text-xs uppercase tracking-widest shadow-lg"
                        >
                          Adjust Filters
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