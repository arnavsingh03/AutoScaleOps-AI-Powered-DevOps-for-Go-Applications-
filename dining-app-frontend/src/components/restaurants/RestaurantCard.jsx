import React from 'react';
import { Link } from 'react-router-dom';

const RestaurantCard = ({ restaurant }) => {
    return (
        <div className="card hover:shadow-lg transition-shadow duration-300">
            <div className="relative">
                <img
                    src={restaurant.image || 'https://via.placeholder.com/400x200'}
                    alt={restaurant.name}
                    className="w-full h-48 object-cover rounded-t-lg"
                />
                <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-full text-sm">
                    {restaurant.cuisine_type}
                </div>
            </div>
            <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">{restaurant.name}</h3>
                <p className="text-gray-600 mb-4 line-clamp-2">
                    {restaurant.description}
                </p>
                <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-500">
                        {restaurant.opening_time} - {restaurant.closing_time}
                    </div>
                    <Link
                        to={`/restaurant/${restaurant.id}`}
                        className="btn-primary"
                    >
                        View Details
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default RestaurantCard;