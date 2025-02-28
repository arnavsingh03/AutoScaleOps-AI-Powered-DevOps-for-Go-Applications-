package apperrors

import "net/http"

type ErrorType string

const (
    ErrorTypeValidation   ErrorType = "VALIDATION_ERROR"
    ErrorTypeNotFound     ErrorType = "NOT_FOUND"
    ErrorTypeUnauthorized ErrorType = "UNAUTHORIZED"
    ErrorTypeInternal     ErrorType = "INTERNAL_ERROR"
)

type Error struct {
    Type    ErrorType   `json:"type"`
    Message string      `json:"message"`
    Details interface{} `json:"details,omitempty"`
}

func (e *Error) Error() string {
    return e.Message
}

func NewError(errorType ErrorType, message string, details interface{}) *Error {
    return &Error{
        Type:    errorType,
        Message: message,
        Details: details,
    }
}

func GetStatusCode(err *Error) int {
    switch err.Type {
    case ErrorTypeValidation:
        return http.StatusBadRequest
    case ErrorTypeNotFound:
        return http.StatusNotFound
    case ErrorTypeUnauthorized:
        return http.StatusUnauthorized
    default:
        return http.StatusInternalServerError
    }
}