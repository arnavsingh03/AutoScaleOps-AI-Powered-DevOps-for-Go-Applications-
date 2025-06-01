package domain

import (
	"time"

	"github.com/go-playground/validator/v10"
)

type Table struct {
	ID           int64     `json:"id" db:"id"`
	RestaurantID int64     `json:"restaurant_id" db:"restaurant_id"`
	TableNumber  string    `json:"table_number" db:"table_number"`
	Capacity     int       `json:"capacity" db:"capacity" validate:"required,min=1"`
	IsAvailable  bool      `json:"is_available" db:"is_available"`
	CreatedAt    time.Time `json:"created_at" db:"created_at"`
	UpdatedAt    time.Time `json:"updated_at" db:"updated_at"`
}

func (t *Table) Validate() error {
	validate := validator.New()
	return validate.Struct(t)
}
