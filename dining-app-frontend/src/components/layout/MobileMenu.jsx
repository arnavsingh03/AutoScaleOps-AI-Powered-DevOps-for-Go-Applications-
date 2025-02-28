import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';

const MobileMenu = ({ isOpen, onClose }) => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);

    const handleLogout = () => {
        dispatch(logout());
        onClose();
    };

    return (
        <div
            className={`fixed inset-0 z-40 transform ${
                isOpen ? 'translate-x-0' : 'translate-x-full'
            } transition-transform duration-300 ease-in-out md:hidden`}
        >
            <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
            
            <div className="fixed right-0 top-0 bottom-0 w-64 bg-white shadow-xl">
                <div className="p-6 space-y-4">
                    {user ? (
                        <>
                            <div className="border-b pb-4">
                                <p className="text-sm text-gray-600">Welcome,</p>
                                <p className="font-medium">{user.name}</p>
                            </div>
                            <Link
                                to="/dashboard"
                                className="block py-2"
                                onClick={onClose}
                            >
                                Dashboard
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="block w-full text-left py-2 text-red-600"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                className="block py-2"
                                onClick={onClose}
                            >
                                Login
                            </Link>
                            <Link
                                to="/register"
                                className="block py-2"
                                onClick={onClose}
                            >
                                Register
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MobileMenu;