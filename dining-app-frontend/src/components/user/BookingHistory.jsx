import React from 'react';
import { format } from 'date-fns';

const BookingHistory = ({ bookings, loading }) => {
    const getStatusColor = (status) => {
        switch (status) {
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (bookings.length === 0) {
        return (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
                <p className="text-gray-600">No booking history found.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {bookings.map((booking) => (
                <div
                    key={booking.id}
                    className="bg-white rounded-lg shadow p-6"
                >
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
                        <div>
                            <span
                                className={`inline-block px-2 py-1 rounded-full text-sm ${getStatusColor(
                                    booking.status
                                )}`}
                            >
                                {booking.status}
                            </span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default BookingHistory;