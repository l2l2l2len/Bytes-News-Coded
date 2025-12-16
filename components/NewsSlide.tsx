import React, { useState, useRef, useEffect } from 'react';
import { Byte } from '../types';

interface NewsSlideProps {
  byte: Byte;
  onLike: (id: string) => void;
  onSave: (id: string) => void;
}

const NewsSlide: React.FC<NewsSlideProps> = ({ byte, onLike, onSave }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [inView, setInView] = useState(false);
  const slideRef = useRef<HTMLDivElement>(null);

  // Scroll Trigger Logic
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
      },
      { threshold: 0.4 }
    );

    if (slideRef.current) observer.observe(slideRef.current);
    return () => observer.disconnect();
  }, []);

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      try {
        await navigator.share({
          title: byte.title,
          text: byte.abstract,
          url: byte.sourceUrl || window.location.href,
        });
      } catch (err) { console.log('Error sharing:', err); }
    } else {
      navigator.clipboard.writeText(byte.sourceUrl || window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const handleFullStory = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (byte.sourceUrl) {
      window.open(byte.sourceUrl, '_blank');
    } else {
      alert("Source URL not available for this story.");
    }
  };

  return (
    // WRAPPER: Full screen snap item with dynamic height for mobile
    <div 
        ref={slideRef}
        className="snap-start relative h-[100dvh] w-full bg-black overflow-hidden flex flex-col justify-end perspective-1000"
    >
      
      {/* 1. BACKGROUND IMAGE (Full Screen) */}
      <div className="absolute inset-0 z-0 overflow-hidden">
         <img 
            src={byte.fileUrl} 
            alt={byte.title} 
            className={`
                w-full h-full object-cover transition-transform duration-[8s] ease-out
                ${inView ? 'scale-110 opacity-100' : 'scale-100 opacity-90'}
            `}
            loading="lazy"
         />
         {/* Gradients for readability */}
         <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80"></div>
         <div className="absolute bottom-0 left-0 right-0 h-3/5 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
      </div>

      {/* 2. FLOATING CONTENT LAYER */}
      {/* PADDING ADJUSTMENT: pb-24 ensures content sits above mobile home indicator/safe area */}
      <div className="relative z-10 w-full px-4 pb-24 flex items-end justify-between gap-2">
         
         {/* LEFT: Text Content Card */}
         <div className={`flex-1 min-w-0 transition-all duration-700 delay-100 ease-out transform ${inView ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
             
             {/* Volv Bits Pill */}
             <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/20 backdrop-blur-md rounded-full mb-3 border border-white/10 shadow-sm">
                <div className="w-4 h-4 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-[8px] text-white font-bold">V</div>
                <span className="text-[10px] font-bold text-white uppercase tracking-widest">Volv Bits</span>
             </div>

             {/* White Card Container */}
             <div 
                className="bg-white rounded-[24px] p-5 shadow-2xl origin-bottom-left w-full max-w-sm"
                onClick={() => setIsExpanded(!isExpanded)}
             >
                 <div className="flex flex-col gap-2">
                     {/* Headline */}
                     <h2 className="font-serif-display text-lg md:text-xl font-bold text-[#1C1C1E] leading-tight line-clamp-3">
                        {byte.title}
                     </h2>

                     {/* Abstract */}
                     <div className={`transition-all duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] overflow-hidden ${isExpanded ? 'max-h-60' : 'max-h-[3.5rem]'}`}>
                        <p className="font-sans text-xs md:text-sm leading-relaxed text-[#505055]">
                            {byte.abstract}
                        </p>
                     </div>
                     
                     {/* Footer in Card */}
                     <div className="flex items-center justify-between pt-2 mt-1 border-t border-gray-100/50">
                        <div className="flex items-center gap-2 truncate">
                            {byte.sourceUrl && (
                                <img src={`https://www.google.com/s2/favicons?domain=${new URL(byte.sourceUrl).hostname}&sz=32`} className="w-3 h-3 rounded-full grayscale opacity-60" alt="" />
                            )}
                             <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wide truncate max-w-[100px]">{byte.publisher}</span>
                        </div>
                        {isExpanded && (
                             <button 
                                onClick={handleFullStory}
                                className="px-3 py-1.5 bg-black text-white rounded-full text-[9px] font-bold uppercase tracking-widest hover:bg-gray-800 shrink-0"
                             >
                                Read
                             </button>
                        )}
                     </div>
                 </div>
             </div>

         </div>

         {/* RIGHT: Floating Actions (Vertical Stack) - Fixed Width to prevent overlapping */}
         <div className="flex flex-col items-center gap-5 mb-2 shrink-0 w-12">
             
             {/* Avatar / Profile */}
             <div className={`relative group transition-all duration-500 delay-[200ms] ${inView ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'}`}>
                 <div className="w-9 h-9 rounded-full border-2 border-white p-0.5 overflow-hidden">
                     <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100" className="w-full h-full rounded-full object-cover" alt="Avatar" />
                 </div>
                 <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-red-500 rounded-full w-3 h-3 flex items-center justify-center border border-white">
                    <svg className="w-1.5 h-1.5 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>
                 </div>
             </div>

             {/* Like */}
             <div className={`flex flex-col items-center gap-0.5 transition-all duration-500 delay-[300ms] ${inView ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'}`}>
                 <button 
                    onClick={() => onLike(byte.id)}
                    className="p-1.5 transition-transform active:scale-75"
                 >
                     <svg 
                        className={`w-7 h-7 drop-shadow-md transition-all duration-300 ${byte.isLiked ? 'fill-red-500 text-red-500 scale-110' : 'fill-white/10 text-white hover:scale-110'}`} 
                        viewBox="0 0 24 24" 
                        stroke="currentColor" 
                        strokeWidth={byte.isLiked ? 0 : 2}
                     >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                     </svg>
                 </button>
                 <span className="text-white text-[10px] font-bold drop-shadow-md">{byte.likes}</span>
             </div>

             {/* Comment */}
             <div className={`flex flex-col items-center gap-0.5 transition-all duration-500 delay-[400ms] ${inView ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'}`}>
                 <button className="p-1.5 transition-transform active:scale-75 hover:scale-110">
                     <svg className="w-6 h-6 text-white drop-shadow-md" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" clipRule="evenodd" d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 13.5997 2.37562 15.1116 3.04346 16.4525C3.22094 16.8088 3.28001 17.2161 3.17712 17.6006L2.58151 19.8267C2.32295 20.793 3.20701 21.677 4.17335 21.4185L6.39939 20.8229C6.78393 20.72 7.19121 20.7791 7.54753 20.9565C8.88837 21.6244 10.4003 22 12 22ZM8 11C8 11.5523 8.44772 12 9 12H15C15.5523 12 16 11.5523 16 11C16 10.4477 15.5523 10 15 10H9C8.44772 10 8 10.4477 8 11ZM8 15C8 15.5523 8.44772 16 9 16H12C12.5523 16 13 15.5523 13 15C13 14.4477 12.5523 14 12 14H9C8.44772 14 8 14.4477 8 15Z" opacity="0.9" /></svg>
                 </button>
                 <span className="text-white text-[10px] font-bold drop-shadow-md">{byte.comments}</span>
             </div>

             {/* Save */}
             <div className={`flex flex-col items-center gap-0.5 transition-all duration-500 delay-[500ms] ${inView ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'}`}>
                 <button 
                    onClick={() => onSave(byte.id)} 
                    className="p-1.5 transition-transform active:scale-75"
                 >
                    <svg 
                        className={`w-6 h-6 drop-shadow-md transition-all duration-300 ${byte.isSaved ? 'fill-white text-white' : 'fill-none text-white hover:scale-110'}`} 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        viewBox="0 0 24 24"
                    >
                         <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                 </button>
                 <span className="text-white text-[10px] font-bold drop-shadow-md">Save</span>
             </div>

             {/* Share */}
             <div className={`flex flex-col items-center gap-0.5 transition-all duration-500 delay-[600ms] ${inView ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'}`}>
                 <button onClick={handleShare} className="p-1.5 transition-transform active:scale-75 hover:scale-110">
                    <svg className="w-6 h-6 text-white drop-shadow-md" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                 </button>
                 <span className="text-white text-[10px] font-bold drop-shadow-md">Share</span>
             </div>

         </div>

      </div>
    </div>
  );
};

export default NewsSlide;