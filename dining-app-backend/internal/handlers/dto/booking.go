package dto

import "time"

// CreateBookingRequest represents the request body for creating a booking
type CreateBookingRequest struct {
    TableID         int64  `json:"table_id" binding:"required"`
    BookingDate     string `json:"booking_date" binding:"required"`
    StartTime       string `json:"start_time" binding:"required"`
    EndTime         string `json:"end_time" binding:"required"`
    NumberOfGuests  int    `json:"number_of_guests" binding:"required,min=1"`
    SpecialRequests string `json:"special_requests"`
}

// UpdateBookingStatusRequest represents the request body for updating a booking status
type UpdateBookingStatusRequest struct {
    Status string `json:"status" binding:"required,oneof=pending confirmed cancelled"`
}

// BookingResponse represents the response body for booking operations
type BookingResponse struct {
    ID              int64     `json:"id"`
    BookingDate     time.Time `json:"booking_date"`
    StartTime       string    `json:"start_time"`
    EndTime         string    `json:"end_time"`
    NumberOfGuests  int       `json:"number_of_guests"`
    Status          string    `json:"status"`
    SpecialRequests string    `json:"special_requests"`
    // You might want to add these fields if needed
    TableNumber    string `json:"table_number,omitempty"`
    RestaurantName string `json:"restaurant_name,omitempty"`
}