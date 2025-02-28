import React from 'react';
import { format } from 'date-fns';
import { useForm } from 'react-hook-form';

const BookingConfirmation = ({ bookingData, restaurant, onConfirm, onBack }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            specialRequests: bookingData.specialRequests,
        },
    });

    const onSubmit = (data) => {
        onConfirm({
            ...bookingData,
            specialRequests: data.specialRequests,
        });
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Confirm Your Booking</h2>

            {/* Booking Summary */}
            <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium mb-4">Booking Details</h3>
                <dl className="space-y-2">
                    <div className="flex justify-between">
                        <dt className="text-gray-600">Restaurant:</dt>
                        <dd className="font-medium">{restaurant.name}</dd>
                    </div>
                    <div className="flex justify-between">
                        <dt className="text-gray-600">Table:</dt>
                        <dd className="font-medium">
                            Table {bookingData.table.table_number} 
                            (Capacity: {bookingData.table.capacity})
                        </dd>
                    </div>
                    <div className="flex justify-between">
                        <dt className="text-gray-600">Date:</dt>
                        <dd className="font-medium">
                            {format(bookingData.date, 'PPP')}
                        </dd>
                    </div>
                    <div className="flex justify-between">
                        <dt className="text-gray-600">Time:</dt>
                        <dd className="font-medium">{bookingData.timeSlot}</dd>
                    </div>
                    <div className="flex justify-between">
                        <dt className="text-gray-600">Guests:</dt>
                        <dd className="font-medium">{bookingData.guests}</dd>
                    </div>
                </dl>
            </div>

            {/* Special Requests Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Special Requests (Optional)
                    </label>
                    <textarea
                        {...register('specialRequests')}
                        rows="3"
                        className="input-field"
                        placeholder="Any special requests or dietary requirements..."
                    />
                </div>

                {/* Terms and Conditions */}
                <div className="space-y-2">
                    <div className="flex items-start">
                        <input
                            type="checkbox"
                            {...register('terms', {
                                required: 'You must accept the terms and conditions',
                            })}
                            className="mt-1"
                        />
                        <label className="ml-2 text-sm text-gray-600">
                            I agree to the terms and conditions
                        </label>
                    </div>
                    {errors.terms && (
                        <p className="text-red-600 text-sm">
                            {errors.terms.message}
                        </p>
                    )}
                </div>

                {/* Navigation */}
                <div className="flex justify-between pt-4">
                    <button
                        type="button"
                        onClick={onBack}
                        className="btn-secondary"
                    >
                        Back
                    </button>
                    <button
                        type="submit"
                        className="btn-primary"
                    >
                        Confirm Booking
                    </button>
                </div>
            </form>
        </div>
    );
};

export default BookingConfirmation;