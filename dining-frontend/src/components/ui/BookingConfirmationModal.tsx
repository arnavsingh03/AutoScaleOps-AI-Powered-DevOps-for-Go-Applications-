import React from 'react';
import { Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface BookingConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BookingConfirmationModal: React.FC<BookingConfirmationModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleClose = () => {
    onClose();
    navigate('/dashboard');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 transform transition-all animate-fade-in-up">
        <div className="flex justify-end">
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-500 focus:outline-none"
          >
            <span className="sr-only">Close</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 mb-4">
            <Check className="h-8 w-8 text-blue-600 animate-bounce" />
          </div>
          
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Booking Confirmed!
          </h3>
          
          <p className="text-sm text-gray-500 mb-6">
            Your table has been successfully booked. You can view your booking details in your dashboard.
          </p>
          
          <button
            onClick={handleClose}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            View in Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}; 