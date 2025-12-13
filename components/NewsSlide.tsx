import React, { useState, MouseEvent } from 'react';
import { Byte } from '../types';

interface NewsSlideProps {
  byte: Byte;
  onLike: (id: string) => void;
  onSave: (id: string) => void;
}

const NewsSlide: React.FC<NewsSlideProps> = ({ byte, onLike, onSave }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      try {
        await navigator.share({
          title: byte.title,
          text: byte.abstract.substring(0, 100) + '...',
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied!');
    }
  };

  const toggleAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
      const msg = new SpeechSynthesisUtterance(byte.abstract);
      msg.onend = () => setIsPlaying(false);
      window.speechSynthesis.speak(msg);
    } else {
      window.speechSynthesis.cancel();
    }
  };

  return (
    <div className="snap-slide w-full flex items-center justify-center p-4">
      {/* Prism Card - Frosted Glass */}
      <div 
        className="prism-card w-full max-w-[420px] h-auto min-h-[640px] flex flex-col group"
      >
        
        {/* Top Decorative ID */}
        <div className="absolute top-6 right-6 z-10 opacity-30">
           <span className="font-mono text-[10px] tracking-widest text-black">#{byte.id.split('-')[1]}</span>
        </div>

        {/* Image Section - Edge-to-Edge Top */}
        <div className="relative h-72 w-full overflow-hidden">
           <img 
             src={byte.fileUrl} 
             alt={byte.title}
             className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
           />
           {/* Gradient Overlay for Text Readability */}
           <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/60 to-transparent opacity-80"></div>

           {/* Badge floating on image */}
           <div className="absolute bottom-4 left-6">
              <span className="inline-block px-3 py-1 bg-white/90 backdrop-blur-md text-indigo-950 text-[10px] font-extrabold uppercase tracking-widest rounded-sm">
                {byte.category}
              </span>
           </div>
        </div>

        {/* Content Body - Glass White */}
        <div className="flex-1 px-8 py-6 flex flex-col bg-white/60 relative">
            
            {/* Publisher & Time */}
            <div className="flex items-center gap-3 mb-4">
               <div className="w-6 h-6 rounded-full bg-indigo-950 text-white flex items-center justify-center text-[10px] font-bold">
                 {byte.publisher[0]}
               </div>
               <span className="text-xs font-bold text-indigo-950 uppercase tracking-wide">{byte.publisher}</span>
               <span className="text-indigo-300 mx-1">•</span>
               <span className="text-xs font-mono text-indigo-800/60">{byte.readTime}</span>
            </div>

            {/* Typography - Huge & Bold */}
            <h2 className="font-display text-[28px] leading-[1.1] font-bold text-indigo-950 mb-4 tracking-tight">
              {byte.title}
            </h2>

            {/* Abstract with custom scroll fade */}
            <div className="flex-1 overflow-y-auto no-scrollbar mask-fade-bottom">
               <p className="text-[16px] leading-relaxed text-indigo-900/80 font-medium font-sans">
                 {byte.abstract}
               </p>
            </div>

            {/* Action Bar - Floating Pill Style */}
            <div className="mt-8 pt-4 border-t border-indigo-100/50 flex items-center justify-between">
                
                {/* Like / Share */}
                <div className="flex gap-2">
                   <button 
                      onClick={(e) => { e.stopPropagation(); onLike(byte.id); }}
                      className={`btn-icon w-12 h-12 rounded-full flex items-center justify-center transition-all ${byte.isLiked ? 'bg-rose-100/50 text-rose-600' : 'bg-white/50 text-indigo-300 hover:bg-white/80 hover:text-indigo-950'}`}
                   >
                      <svg className="w-5 h-5" fill={byte.isLiked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                   </button>
                   <button 
                      onClick={handleShare}
                      className="btn-icon w-12 h-12 rounded-full bg-white/50 text-indigo-300 hover:bg-white/80 hover:text-indigo-950 flex items-center justify-center transition-all"
                   >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                   </button>
                </div>

                {/* Play / Save */}
                <div className="flex gap-2">
                   <button 
                      onClick={toggleAudio}
                      className={`btn-icon h-12 px-5 rounded-full flex items-center gap-2 transition-all font-bold text-xs uppercase tracking-wider ${isPlaying ? 'bg-indigo-950 text-white' : 'bg-white/80 text-indigo-950 hover:bg-white'}`}
                   >
                      {isPlaying ? (
                        <>
                          <span className="w-2 h-2 bg-rose-500 rounded-full animate-pulse"/>
                          <span>Listen</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /></svg>
                          <span>Listen</span>
                        </>
                      )}
                   </button>
                   <button 
                      onClick={(e) => { e.stopPropagation(); onSave(byte.id); }}
                      className={`btn-icon w-12 h-12 rounded-full flex items-center justify-center transition-all ${byte.isSaved ? 'bg-indigo-950 text-white' : 'bg-white/50 text-indigo-300 hover:bg-white/80 hover:text-indigo-950'}`}
                   >
                      <svg className="w-5 h-5" fill={byte.isSaved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
                   </button>
                </div>

            </div>

        </div>
      </div>
    </div>
  );
};

export default NewsSlide;