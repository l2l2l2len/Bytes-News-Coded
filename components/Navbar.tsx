
import React from 'react';

interface NavbarProps {
  onProfileClick: () => void;
  onSearchClick: () => void;
  onNotifyClick: () => void;
  onLiveClick?: () => void;
  isLiveLoading?: boolean;
  userName?: string;
}

const Navbar: React.FC<NavbarProps> = ({ onProfileClick, onSearchClick, onNotifyClick, onLiveClick, isLiveLoading, userName }) => {
  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 px-4 md:px-6 py-4 md:py-6 flex justify-between items-center transition-all bg-gradient-to-b from-white/40 to-transparent pointer-events-none"
      role="navigation"
      aria-label="Main navigation"
    >

      {/* Left: Brand */}
      <div className="flex flex-col justify-center pointer-events-auto">
         <span className="font-serif-display text-2xl md:text-3xl font-bold text-[#831843] tracking-tight drop-shadow-sm">Bytes.</span>
         {userName && (
             <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#831843]/60 -mt-1 ml-0.5 animate-fade-in-up">
                 Hello, {userName}
             </span>
         )}
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2 md:gap-4 pointer-events-auto">

        {/* Live Button */}
        <button
          onClick={onLiveClick}
          disabled={isLiveLoading}
          aria-label={isLiveLoading ? "Syncing news feed" : "Refresh live news"}
          className={`
            h-8 px-3 rounded-full flex items-center gap-2 font-bold text-[9px] md:text-[10px] uppercase tracking-widest transition-all backdrop-blur-md shadow-sm min-w-[44px] min-h-[44px]
            ${isLiveLoading
              ? 'bg-white/50 text-[#831843] border border-[#831843]/20 cursor-wait'
              : 'bg-white/40 hover:bg-white/60 text-[#831843] border border-white/40'}
          `}
        >
          {isLiveLoading ? (
            <svg className="animate-spin w-3 h-3 text-[#be185d]" fill="none" viewBox="0 0 24 24" aria-hidden="true">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-red-500 rounded-full animate-pulse" aria-hidden="true"></div>
          )}
          <span>{isLiveLoading ? 'Syncing' : 'Live'}</span>
        </button>

        {/* Info/About Button */}
        <button
          onClick={onNotifyClick}
          aria-label="About Bytes"
          className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center text-[#831843] bg-white/40 hover:bg-white/60 rounded-full transition-all backdrop-blur-md border border-white/40 shadow-sm min-w-[44px] min-h-[44px]"
        >
          <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>

        {/* Search Button */}
        <button
          onClick={onSearchClick}
          aria-label="Open search and settings"
          className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center text-[#831843] bg-white/40 hover:bg-white/60 rounded-full transition-all backdrop-blur-md border border-white/40 shadow-sm min-w-[44px] min-h-[44px]"
        >
           <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
             <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
           </svg>
        </button>

        {/* Profile Button */}
        <button
          onClick={onProfileClick}
          aria-label="Open settings"
          className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-white/50 text-[#831843] border border-white/50 hover:scale-105 flex items-center justify-center transition-all backdrop-blur-md shadow-md min-w-[44px] min-h-[44px]"
        >
          {userName ? (
            <span className="font-serif font-bold text-lg">{userName[0].toUpperCase()}</span>
          ) : (
            <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          )}
        </button>
      </div>

    </nav>
  );
};

export default Navbar;
