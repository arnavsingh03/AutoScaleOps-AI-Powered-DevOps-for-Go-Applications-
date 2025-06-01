import React from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ searchQuery, setSearchQuery }) => {
  return (
    <div className="relative w-full max-w-xl">
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search restaurants..."
        className="w-full px-4 py-3 pl-12 text-gray-700 bg-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
      />
      <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
    </div>
  );
};