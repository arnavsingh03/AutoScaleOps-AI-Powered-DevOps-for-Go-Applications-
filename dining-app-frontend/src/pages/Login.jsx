import React from 'react';
import { Link } from 'react-router-dom';
import LoginForm from '../components/user/LoginForm';

const Login = () => {
    return (
        <div className="max-w-md mx-auto">
            <div className="bg-white rounded-lg shadow-md p-8">
                <h2 className="text-2xl font-bold text-center mb-6">
                    Login to Your Account
                </h2>
                <LoginForm />
                <p className="mt-4 text-center text-gray-600">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-blue-600 hover:text-blue-800">
                        Register here
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;