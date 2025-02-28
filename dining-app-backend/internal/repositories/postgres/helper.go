package postgres

import (
    "github.com/lib/pq"
)

const (
    uniqueViolationCode = "23505"
)

// isPgUniqueViolation checks if the error is a PostgreSQL unique constraint violation
func isPgUniqueViolation(err error) bool {
    if pqErr, ok := err.(*pq.Error); ok {
        return pqErr.Code == uniqueViolationCode
    }
    return false
}