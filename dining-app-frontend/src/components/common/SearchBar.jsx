import React from 'react';
import { SearchIcon } from '@heroicons/react/outline';

const SearchBar = ({ 
    value, 
    onChange, 
    placeholder = "Search...",
    className = "" 
}) => {
    return (
        <div className={`relative ${className}`}>
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="input-field pl-10"
            />
        </div>
    );
};

export default SearchBar;