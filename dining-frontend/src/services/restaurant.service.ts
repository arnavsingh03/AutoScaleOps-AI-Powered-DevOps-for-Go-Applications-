import api from './api';
import { restaurants } from '../data/restaurants';

export interface CreateRestaurantData {
  name: string;
  description: string;
  address: string;
  cuisine_type: string;
  opening_time: string;
  closing_time: string;
}

export const restaurantService = {
  async getAllRestaurants() {
    const response = await api.get('/restaurants');
    return response.data;
  },

  async getRestaurantById(id: string) {
    const response = await api.get(`/restaurants/${id}`);
    const r = response.data;
    
    // Find matching local data for additional info
    const localData = restaurants.find(local => local.id === id);
    
    return {
      ...r,
      cuisine: r.cuisine_type,
      openingHours: `${r.opening_time} - ${r.closing_time}`,
      // Use local data for these fields if available
      phone: localData?.phone || r.phone || 'Not available',
      rating: localData?.rating || r.rating || 0,
      imageUrl: localData?.imageUrl || r.imageUrl || '',
      photos: localData?.photos || r.photos || [],
      reviews: localData?.reviews || r.reviews || [],
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