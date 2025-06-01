package dto

import "time"

// CreateBookingRequest represents the request body for creating a booking
type CreateBookingRequest struct {
	TableID        int64  `json:"table_id" validate:"required"`
	BookingDate    string `json:"booking_date" validate:"required"`
	StartTime      string `json:"start_time" validate:"required"`
	EndTime        string `json:"end_time" validate:"required"`
	NumberOfGuests int    `json:"number_of_guests" validate:"required,min=1"`
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
