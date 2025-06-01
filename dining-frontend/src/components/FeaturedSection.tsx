import React from 'react';
import { RestaurantCard } from './RestaurantCard';
import { Restaurant } from '../types/restaurant';

interface FeaturedSectionProps {
  restaurants: Restaurant[];
}

export const FeaturedSection: React.FC<FeaturedSectionProps> = ({ restaurants }) => {
  const featuredRestaurants = restaurants.filter(restaurant => restaurant.featured);

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Restaurants</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {featuredRestaurants.map(restaurant => (
          <RestaurantCard key={restaurant.id} restaurant={restaurant} />
        ))}
      </div>
    </section>
  );
};