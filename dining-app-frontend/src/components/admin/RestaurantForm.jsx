import React from 'react';
import { useForm } from 'react-hook-form';

const RestaurantForm = ({ initialData, onSubmit, onCancel }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: initialData || {},
    });

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700">
                    Restaurant Name
                </label>
                <input
                    type="text"
                    {...register('name', { required: 'Name is required' })}
                    className="input-field"
                />
                {errors.name && (
                    <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">
                    Description
                </label>
                <textarea
                    {...register('description')}
                    rows="3"
                    className="input-field"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">
                    Address
                </label>
                <input
                    type="text"
                    {...register('address', { required: 'Address is required' })}
                    className="input-field"
                />
                {errors.address && (
                    <p className="text-red-600 text-sm mt-1">{errors.address.message}</p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">
                    Cuisine Type
                </label>
                <input
                    type="text"
                    {...register('cuisine_type', { required: 'Cuisine type is required' })}
                    className="input-field"
                />
                {errors.cuisine_type && (
                    <p className="text-red-600 text-sm mt-1">{errors.cuisine_type.message}</p>
                )}
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Opening Time
                    </label>
                    <input
                        type="time"
                        {...register('opening_time', { required: 'Opening time is required' })}
                        className="input-field"
                    />
                    {errors.opening_time && (
                        <p className="text-red-600 text-sm mt-1">{errors.opening_time.message}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Closing Time
                    </label>
                    <input
                        type="time"
                        {...register('closing_time', { required: 'Closing time is required' })}
                        className="input-field"
                    />
                    {errors.closing_time && (
                        <p className="text-red-600 text-sm mt-1">{errors.closing_time.message}</p>
                    )}
                </div>
            </div>

            <div className="flex justify-end space-x-4 mt-6">
                <button
                    type="button"
                    onClick={onCancel}
                    className="btn-secondary"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="btn-primary"
                >
                    {initialData ? 'Update' : 'Create'}
                </button>
            </div>
        </form>
    );
};

export default RestaurantForm;