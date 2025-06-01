import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CalendarDays, Clock, User, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { bookingService } from '../services/booking.service';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { ErrorMessage } from '../components/ui/ErrorMessage';

type TabType = 'reservations' | 'history' | 'profile' | 'settings';

interface Booking {
  id: number;
  booking_date: string;
  start_time: string;
  end_time: string;
  number_of_guests: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  special_requests: string;
  table_number: string;
  restaurant_name: string;
}

export const UserDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('reservations');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
  });
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState('');

  useEffect(() => {
    if (activeTab === 'reservations') {
      fetchBookings();
    }
  }, [activeTab]);

  const fetchBookings = async () => {
    setLoading(true);
    setError('');
    try {
      console.log('Fetching bookings...');
      const token = localStorage.getItem('token');
      console.log('Auth token present:', !!token);
      
      const data = await bookingService.getUserBookings();
      console.log('Bookings data:', data);
      setBookings(data);
    } catch (err: any) {
      console.error('Error fetching bookings:', err);
      console.error('Error response:', err.response?.data);
      console.error('Error status:', err.response?.status);
      setError(err.response?.data?.message || 'Failed to fetch bookings. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    try {
      await bookingService.updateBookingStatus(bookingId, { status: 'cancelled' });
      await fetchBookings();
    } catch (err) {
      setError('Failed to cancel booking. Please try again later.');
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileError('');
    try {
      await updateProfile(profileData);
    } catch (err) {
      setProfileError('Failed to update profile. Please try again later.');
    } finally {
      setProfileLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const upcomingBookings = bookings.filter(
    booking => booking.status === 'confirmed' || booking.status === 'pending'
  );

  const pastBookings = bookings.filter(
    booking => booking.status === 'cancelled'
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'reservations':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Upcoming Reservations</h3>
            {loading ? (
              <LoadingSpinner />
            ) : error ? (
              <ErrorMessage message={error} />
            ) : upcomingBookings.length === 0 ? (
              <p className="text-gray-600">No upcoming reservations found.</p>
            ) : (
              upcomingBookings.map(booking => (
                <div key={booking.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-gray-900">{booking.restaurant_name}</h4>
                      <p className="text-gray-600">
                        {new Date(booking.booking_date).toLocaleDateString()} at {booking.start_time}
                      </p>
                      <p className="text-gray-600">{booking.number_of_guests} guests</p>
                      <span className={`inline-block mt-2 px-2 py-1 text-xs font-medium rounded ${
                        booking.status === 'confirmed'
                          ? 'bg-green-100 text-green-800'
                          : booking.status === 'pending'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {booking.status === 'pending' ? 'Confirming...' : booking.status}
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      {booking.status !== 'cancelled' && (
                        <button
                          onClick={() => handleCancelBooking(booking.id.toString())}
                          className="text-red-600 hover:text-red-700 font-medium"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        );

      case 'history':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Booking History</h3>
            {loading ? (
              <LoadingSpinner />
            ) : error ? (
              <ErrorMessage message={error} />
            ) : pastBookings.length === 0 ? (
              <p className="text-gray-600">No booking history found.</p>
            ) : (
              pastBookings.map(booking => (
                <div key={booking.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-gray-900">{booking.restaurant_name}</h4>
                      <p className="text-gray-600">
                        {new Date(booking.booking_date).toLocaleDateString()} at {booking.start_time}
                      </p>
                      <p className="text-gray-600">{booking.number_of_guests} guests</p>
                      <span className="inline-block mt-2 px-2 py-1 text-xs font-medium rounded bg-red-100 text-red-800">
                        {booking.status}
                      </span>
                    </div>
                    <Link
                      to={`/restaurant/${booking.id}`}
                      className="text-orange-600 hover:text-orange-700 font-medium"
                    >
                      Book Again
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        );

      case 'profile':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Profile Information</h3>
            {profileError && <ErrorMessage message={profileError} />}
            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                <input
                  type="tel"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                />
              </div>
              <button
                type="submit"
                disabled={profileLoading}
                className="w-full bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {profileLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>
        );

      case 'settings':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Account Settings</h3>
            <div className="space-y-4">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h4 className="font-medium text-gray-900 mb-4">Change Password</h4>
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Current Password</label>
                    <input
                      type="password"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">New Password</label>
                    <input
                      type="password"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                    <input
                      type="password"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                  >
                    Update Password
                  </button>
                </form>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h4 className="font-medium text-gray-900 mb-4">Preferences</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Email Notifications</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">SMS Notifications</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center">
              <CalendarDays className="h-8 w-8 text-orange-500" />
              <h1 className="ml-3 text-2xl font-bold text-gray-900">My Dashboard</h1>
            </Link>
            <button
              onClick={handleLogout}
              className="text-gray-600 hover:text-gray-900 flex items-center"
            >
              <LogOut className="h-5 w-5 mr-2" />
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Navigation */}
          <nav className="md:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm border border-gray-100">
              <div className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="h-12 w-12 rounded-full bg-gray-200"></div>
                  <div>
                    <p className="font-medium text-gray-900">{user?.name}</p>
                    <p className="text-sm text-gray-500">{user?.email}</p>
                  </div>
                </div>
              </div>
              <div className="border-t border-gray-100">
                <div className="p-2">
                  <button
                    onClick={() => setActiveTab('reservations')}
                    className={`w-full flex items-center space-x-2 px-4 py-2 text-sm rounded-md ${
                      activeTab === 'reservations'
                        ? 'bg-orange-50 text-orange-600'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <CalendarDays className="h-5 w-5" />
                    <span>Upcoming Reservations</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('history')}
                    className={`w-full flex items-center space-x-2 px-4 py-2 text-sm rounded-md ${
                      activeTab === 'history'
                        ? 'bg-orange-50 text-orange-600'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Clock className="h-5 w-5" />
                    <span>Booking History</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('profile')}
                    className={`w-full flex items-center space-x-2 px-4 py-2 text-sm rounded-md ${
                      activeTab === 'profile'
                        ? 'bg-orange-50 text-orange-600'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <User className="h-5 w-5" />
                    <span>Profile</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('settings')}
                    className={`w-full flex items-center space-x-2 px-4 py-2 text-sm rounded-md ${
                      activeTab === 'settings'
                        ? 'bg-orange-50 text-orange-600'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Settings className="h-5 w-5" />
                    <span>Settings</span>
                  </button>
                </div>
              </div>
            </div>
          </nav>

          {/* Main Content Area */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
              {renderTabContent()}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};