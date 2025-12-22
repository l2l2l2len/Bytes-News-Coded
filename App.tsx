
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
  const [userName, setUserName] = useState('');
  
  // Streaming State
  const [streamStatus, setStreamStatus] = useState<string>(''); 
  const [isStreaming, setIsStreaming] = useState(false);
  
  const feedRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);

  // Dynamic Batch Generation based on User Topics
  const getDynamicBatches = useCallback(() => {
    // If user has minimal topics, use defaults + user topics
    if (selectedTopics.length <= 3) {
      return [
        [...selectedTopics, 'Breaking News'],
        ['Global Economy', 'World Politics'],
        ['Technology', 'Science'],
        ['Culture', 'Entertainment'],
        ['Sports', 'Health']
      ];
    }

    // Split user selected topics into chunks for parallel processing
    const chunks: string[][] = [];
    const chunkSize = Math.ceil(selectedTopics.length / 5);
    for (let i = 0; i < selectedTopics.length; i += chunkSize) {
        chunks.push(selectedTopics.slice(i, i + chunkSize));
    }
    
    // Ensure we have at least 5 batches for speed consistency
    while (chunks.length < 5) {
        chunks.push(['Breaking News', 'Trending']);
    }
    
    return chunks.slice(0, 5); // Limit to 5 parallel max
  }, [selectedTopics]);

  const startNewsStream = useCallback(async () => {
    if (!process.env.API_KEY || isStreaming) return;
    
    setIsStreaming(true);
    setStreamStatus(userName ? `Curating for ${userName}...` : 'Initializing velocity wire...');

    const batches = getDynamicBatches();

    // Fire all 5 batches simultaneously
    const fetchPromises = batches.map(async (batchTopics, index) => {
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
  }, [getDynamicBatches, isStreaming, userName]);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const storedPrefs = localStorage.getItem('bytes_prefs');
    if (storedPrefs) {
      const prefs = JSON.parse(storedPrefs) as UserPreferences;
      if (prefs.topics?.length > 0) setSelectedTopics(prefs.topics);
      if (prefs.userName) setUserName(prefs.userName);
      setShowOnboarding(false); // Skip onboarding if prefs exist
      setTimeout(() => startNewsStream(), 500); // Start stream slightly after mount
    } else {
        setShowOnboarding(true);
    }
    
    setNews(PAPERS.map(p => ({ ...p, isLiked: false, isSaved: false })));
  }, []); // Remove dependency on startNewsStream to avoid loops

  const handleRefresh = () => {
    setNews([]); 
    setStreamStatus(userName ? `Rewiring for ${userName}...` : 'Rewiring feed...');
    feedRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    startNewsStream();
  };

  const handleOnboardingComplete = (prefs: UserPreferences) => {
    setShowOnboarding(false);
    setSelectedTopics(prefs.topics);
    if (prefs.userName) setUserName(prefs.userName);
    
    localStorage.setItem('bytes_onboarded', 'true');
    localStorage.setItem('bytes_prefs', JSON.stringify(prefs));
    
    // Small delay to allow UI to transition before heavy network requests
    setTimeout(() => startNewsStream(), 300);
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
    setSelectedTopics(prev => {
        const newTopics = prev.includes(topic) ? prev.filter(t => t !== topic) : [...prev, topic];
        // Update local storage silently so prefs persist
        const prefs = JSON.parse(localStorage.getItem('bytes_prefs') || '{}');
        localStorage.setItem('bytes_prefs', JSON.stringify({...prefs, topics: newTopics}));
        return newTopics;
    });
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
                userName={userName}
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
                                <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Live Wire: {news.length} Loaded</span>
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
