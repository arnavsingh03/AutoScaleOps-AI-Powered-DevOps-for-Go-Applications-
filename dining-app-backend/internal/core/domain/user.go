package domain

import (
	"time"

	"github.com/go-playground/validator/v10"
)

const (
	RoleUser  = "user"
	RoleAdmin = "admin"
)

type User struct {
	ID        int64     `json:"id" db:"id"`
	Name      string    `json:"name" db:"name" validate:"required,min=2,max=100"`
	Email     string    `json:"email" db:"email" validate:"required,email"`
	Password  string    `json:"password,omitempty" db:"password" validate:"required,min=6"`
	Role      string    `json:"role" db:"role"` // Remove required validation
	CreatedAt time.Time `json:"created_at" db:"created_at"`
	UpdatedAt time.Time `json:"updated_at" db:"updated_at"`
}

func (u *User) Validate() error {
	validate := validator.New()
	return validate.Struct(u)
}

// New method to set defaults
func (u *User) SetDefaults() {
	if u.Role == "" {
		u.Role = RoleUser
	}
}
