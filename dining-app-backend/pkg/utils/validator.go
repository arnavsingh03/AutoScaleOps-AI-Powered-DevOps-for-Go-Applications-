package utils

import (
	"reflect"
	"regexp"
	"strings"
	"time"

	"github.com/go-playground/validator/v10"
)

// CustomValidator wraps the validator.Validate instance
type CustomValidator struct {
	validator *validator.Validate
}

// NewCustomValidator creates a new validator instance with custom validations
func NewCustomValidator() *CustomValidator {
	v := validator.New()

	// Register custom validation tags
	v.RegisterValidation("phone", validatePhone)
	v.RegisterValidation("password", validatePassword)
	v.RegisterValidation("time", validateTime)
	v.RegisterValidation("future", validateFutureDate)

	// Register function to get json tag names
	v.RegisterTagNameFunc(func(fld reflect.StructField) string {
		name := strings.SplitN(fld.Tag.Get("json"), ",", 2)[0]
		if name == "-" {
			return ""
		}
		return name
	})

	return &CustomValidator{validator: v}
}

// Validate validates a struct based on validation tags
func (cv *CustomValidator) Validate(i interface{}) error {
	return cv.validator.Struct(i)
}

// validatePhone validates phone numbers
func validatePhone(fl validator.FieldLevel) bool {
	phone := fl.Field().String()
	phoneRegex := regexp.MustCompile(`^\+?[1-9]\d{1,14}$`)
	return phoneRegex.MatchString(phone)
}

// validatePassword validates password strength
func validatePassword(fl validator.FieldLevel) bool {
	password := fl.Field().String()
	// At least 8 characters, 1 uppercase, 1 lowercase, 1 number
	hasMinLen := len(password) >= 8
	hasUpper := regexp.MustCompile(`[A-Z]`).MatchString(password)
	hasLower := regexp.MustCompile(`[a-z]`).MatchString(password)
	hasNumber := regexp.MustCompile(`[0-9]`).MatchString(password)

	return hasMinLen && hasUpper && hasLower && hasNumber
}

// validateTime validates time format (HH:MM)
func validateTime(fl validator.FieldLevel) bool {
	timeStr := fl.Field().String()
	// Allow both HH:MM and HH:MM:SS formats, and be more lenient with hours
	timeRegex := regexp.MustCompile(`^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$`)
	return timeRegex.MatchString(timeStr)
}

// validateFutureDate validates that a date is in the future
func validateFutureDate(fl validator.FieldLevel) bool {
	date, ok := fl.Field().Interface().(time.Time)
	if !ok {
		return false
	}
	return date.After(time.Now())
}

// ValidationError represents a validation error
type ValidationError struct {
	Field string `json:"field"`
	Tag   string `json:"tag"`
	Value string `json:"value"`
}

// FormatValidationErrors formats validator.ValidationErrors into a more user-friendly format
func (cv *CustomValidator) FormatValidationErrors(err error) []ValidationError {
	if err == nil {
		return nil
	}

	var errors []ValidationError
	for _, err := range err.(validator.ValidationErrors) {
		errors = append(errors, ValidationError{
			Field: err.Field(),
			Tag:   err.Tag(),
			Value: err.Param(),
		})
	}

	return errors
}
