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
  
  // Streaming State
  const [streamStatus, setStreamStatus] = useState<string>(''); 
  const [isStreaming, setIsStreaming] = useState(false);
  
  const feedRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);

  // Define Batches for the "Massive Fetch" pipeline
  // Broken down to prevent API overload, but run automatically
  const BATCHES = useMemo(() => [
    ['Breaking News Global', 'World Politics'],
    ['Technology Trends', 'Artificial Intelligence'],
    ['Financial Markets', 'Crypto & Web3'],
    ['Science Breakthroughs', 'Health & Medicine'],
    ['Entertainment', 'Internet Culture', 'Sports']
  ], []);

  /**
   * Massive Sequential Fetch
   * Loads all batches one by one with a delay to respect API quotas (The "Correct Way")
   */
  const startNewsStream = useCallback(async () => {
    if (!process.env.API_KEY || isStreaming) return;
    
    setIsStreaming(true);
    setStreamStatus('Initializing global feed...');

    // 1. Reset or Prep
    // Note: We don't clear PAPERS (static data) immediately so the user has something to read.

    for (let i = 0; i < BATCHES.length; i++) {
        const batchTopics = BATCHES[i];
        setStreamStatus(`Syncing: ${batchTopics.join(' & ')}...`);
        
        try {
            // Fetch
            const newBytes = await fetchRealTimeNews(batchTopics);
            
            // Append immediately
            setNews(prev => {
                const existingIds = new Set(prev.map(p => p.id));
                const uniqueNew = newBytes.filter(b => !existingIds.has(b.id));
                return [...prev, ...uniqueNew];
            });

            // Delay for Rate Limiting (Throttle)
            // 2000ms delay + execution time usually keeps us under 15 RPM
            if (i < BATCHES.length - 1) {
                await new Promise(resolve => setTimeout(resolve, 2000));
            }

        } catch (error) {
            console.error(`Batch ${i} failed`, error);
            // Continue to next batch even if one fails
        }
    }

    setStreamStatus('');
    setIsStreaming(false);
  }, [BATCHES]);

  // Initial Load Effect
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

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

    // 3. Start the Stream automatically if onboarded
    if (hasSeenOnboarding) {
        setTimeout(startNewsStream, 1000);
    }
  }, [startNewsStream]);

  // Handlers
  const handleRefresh = () => {
    // Clear and restart
    setNews(PAPERS.map(p => ({ ...p, isLiked: false, isSaved: false })));
    feedRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    startNewsStream();
  };

  const handleOnboardingComplete = (prefs: UserPreferences) => {
    setShowOnboarding(false);
    setSelectedTopics(prefs.topics);
    localStorage.setItem('bytes_onboarded', 'true');
    localStorage.setItem('bytes_prefs', JSON.stringify(prefs));
    // Start stream after onboarding
    startNewsStream();
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
      if (byte.id.startsWith('live-') || byte.id.startsWith('fallback-')) return true; 
      const matchesTopic = selectedTopics.includes(byte.category) || selectedTopics.length === 0;
      const matchesSearch = searchTerm === '' || 
        byte.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        byte.abstract.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesTopic && matchesSearch;
    });
  }, [news, selectedTopics, searchTerm]);

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-black">
      
      {showOnboarding ? (
        <Onboarding onComplete={handleOnboardingComplete} />
      ) : (
        <>
          <div 
            className={`
              relative z-10 w-full h-full transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] bg-black
              ${isDrawerOpen ? 'scale-90 opacity-80 blur-[1px]' : 'scale-100 opacity-100'}
            `}
            style={{ transformOrigin: 'center bottom' }}
          >
            <Navbar 
                onProfileClick={() => setIsDrawerOpen(true)}
                onSearchClick={() => setIsDrawerOpen(true)}
                onNotifyClick={() => {}}
                onLiveClick={handleRefresh}
                isLiveLoading={isStreaming}
            />

            {/* SNAP SCROLL CONTAINER - FULL SCREEN, NO PADDING */}
            <div 
                ref={feedRef}
                className="h-screen w-full overflow-y-scroll snap-y snap-mandatory scroll-smooth no-scrollbar"
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
                    <div className="h-full w-full flex flex-col items-center justify-center text-center p-8 snap-center bg-gray-900">
                        <h3 className="text-3xl font-serif-display font-bold text-white mb-2">No stories found.</h3>
                        <button 
                          onClick={() => setIsDrawerOpen(true)}
                          className="mt-8 px-8 py-4 rounded-full bg-white text-black font-bold text-xs uppercase tracking-widest shadow-lg hover:scale-105 transition-transform"
                        >
                          Adjust Filters
                        </button>
                    </div>
                )}

                {/* Live Stream Status Indicator - Snaps as the last item */}
                <div className="h-[30vh] w-full flex flex-col items-center justify-center gap-3 transition-opacity duration-500 snap-center bg-black text-white">
                    {isStreaming ? (
                        <>
                             <div className="flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></span>
                                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">{streamStatus}</span>
                            </div>
                            {/* Animated bar */}
                            <div className="w-32 h-0.5 bg-gray-800 rounded-full overflow-hidden">
                                <div className="h-full bg-red-600 animate-progress-indeterminate"></div>
                            </div>
                        </>
                    ) : (
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">
                             Feed Up to Date
                        </span>
                    )}
                </div>

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