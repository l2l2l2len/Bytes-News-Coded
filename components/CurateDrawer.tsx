
import React from 'react';

interface CurateDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onTopicToggle: (topic: string) => void;
  selectedTopics: string[];
  onSearch: (term: string) => void;
}

const CurateDrawer: React.FC<CurateDrawerProps> = ({ isOpen, onClose, onTopicToggle, selectedTopics }) => {
  
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
        className={`fixed inset-0 z-[100] bg-[#4a044e]/20 backdrop-blur-sm transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
        onClick={onClose} 
      />

      {/* Side Drawer (Sliding from Right) */}
      <div 
        className={`
          fixed inset-y-0 right-0 z-[110] glass-card rounded-l-[40px] overflow-hidden shadow-2xl border-l border-white/50
          w-full max-w-md flex flex-col
          transform transition-transform duration-500 cubic-bezier(0.32, 0.72, 0, 1)
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
        style={{ background: 'rgba(255, 255, 255, 0.92)' }}
      >
        
        {/* Header */}
        <div className="pt-8 pb-4 px-6 flex justify-between items-center sticky top-0 z-20 border-b border-rose-100 bg-transparent">
          <button onClick={onClose} className="p-2 -ml-2 rounded-full hover:bg-rose-50 transition-colors">
            {/* Chevron Right to indicate closing to the right */}
            <svg className="w-6 h-6 text-[#831843]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
          <h2 className="font-serif-display text-2xl font-bold text-[#4a044e]">Settings</h2>
          <div className="w-8"></div> {/* Spacer */}
        </div>

        <div className="overflow-y-auto px-6 pb-20 no-scrollbar text-[#4a044e] flex-1">
          
          {/* Curation Section */}
          <div className="mb-12 mt-6">
             <h3 className="font-serif-display text-2xl font-bold text-[#4a044e] mb-2">Curate Feed</h3>
             <p className="text-xs text-[#831843]/60 mb-6">Tap to toggle interest vectors</p>
             
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
                            ? 'bg-[#831843] text-white border-[#831843] transform scale-105 shadow-lg' 
                            : 'bg-white border-rose-100 text-[#831843]/60 hover:bg-rose-50'}
                     `}
                   >
                     <span className="text-lg">{cat.icon}</span>
                     <span className={`font-bold text-sm ${isActive ? 'text-white' : 'text-[#831843]/80'}`}>{cat.label}</span>
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
