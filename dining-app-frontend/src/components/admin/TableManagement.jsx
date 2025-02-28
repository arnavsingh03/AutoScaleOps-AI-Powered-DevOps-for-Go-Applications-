import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import { restaurantAPI } from '../../services/api';

const TableManagement = () => {
    const [selectedRestaurant, setSelectedRestaurant] = useState('');
    const [tables, setTables] = useState([]);
    const [isAddingTable, setIsAddingTable] = useState(false);
    const { list: restaurants } = useSelector((state) => state.restaurants);

    useEffect(() => {
        if (selectedRestaurant) {
            fetchTables(selectedRestaurant);
        }
    }, [selectedRestaurant]);

    const fetchTables = async (restaurantId) => {
        try {
            const response = await restaurantAPI.getTables(restaurantId);
            setTables(response.data);
        } catch (error) {
            toast.error('Failed to fetch tables');
        }
    };

    const handleAddTable = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const tableData = {
            table_number: formData.get('table_number'),
            capacity: parseInt(formData.get('capacity')),
            restaurant_id: selectedRestaurant,
        };

        try {
            await restaurantAPI.createTable(selectedRestaurant, tableData);
            toast.success('Table added successfully');
            fetchTables(selectedRestaurant);
            setIsAddingTable(false);
        } catch (error) {
            toast.error('Failed to add table');
        }
    };

    const handleUpdateAvailability = async (tableId, isAvailable) => {
        try {
            await restaurantAPI.updateTableAvailability(tableId, isAvailable);
            toast.success('Table availability updated');
            fetchTables(selectedRestaurant);
        } catch (error) {
            toast.error('Failed to update table availability');
        }
    };

    return (
        <div>
            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Restaurant
                </label>
                <select
                    value={selectedRestaurant}
                    onChange={(e) => setSelectedRestaurant(e.target.value)}
                    className="input-field"
                >
                    <option value="">Select a restaurant</option>
                    {restaurants.map((restaurant) => (
                        <option key={restaurant.id} value={restaurant.id}>
                            {restaurant.name}
                        </option>
                    ))}
                </select>
            </div>

            {selectedRestaurant && (
                <div className="mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-semibold">Tables</h3>
                        <button
                            onClick={() => setIsAddingTable(true)}
                            className="btn-primary"
                        >
                            Add Table
                        </button>
                    </div>

                    <div className="bg-white shadow rounded-lg overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Table Number
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Capacity
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {tables.map((table) => (
                                    <tr key={table.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {table.table_number}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {table.capacity}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span
                                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                    table.is_available
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-red-100 text-red-800'
                                                }`}
                                            >
                                                {table.is_available ? 'Available' : 'Occupied'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            <button
                                                onClick={() =>
                                                    handleUpdateAvailability(
                                                        table.id,
                                                        !table.is_available
                                                    )
                                                }
                                                className="text-blue-600 hover:text-blue-900"
                                            >
                                                Toggle Availability
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Add Table Modal */}
            {isAddingTable && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full">
                        <h3 className="text-xl font-semibold mb-4">Add New Table</h3>
                        <form onSubmit={handleAddTable} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Table Number
                                </label>
                                <input
                                    type="text"
                                    name="table_number"
                                    required
                                    className="input-field"
                                    placeholder="e.g., A1"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Capacity
                                </label>
                                <input
                                    type="number"
                                    name="capacity"
                                    required
                                    min="1"
                                    className="input-field"
                                    placeholder="Number of seats"
                                />
                            </div>
                            <div className="flex justify-end space-x-4">
                                <button
                                    type="button"
                                    onClick={() => setIsAddingTable(false)}
                                    className="btn-secondary"
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="btn-primary">
                                    Add Table
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TableManagement;