export interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  location: string;
  rating: number;
  priceRange: string;
  imageUrl: string;
  featured: boolean;
  description: string;
  address: string;
  phone: string;
  openingHours: string;
  photos: string[];
  reviews: Review[];
  tables: Table[];
}

export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  userImage: string;
}

export interface Table {
  id: string;
  number: string;
  seats: number;
  isAvailable: boolean;
}

export type Cuisine = 'Italian' | 'Japanese' | 'Indian' | 'Mexican' | 'American' | 'French' | 'Chinese' | 'Thai';
export type Location = 'Downtown' | 'Uptown' | 'Midtown' | 'West End' | 'East Side' | 'South Side' | 'North Side';