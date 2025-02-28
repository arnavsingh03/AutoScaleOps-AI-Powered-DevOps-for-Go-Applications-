import React from 'react';
import { format } from 'date-fns';

const BookingList = ({ bookings, onCancelBooking }) => {
    const getStatusColor = (status) => {
        switch (status) {
            case 'confirmed':
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="space-y-4">
            {bookings.map((booking) => (
                <div key={booking.id} className="card">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-lg font-semibold">
                                {booking.restaurant_name}
                            </h3>
                            <p className="text-gray-600">
                                Table {booking.table_number}
                            </p>
                            <p className="text-gray-600">
                                {format(new Date(booking.booking_date), 'PPP')}
                            </p>
                            <p className="text-gray-600">
                                {booking.start_time} - {booking.end_time}
                            </p>
                            <p className="text-gray-600">
                                Guests: {booking.number_of_guests}
                            </p>
                        </div>
                        <div className="text-right">
                            <span
                                className={`inline-block px-2 py-1 rounded-full text-sm ${getStatusColor(
                                    booking.status
                                )}`}
                            >
                                {booking.status}
                            </span>
                            {booking.status !== 'cancelled' && (
                                <button
                                    onClick={() => onCancelBooking(booking.id)}
                                    className="block mt-2 text-red-600 hover:text-red-800"
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default BookingList;