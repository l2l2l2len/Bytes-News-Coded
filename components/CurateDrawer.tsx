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
      {/* Dark Overlay */}
      <div 
        className={`fixed inset-0 z-[100] bg-black/40 backdrop-blur-[2px] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
        onClick={onClose} 
      />

      {/* Drawer */}
      <div 
        className={`
          fixed right-0 top-0 h-full w-full sm:w-[420px] z-[110] 
          bg-white flex flex-col shadow-2xl
          transform transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)]
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        <div className="p-8 flex-1 overflow-y-auto no-scrollbar flex flex-col">
          
          {/* Header: User Profile & Close */}
          <div className="flex items-center justify-between mb-8">
             <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                  <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                </div>
                <div>
                   <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">Aaron Reader</h4>
                   <h3 className="font-display text-lg font-black text-slate-900 leading-none">Bytes Member</h3>
                </div>
             </div>
             
             <button 
               onClick={onClose}
               className="w-10 h-10 rounded-full bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-400 transition-colors"
             >
               <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
             </button>
          </div>

          {/* Search */}
          <div className="relative mb-6">
             <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400">
               <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
             </div>
             <input 
               type="text" 
               placeholder="search everything..." 
               value={searchTerm}
               onChange={handleSearchChange}
               className="w-full h-14 pl-12 pr-4 rounded-2xl bg-white border border-slate-100 shadow-sm text-slate-700 font-medium placeholder:text-slate-300 focus:outline-none focus:border-slate-300 focus:ring-0 transition-all"
             />
          </div>

          {/* Action Buttons */}
          <button className="w-full py-5 mb-4 rounded-2xl bg-gradient-to-r from-rose-50 to-indigo-50 text-xs font-bold uppercase tracking-widest text-slate-800 hover:scale-[1.02] transition-transform">
             Upgrade to Premium.
          </button>
          <button className="w-full py-5 mb-12 rounded-2xl bg-white border border-slate-100 shadow-sm text-xs font-bold uppercase tracking-widest text-slate-800 hover:border-slate-300 transition-colors">
             Publish on Bytes.
          </button>

          {/* Curate Feed Header */}
          <div className="mb-6">
             <h2 className="font-display text-3xl font-black text-slate-900 tracking-tight mb-2">curate feed.</h2>
             <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Tap a category to follow</p>
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
                     h-11 px-5 rounded-full text-sm font-bold flex items-center gap-2 transition-all duration-200 border
                     ${isActive 
                       ? 'bg-slate-900 text-white border-slate-900 shadow-md' 
                       : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'}
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
          <div className="pt-8 mt-8 border-t border-slate-100 flex items-center justify-between">
             <div className="flex items-center gap-3 text-slate-500">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                <span className="font-bold text-slate-700">Notifications</span>
             </div>
             
             {/* Toggle Switch */}
             <button 
               onClick={() => setNotifications(!notifications)}
               className={`w-14 h-8 rounded-full transition-colors relative ${notifications ? 'bg-slate-200' : 'bg-slate-100'}`}
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