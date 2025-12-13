import React from 'react';

interface NavbarProps {
  onProfileClick: () => void;
  onSearchClick: () => void;
  onNotifyClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onProfileClick, onSearchClick, onNotifyClick }) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-[40] px-6 py-10 flex items-center justify-between pointer-events-none">
      <div className="flex items-center gap-4 pointer-events-auto">
        <button 
          onClick={onProfileClick}
          className="w-11 h-11 rounded-full bg-white/20 backdrop-blur-xl flex items-center justify-center text-white border border-white/20 overflow-hidden shadow-lg transition-transform active:scale-90"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>
        </button>
        <span className="font-display text-[26px] font-black text-white tracking-tighter drop-shadow-2xl">Bytes</span>
      </div>

      <div className="flex items-center gap-3 pointer-events-auto">
        <button 
          onClick={onSearchClick}
          className="w-11 h-11 rounded-full bg-white/20 backdrop-blur-xl flex items-center justify-center text-white border border-white/20 shadow-lg transition-transform active:scale-90"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
        <button 
          onClick={onNotifyClick}
          className="w-11 h-11 rounded-full bg-white/20 backdrop-blur-xl flex items-center justify-center text-white border border-white/20 shadow-lg transition-transform active:scale-90"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;