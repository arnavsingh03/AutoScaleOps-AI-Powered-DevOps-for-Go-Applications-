package domain

import (
    "time"
    "github.com/go-playground/validator/v10"
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
    BookingDate     time.Time     `json:"booking_date" db:"booking_date" validate:"required,future"`
    StartTime       string        `json:"start_time" db:"start_time" validate:"required"`
    EndTime         string        `json:"end_time" db:"end_time" validate:"required,gtfield=StartTime"`
    NumberOfGuests  int          `json:"number_of_guests" db:"number_of_guests" validate:"required,min=1"`
    Status          BookingStatus `json:"status" db:"status"`
    SpecialRequests string        `json:"special_requests" db:"special_requests"`
    CreatedAt       time.Time     `json:"created_at" db:"created_at"`
    UpdatedAt       time.Time     `json:"updated_at" db:"updated_at"`
}

func (b *Booking) Validate() error {
    validate := validator.New()
    validate.RegisterValidation("future", validateFutureDate)
    return validate.Struct(b)
}

func validateFutureDate(fl validator.FieldLevel) bool {
    date, ok := fl.Field().Interface().(time.Time)
    if !ok {
        return false
    }
    return date.After(time.Now())
}