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
        className={`fixed inset-0 z-[100] bg-[#1C1C1E]/20 backdrop-blur-sm transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
        onClick={onClose} 
      />

      {/* Slide-up Sheet / Drawer */}
      <div 
        className={`
          fixed inset-x-0 bottom-0 z-[110] bg-[#F2F1EC] rounded-t-[40px] overflow-hidden shadow-[0_-20px_40px_-15px_rgba(0,0,0,0.1)]
          h-[92vh] flex flex-col
          transform transition-transform duration-500 cubic-bezier(0.32, 0.72, 0, 1)
          ${isOpen ? 'translate-y-0' : 'translate-y-full'}
        `}
      >
        
        {/* Header */}
        <div className="pt-8 pb-4 px-6 flex justify-between items-center bg-[#F2F1EC] sticky top-0 z-20">
          <button onClick={onClose} className="p-2 -ml-2 rounded-full hover:bg-black/5 transition-colors">
            <svg className="w-6 h-6 text-[#1C1C1E]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
          </button>
          <h2 className="font-serif-display text-2xl font-bold text-[#1C1C1E]">Settings</h2>
          <div className="w-8"></div> {/* Spacer */}
        </div>

        <div className="overflow-y-auto px-6 pb-20 no-scrollbar">
          
          {/* User Profile Card - White floating card */}
          <div className="mt-2 mb-8 relative w-full p-6 rounded-[32px] bg-white soft-depth-card flex items-center justify-between">
             <div className="flex items-center gap-4">
                 <div className="w-12 h-12 rounded-full bg-[#F2F1EC] flex items-center justify-center font-bold text-xl text-[#1C1C1E]">A</div>
                 <div className="flex flex-col">
                     <span className="font-bold text-lg text-[#1C1C1E]">Aaron Smith</span>
                     <span className="text-xs text-[#8E8E93]">Free Plan</span>
                 </div>
             </div>
             <button className="px-4 py-2 bg-[#F2F1EC] rounded-full text-xs font-bold text-[#1C1C1E] uppercase tracking-wide">
                 Edit
             </button>
          </div>

          {/* Search Bar */}
          <div className="relative mb-8">
            <input 
              type="text" 
              placeholder="Search topics..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); onSearch(e.target.value); }}
              className="w-full bg-white rounded-full py-4 px-6 text-[#1C1C1E] font-sans text-base placeholder:text-[#C7C7CC] focus:outline-none focus:ring-2 focus:ring-black/5 soft-inset"
            />
            <svg className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-[#C7C7CC]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>

          {/* Premium Banner */}
          <button className="w-full mb-10 group overflow-hidden rounded-[32px] soft-depth-card relative">
             <div className="absolute inset-0 bg-gradient-to-r from-neutral-100 to-stone-200 opacity-50"></div>
             <div className="relative p-6 flex flex-col items-center text-center">
                 <h3 className="font-serif-display text-xl font-bold text-[#1C1C1E] mb-1">Volv Premium</h3>
                 <p className="text-xs text-[#505055] mb-4">Unlock deep dives & audio mode</p>
                 <span className="px-6 py-2 bg-[#1C1C1E] text-white rounded-full text-[10px] font-bold uppercase tracking-widest group-hover:scale-105 transition-transform">Upgrade</span>
             </div>
          </button>

          {/* Curation Section */}
          <div className="mb-12">
             <h3 className="font-serif-display text-2xl font-bold text-[#1C1C1E] mb-2">Curate Feed</h3>
             <p className="text-xs text-[#8E8E93] mb-6">Tap to toggle interest vectors</p>
             
             <div className="flex flex-wrap gap-3">
               {categories.map(cat => {
                 const isActive = selectedTopics.includes(cat.label);
                 return (
                   <button 
                     key={cat.label}
                     onClick={() => onTopicToggle(cat.label)}
                     className={`
                       pl-3 pr-5 py-3 rounded-full flex items-center gap-2 border transition-all duration-300
                       ${isActive 
                            ? 'bg-white border-transparent soft-depth-card transform scale-105' 
                            : 'bg-transparent border-[#E5E5EA] text-[#8E8E93] hover:bg-white hover:border-transparent'}
                     `}
                   >
                     <span className="text-lg grayscale">{cat.icon}</span>
                     <span className={`font-bold text-sm ${isActive ? 'text-[#1C1C1E]' : 'text-[#8E8E93]'}`}>{cat.label}</span>
                   </button>
                 )
               })}
             </div>
          </div>

          {/* Footer Actions */}
           <div className="space-y-3">
            {['Submit Story', 'Contact Support', 'Terms of Service'].map((text) => (
              <button key={text} className="w-full py-4 text-center font-bold text-xs text-[#8E8E93] hover:text-[#1C1C1E] transition-colors uppercase tracking-widest">
                {text}
              </button>
            ))}
          </div>

        </div>

      </div>
    </>
  );
};

export default CurateDrawer;