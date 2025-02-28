import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { restaurantAPI } from '../../services/api';

export const fetchRestaurants = createAsyncThunk(
    'restaurants/fetchAll',
    async (params, { rejectWithValue }) => {
        try {
            const response = await restaurantAPI.getAll(params);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to fetch restaurants');
        }
    }
);

export const fetchRestaurantById = createAsyncThunk(
    'restaurants/fetchById',
    async (id, { rejectWithValue }) => {
        try {
            const response = await restaurantAPI.getById(id);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to fetch restaurant');
        }
    }
);

const restaurantSlice = createSlice({
    name: 'restaurants',
    initialState: {
        list: [],
        currentRestaurant: null,
        loading: false,
        error: null,
    },
    reducers: {
        clearCurrentRestaurant: (state) => {
            state.currentRestaurant = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch all restaurants
            .addCase(fetchRestaurants.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchRestaurants.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload;
            })
            .addCase(fetchRestaurants.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Fetch restaurant by ID
            .addCase(fetchRestaurantById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchRestaurantById.fulfilled, (state, action) => {
                state.loading = false;
                state.currentRestaurant = action.payload;
            })
            .addCase(fetchRestaurantById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearCurrentRestaurant } = restaurantSlice.actions;
export default restaurantSlice.reducer;