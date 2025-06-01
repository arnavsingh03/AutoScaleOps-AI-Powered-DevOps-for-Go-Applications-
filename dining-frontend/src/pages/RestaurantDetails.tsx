import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, MapPin, Phone, Clock, ChevronLeft } from 'lucide-react';
import { restaurantService } from '../services/restaurant.service';
import { BookingForm } from '../components/BookingForm';
import { ReviewSection } from '../components/ReviewSection';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { ErrorMessage } from '../components/ui/ErrorMessage';
import { Restaurant } from '../types/restaurant';

export const RestaurantDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRestaurant = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const data = await restaurantService.getRestaurantById(id);
        setRestaurant(data);
      } catch (err) {
        setError('Failed to load restaurant details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurant();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <ErrorMessage 
            title="Restaurant Not Found"
            message={error || 'The requested restaurant could not be found.'} 
          />
          <Link to="/" className="mt-4 text-orange-500 hover:text-orange-600 inline-block">
            Return to home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Image */}
      <div className="relative h-96">
        <img
          src={restaurant.imageUrl}
          alt={restaurant.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40" />
        <Link
          to="/"
          className="absolute top-4 left-4 flex items-center text-white hover:text-orange-200"
        >
          <ChevronLeft className="h-6 w-6" />
          <span className="ml-1">Back</span>
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-md p-6 mb-8">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{restaurant.name}</h1>
                  <p className="text-gray-600 mt-2">{restaurant.cuisine} Cuisine</p>
                </div>
                <div className="flex items-center">
                  <Star className="h-6 w-6 text-yellow-400 fill-current" />
                  <span className="ml-2 text-xl font-semibold">{restaurant.rating}</span>
                </div>
              </div>

              <div className="space-y-4 text-gray-600">
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-gray-400" />
                  <span className="ml-2">{restaurant.address}</span>
                </div>
                <div className="flex items-center">
                  <Phone className="h-5 w-5 text-gray-400" />
                  <span className="ml-2">{restaurant.phone}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-gray-400" />
                  <span className="ml-2">{restaurant.openingHours}</span>
                </div>
              </div>
            </div>

            {/* Photos */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Photos</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {restaurant.photos.map((photo, index) => (
                  <img
                    key={index}
                    src={photo}
                    alt={`${restaurant.name} - Photo ${index + 1}`}
                    className="rounded-lg h-40 w-full object-cover"
                  />
                ))}
              </div>
            </div>

            {/* Reviews */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Reviews</h2>
              <ReviewSection reviews={restaurant.reviews} />
            </div>
          </div>

          {/* Booking Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Make a Reservation</h2>
              <BookingForm tables={restaurant.tables} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};