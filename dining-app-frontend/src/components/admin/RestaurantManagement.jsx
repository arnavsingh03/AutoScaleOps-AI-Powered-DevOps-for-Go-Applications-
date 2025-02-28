import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-hot-toast';
import RestaurantForm from './RestaurantForm';

const RestaurantManagement = () => {
    const [isAddingRestaurant, setIsAddingRestaurant] = useState(false);
    const [editingRestaurant, setEditingRestaurant] = useState(null);
    const { list: restaurants, loading } = useSelector((state) => state.restaurants);
    const dispatch = useDispatch();
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        status: '',
        cuisine_type: '',
    });

    const filterOptions = [
        {
            key: 'status',
            label: 'Status',
            choices: [
                { value: 'active', label: 'Active' },
                { value: 'inactive', label: 'Inactive' },
            ]
        },
        {
            key: 'cuisine_type',
            label: 'Cuisine',
            choices: [
                { value: 'italian', label: 'Italian' },
                { value: 'japanese', label: 'Japanese' },
                // Add more cuisines
            ]
        }
    ];

    const handleAddRestaurant = async (data) => {
        try {
            // Add restaurant API call
            toast.success('Restaurant added successfully');
            setIsAddingRestaurant(false);
        } catch (error) {
            toast.error('Failed to add restaurant');
        }
    };

    const handleEditRestaurant = async (data) => {
        try {
            // Edit restaurant API call
            toast.success('Restaurant updated successfully');
            setEditingRestaurant(null);
        } catch (error) {
            toast.error('Failed to update restaurant');
        }
    };

    const handleDeleteRestaurant = async (id) => {
        if (window.confirm('Are you sure you want to delete this restaurant?')) {
            try {
                // Delete restaurant API call
                toast.success('Restaurant deleted successfully');
            } catch (error) {
                toast.error('Failed to delete restaurant');
            }
        }
    };

    return (
        <div>
            <div className="mb-6 space-y-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-semibold">Manage Restaurants</h2>
                    <button
                        onClick={() => setIsAddingRestaurant(true)}
                        className="btn-primary"
                    >
                        Add Restaurant
                    </button>
                </div>

                <div className="flex flex-col md:flex-row gap-4">
                    <SearchBar
                        value={searchTerm}
                        onChange={setSearchTerm}
                        placeholder="Search restaurants..."
                        className="md:w-1/3"
                    />
                    <FilterBar
                        filters={filters}
                        onChange={(key, value) => 
                            setFilters(prev => ({ ...prev, [key]: value }))
                        }
                        options={filterOptions}
                    />
                </div>
            </div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">Manage Restaurants</h2>
                <button
                    onClick={() => setIsAddingRestaurant(true)}
                    className="btn-primary"
                >
                    Add Restaurant
                </button>
            </div>

            {/* Restaurant List */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Cuisine
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Address
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Hours
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {restaurants.map((restaurant) => (
                            <tr key={restaurant.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {restaurant.name}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {restaurant.cuisine_type}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {restaurant.address}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {restaurant.opening_time} - {restaurant.closing_time}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                    <button
                                        onClick={() => setEditingRestaurant(restaurant)}
                                        className="text-blue-600 hover:text-blue-900 mr-4"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDeleteRestaurant(restaurant.id)}
                                        className="text-red-600 hover:text-red-900"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Add/Edit Restaurant Modal */}
            {(isAddingRestaurant || editingRestaurant) && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full">
                        <h3 className="text-xl font-semibold mb-4">
                            {editingRestaurant ? 'Edit Restaurant' : 'Add Restaurant'}
                        </h3>
                        <RestaurantForm
                            initialData={editingRestaurant}
                            onSubmit={editingRestaurant ? handleEditRestaurant : handleAddRestaurant}
                            onCancel={() => {
                                setIsAddingRestaurant(false);
                                setEditingRestaurant(null);
                            }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default RestaurantManagement;