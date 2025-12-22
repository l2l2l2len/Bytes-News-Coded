
import React, { useState } from 'react';

interface CurateDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onTopicToggle: (topic: string) => void;
  selectedTopics: string[];
  onSearch: (term: string) => void;
}

const CurateDrawer: React.FC<CurateDrawerProps> = ({ isOpen, onClose, onTopicToggle, selectedTopics }) => {
  const [inputValue, setInputValue] = useState('');

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

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const val = inputValue.trim();
    if (val) {
        // If it's already selected, don't toggle it off, just clear input. 
        // If it's not selected, toggle it on.
        if (!selectedTopics.includes(val)) {
            onTopicToggle(val);
        }
        setInputValue('');
    }
  };

  // Identify custom topics (those in selectedTopics but NOT in the predefined categories)
  const customTopics = selectedTopics.filter(t => !categories.some(c => c.label === t));

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
             
             {/* Input for Custom Topics */}
             <form onSubmit={handleAdd} className="mb-8 relative">
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Add specific interest (e.g. SpaceX)..."
                    className="w-full bg-white border border-rose-200 rounded-2xl px-5 py-4 pr-12 text-sm font-medium text-[#4a044e] placeholder:text-[#831843]/40 focus:outline-none focus:border-[#831843] focus:ring-1 focus:ring-[#831843] transition-all shadow-sm"
                />
                <button 
                    type="submit"
                    disabled={!inputValue.trim()}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-[#831843] disabled:opacity-30 hover:bg-rose-50 rounded-xl transition-colors"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                </button>
             </form>

             {/* Custom Topics List (if any) */}
             {customTopics.length > 0 && (
                <div className="mb-6">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#831843]/40 mb-3">Your Additions</p>
                    <div className="flex flex-wrap gap-2">
                        {customTopics.map(topic => (
                            <button 
                                key={topic}
                                onClick={() => onTopicToggle(topic)}
                                className="pl-4 pr-3 py-2 rounded-full flex items-center gap-2 border bg-[#831843] text-white border-[#831843] shadow-md hover:bg-[#be185d] transition-all"
                            >
                                <span className="font-bold text-xs">{topic}</span>
                                <svg className="w-3.5 h-3.5 opacity-70 hover:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        ))}
                    </div>
                </div>
             )}

             <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#831843]/40 mb-3">Essentials</p>
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
                            ? 'bg-white border-rose-300 text-[#4a044e] shadow-md ring-1 ring-rose-100' 
                            : 'bg-white/50 border-transparent text-[#831843]/50 hover:bg-rose-50'}
                     `}
                   >
                     <span className="text-lg grayscale opacity-80">{cat.icon}</span>
                     <span className={`font-bold text-sm ${isActive ? 'text-[#4a044e]' : 'text-[#831843]/60'}`}>{cat.label}</span>
                     {isActive && <div className="w-1.5 h-1.5 rounded-full bg-[#831843] ml-1" />}
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
