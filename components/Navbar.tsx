import React from 'react';

interface NavbarProps {
  onProfileClick: () => void;
  onSearchClick: () => void;
  onNotifyClick: () => void;
  onLiveClick?: () => void;
  isLiveLoading?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ onProfileClick, onSearchClick, onNotifyClick, onLiveClick, isLiveLoading }) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-5 py-4 flex justify-between items-center bg-white/90 backdrop-blur-md border-b border-gray-200 transition-all shadow-sm">
      
      {/* Left: Profile / Brand */}
      <div className="flex items-center gap-3">
        <button 
          onClick={onProfileClick}
          className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 border border-gray-300 flex items-center justify-center text-gray-700 transition-all"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </button>
        <div className="flex flex-col leading-none">
           <span className="font-serif-display text-2xl font-bold text-black tracking-tight">Bytes</span>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        
        {/* Live Button */}
        <button 
          onClick={onLiveClick}
          disabled={isLiveLoading}
          className={`
            h-9 px-4 rounded-full flex items-center gap-2 font-bold text-[10px] uppercase tracking-widest transition-all
            ${isLiveLoading 
              ? 'bg-red-50 text-red-400 cursor-wait' 
              : 'bg-red-600 hover:bg-red-500 text-white shadow-md'}
          `}
        >
          {isLiveLoading ? (
            <svg className="animate-spin w-3 h-3 text-red-500" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
          ) : (
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          )}
          <span>{isLiveLoading ? 'Syncing...' : 'Live'}</span>
        </button>

        <button 
          onClick={onSearchClick}
          className="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-black hover:bg-gray-100 rounded-full transition-all"
        >
           <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </button>
      </div>

    </nav>
  );
};

export default Navbar;