import { Restaurant } from '../types/restaurant';

export const restaurants: Restaurant[] = [
  {
    id: '1',
    name: 'La Bella Italia',
    cuisine: 'Italian',
    location: 'Downtown',
    rating: 4.8,
    priceRange: '$$$',
    imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4',
    featured: true,
    description: 'Authentic Italian cuisine in an elegant setting',
    address: '123 Main St, Downtown',
    phone: '(555) 123-4567',
    openingHours: 'Mon-Sun: 11:00 AM - 10:00 PM',
    photos: [
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4',
      'https://images.unsplash.com/photo-1592861956120-e524fc739696',
      'https://images.unsplash.com/photo-1590846406792-0adc7f938f1d',
      'https://images.unsplash.com/photo-1481833761820-0509d3217039'
    ],
    reviews: [
      {
        id: '1',
        userName: 'John Smith',
        rating: 5,
        comment: 'Amazing authentic Italian food! The pasta was perfectly cooked and the service was impeccable.',
        date: '2024-03-15',
        userImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e'
      },
      {
        id: '2',
        userName: 'Emma Wilson',
        rating: 4.5,
        comment: 'Great atmosphere and wonderful wine selection. The risotto was divine!',
        date: '2024-03-10',
        userImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80'
      }
    ],
    tables: [
      { id: 't1', number: 1, seats: 2, isAvailable: true },
      { id: 't2', number: 2, seats: 2, isAvailable: false },
      { id: 't3', number: 3, seats: 4, isAvailable: true },
      { id: 't4', number: 4, seats: 4, isAvailable: true },
      { id: 't5', number: 5, seats: 6, isAvailable: false }
    ]
  },
  {
    id: '2',
    name: 'Sakura Japanese',
    cuisine: 'Japanese',
    location: 'Midtown',
    rating: 4.9,
    priceRange: '$$$$',
    imageUrl: 'https://images.unsplash.com/photo-1579027989536-b7b1f875659b',
    featured: true,
    description: 'Premium sushi and traditional Japanese dishes'
  },
  {
    id: '3',
    name: 'Spice Route',
    cuisine: 'Indian',
    location: 'West End',
    rating: 4.7,
    priceRange: '$$',
    imageUrl: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe',
    featured: true,
    description: 'Flavorful Indian dishes with modern twists'
  },
  {
    id: '4',
    name: 'El Mariachi',
    cuisine: 'Mexican',
    location: 'South Side',
    rating: 4.6,
    priceRange: '$$',
    imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836',
    featured: false,
    description: 'Authentic Mexican street food and traditional dishes'
  },
  {
    id: '5',
    name: 'The American Grill',
    cuisine: 'American',
    location: 'East Side',
    rating: 4.5,
    priceRange: '$$$',
    imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5',
    featured: false,
    description: 'Classic American steakhouse with modern flair'
  }
];