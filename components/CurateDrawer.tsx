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
  const [notifications, setNotifications] = useState(true);

  const categories = [
    { label: 'US News', emoji: 'us' },
    { label: 'World', emoji: '🌍' },
    { label: 'Important Updates', emoji: '🚨' },
    { label: 'Interesting Digs', emoji: '🧠' },
    { label: 'Business', emoji: '💼' },
    { label: 'AI & Tech', emoji: '🤖' },
    { label: 'Entertainment', emoji: '🎙️' },
    { label: 'Science', emoji: '🧪' },
    { label: 'Finance', emoji: '📈' },
    { label: 'Culture', emoji: '🎭' },
  ];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    onSearch(term);
  };

  return (
    <>
      {/* Light Overlay */}
      <div 
        className={`fixed inset-0 z-[100] bg-indigo-950/20 backdrop-blur-sm transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
        onClick={onClose} 
      />

      {/* Drawer - Glassy */}
      <div 
        className={`
          fixed right-0 top-0 h-full w-full sm:w-[420px] z-[110] 
          bg-white/60 backdrop-blur-3xl border-l border-white/50
          flex flex-col shadow-2xl
          transform transition-transform duration-500 cubic-bezier(0.16, 1, 0.3, 1)
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        <div className="p-8 flex-1 overflow-y-auto no-scrollbar flex flex-col">
          
          {/* Header: User Profile & Close */}
          <div className="flex items-center justify-between mb-10">
             <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 p-[2px]">
                   <div className="w-full h-full rounded-full bg-white/90 flex items-center justify-center">
                     <span className="text-xl font-bold text-indigo-950">B</span>
                   </div>
                </div>
                <div>
                   <h4 className="text-[10px] font-bold uppercase tracking-widest text-indigo-500 mb-1">Aaron Reader</h4>
                   <h3 className="font-display text-xl font-bold text-indigo-950 leading-none">Bytes Member</h3>
                </div>
             </div>
             
             <button 
               onClick={onClose}
               className="w-10 h-10 rounded-full bg-white/50 hover:bg-white border border-white/50 flex items-center justify-center text-indigo-900/50 hover:text-indigo-950 transition-colors"
             >
               <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
             </button>
          </div>

          {/* Search */}
          <div className="relative mb-8">
             <div className="absolute left-5 top-1/2 -translate-y-1/2 text-indigo-900/40">
               <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
             </div>
             <input 
               type="text" 
               placeholder="Search everything..." 
               value={searchTerm}
               onChange={handleSearchChange}
               className="w-full h-14 pl-12 pr-4 rounded-2xl bg-white/50 border border-white/60 text-indigo-950 font-medium placeholder:text-indigo-900/40 focus:outline-none focus:border-indigo-400 focus:bg-white/80 transition-all shadow-sm"
             />
          </div>

          {/* Action Buttons */}
          <button className="w-full py-5 mb-4 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-xs font-bold uppercase tracking-widest text-white hover:shadow-lg hover:scale-[1.02] transition-all duration-300">
             Upgrade to Premium.
          </button>
          <button className="w-full py-5 mb-12 rounded-2xl bg-white/40 border border-white/60 text-xs font-bold uppercase tracking-widest text-indigo-900/70 hover:bg-white/60 hover:text-indigo-950 transition-all">
             Publish on Bytes.
          </button>

          {/* Curate Feed Header */}
          <div className="mb-6">
             <h2 className="font-display text-3xl font-bold text-indigo-950 tracking-tight mb-2">Curate Feed.</h2>
             <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-900/40">Tap a category to follow</p>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-3 mb-auto">
             {categories.map((cat) => {
               const isActive = selectedTopics.includes(cat.label);
               return (
                 <button
                   key={cat.label}
                   onClick={() => onTopicToggle(cat.label)}
                   className={`
                     h-11 px-5 rounded-full text-sm font-bold flex items-center gap-2 transition-all duration-300 border
                     ${isActive 
                       ? 'bg-indigo-950 text-white border-indigo-950 shadow-md' 
                       : 'bg-white/40 text-indigo-900/60 border-white/50 hover:bg-white/60 hover:border-white/80'}
                   `}
                 >
                   <span>{cat.emoji}</span>
                   <span>{cat.label}</span>
                   {isActive && (
                     <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                   )}
                 </button>
               );
             })}
          </div>

          {/* Footer Notifications */}
          <div className="pt-8 mt-8 border-t border-indigo-100/50 flex items-center justify-between">
             <div className="flex items-center gap-3 text-indigo-900/50">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                <span className="font-bold text-indigo-950">Notifications</span>
             </div>
             
             {/* Toggle Switch */}
             <button 
               onClick={() => setNotifications(!notifications)}
               className={`w-14 h-8 rounded-full transition-colors relative ${notifications ? 'bg-indigo-200' : 'bg-white/50 border border-white/60'}`}
             >
                <div className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow-md transition-transform duration-200 ${notifications ? 'translate-x-7' : 'translate-x-1'}`}></div>
             </button>
          </div>

        </div>
      </div>
    </>
  );
};

export default CurateDrawer;