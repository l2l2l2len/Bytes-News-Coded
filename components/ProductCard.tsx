import React from 'react';
import { Paper } from '../types';

interface ProductCardProps {
  product: Paper;
  onClick: (paper: Paper) => void;
  onToggleSave?: (paper: Paper) => void;
  isSaved?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onClick, onToggleSave, isSaved }) => {
  return (
    <div 
      className="soft-card p-4 rounded-[2rem] flex gap-5 cursor-pointer hover:scale-[1.01] active:scale-[0.98] transition-all duration-300 animate-fade-in-up mb-4"
      onClick={() => onClick(product)}
    >
      <div className="w-24 h-24 flex-shrink-0 rounded-2xl overflow-hidden bg-[#F0E0D2]">
        <img src={product.fileUrl} className="w-full h-full object-cover" alt={product.title} loading="lazy" />
      </div>
      
      <div className="flex flex-col justify-between flex-1 py-1">
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#B28E6A]">{product.category}</span>
            <span className="text-[9px] font-medium text-[#232323]/40">{product.readTime}</span>
          </div>
          <h3 className="font-display text-[15px] font-bold leading-[1.3] text-[#232323] line-clamp-2 mb-1">
            {product.title}
          </h3>
          <p className="text-[11px] text-[#232323]/60 line-clamp-2 leading-[1.4] font-normal">
            {product.abstractPreview}
          </p>
        </div>

        <div className="flex justify-end mt-1">
          <button 
            onClick={(e) => { e.stopPropagation(); onToggleSave?.(product); }}
            className={`transition-all ${isSaved ? 'text-[#D9B77E]' : 'text-[#232323]/20 hover:text-[#D9B77E]'}`}
          >
            <svg className="w-4 h-4" fill={isSaved ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;