import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRestaurants } from '../store/slices/restaurantSlice';
import RestaurantList from '../components/restaurant/RestaurantList';
import SearchBar from '../components/common/SearchBar';
import FilterBar from '../components/common/FilterBar';
import { searchFilter, filterItems } from '../utils/search';

const Home = () => {
    const dispatch = useDispatch();
    const { list: restaurants, loading } = useSelector((state) => state.restaurants);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        cuisine_type: '',
        price_range: '',
    });

    useEffect(() => {
        dispatch(fetchRestaurants());
    }, [dispatch]);

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const filterOptions = [
        {
            key: 'cuisine_type',
            label: 'Cuisine',
            choices: [
                { value: 'italian', label: 'Italian' },
                { value: 'japanese', label: 'Japanese' },
                { value: 'indian', label: 'Indian' },
                { value: 'chinese', label: 'Chinese' },
                // Add more cuisine types
            ]
        },
        {
            key: 'price_range',
            label: 'Price Range',
            choices: [
                { value: 'low', label: '$ (Budget)' },
                { value: 'medium', label: '$$ (Moderate)' },
                { value: 'high', label: '$$$ (Expensive)' },
            ]
        }
    ];

    // Apply search and filters
    const filteredRestaurants = filterItems(
        searchFilter(restaurants, searchTerm, ['name', 'cuisine_type', 'address']),
        filters
    );

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-center mb-4">
                    Find Your Perfect Dining Spot
                </h1>
                <div className="max-w-3xl mx-auto space-y-4">
                    <SearchBar
                        value={searchTerm}
                        onChange={setSearchTerm}
                        placeholder="Search restaurants, cuisine, or location..."
                        className="mb-4"
                    />
                    <FilterBar
                        filters={filters}
                        onChange={handleFilterChange}
                        options={filterOptions}
                    />
                </div>
            </div>

            {filteredRestaurants.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">
                        No restaurants found matching your criteria
                    </p>
                </div>
            ) : (
                <RestaurantList
                    restaurants={filteredRestaurants}
                    loading={loading}
                />
            )}
        </div>
    );
};

export default Home;