import React from 'react';
import { Toaster } from 'react-hot-toast';

const ToastContainer = () => {
    return (
        <Toaster
            position="top-right"
            toastOptions={{
                success: {
                    duration: 3000,
                    style: {
                        background: '#10B981',
                        color: 'white',
                    },
                },
                error: {
                    duration: 4000,
                    style: {
                        background: '#EF4444',
                        color: 'white',
                    },
                },
                loading: {
                    duration: Infinity,
                },
            }}
        />
    );
};

export default ToastContainer;