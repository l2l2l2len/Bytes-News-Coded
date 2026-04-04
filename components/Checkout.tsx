import React from 'react';

interface CheckoutProps {
  onBack: () => void;
}

const Checkout: React.FC<CheckoutProps> = ({ onBack }) => {
  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <button 
        onClick={onBack}
        className="mb-4 text-rose-600 font-bold flex items-center gap-2"
      >
        ← Back
      </button>
      <h2 className="text-2xl font-serif-display font-bold text-[#4a044e] mb-4">Checkout</h2>
      <p className="text-sm text-gray-600">This feature is coming soon.</p>
    </div>
  );
};

export default Checkout;
