import api from './api';
import { Review } from '../types/restaurant';

export interface CreateRestaurantData {
  name: string;
  description: string;
  address: string;
  cuisine_type: string;
  opening_time: string;
  closing_time: string;
}

export interface Restaurant {
  id: number;
  name: string;
  cuisine: string;
  description: string;
  address: string;
  phone: string;
  openingHours: string;
  imageUrl: string;
  photos: string[];
  rating: number;
  reviews: Review[];
}

export const restaurantService = {
  async getAllRestaurants() {
    const response = await api.get('/restaurants');
    return response.data;
  },

  async getRestaurantById(id: string) {
    const response = await api.get(`/restaurants/${id}`);
    const r = response.data;
  
    return {
      ...r,
      cuisine: r.cuisine_type,
      openingHours: `${r.opening_time} - ${r.closing_time}`,
      photos: r.photos || [],       // Fallback if not present
      reviews: r.reviews || [],
      tables: (r.tables || []).map((table: any) => ({
        id: table.id.toString(),
        number: table.table_number,
        seats: table.capacity,
        isAvailable: table.is_available
      })),
    };
  },

  async createRestaurant(data: CreateRestaurantData) {
    const response = await api.post('/restaurants', data);
    return response.data;
  },

  async updateRestaurant(id: string, data: Partial<CreateRestaurantData>) {
    const response = await api.put(`/restaurants/${id}`, data);
    return response.data;
  },

  async deleteRestaurant(id: string) {
    const response = await api.delete(`/restaurants/${id}`);
    return response.data;
  },

  async getRestaurantTables(id: string) {
    const response = await api.get(`/restaurants/${id}/tables`);
    return response.data;
  }
};