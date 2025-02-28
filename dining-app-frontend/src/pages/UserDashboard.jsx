import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Tab } from '@headlessui/react';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';
import { bookingAPI } from '../services/api';
import ProfileSection from '../components/user/ProfileSection';
import BookingHistory from '../components/user/BookingHistory';
import UpcomingReservations from '../components/user/UpcomingReservations';

const UserDashboard = () => {
    const { user } = useSelector((state) => state.auth);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

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

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold">Welcome, {user?.name}!</h1>
                <p className="text-gray-600">Manage your bookings and profile</p>
            </div>

            <Tab.Group>
                <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1 mb-8">
                    <Tab
                        className={({ selected }) =>
                            `w-full rounded-lg py-2.5 text-sm font-medium leading-5
                            ${selected
                                ? 'bg-white text-blue-700 shadow'
                                : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
                            }`
                        }
                    >
                        Upcoming Reservations
                    </Tab>
                    <Tab
                        className={({ selected }) =>
                            `w-full rounded-lg py-2.5 text-sm font-medium leading-5
                            ${selected
                                ? 'bg-white text-blue-700 shadow'
                                : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
                            }`
                        }
                    >
                        Booking History
                    </Tab>
                    <Tab
                        className={({ selected }) =>
                            `w-full rounded-lg py-2.5 text-sm font-medium leading-5
                            ${selected
                                ? 'bg-white text-blue-700 shadow'
                                : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
                            }`
                        }
                    >
                        Profile
                    </Tab>
                </Tab.List>

                <Tab.Panels>
                    <Tab.Panel>
                        <UpcomingReservations
                            bookings={bookings.filter(b => 
                                new Date(b.booking_date) >= new Date() && 
                                b.status !== 'cancelled'
                            )}
                            onCancelBooking={handleCancelBooking}
                            loading={loading}
                        />
                    </Tab.Panel>
                    <Tab.Panel>
                        <BookingHistory
                            bookings={bookings.filter(b => 
                                new Date(b.booking_date) < new Date() ||
                                b.status === 'cancelled'
                            )}
                            loading={loading}
                        />
                    </Tab.Panel>
                    <Tab.Panel>
                        <ProfileSection user={user} />
                    </Tab.Panel>
                </Tab.Panels>
            </Tab.Group>
        </div>
    );
};

export default UserDashboard;