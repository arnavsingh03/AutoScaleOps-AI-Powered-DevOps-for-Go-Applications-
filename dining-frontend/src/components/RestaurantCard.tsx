import React from 'react';
import { Star, MapPin, DollarSign } from 'lucide-react';
import { Restaurant } from '../types/restaurant';
import { Link } from 'react-router-dom';

interface RestaurantCardProps {
  restaurant: Restaurant;
}

export const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant }) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden transition-transform hover:scale-[1.02]">
      <Link to={`/restaurant/${restaurant.id}`}>
        <div className="relative h-48">
          <img
            src={restaurant.imageUrl}
            alt={restaurant.name}
            className="w-full h-full object-cover"
          />
          {restaurant.featured && (
            <div className="absolute top-4 right-4 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">
              Featured
            </div>
          )}
        </div>
        <div className="p-6">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-semibold text-gray-900">{restaurant.name}</h3>
            <div className="flex items-center">
              <Star className="h-5 w-5 text-yellow-400 fill-current" />
              <span className="ml-1 text-gray-700">{restaurant.rating}</span>
            </div>
          </div>
          <p className="text-gray-600 mb-4">{restaurant.description}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center text-gray-500">
              <MapPin className="h-4 w-4 mr-1" />
              <span className="text-sm">{restaurant.location}</span>
            </div>
            <div className="flex items-center">
              <span className="text-orange-500 font-medium">
                {'$'.repeat(restaurant.priceRange.length)}
              </span>
            </div>
          </div>
          <button className="mt-4 w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition-colors">
            Book Now
          </button>
        </div>
      </Link>
    </div>
  );
};