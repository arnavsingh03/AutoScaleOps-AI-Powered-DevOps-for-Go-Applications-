import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { bookingAPI } from '../services/api';
import BookingList from '../components/booking/BookingList';
import { toast } from 'react-hot-toast';

const Dashboard = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useSelector((state) => state.auth);

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const response = await bookingAPI.getUserBookings();
            setBookings(response.data);
        } catch (error) {
            toast.error('Failed to fetch bookings');
        } finally {
            setLoading(false);
        }
    };

    const handleCancelBooking = async (bookingId) => {
        try {
            await bookingAPI.updateStatus(bookingId, 'cancelled');
            toast.success('Booking cancelled successfully');
            fetchBookings();
        } catch (error) {
            toast.error('Failed to cancel booking');
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold">Welcome, {user?.name}!</h1>
                <p className="text-gray-600">Manage your bookings here</p>
            </div>

            <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Your Bookings</h2>
                {bookings.length > 0 ? (
                    <BookingList
                        bookings={bookings}
                        onCancelBooking={handleCancelBooking}
                    />
                ) : (
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                        <p className="text-gray-600">
                            You don't have any bookings yet.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;