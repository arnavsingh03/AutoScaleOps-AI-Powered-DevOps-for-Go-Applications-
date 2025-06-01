import api from './api';

export interface CreateTableData {
  restaurantId: string;
  number: string;
  seats: number;
}

export const tableService = {
  async createTable(data: CreateTableData) {
    const response = await api.post(`/tables/restaurant/${data.restaurantId}`, {
      table_number: data.number,
      capacity: data.seats
    });
    return response.data;
  },

  async updateTableAvailability(id: string, isAvailable: boolean) {
    const response = await api.put(`/tables/${id}/availability`, { isAvailable });
    return response.data;
  }
};