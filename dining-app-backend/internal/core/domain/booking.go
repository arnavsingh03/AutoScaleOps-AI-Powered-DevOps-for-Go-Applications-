package domain

import (
	"time"
)

type BookingStatus string

const (
	BookingStatusPending   BookingStatus = "pending"
	BookingStatusConfirmed BookingStatus = "confirmed"
	BookingStatusCancelled BookingStatus = "cancelled"
)

type Booking struct {
	ID              int64         `json:"id" db:"id"`
	UserID          int64         `json:"user_id" db:"user_id"`
	TableID         int64         `json:"table_id" db:"table_id"`
	BookingDate     time.Time     `json:"booking_date" db:"booking_date"`
	StartTime       string        `json:"start_time" db:"start_time"`
	EndTime         string        `json:"end_time" db:"end_time"`
	NumberOfGuests  int           `json:"number_of_guests" db:"number_of_guests"`
	Status          BookingStatus `json:"status" db:"status"`
	SpecialRequests string        `json:"special_requests" db:"special_requests"`
	CreatedAt       time.Time     `json:"created_at" db:"created_at"`
	UpdatedAt       time.Time     `json:"updated_at" db:"updated_at"`
	TableNumber     string        `json:"table_number" db:"table_number"`
	RestaurantName  string        `json:"restaurant_name" db:"restaurant_name"`
}
