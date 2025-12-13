import React from 'react';

interface NavbarProps {
  onProfileClick: () => void;
  onSearchClick: () => void;
  onNotifyClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onProfileClick, onSearchClick, onNotifyClick }) => {
  return (
    <nav className="fixed bottom-8 left-0 right-0 z-[40] flex justify-center pointer-events-none">
      {/* Dark Glass Dock */}
      <div className="glass-dock px-8 py-3 rounded-full flex items-center gap-10 pointer-events-auto animate-enter">
        
        {/* Home */}
        <button className="group relative flex flex-col items-center gap-1" aria-label="Home">
           <div className="p-2 rounded-xl group-hover:bg-white/5 transition-colors">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
           </div>
           {/* Active Dot */}
           <div className="w-1 h-1 bg-cyan-400 rounded-full shadow-[0_0_8px_rgba(34,211,238,0.8)]"></div>
        </button>

        {/* Search */}
        <button onClick={onSearchClick} className="group relative flex flex-col items-center gap-1 text-slate-400 hover:text-white transition-colors" aria-label="Search">
           <div className="p-2 rounded-xl group-hover:bg-white/5 transition-colors">
             <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
           </div>
           <div className="w-1 h-1 bg-transparent rounded-full"></div>
        </button>

        {/* Notifications */}
        <button onClick={onNotifyClick} className="group relative flex flex-col items-center gap-1 text-slate-400 hover:text-white transition-colors" aria-label="Notifications">
           <div className="p-2 rounded-xl group-hover:bg-white/5 transition-colors relative">
             <div className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border border-[#0f172a]"></div>
             <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
           </div>
           <div className="w-1 h-1 bg-transparent rounded-full"></div>
        </button>

        {/* Profile */}
        <button onClick={onProfileClick} className="group relative flex flex-col items-center gap-1" aria-label="Profile">
           <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 p-[2px] group-active:scale-95 transition-transform">
              <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
                 <span className="font-bold text-white text-xs">B</span>
              </div>
           </div>
           <div className="w-1 h-1 bg-transparent rounded-full"></div>
        </button>

      </div>
    </nav>
  );
};

export default Navbar;