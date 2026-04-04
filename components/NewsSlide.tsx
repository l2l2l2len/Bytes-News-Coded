
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
      window.open(byte.sourceUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div 
        ref={slideRef}
        className="snap-start relative h-[100dvh] w-full bg-transparent overflow-hidden flex flex-col justify-end"
    >
      <div className="absolute inset-0 z-0 overflow-hidden rounded-[32px] md:rounded-[40px] m-2 md:m-4 shadow-2xl">
         <img 
            src={byte.fileUrl} 
            alt={byte.title} 
            className={`
                w-full h-full object-cover transition-transform duration-[8s] ease-out
                ${inView ? 'scale-110 opacity-100' : 'scale-100 opacity-90'}
            `}
            loading="lazy"
         />
         <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40"></div>
         <div className="absolute bottom-0 left-0 right-0 h-[60%] bg-gradient-to-t from-black/80 to-transparent"></div>
      </div>

      <div className="relative z-10 w-full px-4 md:px-6 pb-24 md:pb-28 flex items-end justify-between gap-3 md:gap-4">
         <div className={`flex-1 min-w-0 transition-all duration-700 delay-100 ease-out transform ${inView ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
             <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/90 backdrop-blur-md rounded-full mb-3 shadow-lg border border-white/50">
                <span className="text-[9px] font-black text-[#831843] uppercase tracking-[0.2em]">{byte.category}</span>
             </div>

             <div 
                className="glass-card rounded-[28px] p-6 origin-bottom-left w-full max-w-lg shadow-2xl cursor-pointer hover:bg-white/80 transition-colors"
                onClick={() => setIsExpanded(!isExpanded)}
             >
                 <div className="flex flex-col gap-2">
                     <h2 className="font-serif-display text-2xl md:text-3xl font-bold text-[#4a044e] leading-tight mb-1">
                        {byte.title}
                     </h2>

                     <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isExpanded ? 'max-h-96' : 'max-h-[3rem]'}`}>
                        <p className="font-sans text-[14px] leading-relaxed md:text-[16px] text-[#831843]/80 font-medium mb-4">
                            {byte.abstract}
                        </p>
                        {byte.whyMatters && (
                          <div className="bg-[#831843]/5 p-4 rounded-2xl border border-[#831843]/10 mb-4 animate-fade-in">
                             <p className="text-[10px] font-black uppercase tracking-widest text-[#831843] mb-1">Impact Vector</p>
                             <p className="text-[13px] italic text-[#4a044e] leading-relaxed">{byte.whyMatters}</p>
                          </div>
                        )}
                     </div>
                     
                     <div className="flex items-center justify-between pt-3 mt-1 border-t border-[#831843]/10">
                        <div className="flex items-center gap-2 truncate">
                            <span className="text-[10px] font-bold text-[#831843]/60 uppercase tracking-widest truncate">{byte.publisher}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-[9px] font-bold text-[#831843]/30 uppercase">{isExpanded ? 'Tap to close' : 'Tap for more'}</span>
                            {isExpanded && (
                                <button 
                                    onClick={handleFullStory}
                                    className="px-4 py-2 bg-[#831843] text-white rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-[#be185d] transition-colors shadow-lg active:scale-95"
                                >
                                    Full Story
                                </button>
                            )}
                        </div>
                     </div>
                 </div>
             </div>
         </div>

         <div className="flex flex-col items-center gap-5 mb-1 shrink-0 w-12">
             <div className="flex flex-col items-center gap-1">
                 <button onClick={() => onLike(byte.id)} className="p-1 active:scale-75 transition-transform group">
                     <div className={`p-3 rounded-full backdrop-blur-md shadow-xl border border-white/40 transition-all ${byte.isLiked ? 'bg-rose-500 border-rose-400' : 'bg-white/60'}`}>
                        <svg className={`w-6 h-6 ${byte.isLiked ? 'fill-white text-white' : 'text-[#831843]'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                     </div>
                 </button>
                 <span className="text-white text-[11px] font-black drop-shadow-md">{byte.likes}</span>
             </div>

             <div className="flex flex-col items-center gap-1">
                 <button onClick={() => onSave(byte.id)} className="p-1 active:scale-75 transition-transform">
                    <div className={`p-3 rounded-full backdrop-blur-md shadow-xl border border-white/40 transition-all ${byte.isSaved ? 'bg-[#831843] border-[#be185d]' : 'bg-white/60'}`}>
                        <svg className={`w-6 h-6 ${byte.isSaved ? 'fill-white text-white' : 'text-[#831843]'}`} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
                    </div>
                 </button>
                 <span className="text-white text-[11px] font-black drop-shadow-md">Save</span>
             </div>

             <button onClick={handleShare} className="p-1 active:scale-75 transition-transform">
                <div className="p-3 rounded-full bg-white/60 backdrop-blur-md shadow-xl border border-white/40">
                    <svg className="w-6 h-6 text-[#831843]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                </div>
             </button>
         </div>
      </div>
    </div>
  );
};

export default NewsSlide;
