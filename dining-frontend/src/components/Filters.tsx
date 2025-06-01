import React from 'react';
import { Cuisine, Location } from '../types/restaurant';

interface FiltersProps {
  selectedCuisine: string;
  setSelectedCuisine: (cuisine: string) => void;
  selectedLocation: string;
  setSelectedLocation: (location: string) => void;
}

export const Filters: React.FC<FiltersProps> = ({
  selectedCuisine,
  setSelectedCuisine,
  selectedLocation,
  setSelectedLocation,
}) => {
  const cuisines: Cuisine[] = ['All', 'Italian', 'Japanese', 'Indian', 'Mexican', 'American', 'French', 'Chinese', 'Thai'];
  const locations: Location[] = ['All', 'Downtown', 'Uptown', 'Midtown', 'West End', 'East Side', 'South Side', 'North Side'];

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <select
        value={selectedCuisine}
        onChange={(e) => setSelectedCuisine(e.target.value)}
        className="px-4 py-2 rounded-lg bg-white shadow-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
      >
        {cuisines.map((cuisine) => (
          <option key={cuisine} value={cuisine === 'All' ? '' : cuisine}>
            {cuisine} Cuisine
          </option>
        ))}
      </select>

      <select
        value={selectedLocation}
        onChange={(e) => setSelectedLocation(e.target.value)}
        className="px-4 py-2 rounded-lg bg-white shadow-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
      >
        {locations.map((location) => (
          <option key={location} value={location === 'All' ? '' : location}>
            {location}
          </option>
        ))}
      </select>
    </div>
  );
};