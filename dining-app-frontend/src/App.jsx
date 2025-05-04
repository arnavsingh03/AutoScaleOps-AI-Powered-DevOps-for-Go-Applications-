import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import RestaurantDetails from './pages/RestaurantDetails';
import AdminDashboard from './pages/admin/AdminDashboard';
import MainLayout from './components/layout/MainLayout';

function App() {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/restaurant/:id" element={<RestaurantDetails />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </MainLayout>
  );
}

export default App;