import React from 'react';

export const DiscountBanner: React.FC = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-orange-500 to-red-500 rounded-lg shadow-lg mb-12">
      <div className="animate-slide flex items-center justify-between px-8 py-6">
        <div className="text-white">
          <h2 className="text-2xl font-bold mb-2">Special Offers!</h2>
          <p className="text-lg">Get up to 30% off on selected restaurants</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="bg-white/20 backdrop-blur-sm rounded-full px-6 py-3">
            <span className="text-white text-xl font-bold">30% OFF</span>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-full px-6 py-3">
            <span className="text-white text-xl font-bold">20% OFF</span>
          </div>
        </div>
      </div>
    </div>
  );
}; 