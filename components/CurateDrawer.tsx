import React, { useState } from 'react';

interface CurateDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onTopicToggle: (topic: string) => void;
  selectedTopics: string[];
  onSearch: (term: string) => void;
}

const CurateDrawer: React.FC<CurateDrawerProps> = ({ isOpen, onClose, onTopicToggle, selectedTopics, onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const categories = [
    { label: 'US News', icon: '🇺🇸' },
    { label: 'World', icon: '🌍' },
    { label: 'Business', icon: '💼' },
    { label: 'Technology', icon: '💻' },
    { label: 'Science', icon: '🧬' },
    { label: 'Health', icon: '🏥' },
    { label: 'Sports', icon: '⚽' },
    { label: 'Entertainment', icon: '🎬' },
    { label: 'Crypto', icon: '₿' },
  ];

  return (
    <>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
        onClick={onClose} 
      />

      {/* Slide-up Sheet / Drawer */}
      <div 
        className={`
          fixed inset-x-0 bottom-0 z-[110] bg-[#f9f9f9] rounded-t-[30px] overflow-hidden
          h-[92vh] flex flex-col
          transform transition-transform duration-500 cubic-bezier(0.32, 0.72, 0, 1)
          ${isOpen ? 'translate-y-0' : 'translate-y-full'}
        `}
      >
        
        {/* Header - "settings." */}
        <div className="pt-6 pb-2 px-6 flex justify-between items-center bg-white sticky top-0 z-20">
          <button onClick={onClose} className="p-2 -ml-2 rounded-full hover:bg-gray-100">
            <svg className="w-6 h-6 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
          </button>
          <h2 className="font-serif-display text-2xl font-bold text-black">settings.</h2>
          <div className="w-8"></div> {/* Spacer */}
        </div>

        <div className="overflow-y-auto px-5 pb-20 no-scrollbar">
          
          {/* User Profile Card (Aurora) */}
          <div className="mt-4 mb-6 relative w-full p-6 rounded-[24px] bg-gradient-to-tr from-blue-100 via-pink-100 to-indigo-100 overflow-hidden shadow-sm">
             <div className="relative z-10 bg-white rounded-full py-3 px-6 inline-flex items-center gap-3 shadow-sm">
                <div className="font-serif-display font-bold text-xl text-black">@</div>
                <div className="flex flex-col">
                   <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Hey, Aaron</span>
                   <span className="font-bold text-sm text-black">Claim your username</span>
                </div>
             </div>
             
             <button className="mt-4 ml-1 flex items-center gap-1 text-xs font-bold text-gray-500 hover:text-black">
                Account info 
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
             </button>
          </div>

          {/* Search Bar */}
          <div className="relative mb-6">
            <input 
              type="text" 
              placeholder="search."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); onSearch(e.target.value); }}
              className="w-full bg-white rounded-full py-4 px-6 text-black font-serif-display text-lg placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-black/5 shadow-sm"
            />
            <svg className="absolute right-6 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>

          {/* Upgrade Banner */}
          <button className="w-full mb-6 p-1 rounded-full bg-gradient-to-r from-orange-100 via-pink-100 to-blue-100 shadow-sm hover:scale-[1.01] transition-transform">
             <div className="bg-white/40 backdrop-blur-sm rounded-full py-4 text-center">
               <span className="font-bold text-black text-sm">upgrade to Premium.</span>
             </div>
          </button>

          {/* Menu Actions */}
          <div className="space-y-3 mb-10">
            {['publish on Bytes.', 'win merch.', 'contact team Bytes.'].map((text) => (
              <button key={text} className="w-full bg-white rounded-full py-4 text-center shadow-sm hover:bg-gray-50 font-bold text-sm text-black border border-transparent hover:border-gray-100 transition-colors">
                {text}
              </button>
            ))}
          </div>

          {/* Curation Section */}
          <div className="mb-4">
             <h3 className="font-serif-display text-2xl font-bold text-black mb-1">curate your feed.</h3>
             <p className="text-xs text-gray-500 mb-6">To explore a category, tap on the name</p>
             
             <div className="flex flex-wrap gap-3">
               {categories.map(cat => {
                 const isActive = selectedTopics.includes(cat.label);
                 return (
                   <button 
                     key={cat.label}
                     onClick={() => onTopicToggle(cat.label)}
                     className={`
                       pl-2 pr-4 py-2 rounded-full flex items-center gap-2 border transition-all
                       ${isActive ? 'bg-white border-gray-200 shadow-sm' : 'bg-transparent border-transparent opacity-60'}
                     `}
                   >
                     <span className="text-xl">{cat.icon}</span>
                     <span className="font-bold text-sm text-black">{cat.label}</span>
                     {isActive && <svg className="w-4 h-4 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>}
                   </button>
                 )
               })}
             </div>
          </div>

        </div>

      </div>
    </>
  );
};

export default CurateDrawer;