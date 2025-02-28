import React from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { toast } from 'react-hot-toast';
import { bookingAPI } from '../../services/api';

const BookingForm = ({ restaurantId, tables, onSuccess }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm();

    const onSubmit = async (data) => {
        try {
            const response = await bookingAPI.create({
                ...data,
                restaurant_id: restaurantId,
            });
            toast.success('Booking created successfully!');
            reset();
            if (onSuccess) {
                onSuccess(response.data);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create booking');
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700">
                    Select Table
                </label>
                <select
                    {...register('table_id', { required: 'Please select a table' })}
                    className="input-field"
                >
                    <option value="">Select a table</option>
                    {tables.map((table) => (
                        <option key={table.id} value={table.id}>
                            Table {table.table_number} (Capacity: {table.capacity})
                        </option>
                    ))}
                </select>
                {errors.table_id && (
                    <p className="text-red-600 text-sm mt-1">
                        {errors.table_id.message}
                    </p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">
                    Date
                </label>
                <input
                    type="date"
                    {...register('booking_date', { required: 'Date is required' })}
                    className="input-field"
                    min={new Date().toISOString().split('T')[0]}
                />
                {errors.booking_date && (
                    <p className="text-red-600 text-sm mt-1">
                        {errors.booking_date.message}
                    </p>
                )}
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Start Time
                    </label>
                    <input
                        type="time"
                        {...register('start_time', { required: 'Start time is required' })}
                        className="input-field"
                    />
                    {errors.start_time && (
                        <p className="text-red-600 text-sm mt-1">
                            {errors.start_time.message}
                        </p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        End Time
                    </label>
                    <input
                        type="time"
                        {...register('end_time', { required: 'End time is required' })}
                        className="input-field"
                    />
                    {errors.end_time && (
                        <p className="text-red-600 text-sm mt-1">
                            {errors.end_time.message}
                        </p>
                    )}
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">
                    Number of Guests
                </label>
                <input
                    type="number"
                    {...register('number_of_guests', {
                        required: 'Number of guests is required',
                        min: { value: 1, message: 'Minimum 1 guest required' },
                    })}
                    className="input-field"
                    min="1"
                />
                {errors.number_of_guests && (
                    <p className="text-red-600 text-sm mt-1">
                        {errors.number_of_guests.message}
                    </p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">
                    Special Requests
                </label>
                <textarea
                    {...register('special_requests')}
                    className="input-field"
                    rows="3"
                    placeholder="Any special requests or notes..."
                />
            </div>

            <button type="submit" className="btn-primary w-full">
                Book Table
            </button>
        </form>
    );
};

export default BookingForm;