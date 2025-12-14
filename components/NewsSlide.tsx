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
    <article className="bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden mb-6 transition-transform hover:scale-[1.01] duration-300">
      
      {/* 1. Header Image */}
      <div className="relative h-64 md:h-80 w-full bg-gray-100 group cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        <img 
          src={byte.fileUrl} 
          alt={byte.title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute top-4 left-4">
             <span className="px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-[10px] text-black font-bold uppercase tracking-wider shadow-sm">
             {byte.category}
           </span>
        </div>
      </div>

      {/* 2. Content Body */}
      <div className="p-6">
        
        <div className="flex items-center gap-2 mb-3">
           <div className="w-5 h-5 rounded-full bg-black flex items-center justify-center">
             <span className="font-serif-display font-bold text-[8px] text-white">B</span>
           </div>
           <span className="text-gray-900 font-bold text-xs uppercase tracking-wide">{byte.publisher}</span>
           <span className="text-gray-400 text-[10px]">• {byte.readTime}</span>
        </div>

        <h2 
             className="font-serif-display text-2xl md:text-3xl font-bold text-gray-900 leading-tight mb-3 cursor-pointer hover:text-gray-700 transition-colors"
             onClick={() => setIsExpanded(!isExpanded)}
        >
             {byte.title}
        </h2>

        <p className={`font-sans-body text-gray-600 text-sm leading-relaxed ${isExpanded ? '' : 'line-clamp-3'}`}>
            {byte.abstract}
        </p>
        
        <div className="mt-2 mb-6">
            {!isExpanded ? (
                <button onClick={() => setIsExpanded(true)} className="text-xs font-bold uppercase tracking-widest text-indigo-600 hover:text-indigo-800">
                    Show more
                </button>
            ) : (
                <button onClick={() => setIsExpanded(false)} className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-gray-600">
                    Show less
                </button>
            )}
        </div>

        {/* 3. Actions Row */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
           <div className="flex items-center gap-4">
               {/* Like */}
               <button 
                  onClick={() => onLike(byte.id)} 
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-full transition-colors ${byte.isLiked ? 'bg-red-50 text-red-500' : 'hover:bg-gray-50 text-gray-500'}`}
               >
                   <svg className={`w-5 h-5 ${byte.isLiked ? 'fill-current' : 'fill-none'}`} stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                   </svg>
                   <span className="text-xs font-bold">{byte.likes}</span>
               </button>

               {/* Comment (Mock) */}
               <button className="flex items-center gap-1.5 px-3 py-2 rounded-full hover:bg-gray-50 text-gray-500 transition-colors">
                   <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                   <span className="text-xs font-bold">{byte.comments || 0}</span>
               </button>
               
               {/* Save */}
               <button 
                  onClick={() => onSave(byte.id)} 
                  className={`p-2 rounded-full transition-colors ${byte.isSaved ? 'text-indigo-600 bg-indigo-50' : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'}`}
               >
                 <svg className="w-5 h-5" fill={byte.isSaved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                 </svg>
               </button>
           </div>

           <div className="flex items-center gap-2">
               <button onClick={handleShare} className="p-2 rounded-full text-gray-400 hover:text-gray-900 hover:bg-gray-50 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
               </button>
               
               <button 
                  onClick={handleFullStory}
                  className="bg-black text-white px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-gray-800 transition-colors shadow-lg"
               >
                  Read
               </button>
           </div>
        </div>

      </div>
    </article>
  );
};

export default NewsSlide;