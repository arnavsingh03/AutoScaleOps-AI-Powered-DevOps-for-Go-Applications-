import React from 'react';

const TableSelection = ({ restaurant, onSelect, selectedGuests, onGuestsChange }) => {
    return (
        <div>
            <h2 className="text-2xl font-semibold mb-6">Select a Table</h2>
            
            {/* Number of Guests Selection */}
            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Guests
                </label>
                <select
                    value={selectedGuests}
                    onChange={(e) => onGuestsChange(parseInt(e.target.value))}
                    className="input-field"
                >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                        <option key={num} value={num}>
                            {num} {num === 1 ? 'Guest' : 'Guests'}
                        </option>
                    ))}
                </select>
            </div>

            {/* Table Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {restaurant.tables
                    .filter((table) => table.capacity >= selectedGuests)
                    .map((table) => (
                        <button
                            key={table.id}
                            onClick={() => onSelect(table)}
                            className={`p-4 rounded-lg border-2 text-left
                                ${
                                    table.is_available
                                        ? 'border-green-500 hover:bg-green-50'
                                        : 'border-red-300 bg-red-50 cursor-not-allowed'
                                }`}
                            disabled={!table.is_available}
                        >
                            <h3 className="font-medium">Table {table.table_number}</h3>
                            <p className="text-sm text-gray-600">
                                Capacity: {table.capacity}
                            </p>
                            {!table.is_available && (
                                <p className="text-sm text-red-600 mt-1">
                                    Not available
                                </p>
                            )}
                        </button>
                    ))}
            </div>
        </div>
    );
};

export default TableSelection;