import { useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MainLayout } from './components/layout/MainLayout';
import { FeaturedSection } from './components/FeaturedSection';
import { RestaurantCard } from './components/RestaurantCard';
import { RestaurantDetails } from './pages/RestaurantDetails';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { UserDashboard } from './pages/UserDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AdminProtectedRoute } from './components/AdminProtectedRoute';
import { restaurants } from './data/restaurants';
import { DiscountBanner } from './components/DiscountBanner';

function HomePage() {
  const filteredRestaurants = useMemo(() => {
    return restaurants;
  }, []);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <DiscountBanner />
      
      {/* Featured Section */}
      <FeaturedSection restaurants={restaurants} />

      {/* All Restaurants */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">All Restaurants</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRestaurants.map(restaurant => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
          ))}
        </div>
      </section>
    </main>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout><HomePage /></MainLayout>} />
        <Route
          path="/restaurant/:id"
          element={
            <ProtectedRoute>
              <MainLayout>
                <RestaurantDetails />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<MainLayout><Login /></MainLayout>} />
        <Route path="/register" element={<MainLayout><Register /></MainLayout>} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <MainLayout>
                <UserDashboard />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <AdminProtectedRoute>
              <AdminDashboard />
            </AdminProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;