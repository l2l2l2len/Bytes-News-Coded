
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
      // Direct deep-link navigation in a fresh tab
      const win = window.open(byte.sourceUrl, '_blank', 'noopener,noreferrer');
      if (win) win.focus();
    } else {
      alert("Source link currently unavailable.");
    }
  };

  return (
    <div 
        ref={slideRef}
        className="snap-start relative h-[100dvh] w-full bg-transparent overflow-hidden flex flex-col justify-end perspective-1000"
    >
      <div className="absolute inset-0 z-0 overflow-hidden rounded-[40px] m-2 md:m-4 shadow-2xl">
         <img 
            src={byte.fileUrl} 
            alt={byte.title} 
            className={`
                w-full h-full object-cover transition-transform duration-[8s] ease-out
                ${inView ? 'scale-110 opacity-100' : 'scale-100 opacity-90'}
            `}
            loading="lazy"
         />
         <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/30"></div>
         <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/50 to-transparent"></div>
      </div>

      <div className="relative z-10 w-full px-6 pb-28 flex items-end justify-between gap-4">
         <div className={`flex-1 min-w-0 transition-all duration-700 delay-100 ease-out transform ${inView ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
             <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/80 backdrop-blur-md rounded-full mb-3 shadow-lg">
                <div className="w-4 h-4 rounded-full bg-gradient-to-tr from-pink-400 to-rose-400 flex items-center justify-center text-[8px] text-white font-bold">V</div>
                <span className="text-[10px] font-bold text-[#831843] uppercase tracking-widest">Volv Bits</span>
             </div>

             <div 
                className="glass-card rounded-[28px] p-6 origin-bottom-left w-full max-w-md shadow-2xl cursor-pointer"
                onClick={() => setIsExpanded(!isExpanded)}
             >
                 <div className="flex flex-col gap-2">
                     <h2 className="font-serif-display text-lg md:text-2xl font-bold text-[#4a044e] leading-tight line-clamp-3">
                        {byte.title}
                     </h2>

                     <div className={`transition-all duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] overflow-hidden ${isExpanded ? 'max-h-60' : 'max-h-[3.5rem]'}`}>
                        <p className="font-sans text-xs md:text-sm leading-relaxed text-[#831843]/80 font-medium">
                            {byte.abstract}
                        </p>
                     </div>
                     
                     <div className="flex items-center justify-between pt-3 mt-1 border-t border-[#831843]/10">
                        <div className="flex items-center gap-2 truncate">
                            {byte.sourceUrl && (
                                <img src={`https://www.google.com/s2/favicons?domain=${new URL(byte.sourceUrl).hostname}&sz=32`} className="w-4 h-4 rounded-full opacity-80" alt="" />
                            )}
                             <span className="text-[9px] font-bold text-[#831843]/60 uppercase tracking-wide truncate max-w-[120px]">{byte.publisher}</span>
                        </div>
                        {isExpanded && (
                             <button 
                                onClick={handleFullStory}
                                className="px-5 py-2 bg-[#831843] text-white rounded-full text-[10px] font-bold uppercase tracking-widest hover:scale-105 transition-transform shrink-0 shadow-lg active:opacity-70 flex items-center gap-2"
                             >
                                Full Story
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                             </button>
                        )}
                     </div>
                 </div>
             </div>
         </div>

         <div className="flex flex-col items-center gap-5 mb-2 shrink-0 w-12">
             <div className={`flex flex-col items-center gap-1 transition-all duration-500 delay-[200ms] ${inView ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'}`}>
                 <button onClick={() => onLike(byte.id)} className="p-1.5 transition-transform active:scale-75 group">
                     <div className="p-3 rounded-full bg-white/70 backdrop-blur-md shadow-lg group-hover:bg-white transition-all">
                        <svg className={`w-6 h-6 transition-all duration-300 ${byte.isLiked ? 'fill-rose-500 text-rose-500 scale-110' : 'fill-white text-[#831843] group-hover:scale-110'}`} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={byte.isLiked ? 0 : 2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                     </div>
                 </button>
                 <span className="text-white text-[10px] font-bold drop-shadow-md">{byte.likes}</span>
             </div>

             <div className={`flex flex-col items-center gap-1 transition-all duration-500 delay-[300ms] ${inView ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'}`}>
                 <button className="p-1.5 transition-transform active:scale-75 group">
                     <div className="p-3 rounded-full bg-white/70 backdrop-blur-md shadow-lg group-hover:bg-white transition-all">
                        <svg className="w-5 h-5 text-[#831843]" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" clipRule="evenodd" d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 13.5997 2.37562 15.1116 3.04346 16.4525C3.22094 16.8088 3.28001 17.2161 3.17712 17.6006L2.58151 19.8267C2.32295 20.793 3.20701 21.677 4.17335 21.4185L6.39939 20.8229C6.78393 20.72 7.19121 20.7791 7.54753 20.9565C8.88837 21.6244 10.4003 22 12 22ZM8 11C8 11.5523 8.44772 12 9 12H15C15.5523 12 16 11.5523 16 11C16 10.4477 15.5523 10 15 10H9C8.44772 10 8 10.4477 8 11ZM8 15C8 15.5523 8.44772 16 9 16H12C12.5523 16 13 15.5523 13 15C13 14.4477 12.5523 14 12 14H9C8.44772 14 8 14.4477 8 15Z" opacity="0.9" /></svg>
                     </div>
                 </button>
                 <span className="text-white text-[10px] font-bold drop-shadow-md">{byte.comments}</span>
             </div>

             <div className={`flex flex-col items-center gap-1 transition-all duration-500 delay-[400ms] ${inView ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'}`}>
                 <button onClick={() => onSave(byte.id)} className="p-1.5 transition-transform active:scale-75 group">
                    <div className="p-3 rounded-full bg-white/70 backdrop-blur-md shadow-lg group-hover:bg-white transition-all">
                        <svg className={`w-5 h-5 transition-all duration-300 ${byte.isSaved ? 'fill-[#831843] text-[#831843]' : 'fill-none text-[#831843] hover:scale-110'}`} stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
                    </div>
                 </button>
                 <span className="text-white text-[10px] font-bold drop-shadow-md">Save</span>
             </div>

             <div className={`flex flex-col items-center gap-1 transition-all duration-500 delay-[500ms] ${inView ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'}`}>
                 <button onClick={handleShare} className="p-1.5 transition-transform active:scale-75 group">
                    <div className="p-3 rounded-full bg-white/70 backdrop-blur-md shadow-lg group-hover:bg-white transition-all">
                        <svg className="w-5 h-5 text-[#831843]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                    </div>
                 </button>
                 <span className="text-white text-[10px] font-bold drop-shadow-md">Share</span>
             </div>
         </div>
      </div>
    </div>
  );
};

export default NewsSlide;
