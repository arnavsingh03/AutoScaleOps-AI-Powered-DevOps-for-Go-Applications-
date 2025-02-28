import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRestaurantById } from '../store/slices/restaurantSlice';
import { restaurantAPI } from '../services/api';
import BookingForm from '../components/booking/BookingForm';

const RestaurantDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { currentRestaurant: restaurant, loading } = useSelector(
        (state) => state.restaurants
    );
    const { token } = useSelector((state) => state.auth);
    const [tables, setTables] = useState([]);

    useEffect(() => {
        dispatch(fetchRestaurantById(id));
        fetchTables();
    }, [dispatch, id]);

    const fetchTables = async () => {
        try {
            const response = await restaurantAPI.getTables(id);
            setTables(response.data);
        } catch (error) {
            console.error('Failed to fetch tables:', error);
        }
    };

    const handleBookingSuccess = () => {
        navigate('/dashboard');
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!restaurant) {
        return <div>Restaurant not found</div>;
    }

    return (
        <div className="max-w-4xl mx-auto">
            {/* Restaurant details section */}
            <div className="card mb-8">
                {/* ... (previous restaurant details code) ... */}
            </div>

            {/* Booking section */}
            <div className="card">
                <h2 className="text-2xl font-bold mb-4">Make a Reservation</h2>
                {token ? (
                    <BookingForm
                        restaurantId={restaurant.id}
                        tables={tables}
                        onSuccess={handleBookingSuccess}
                    />
                ) : (
                    <div className="text-center py-8">
                        <p className="text-gray-600 mb-4">
                            Please login to make a reservation
                        </p>
                        <button
                            onClick={() => navigate('/login')}
                            className="btn-primary"
                        >
                            Login to Book
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RestaurantDetails;