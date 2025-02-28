import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';
import { bookingAPI } from '../../services/api';

const BookingManagement = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, pending, confirmed, cancelled
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        status: '',
        date_range: '',
    });

    const filterOptions = [
        {
            key: 'status',
            label: 'Status',
            choices: [
                { value: 'pending', label: 'Pending' },
                { value: 'confirmed', label: 'Confirmed' },
                { value: 'cancelled', label: 'Cancelled' },
            ]
        },
        {
            key: 'date_range',
            label: 'Date Range',
            choices: [
                { value: 'today', label: 'Today' },
                { value: 'tomorrow', label: 'Tomorrow' },
                { value: 'this_week', label: 'This Week' },
                { value: 'next_week', label: 'Next Week' },
            ]
        }
    ];
    const filteredBookings = filterItems(
        searchFilter(bookings, searchTerm, ['user_name', 'restaurant_name']),
        filters
    ).filter(booking => filter === 'all' || booking.status === filter);

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const response = await bookingAPI.getAllBookings();
            setBookings(response.data);
        } catch (error) {
            toast.error('Failed to fetch bookings');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (bookingId, status) => {
        try {
            await bookingAPI.updateStatus(bookingId, status);
            toast.success('Booking status updated');
            fetchBookings();
        } catch (error) {
            toast.error('Failed to update booking status');
        }
    };

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
        <div>
            <div className="mb-6 space-y-4">
                <SearchBar
                    value={searchTerm}
                    onChange={setSearchTerm}
                    placeholder="Search bookings..."
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
            <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold">Manage Bookings</h3>
                    <div className="flex space-x-2">
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="input-field"
                        >
                            <option value="all">All Bookings</option>
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>
                </div>

                <div className="bg-white shadow rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Customer
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Restaurant
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Date & Time
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
                            {filteredBookings.map((booking) => (
                                <tr key={booking.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {booking.user_name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {booking.restaurant_name}
                                        <div className="text-sm text-gray-500">
                                            Table {booking.table_number}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div>
                                            {format(
                                                new Date(booking.booking_date),
                                                'MMM dd, yyyy'
                                            )}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {booking.start_time} - {booking.end_time}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span
                                            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                                booking.status
                                            )}`}
                                        >
                                            {booking.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                        {booking.status === 'pending' && (
                                            <>
                                                <button
                                                    onClick={() =>
                                                        handleUpdateStatus(
                                                            booking.id,
                                                            'confirmed'
                                                        )
                                                    }
                                                    className="text-green-600 hover:text-green-900 mr-4"
                                                >
                                                    Confirm
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleUpdateStatus(
                                                            booking.id,
                                                            'cancelled'
                                                        )
                                                    }
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    Cancel
                                                </button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default BookingManagement;