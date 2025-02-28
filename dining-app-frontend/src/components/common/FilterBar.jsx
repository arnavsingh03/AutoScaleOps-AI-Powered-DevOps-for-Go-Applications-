import React from 'react';

const FilterBar = ({ filters, onChange, options }) => {
    return (
        <div className="flex flex-wrap gap-4">
            {options.map(({ key, label, choices }) => (
                <div key={key} className="min-w-[150px]">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        {label}
                    </label>
                    <select
                        value={filters[key] || ''}
                        onChange={(e) => onChange(key, e.target.value)}
                        className="input-field"
                    >
                        <option value="">All</option>
                        {choices.map((choice) => (
                            <option key={choice.value} value={choice.value}>
                                {choice.label}
                            </option>
                        ))}
                    </select>
                </div>
            ))}
        </div>
    );
};

export default FilterBar;