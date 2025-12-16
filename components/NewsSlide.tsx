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
    // WRAPPER: Centers the floating card vertically in the snap area
    // 'box-border' and padding ensures the card floats with margins
    <div className="snap-center h-screen w-full flex items-start justify-center p-4 pt-4 md:p-6 md:pt-4 box-border">
      
      {/* 3D FLOATING CARD "Monolith" */}
      {/* Matches GoldenCare style: Rounded 40px, white surface, elevated soft shadow */}
      <div className="relative w-full max-w-[400px] bg-white rounded-[40px] soft-depth-card overflow-hidden flex flex-col h-[75vh] md:h-[80vh] transition-transform duration-500 hover:scale-[1.01]">
        
        {/* TOP: Image Area (Takes ~55% height) */}
        {/* Rounded corners inside to create a 'frame' effect */}
        <div className="relative h-[55%] w-full overflow-hidden rounded-t-[40px] rounded-b-[32px] m-1.5 shadow-inner group">
             <img 
                src={byte.fileUrl} 
                alt={byte.title} 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                loading="lazy"
             />
             
             {/* Gradient overlay for text protection if needed, though mostly clean */}
             <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-60"></div>

             {/* Category Pill Floating on Image */}
             <div className="absolute top-4 left-4">
                 <span className="px-4 py-1.5 bg-white/90 backdrop-blur-md rounded-full text-[10px] text-[#1C1C1E] font-bold uppercase tracking-widest shadow-sm border border-white/50">
                    {byte.category}
                 </span>
             </div>
        </div>

        {/* BOTTOM: Content Area */}
        <div className="flex-1 flex flex-col justify-between p-6 md:p-8 bg-white relative">
             
             <div className="flex flex-col gap-3">
                 {/* Metadata */}
                 <div className="flex items-center gap-2 opacity-60">
                    <span className="text-[10px] font-bold text-[#1C1C1E] uppercase tracking-wide">{byte.publisher}</span>
                    <span className="w-1 h-1 bg-[#1C1C1E] rounded-full"></span>
                    <span className="text-[10px] text-[#1C1C1E] uppercase tracking-wide">{byte.publicationDate}</span>
                 </div>

                 {/* Title - Large Serif/Display */}
                 <h2 className="font-serif-display text-2xl md:text-3xl font-bold text-[#1C1C1E] leading-[1.15] tracking-tight">
                    {byte.title}
                 </h2>

                 {/* Abstract - Short snippet with expand */}
                 <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-40 overflow-y-auto' : 'max-h-16'}`}>
                    <p 
                        className="font-sans text-sm leading-relaxed text-[#505055] cursor-pointer"
                        onClick={() => setIsExpanded(!isExpanded)}
                    >
                        {byte.abstract}
                    </p>
                 </div>
             </div>

             {/* Actions */}
             <div className="flex items-center justify-between pt-4 mt-2 border-t border-gray-100">
                 <button 
                    onClick={handleFullStory}
                    className="px-6 py-3 bg-[#1C1C1E] text-white rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-[#3A3A3C] transition-colors soft-depth-button"
                 >
                    Read
                 </button>

                 <div className="flex items-center gap-2">
                     <button 
                        onClick={() => onLike(byte.id)} 
                        className="w-10 h-10 rounded-full bg-[#F2F1EC] flex items-center justify-center transition-transform active:scale-95 hover:bg-[#E5E4DE] soft-depth-button"
                     >
                         <svg className={`w-5 h-5 ${byte.isLiked ? 'fill-red-500 text-red-500' : 'fill-none text-[#1C1C1E]'}`} stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                         </svg>
                     </button>
                     
                     <button 
                        onClick={() => onSave(byte.id)} 
                        className="w-10 h-10 rounded-full bg-[#F2F1EC] flex items-center justify-center transition-transform active:scale-95 hover:bg-[#E5E4DE] soft-depth-button"
                     >
                       <svg className={`w-5 h-5 ${byte.isSaved ? 'fill-[#1C1C1E] text-[#1C1C1E]' : 'fill-none text-[#1C1C1E]'}`} stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                       </svg>
                     </button>

                     <button onClick={handleShare} className="w-10 h-10 rounded-full bg-[#F2F1EC] flex items-center justify-center transition-transform active:scale-95 hover:bg-[#E5E4DE] soft-depth-button">
                        <svg className="w-5 h-5 text-[#1C1C1E]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                     </button>
                 </div>
             </div>
        </div>
      </div>
    </div>
  );
};

export default NewsSlide;