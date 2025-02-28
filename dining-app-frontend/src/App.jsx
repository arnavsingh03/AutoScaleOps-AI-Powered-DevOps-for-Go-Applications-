import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';
import ErrorBoundary from './components/common/ErrorBoundary';
import PageLoader from './components/common/PageLoader';
import ToastContainer from './components/common/ToastContainer';
import MainLayout from './components/layout/MainLayout';

// Lazy load pages for better performance
const Home = React.lazy(() => import('./pages/Home'));
const Login = React.lazy(() => import('./pages/Login'));
const Register = React.lazy(() => import('./pages/Register'));
const RestaurantDetails = React.lazy(() => import('./pages/RestaurantDetails'));
const UserDashboard = React.lazy(() => import('./pages/UserDashboard'));
const AdminDashboard = React.lazy(() => import('./pages/admin/AdminDashboard'));

function App() {
    return (
        <ErrorBoundary>
            <Provider store={store}>
                <Router>
                    <Suspense fallback={<PageLoader />}>
                        <Routes>
                            <Route path="/" element={<MainLayout />}>
                                <Route index element={<Home />} />
                                <Route path="login" element={<Login />} />
                                <Route path="register" element={<Register />} />
                                <Route path="restaurant/:id" element={<RestaurantDetails />} />
                                <Route path="dashboard" element={<UserDashboard />} />
                                <Route path="admin" element={<AdminDashboard />} />
                            </Route>
                        </Routes>
                    </Suspense>
                </Router>
                <ToastContainer />
            </Provider>
        </ErrorBoundary>
    );
}

export default App;