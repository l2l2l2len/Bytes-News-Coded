import React, { useState } from 'react';
import { Byte } from '../types';

interface NewsSlideProps {
  byte: Byte;
  onLike: (id: string) => void;
  onSave: (id: string) => void;
}

const NewsSlide: React.FC<NewsSlideProps> = ({ byte, onLike, onSave }) => {
  const [isExpanded, setIsExpanded] = useState(false);

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
    // WRAPPER: Full Screen, Snap Start
    <div className="snap-start relative h-screen w-full bg-black overflow-hidden">
      
      {/* 1. BACKGROUND IMAGE */}
      <div className="absolute inset-0 z-0">
          <img 
            src={byte.fileUrl} 
            alt={byte.title} 
            className="w-full h-full object-cover opacity-80"
            loading="lazy"
          />
          {/* Gradients */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/90"></div>
          <div className="absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
      </div>

      {/* 2. OVERLAY CONTENT */}
      <div className="absolute inset-0 z-10 flex flex-col justify-end p-6 pb-24 md:pb-12 md:px-12 pointer-events-none">
          
          {/* Top Metadata (Publisher) - Actually placed top via flex? No, let's keep it near content or top.
              Let's put Category pill top left absolute.
          */}
          
          <div className="absolute top-24 left-6 pointer-events-auto">
             <span className="px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-[10px] text-white font-bold uppercase tracking-widest shadow-lg">
                {byte.category}
             </span>
          </div>

          <div className="max-w-xl pointer-events-auto">
             <div className="flex items-center gap-2 mb-3">
                <div className="w-5 h-5 rounded-full bg-white text-black flex items-center justify-center font-serif font-bold text-[10px]">B</div>
                <span className="text-xs font-bold text-white uppercase tracking-wide opacity-90">{byte.publisher}</span>
                <span className="text-[10px] text-gray-400">•</span>
                <span className="text-[10px] text-gray-400 uppercase tracking-wide">{byte.publicationDate}</span>
             </div>

             <h2 className="font-serif-display text-3xl md:text-4xl font-bold text-white leading-tight mb-4 drop-shadow-lg">
                {byte.title}
             </h2>

             {/* Description - Collapsible or scrollable */}
             <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-96 overflow-y-auto' : 'max-h-24'}`}>
                <p 
                    className="font-sans text-sm md:text-base leading-relaxed text-gray-200 drop-shadow-md"
                    onClick={() => setIsExpanded(!isExpanded)}
                >
                    {byte.abstract}
                </p>
             </div>
             
             <div className="mt-4 flex items-center gap-4">
                 {/* Read More Button */}
                 <button 
                    onClick={handleFullStory}
                    className="px-6 py-2 bg-white text-black rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-gray-200 transition-colors shadow-lg"
                 >
                    Read Story
                 </button>
                 {!isExpanded && (
                     <button onClick={() => setIsExpanded(true)} className="text-xs text-gray-300 font-bold hover:text-white">
                         More...
                     </button>
                 )}
             </div>
          </div>
      </div>

      {/* 3. RIGHT SIDE ACTIONS (TikTok/Reels Style) */}
      <div className="absolute right-4 bottom-28 md:bottom-20 z-20 flex flex-col items-center gap-6">
          
          {/* Like */}
          <div className="flex flex-col items-center gap-1">
             <button 
                onClick={() => onLike(byte.id)} 
                className="p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-white hover:bg-white/20 transition-all active:scale-90"
             >
                 <svg className={`w-7 h-7 ${byte.isLiked ? 'fill-red-500 text-red-500' : 'fill-none text-white'}`} stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                 </svg>
             </button>
             <span className="text-[10px] font-bold text-white shadow-black drop-shadow-md">{byte.likes}</span>
          </div>

          {/* Save */}
          <div className="flex flex-col items-center gap-1">
             <button 
                onClick={() => onSave(byte.id)} 
                className="p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-white hover:bg-white/20 transition-all active:scale-90"
             >
               <svg className={`w-7 h-7 ${byte.isSaved ? 'fill-white text-white' : 'fill-none text-white'}`} stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
               </svg>
             </button>
             <span className="text-[10px] font-bold text-white shadow-black drop-shadow-md">Save</span>
          </div>

          {/* Share */}
          <div className="flex flex-col items-center gap-1">
             <button onClick={handleShare} className="p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-white hover:bg-white/20 transition-all active:scale-90">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
             </button>
             <span className="text-[10px] font-bold text-white shadow-black drop-shadow-md">Share</span>
          </div>

      </div>

    </div>
  );
};

export default NewsSlide;