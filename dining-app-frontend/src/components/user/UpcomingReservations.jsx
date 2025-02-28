import React from 'react';
import { format } from 'date-fns';

const UpcomingReservations = ({ bookings, onCancelBooking, loading }) => {
    if (loading) {
        return <div>Loading...</div>;
    }

    if (bookings.length === 0) {
        return (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
                <p className="text-gray-600">
                    You don't have any upcoming reservations.
                </p>
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
                            {booking.special_requests && (
                                <p className="text-gray-600 mt-2">
                                    Special Requests: {booking.special_requests}
                                </p>
                            )}
                        </div>
                        <div className="text-right">
                            <span
                                className={`inline-block px-2 py-1 rounded-full text-sm
                                    ${booking.status === 'confirmed'
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-yellow-100 text-yellow-800'
                                    }`}
                            >
                                {booking.status}
                            </span>
                            <button
                                onClick={() => onCancelBooking(booking.id)}
                                className="block mt-2 text-red-600 hover:text-red-800"
                            >
                                Cancel Reservation
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default UpcomingReservations;