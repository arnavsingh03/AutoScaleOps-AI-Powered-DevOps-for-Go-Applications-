import api from './api';

export interface CreateBookingData {
  table_id: number;
  booking_date: string;
  start_time: string;
  end_time: string;
  number_of_guests: number;
  special_requests?: string;
}

export interface UpdateBookingStatusData {
  status: 'pending' | 'confirmed' | 'cancelled';
}

export const bookingService = {
  async createBooking(data: CreateBookingData) {
    const response = await api.post('/bookings', data);
    return response.data;
  },

  async getUserBookings() {
    const response = await api.get('/bookings');
    return response.data;
  },

  async updateBookingStatus(id: string, data: UpdateBookingStatusData) {
    const response = await api.put(`/bookings/${id}/status`, data);
    return response.data;
  }
};