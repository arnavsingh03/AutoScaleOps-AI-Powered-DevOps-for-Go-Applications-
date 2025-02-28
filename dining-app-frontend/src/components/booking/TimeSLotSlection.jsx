import React, { useState } from 'react';
import { format, addDays, isAfter, isBefore, parseISO } from 'date-fns';

const TimeSlotSelection = ({ restaurant, table, onSelect, onBack }) => {
    const [selectedDate, setSelectedDate] = useState(null);
    
    // Generate next 14 days
    const availableDates = Array.from({ length: 14 }, (_, i) => 
        addDays(new Date(), i)
    );

    // Generate time slots between opening and closing time
    const generateTimeSlots = () => {
        const slots = [];
        const openTime = parseISO(`2000-01-01T${restaurant.opening_time}`);
        const closeTime = parseISO(`2000-01-01T${restaurant.closing_time}`);
        
        let currentTime = openTime;
        while (isBefore(currentTime, closeTime)) {
            slots.push(format(currentTime, 'HH:mm'));
            currentTime = addDays(currentTime, 30); // 30-minute intervals
        }
        
        return slots;
    };

    const timeSlots = generateTimeSlots();

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Select Date & Time</h2>

            {/* Date Selection */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Date
                </label>
                <div className="grid grid-cols-4 gap-2">
                    {availableDates.map((date) => (
                        <button
                            key={date.toISOString()}
                            onClick={() => setSelectedDate(date)}
                            className={`p-2 text-center rounded-lg border
                                ${selectedDate?.toDateString() === date.toDateString()
                                    ? 'border-blue-500 bg-blue-50'
                                    : 'border-gray-300 hover:border-blue-500'
                                }`}
                        >
                            <div className="text-sm font-medium">
                                {format(date, 'EEE')}
                            </div>
                            <div className="text-lg">
                                {format(date, 'd')}
                            </div>
                            <div className="text-sm text-gray-500">
                                {format(date, 'MMM')}
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Time Selection */}
            {selectedDate && (
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select Time
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                        {timeSlots.map((time) => (
                            <button
                                key={time}
                                onClick={() => onSelect(selectedDate, time)}
                                className="p-2 text-center rounded-lg border border-gray-300 
                                         hover:border-blue-500 hover:bg-blue-50"
                            >
                                {time}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between pt-4">
                <button
                    onClick={onBack}
                    className="btn-secondary"
                >
                    Back
                </button>
            </div>
        </div>
    );
};

export default TimeSlotSelection;