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
    { label: 'US News', emoji: '🇺🇸' },
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
      <div 
        className={`fixed inset-0 bg-black/50 backdrop-blur-md z-[100] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
        onClick={onClose} 
      />
      <div className={`fixed left-0 top-0 h-full w-full sm:w-[360px] bg-white z-[110] transform transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col shadow-2xl ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-8 flex-1 overflow-y-auto no-scrollbar">
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 border border-gray-100">
                <span className="text-2xl font-black">@</span>
              </div>
              <div>
                <p className="text-[11px] text-gray-400 font-black uppercase tracking-widest">Aaron Reader</p>
                <p className="text-sm font-black text-black">Bytes Member</p>
              </div>
            </div>
            <button onClick={onClose} className="p-3 bg-gray-50 rounded-full text-gray-400 hover:text-black hover:bg-gray-100 transition-all">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <div className="space-y-4 mb-12">
            <div className="relative group">
              <input 
                type="text"
                placeholder="search everything..."
                className="w-full h-16 rounded-2xl border border-gray-100 bg-gray-50/50 pl-14 pr-6 text-base outline-none focus:border-black focus:bg-white transition-all font-medium"
                value={searchTerm}
                onChange={handleSearchChange}
              />
              <svg className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
            
            <button className="w-full h-16 rounded-2xl bg-gradient-to-r from-pink-50 via-white to-blue-50 border border-gray-100 text-[13px] font-black uppercase tracking-widest flex items-center justify-center hover:shadow-lg transition-all active:scale-95">
              upgrade to Premium.
            </button>
            <button className="w-full h-16 rounded-2xl border border-gray-100 text-[13px] font-black uppercase tracking-widest flex items-center justify-center hover:bg-black hover:text-white transition-all active:scale-95">
              publish on Bytes.
            </button>
          </div>

          <h3 className="text-3xl font-display font-black mb-3 tracking-tighter">curate feed.</h3>
          <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] mb-8">Tap a category to follow</p>

          <div className="flex flex-wrap gap-2 mb-12">
            {categories.map((cat) => (
              <button 
                key={cat.label}
                onClick={() => onTopicToggle(cat.label)}
                className={`h-11 rounded-full px-5 border flex items-center gap-3 transition-all active:scale-95 ${
                  selectedTopics.includes(cat.label) 
                    ? 'border-black bg-black text-white' 
                    : 'border-gray-200 bg-white text-gray-600 hover:border-gray-400'
                }`}
              >
                <span className="text-sm font-bold">{cat.emoji} {cat.label}</span>
                {selectedTopics.includes(cat.label) && (
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                )}
              </button>
            ))}
          </div>

          <div className="space-y-4 pt-10 border-t border-gray-100">
             <div className="flex items-center justify-between p-2">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                  <span className="text-sm font-bold">Notifications</span>
                </div>
                <button 
                  onClick={() => setNotifications(!notifications)}
                  className={`w-12 h-7 rounded-full transition-all relative ${notifications ? 'bg-black' : 'bg-gray-200'}`}
                >
                  <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all ${notifications ? 'left-6' : 'left-1'}`} />
                </button>
             </div>
             <button className="w-full flex items-center justify-between p-2 hover:bg-gray-50 rounded-xl transition-all">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  <span className="text-sm font-bold">Settings</span>
                </div>
                <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
             </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CurateDrawer;