import React from 'react';
import { Paper } from '../types';

interface ProductDetailProps {
  product: Paper;
  onBack: () => void;
  onToggleSave: (paper: Paper) => void;
  isSaved: boolean;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product, onBack, onToggleSave, isSaved }) => {
  return (
    <div className="animate-fade-in-up pb-24">
      <button 
        onClick={onBack} 
        className="mb-8 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#B28E6A]"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        Back to Feed
      </button>

      <div className="w-full h-72 rounded-[2.5rem] overflow-hidden mb-10 shadow-xl border border-white/40">
        <img src={product.fileUrl} className="w-full h-full object-cover" alt={product.title} />
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#B28E6A] block">{product.category}</span>
          <h1 className="text-3xl font-display font-bold text-[#232323] leading-tight">{product.title}</h1>
          <div className="flex items-center gap-3 py-2">
            <div className="w-9 h-9 rounded-full bg-[#D9B77E]/10 flex items-center justify-center font-bold text-xs text-[#D9B77E] border border-[#D9B77E]/20">
              {product.authors[0][0]}
            </div>
            <div>
              <p className="text-xs font-bold text-[#232323]">{product.authors[0]}</p>
              <p className="text-[10px] text-[#232323]/40 uppercase tracking-widest">{product.publicationDate} • {product.readTime}</p>
            </div>
          </div>
        </div>

        <div className="prose prose-stone">
          <p className="text-lg font-medium text-[#232323] leading-snug mb-8">{product.abstract}</p>
          <div className="h-px bg-[#F0E0D2] w-full mb-8" />
          <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#B28E6A] mb-4">Why it matters</h4>
          <p className="text-sm text-[#232323]/70 leading-relaxed font-normal">{product.whyMatters}</p>
        </div>

        <button 
          onClick={() => onToggleSave(product)}
          className={`w-full py-5 rounded-[2rem] mt-12 font-bold text-xs uppercase tracking-widest transition-all shadow-lg ${
            isSaved 
              ? 'bg-[#232323] text-white' 
              : 'bg-white text-[#232323] border border-[#F0E0D2]'
          }`}
        >
          {isSaved ? 'Saved to library' : 'Save for later'}
        </button>
      </div>
    </div>
  );
};

export default ProductDetail;