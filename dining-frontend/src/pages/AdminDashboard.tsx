import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Store,
  Settings,
  LogOut,
  TrendingUp,
  Calendar,
  DollarSign,
  UserCheck
} from 'lucide-react';

type TabType = 'overview' | 'restaurants' | 'users' | 'settings' | 'bookings';

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  const statistics = {
    totalBookings: 156,
    activeRestaurants: 24,
    totalUsers: 892,
    monthlyRevenue: 45600
  };

  const recentBookings = [
    {
      id: '1',
      customerName: 'Emma Wilson',
      restaurantName: 'La Bella Italia',
      date: '2024-03-20',
      time: '19:00',
      guests: 2,
      status: 'confirmed'
    },
    {
      id: '2',
      customerName: 'John Smith',
      restaurantName: 'Sakura Japanese',
      date: '2024-03-20',
      time: '20:00',
      guests: 4,
      status: 'pending'
    }
  ];

  const restaurants = [
    {
      id: '1',
      name: 'La Bella Italia',
      location: 'Downtown',
      tables: 12,
      activeBookings: 8
    },
    {
      id: '2',
      name: 'Sakura Japanese',
      location: 'Midtown',
      tables: 15,
      activeBookings: 10
    }
  ];

  const users = [
    {
      id: '1',
      name: 'Emma Wilson',
      email: 'emma@example.com',
      joinDate: '2024-02-15',
      bookings: 5
    },
    {
      id: '2',
      name: 'John Smith',
      email: 'john@example.com',
      joinDate: '2024-02-10',
      bookings: 3
    }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-8">
            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Total Bookings</p>
                    <h3 className="text-2xl font-bold text-gray-900">{statistics.totalBookings}</h3>
                  </div>
                  <Calendar className="h-8 w-8 text-orange-500" />
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Active Restaurants</p>
                    <h3 className="text-2xl font-bold text-gray-900">{statistics.activeRestaurants}</h3>
                  </div>
                  <Store className="h-8 w-8 text-orange-500" />
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Total Users</p>
                    <h3 className="text-2xl font-bold text-gray-900">{statistics.totalUsers}</h3>
                  </div>
                  <Users className="h-8 w-8 text-orange-500" />
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Monthly Revenue</p>
                    <h3 className="text-2xl font-bold text-gray-900">${statistics.monthlyRevenue}</h3>
                  </div>
                  <DollarSign className="h-8 w-8 text-orange-500" />
                </div>
              </div>
            </div>

            {/* Recent Bookings */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Bookings</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Customer
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Restaurant
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date & Time
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {recentBookings.map(booking => (
                        <tr key={booking.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{booking.customerName}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{booking.restaurantName}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {new Date(booking.date).toLocaleDateString()} at {booking.time}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              booking.status === 'confirmed'
                                ? 'bg-green-100 text-green-800'
                                : booking.status === 'pending'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {booking.status === 'pending' ? 'Confirming...' : booking.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        );

      case 'restaurants':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Restaurant Management</h3>
              <button className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600">
                Add Restaurant
              </button>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-100">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Restaurant
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Location
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tables
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Active Bookings
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {restaurants.map(restaurant => (
                      <tr key={restaurant.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{restaurant.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{restaurant.location}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{restaurant.tables}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{restaurant.activeBookings}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button className="text-orange-600 hover:text-orange-700 font-medium mr-3">
                            Edit
                          </button>
                          <button className="text-red-600 hover:text-red-700 font-medium">
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'users':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">User Management</h3>

            <div className="bg-white rounded-lg shadow-sm border border-gray-100">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Join Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Bookings
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {users.map(user => (
                      <tr key={user.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{user.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {new Date(user.joinDate).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{user.bookings}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button className="text-orange-600 hover:text-orange-700 font-medium mr-3">
                            View Details
                          </button>
                          <button className="text-red-600 hover:text-red-700 font-medium">
                            Disable
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'settings':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">System Settings</h3>

            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
              <div className="space-y-6">
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-4">Booking Settings</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">Automatic Booking Confirmation</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">Allow Multiple Bookings</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-200">
                  <h4 className="text-md font-medium text-gray-900 mb-4">Notification Settings</h4>
                  <form className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Booking Confirmation Email Template
                      </label>
                      <textarea
                        rows={4}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                        defaultValue="Thank you for your booking at [Restaurant Name]. Your reservation for [Number of Guests] on [Date] at [Time] has been confirmed."
                      />
                    </div>
                    <button
                      type="submit"
                      className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600"
                    >
                      Save Changes
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        );

      case 'bookings':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Recent Bookings</h3>
            <div className="bg-white rounded-lg shadow-sm border border-gray-100">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Restaurant
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date & Time
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {recentBookings.map(booking => (
                      <tr key={booking.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{booking.customerName}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{booking.restaurantName}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {new Date(booking.date).toLocaleDateString()} at {booking.time}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            booking.status === 'confirmed'
                              ? 'bg-green-100 text-green-800'
                              : booking.status === 'pending'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {booking.status === 'pending' ? 'Confirming...' : booking.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
              <LayoutDashboard className="h-8 w-8 text-orange-500" />
              <h1 className="ml-3 text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            </Link>
            <button className="text-gray-600 hover:text-gray-900 flex items-center">
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
                  <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center">
                    <UserCheck className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Admin User</p>
                    <p className="text-sm text-gray-500">admin@tablespot.com</p>
                  </div>
                </div>
              </div>
              <div className="border-t border-gray-100">
                <div className="p-2">
                  <button
                    onClick={() => setActiveTab('overview')}
                    className={`w-full flex items-center space-x-2 px-4 py-2 text-sm rounded-md ${
                      activeTab === 'overview'
                        ? 'bg-orange-50 text-orange-600'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <TrendingUp className="h-5 w-5" />
                    <span>Overview</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('restaurants')}
                    className={`w-full flex items-center space-x-2 px-4 py-2 text-sm rounded-md ${
                      activeTab === 'restaurants'
                        ? 'bg-orange-50 text-orange-600'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Store className="h-5 w-5" />
                    <span>Restaurants</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('users')}
                    className={`w-full flex items-center space-x-2 px-4 py-2 text-sm rounded-md ${
                      activeTab === 'users'
                        ? 'bg-orange-50 text-orange-600'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Users className="h-5 w-5" />
                    <span>Users</span>
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
                  <button
                    onClick={() => setActiveTab('bookings')}
                    className={`w-full flex items-center space-x-2 px-4 py-2 text-sm rounded-md ${
                      activeTab === 'bookings'
                        ? 'bg-orange-50 text-orange-600'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <TrendingUp className="h-5 w-5" />
                    <span>Bookings</span>
                  </button>
                </div>
              </div>
            </div>
          </nav>

          {/* Main Content Area */}
          <div className="flex-1">
            {renderTabContent()}
          </div>
        </div>
      </main>
    </div>
  );
};