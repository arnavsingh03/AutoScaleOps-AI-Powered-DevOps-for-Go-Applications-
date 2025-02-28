import { useState, useCallback } from 'react';
import { toast } from 'react-hot-toast';

export const useLoadingState = (initialState = false) => {
    const [isLoading, setIsLoading] = useState(initialState);

    const withLoading = useCallback(async (action, errorMessage = 'An error occurred') => {
        setIsLoading(true);
        try {
            const result = await action();
            return result;
        } catch (error) {
            toast.error(errorMessage);
            console.error(error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, []);

    return [isLoading, withLoading];
};