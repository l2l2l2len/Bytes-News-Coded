import React from 'react';

const Footer: React.FC<any> = () => {
  return (
    <footer className="mt-12 pb-16 px-6 text-center">
      <div className="w-10 h-10 bg-[#B28E6A]/20 rounded-full mx-auto mb-4 flex items-center justify-center">
        <div className="w-4 h-4 bg-[#B28E6A] rounded-full" />
      </div>
      <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#B28E6A] mb-2">The Philanthropy Times</p>
      <p className="text-[9px] text-[#8C8881] uppercase tracking-widest leading-loose">
        Powered by Gregorious Creative Studios<br/>
        © 2025 All Rights Reserved
      </p>
    </footer>
  );
};

export default Footer;