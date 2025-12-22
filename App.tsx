
import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import Navbar from './components/Navbar';
import NewsSlide from './components/NewsSlide';
import CurateDrawer from './components/CurateDrawer';
import Onboarding from './components/Onboarding';
import InteractiveBackground from './components/InteractiveBackground';
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

  // Optimized Speed Strategy: 5 focused micro-batches running in parallel.
  // Smaller batches generate faster than large ones, populating the feed progressively.
  const BATCHES = useMemo(() => [
    ['Breaking News', 'Top Headlines'],
    ['US Politics', 'Global Economy'],
    ['Technology', 'Artificial Intelligence', 'Startups'],
    ['Science', 'Health', 'Environment'],
    ['Sports', 'Entertainment', 'Culture']
  ], []);

  const startNewsStream = useCallback(async () => {
    if (!process.env.API_KEY || isStreaming) return;
    
    setIsStreaming(true);
    setStreamStatus('Initializing velocity wire...');

    // Fire all 5 batches simultaneously
    const fetchPromises = BATCHES.map(async (batchTopics, index) => {
        try {
            // Slight stagger (100ms) to prevent instant rate-limit clashes while keeping it fast
            await new Promise(r => setTimeout(r, index * 100)); 
            
            const newBytes = await fetchRealTimeNews(batchTopics);
            
            setNews(prev => {
                const existingIds = new Set(prev.map(p => p.id));
                const uniqueNew = newBytes.filter(b => !existingIds.has(b.id));
                // Append immediately so user sees news as soon as ANY batch finishes
                return [...prev, ...uniqueNew];
            });
        } catch (error) {
            console.error(`Batch ${index} failed`, error);
        }
    });

    await Promise.all(fetchPromises);

    setStreamStatus('');
    setIsStreaming(false);
  }, [BATCHES, isStreaming]);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    // Force Onboarding to show by not checking localStorage
    
    const storedPrefs = localStorage.getItem('bytes_prefs');
    if (storedPrefs) {
      const prefs = JSON.parse(storedPrefs) as UserPreferences;
      if (prefs.topics?.length > 0) setSelectedTopics(prefs.topics);
    }
    
    setNews(PAPERS.map(p => ({ ...p, isLiked: false, isSaved: false })));

    // Removed auto-start of stream here, it triggers after onboarding completes
  }, [startNewsStream]);

  const handleRefresh = () => {
    // Clear feed to show speed of new engine
    setNews([]); 
    setStreamStatus('Rewiring feed...');
    feedRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    startNewsStream();
  };

  const handleOnboardingComplete = (prefs: UserPreferences) => {
    setShowOnboarding(false);
    setSelectedTopics(prefs.topics);
    localStorage.setItem('bytes_onboarded', 'true');
    localStorage.setItem('bytes_prefs', JSON.stringify(prefs));
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
    <div className="relative h-[100dvh] w-full overflow-hidden text-[#4a044e]">
      
      {/* BACKGROUND LAYER */}
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
            />

            {/* FEED CONTAINER */}
            <div 
                ref={feedRef}
                className="h-[100dvh] w-full overflow-y-scroll snap-y snap-mandatory scroll-smooth no-scrollbar"
            >
                {/* Initial Empty State / Skeleton could go here if needed, but we rely on speed now */}
                
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
                ) : !isStreaming ? (
                    <div className="h-[100dvh] w-full flex flex-col items-center justify-center text-center p-8 snap-center">
                        <div className="glass-panel p-8 rounded-[32px] max-w-sm w-full mx-auto shadow-xl">
                            <h3 className="text-3xl font-serif-display font-bold text-[#831843] mb-3">Quiet today.</h3>
                            <p className="text-[#831843]/60 text-sm mb-8">Try adjusting your interests.</p>
                            <button 
                              onClick={() => setIsDrawerOpen(true)}
                              className="px-8 py-4 rounded-full bg-[#831843] text-white font-bold text-xs uppercase tracking-widest shadow-lg hover:scale-105 transition-transform"
                            >
                              Curate Feed
                            </button>
                        </div>
                    </div>
                ) : null}

                {/* Status Indicator */}
                <div className="h-[20dvh] w-full flex flex-col items-center justify-center gap-3 snap-center text-[#831843]/50 pb-20">
                    {isStreaming ? (
                        <>
                             <div className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-[#be185d] rounded-full animate-pulse"></span>
                                <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Live Wire: {news.length}/40</span>
                            </div>
                            <div className="w-24 h-1 bg-[#831843]/10 rounded-full overflow-hidden">
                                <div className="h-full bg-[#be185d] animate-progress-indeterminate"></div>
                            </div>
                        </>
                    ) : (
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em]">
                             End of Wire
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
