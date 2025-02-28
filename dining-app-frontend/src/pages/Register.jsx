import React from 'react';
import { Link } from 'react-router-dom';
import RegisterForm from '../components/user/RegisterForm';

const Register = () => {
    return (
        <div className="max-w-md mx-auto">
            <div className="card">
                <h2 className="text-2xl font-bold text-center mb-6">
                    Create an Account
                </h2>
                <RegisterForm />
                <p className="mt-4 text-center text-gray-600">
                    Already have an account?{' '}
                    <Link to="/login" className="text-blue-600 hover:underline">
                        Login here
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;