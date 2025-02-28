import React from 'react';
import LoadingSpinner from './LoadingSpinner';

const PageLoader = () => {
    return (
        <div className="fixed inset-0 bg-white bg-opacity-90 z-50 
                      flex items-center justify-center">
            <div className="text-center">
                <LoadingSpinner size="lg" />
                <p className="mt-4 text-gray-600">Loading...</p>
            </div>
        </div>
    );
};

export default PageLoader;