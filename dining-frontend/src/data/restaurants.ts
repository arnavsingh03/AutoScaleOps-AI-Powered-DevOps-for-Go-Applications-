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
      'https://images.unsplash.com/photo-1481833761820-0509d3217039',
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5',
      'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c'
    ],
    reviews: [
      {
        id: '1',
        userName: 'John Smith',
        rating: 5,
        comment: 'Amazing authentic Italian food! The pasta was perfectly cooked and the service was impeccable.',
        date: '2025-03-15',
        userImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e'
      },
      {
        id: '2',
        userName: 'Emma Wilson',
        rating: 4.5,
        comment: 'Great atmosphere and wonderful wine selection. The risotto was divine!',
        date: '2025-03-10',
        userImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80'
      },
      {
        id: '3',
        userName: 'Michael Brown',
        rating: 5,
        comment: 'The best Italian restaurant in town! Their homemade pasta is to die for.',
        date: '2025-03-05',
        userImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d'
      }
    ],
    tables: [
      { id: 't1', number: '1', seats: 2, isAvailable: true },
      { id: 't2', number: '2', seats: 2, isAvailable: false },
      { id: 't3', number: '3', seats: 4, isAvailable: true },
      { id: 't4', number: '4', seats: 4, isAvailable: true },
      { id: 't5', number: '5', seats: 6, isAvailable: false }
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
    description: 'Premium sushi and traditional Japanese dishes',
    address: '456 Oak Ave, Midtown',
    phone: '(555) 234-5678',
    openingHours: 'Mon-Sun: 12:00 PM - 11:00 PM',
    photos: [
      'https://images.unsplash.com/photo-1579027989536-b7b1f875659b',
      'https://images.unsplash.com/photo-1579871494447-9811cf80d66c',
      'https://images.unsplash.com/photo-1553621042-f6e147245754',
      'https://images.unsplash.com/photo-1553621042-f6e147245754',
      'https://images.unsplash.com/photo-1553621042-f6e147245754'
    ],
    reviews: [
      {
        id: '1',
        userName: 'Sarah Johnson',
        rating: 5,
        comment: 'The freshest sushi I\'ve ever had! The chef\'s special roll was incredible.',
        date: '2025-03-12',
        userImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330'
      },
      {
        id: '2',
        userName: 'David Lee',
        rating: 4.8,
        comment: 'Authentic Japanese experience with excellent service.',
        date: '2025-03-08',
        userImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e'
      }
    ],
    tables: [
      { id: 't1', number: '1', seats: 2, isAvailable: true },
      { id: 't2', number: '2', seats: 4, isAvailable: true },
      { id: 't3', number: '3', seats: 6, isAvailable: true }
    ]
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
    description: 'Flavorful Indian dishes with modern twists',
    address: '789 West St, West End',
    phone: '(555) 345-6789',
    openingHours: 'Mon-Sun: 11:30 AM - 10:30 PM',
    photos: [
      'https://images.unsplash.com/photo-1585937421612-70a008356fbe',
      'https://images.unsplash.com/photo-1585937421612-70a008356fbe',
      'https://images.unsplash.com/photo-1585937421612-70a008356fbe',
      'https://images.unsplash.com/photo-1585937421612-70a008356fbe'
    ],
    reviews: [
      {
        id: '1',
        userName: 'Priya Patel',
        rating: 4.9,
        comment: 'The butter chicken is absolutely divine! Authentic flavors with a modern touch.',
        date: '2025-03-14',
        userImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80'
      },
      {
        id: '2',
        userName: 'James Wilson',
        rating: 4.5,
        comment: 'Great selection of vegetarian dishes. The naan bread is freshly made!',
        date: '2025-03-09',
        userImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e'
      }
    ],
    tables: [
      { id: 't1', number: '1', seats: 2, isAvailable: true },
      { id: 't2', number: '2', seats: 4, isAvailable: true },
      { id: 't3', number: '3', seats: 6, isAvailable: true }
    ]
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
    description: 'Authentic Mexican street food and traditional dishes',
    address: '321 South Blvd, South Side',
    phone: '(555) 456-7890',
    openingHours: 'Mon-Sun: 11:00 AM - 11:00 PM',
    photos: [
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836',
      'https://images.unsplash.com/photo-1552332386-f8dd00dc2f85',
      'https://images.unsplash.com/photo-1565299585323-38d6b0865b47',
      'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38'
    ],
    reviews: [
      {
        id: '1',
        userName: 'Maria Garcia',
        rating: 4.7,
        comment: 'The best tacos in town! Authentic flavors and great atmosphere.',
        date: '2025-03-13',
        userImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330'
      },
      {
        id: '2',
        userName: 'Robert Chen',
        rating: 4.5,
        comment: 'Excellent margaritas and friendly service. The enchiladas are a must-try!',
        date: '2025-03-07',
        userImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e'
      }
    ],
    tables: [
      { id: 't1', number: '1', seats: 2, isAvailable: true },
      { id: 't2', number: '2', seats: 4, isAvailable: true },
      { id: 't3', number: '3', seats: 6, isAvailable: true }
    ]
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
    description: 'Classic American steakhouse with modern flair',
    address: '654 East Ave, East Side',
    phone: '(555) 567-8901',
    openingHours: 'Mon-Sun: 4:00 PM - 11:00 PM',
    photos: [
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5',
      'https://images.unsplash.com/photo-1544025162-d76694265947',
      'https://images.unsplash.com/photo-1544025162-d76694265947',
      'https://images.unsplash.com/photo-1544025162-d76694265947'
    ],
    reviews: [
      {
        id: '1',
        userName: 'Thomas Anderson',
        rating: 4.6,
        comment: 'The ribeye steak was cooked to perfection. Great wine selection too!',
        date: '2025-03-11',
        userImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e'
      },
      {
        id: '2',
        userName: 'Lisa Thompson',
        rating: 4.4,
        comment: 'Cozy atmosphere and excellent service. The lobster bisque is amazing!',
        date: '2025-03-06',
        userImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80'
      }
    ],
    tables: [
      { id: 't1', number: '1', seats: 2, isAvailable: true },
      { id: 't2', number: '2', seats: 4, isAvailable: true },
      { id: 't3', number: '3', seats: 6, isAvailable: true }
    ]
  }
];