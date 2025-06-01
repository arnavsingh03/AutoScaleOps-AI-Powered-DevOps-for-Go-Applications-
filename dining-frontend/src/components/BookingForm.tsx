import React, { useState, useEffect } from 'react';
import { format, parse } from 'date-fns';
import { useParams, useNavigate } from 'react-router-dom';
import { bookingService } from '../services/booking.service';
import { Table } from '../types/restaurant';
import { useAuth } from '../contexts/AuthContext';
import { BookingConfirmationModal } from './ui/BookingConfirmationModal';

interface BookingFormProps {
  tables: Table[];
}

export const BookingForm: React.FC<BookingFormProps> = ({ tables }) => {
  const { id: restaurantId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [guests, setGuests] = useState('2');
  const [selectedTable, setSelectedTable] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      navigate('/login', { state: { from: `/restaurant/${restaurantId}` } });
    }
  }, [user, navigate, restaurantId]);

  const availableTables = tables.filter(table => table.isAvailable);
  const today = format(new Date(), 'yyyy-MM-dd');
  const timeSlots = [
    '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
    '17:00', '17:30', '18:00', '18:30', '19:00', '19:30',
    '20:00', '20:30', '21:00'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      navigate('/login');
      return;
    }

    if (!restaurantId) {
      setError('Restaurant ID is missing');
      return;
    }

    if (!selectedTable) {
      setError('Please select a table');
      return;
    }

    if (!selectedDate || !selectedTime) {
      setError('Please select both date and time');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      // Convert YYYY-MM-DD to DD-MM-YYYY
      const [year, month, day] = selectedDate.split('-');
      const formattedDate = `${day}-${month}-${year}`;
      
      // Create ISO timestamps for start and end time
      const startDateTime = parse(selectedTime, 'HH:mm', new Date());
      const endDateTime = new Date(startDateTime);
      endDateTime.setHours(endDateTime.getHours() + 2);
      
      const bookingData = {
        table_id: parseInt(selectedTable),
        booking_date: formattedDate,
        start_time: format(startDateTime, "yyyy-MM-dd'T'HH:mm:ss'Z'"),
        end_time: format(endDateTime, "yyyy-MM-dd'T'HH:mm:ss'Z'"),
        number_of_guests: parseInt(guests)
      };
      
      console.log('Sending booking data:', bookingData);
      console.log('Auth token:', localStorage.getItem('token'));
      
      const response = await bookingService.createBooking(bookingData);
      console.log('Booking response:', response);
      
      // Reset form
      setSelectedDate('');
      setSelectedTime('');
      setGuests('2');
      setSelectedTable('');
      
      // Show confirmation modal instead of alert
      setShowConfirmation(true);
    } catch (err: any) {
      console.error('Booking error details:', err);
      console.error('Error response:', err.response?.data);
      console.error('Error status:', err.response?.status);
      console.error('Error headers:', err.response?.headers);
      setError(err.response?.data?.message || 'Failed to create booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="text-red-500 text-sm">{error}</div>
        )}
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700">
            Date
          </label>
          <input
            type="date"
            id="date"
            min={today}
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
            required
          />
        </div>

        <div>
          <label htmlFor="time" className="block text-sm font-medium text-gray-700">
            Time
          </label>
          <select
            id="time"
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
            required
          >
            <option value="">Select a time</option>
            {timeSlots.map(time => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="guests" className="block text-sm font-medium text-gray-700">
            Number of Guests
          </label>
          <select
            id="guests"
            value={guests}
            onChange={(e) => setGuests(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
            required
          >
            {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
              <option key={num} value={num}>
                {num} {num === 1 ? 'Guest' : 'Guests'}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="table" className="block text-sm font-medium text-gray-700">
            Select Table
          </label>
          <select
            id="table"
            value={selectedTable}
            onChange={(e) => setSelectedTable(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
            required
          >
            <option value="">Select a table</option>
            {availableTables.map(table => (
              <option key={table.id} value={table.id}>
                Table {table.number} ({table.seats} seats)
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Booking...' : 'Book Table'}
        </button>
      </form>
      
      <BookingConfirmationModal 
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
      />
    </>
  );
};