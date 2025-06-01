package domain

import (
	"time"

	"github.com/go-playground/validator/v10"
)

type Restaurant struct {
	ID          int64     `json:"id" db:"id"`
	Name        string    `json:"name" db:"name" validate:"required,min=2,max=100"`
	Description string    `json:"description" db:"description"`
	Address     string    `json:"address" db:"address" validate:"required"`
	CuisineType string    `json:"cuisine_type" db:"cuisine_type" validate:"required"`
	OpeningTime string    `json:"opening_time" db:"opening_time" validate:"required"`
	ClosingTime string    `json:"closing_time" db:"closing_time" validate:"required"`
	CreatedAt   time.Time `json:"created_at" db:"created_at"`
	UpdatedAt   time.Time `json:"updated_at" db:"updated_at"`
	Tables      []*Table  `json:"tables"`
}

func (r *Restaurant) Validate() error {
	validate := validator.New()
	return validate.Struct(r)
}
