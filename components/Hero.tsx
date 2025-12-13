/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';

const Hero: React.FC = () => {
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const element = document.getElementById(targetId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="bg-[#fdfbf7] text-[#1c1917] pt-12 pb-12 px-6 border-b-4 border-[#1c1917]">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Main Lead Story */}
        <div className="lg:col-span-8 border-r border-gray-300 pr-0 lg:pr-12">
            <div className="flex justify-between items-center border-t-2 border-[#1c1917] pt-1 mb-2">
                <span className="font-sans-accent text-[10px] font-bold uppercase tracking-widest text-[#0f766e]">Special Report</span>
                <span className="font-serif text-xs italic text-gray-500">Global Development Summit</span>
            </div>
            
            <h1 className="font-headline text-5xl md:text-6xl lg:text-7xl font-bold leading-none mb-6 text-[#1c1917] tracking-tight">
                The Era of <br/> Trust-Based Giving.
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                <div>
                    <p className="font-serif text-lg leading-relaxed first-letter:text-5xl first-letter:font-bold first-letter:float-left first-letter:mr-3 first-letter:mt-[-10px] text-[#44403c]">
                        The days of heavy restrictions and bureaucratic hurdles are ending. Major foundations are shifting to multi-year, unrestricted grants, empowering local leaders to solve crises on their own terms.
                    </p>
                </div>
                <div>
                     <p className="font-serif text-sm leading-relaxed text-gray-700">
                        "We must move from a model of control to one of collaboration," says the Ford Foundation President. "Those closest to the pain are closest to the solution."
                     </p>
                     <a href="#products" onClick={(e) => handleNavClick(e, 'products')} className="inline-block mt-4 font-sans-accent text-xs font-bold uppercase tracking-widest border-b border-[#1c1917] pb-1 hover:text-[#0f766e] text-[#1c1917]">
                        Read The Analysis →
                     </a>
                </div>
            </div>

            <div className="w-full h-[400px] overflow-hidden relative border border-[#1c1917] bg-gray-100">
                 <img 
                    src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=1200" 
                    alt="Community volunteers working together" 
                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000"
                 />
                 <div className="absolute bottom-0 left-0 bg-[#fdfbf7] border-t border-r border-[#1c1917] px-4 py-2 text-[10px] font-sans-accent uppercase tracking-widest text-[#1c1917]">
                    Fig 1. Community-led relief efforts in Southeast Asia.
                 </div>
            </div>
        </div>

        {/* Side Column / Briefs */}
        <div className="lg:col-span-4 flex flex-col gap-8">
            <div className="border-t-2 border-[#1c1917] pt-1">
                 <h3 className="font-headline text-2xl font-bold mb-4 text-[#1c1917]">Impact Briefs</h3>
                 <ul className="space-y-6">
                    <li className="pb-6 border-b border-gray-300">
                        <span className="block font-sans-accent text-[10px] font-bold text-[#0f766e] mb-1">HEALTH</span>
                        <h4 className="font-serif text-lg font-bold leading-tight mb-2 hover:underline cursor-pointer text-[#44403c]">Malaria vaccine rollout reaches 10 million children.</h4>
                        <p className="font-serif text-xs text-gray-600">A historic milestone in public health.</p>
                    </li>
                    <li className="pb-6 border-b border-gray-300">
                        <span className="block font-sans-accent text-[10px] font-bold text-[#0f766e] mb-1">CLIMATE</span>
                        <h4 className="font-serif text-lg font-bold leading-tight mb-2 hover:underline cursor-pointer text-[#44403c]">Bezos Earth Fund pledges another $1B for restoration.</h4>
                        <p className="font-serif text-xs text-gray-600">Focus on African landscape recovery.</p>
                    </li>
                    <li className="pb-6">
                        <span className="block font-sans-accent text-[10px] font-bold text-[#0f766e] mb-1">YOUTH</span>
                        <h4 className="font-serif text-lg font-bold leading-tight mb-2 hover:underline cursor-pointer text-[#44403c]">Gen Z donors prioritize climate justice over traditional aid.</h4>
                    </li>
                 </ul>
            </div>

            <div className="bg-[#e7e5e4] p-6 border border-[#1c1917] text-center">
                <span className="font-masthead text-2xl block mb-2 text-[#1c1917]">The Philanthropy Times</span>
                <p className="font-serif text-xs italic mb-4 text-[#44403c]">Chronicling the good in the world.</p>
                <button className="w-full bg-[#1c1917] text-white font-sans-accent text-xs font-bold uppercase py-3 hover:bg-[#44403c]">
                    Subscribe Now
                </button>
            </div>
        </div>

      </div>
    </section>
  );
};

export default Hero;