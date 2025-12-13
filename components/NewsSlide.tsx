import React, { useState } from 'react';
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
      alert('Link copied to clipboard!');
    }
  };

  const openSource = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (byte.sourceUrl) {
      window.open(byte.sourceUrl, '_blank');
    }
  };

  const toggleAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPlaying(!isPlaying);
    // Simple mock feedback for audio functionality
    if (!isPlaying) {
      const msg = new SpeechSynthesisUtterance(byte.abstract);
      msg.onend = () => setIsPlaying(false);
      window.speechSynthesis.speak(msg);
    } else {
      window.speechSynthesis.cancel();
    }
  };

  return (
    <div className="snap-slide w-full h-full bg-black relative">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src={byte.fileUrl} 
          className="w-full h-full object-cover transition-transform duration-10000 hover:scale-110" 
          alt={byte.title}
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/70" />
      </div>

      {/* Side Actions Bar - Volv Style */}
      <div className="absolute right-4 bottom-52 flex flex-col gap-8 items-center z-20">
        {/* Share Button */}
        <button 
          onClick={handleShare}
          className="flex flex-col items-center group transition-all active:scale-90"
        >
          <div className="w-10 h-10 flex items-center justify-center text-white drop-shadow-md group-hover:text-[#D9B77E]">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
          </div>
        </button>

        {/* Comment Button */}
        <button className="flex flex-col items-center group transition-all active:scale-90">
          <div className="w-10 h-10 flex items-center justify-center text-white drop-shadow-md group-hover:text-[#D9B77E]">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
        </button>

        {/* Like Button */}
        <button 
          onClick={(e) => { e.stopPropagation(); onLike(byte.id); }}
          className="flex flex-col items-center group transition-all active:scale-90"
        >
          <div className={`w-10 h-10 flex items-center justify-center transition-all ${byte.isLiked ? 'text-red-500 scale-125' : 'text-white drop-shadow-md group-hover:text-red-500'}`}>
            <svg className="w-8 h-8" fill={byte.isLiked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <span className="text-white text-[10px] font-bold mt-1 tracking-tighter drop-shadow-md">{(byte.likes / 1000).toFixed(1)}K</span>
        </button>

        {/* Save Button */}
        <button 
          onClick={(e) => { e.stopPropagation(); onSave(byte.id); }}
          className="flex flex-col items-center group transition-all active:scale-90"
        >
          <div className={`w-10 h-10 flex items-center justify-center transition-all ${byte.isSaved ? 'text-[#D9B77E] scale-110' : 'text-white drop-shadow-md group-hover:text-[#D9B77E]'}`}>
            <svg className="w-7 h-7" fill={byte.isSaved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </div>
        </button>
      </div>

      {/* Floating Meta Overlay */}
      <div className="absolute left-6 bottom-[330px] flex items-center gap-4 z-20">
        <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center overflow-hidden border-2 border-white/20 shadow-xl">
          <span className="text-[12px] font-black tracking-tighter">BY</span>
        </div>
        <div className="flex flex-col">
          <span className="text-white font-bold text-base tracking-tight drop-shadow-lg">Bytes Bits</span>
          <span className="text-white/70 text-[11px] uppercase font-bold tracking-widest drop-shadow-lg">{byte.publicationDate}</span>
        </div>
      </div>

      {/* Content Card - Large and Rounded */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[calc(100%-32px)] max-w-[480px] bg-white rounded-[2.5rem] p-8 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] z-20 animate-slide-up transform border border-white/40">
        <h2 className="font-display text-2xl font-bold leading-[1.25] mb-5 text-[#1c1c1c] tracking-tight">
          {byte.title}
        </h2>
        <p className="text-[15px] leading-relaxed text-[#555] font-normal line-clamp-6 mb-6">
          {byte.abstract}
        </p>

        <div className="flex items-center justify-between pt-6 border-t border-gray-100">
          <div className="flex items-center gap-6">
            <button 
              onClick={toggleAudio}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${isPlaying ? 'bg-black text-white scale-110 shadow-lg' : 'bg-gray-50 text-gray-400 hover:text-black hover:bg-gray-100'}`}
              aria-label="Listen to summary"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              </svg>
            </button>
            <button 
              onClick={openSource}
              className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-black hover:bg-gray-100 transition-all active:scale-95"
              aria-label="Read full article"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </button>
          </div>
          <span className="text-[11px] font-black text-gray-300 uppercase tracking-[0.2em]">{byte.readTime}</span>
        </div>
      </div>
    </div>
  );
};

export default NewsSlide;