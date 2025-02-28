import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import TableSelection from './TableSelection';
import TimeSlotSelection from './TimeSlotSelection';
import BookingConfirmation from './BookingConfirmation';

const STEPS = {
    TABLE_SELECTION: 'TABLE_SELECTION',
    TIME_SELECTION: 'TIME_SELECTION',
    CONFIRMATION: 'CONFIRMATION',
};

const BookingFlow = ({ restaurant }) => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(STEPS.TABLE_SELECTION);
    const [bookingData, setBookingData] = useState({
        table: null,
        date: null,
        timeSlot: null,
        guests: 1,
        specialRequests: '',
    });

    const handleTableSelect = (table) => {
        setBookingData((prev) => ({ ...prev, table }));
        setCurrentStep(STEPS.TIME_SELECTION);
    };

    const handleTimeSelect = (date, timeSlot) => {
        setBookingData((prev) => ({ ...prev, date, timeSlot }));
        setCurrentStep(STEPS.CONFIRMATION);
    };

    const handleConfirm = async (finalData) => {
        try {
            // API call to create booking
            const response = await bookingAPI.create({
                ...bookingData,
                ...finalData,
                restaurant_id: restaurant.id,
            });
            
            toast.success('Booking confirmed successfully!');
            navigate('/dashboard');
        } catch (error) {
            toast.error('Failed to confirm booking');
        }
    };

    const renderStep = () => {
        switch (currentStep) {
            case STEPS.TABLE_SELECTION:
                return (
                    <TableSelection
                        restaurant={restaurant}
                        onSelect={handleTableSelect}
                        selectedGuests={bookingData.guests}
                        onGuestsChange={(guests) =>
                            setBookingData((prev) => ({ ...prev, guests }))
                        }
                    />
                );
            case STEPS.TIME_SELECTION:
                return (
                    <TimeSlotSelection
                        restaurant={restaurant}
                        table={bookingData.table}
                        onSelect={handleTimeSelect}
                        onBack={() => setCurrentStep(STEPS.TABLE_SELECTION)}
                    />
                );
            case STEPS.CONFIRMATION:
                return (
                    <BookingConfirmation
                        bookingData={bookingData}
                        restaurant={restaurant}
                        onConfirm={handleConfirm}
                        onBack={() => setCurrentStep(STEPS.TIME_SELECTION)}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            {/* Progress Bar */}
            <div className="mb-8">
                <div className="flex items-center justify-between">
                    {Object.values(STEPS).map((step, index) => (
                        <React.Fragment key={step}>
                            <div
                                className={`flex items-center ${
                                    Object.values(STEPS).indexOf(currentStep) >= index
                                        ? 'text-blue-600'
                                        : 'text-gray-400'
                                }`}
                            >
                                <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center border-2 
                                    ${
                                        Object.values(STEPS).indexOf(currentStep) >= index
                                            ? 'border-blue-600 bg-blue-50'
                                            : 'border-gray-300'
                                    }`}
                                >
                                    {index + 1}
                                </div>
                                <span className="ml-2 text-sm font-medium">
                                    {step.replace('_', ' ')}
                                </span>
                            </div>
                            {index < Object.values(STEPS).length - 1 && (
                                <div
                                    className={`flex-1 h-0.5 mx-4 ${
                                        Object.values(STEPS).indexOf(currentStep) > index
                                            ? 'bg-blue-600'
                                            : 'bg-gray-300'
                                    }`}
                                />
                            )}
                        </React.Fragment>
                    ))}
                </div>
            </div>

            {/* Step Content */}
            <div className="bg-white rounded-lg shadow-lg p-6">
                {renderStep()}
            </div>
        </div>
    );
};

export default BookingFlow;