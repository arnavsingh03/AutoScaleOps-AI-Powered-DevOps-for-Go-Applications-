package postgres

import (
	"context"
	"database/sql"
	"time"

	"github.com/arnavsingh03/AutoScaleOps-AI-Powered-DevOps-for-Go-Applications-/dining-app-backend/internal/core/domain"
	"github.com/arnavsingh03/AutoScaleOps-AI-Powered-DevOps-for-Go-Applications-/dining-app-backend/pkg/apperrors"
	"github.com/jmoiron/sqlx"
)

type bookingRepository struct {
	db *sqlx.DB
}

func NewBookingRepository(db *sqlx.DB) *bookingRepository {
	return &bookingRepository{
		db: db,
	}
}

func (r *bookingRepository) Create(ctx context.Context, booking *domain.Booking) error {
	tx, err := r.db.BeginTxx(ctx, nil)
	if err != nil {
		return apperrors.NewError(apperrors.ErrorTypeInternal, "failed to start transaction", err)
	}
	defer tx.Rollback()

	// Insert booking
	query := `
        INSERT INTO bookings (
            user_id, table_id, booking_date, start_time, end_time,
            number_of_guests, status, special_requests
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING id, created_at, updated_at`

	err = tx.QueryRowContext(
		ctx,
		query,
		booking.UserID,
		booking.TableID,
		booking.BookingDate,
		booking.StartTime,
		booking.EndTime,
		booking.NumberOfGuests,
		booking.Status,
		booking.SpecialRequests,
	).Scan(&booking.ID, &booking.CreatedAt, &booking.UpdatedAt)

	if err != nil {
		return apperrors.NewError(apperrors.ErrorTypeInternal, "failed to create booking", err)
	}

	// Update table availability
	updateQuery := `
        UPDATE tables
        SET is_available = false
        WHERE id = $1`

	_, err = tx.ExecContext(ctx, updateQuery, booking.TableID)
	if err != nil {
		return apperrors.NewError(apperrors.ErrorTypeInternal, "failed to update table availability", err)
	}

	if err := tx.Commit(); err != nil {
		return apperrors.NewError(apperrors.ErrorTypeInternal, "failed to commit transaction", err)
	}

	return nil
}

func (r *bookingRepository) GetByID(ctx context.Context, id int64) (*domain.Booking, error) {
	query := `
        SELECT b.*, t.table_number, r.name as restaurant_name
        FROM bookings b
        JOIN tables t ON b.table_id = t.id
        JOIN restaurants r ON t.restaurant_id = r.id
        WHERE b.id = $1`

	var booking domain.Booking
	err := r.db.GetContext(ctx, &booking, query, id)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, apperrors.NewError(apperrors.ErrorTypeNotFound, "booking not found", nil)
		}
		return nil, apperrors.NewError(apperrors.ErrorTypeInternal, "failed to get booking", err)
	}

	return &booking, nil
}

func (r *bookingRepository) GetUserBookings(ctx context.Context, userID int64) ([]*domain.Booking, error) {
	query := `
        SELECT 
            b.id, b.user_id, b.table_id, b.booking_date, b.start_time, b.end_time,
            b.number_of_guests, b.status, b.special_requests, b.created_at, b.updated_at,
            t.table_number as "table_number", r.name as "restaurant_name"
        FROM bookings b
        LEFT JOIN tables t ON b.table_id = t.id
        LEFT JOIN restaurants r ON t.restaurant_id = r.id
        WHERE b.user_id = $1
        ORDER BY b.booking_date DESC, b.start_time DESC`

	bookings := []*domain.Booking{}
	err := r.db.SelectContext(ctx, &bookings, query, userID)
	if err != nil {
		return nil, apperrors.NewError(apperrors.ErrorTypeInternal, "failed to get user bookings", err)
	}

	return bookings, nil
}

func (r *bookingRepository) CheckTableAvailability(ctx context.Context, tableID int64, date time.Time, startTime, endTime string) (bool, error) {
	query := `
        SELECT COUNT(*)
        FROM bookings
        WHERE table_id = $1
        AND booking_date = $2
        AND status != 'cancelled'
        AND (
            (start_time <= $3 AND end_time > $3)
            OR (start_time < $4 AND end_time >= $4)
            OR (start_time >= $3 AND end_time <= $4)
        )`

	var count int
	err := r.db.GetContext(ctx, &count, query, tableID, date, startTime, endTime)
	if err != nil {
		return false, apperrors.NewError(apperrors.ErrorTypeInternal, "failed to check table availability", err)
	}

	return count == 0, nil
}

func (r *bookingRepository) UpdateStatus(ctx context.Context, bookingID int64, status domain.BookingStatus) error {
	tx, err := r.db.BeginTxx(ctx, nil)
	if err != nil {
		return apperrors.NewError(apperrors.ErrorTypeInternal, "failed to start transaction", err)
	}
	defer tx.Rollback()

	query := `
        UPDATE bookings
        SET status = $1, updated_at = CURRENT_TIMESTAMP
        WHERE id = $2
        RETURNING updated_at`

	var updatedAt sql.NullTime
	err = tx.QueryRowContext(ctx, query, status, bookingID).Scan(&updatedAt)
	if err != nil {
		if err == sql.ErrNoRows {
			return apperrors.NewError(apperrors.ErrorTypeNotFound, "booking not found", nil)
		}
		return apperrors.NewError(apperrors.ErrorTypeInternal, "failed to update booking status", err)
	}

	// If booking is cancelled, make the table available again
	if status == domain.BookingStatusCancelled {
		updateTableQuery := `
            UPDATE tables t
            SET is_available = true
            FROM bookings b
            WHERE b.id = $1 AND t.id = b.table_id`

		_, err = tx.ExecContext(ctx, updateTableQuery, bookingID)
		if err != nil {
			return apperrors.NewError(apperrors.ErrorTypeInternal, "failed to update table availability", err)
		}
	}

	if err := tx.Commit(); err != nil {
		return apperrors.NewError(apperrors.ErrorTypeInternal, "failed to commit transaction", err)
	}

	return nil
}

func (r *bookingRepository) Delete(ctx context.Context, id int64) error {
	query := `DELETE FROM bookings WHERE id = $1`

	result, err := r.db.ExecContext(ctx, query, id)
	if err != nil {
		return apperrors.NewError(apperrors.ErrorTypeInternal, "failed to delete booking", err)
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return apperrors.NewError(apperrors.ErrorTypeInternal, "failed to get affected rows", err)
	}

	if rowsAffected == 0 {
		return apperrors.NewError(apperrors.ErrorTypeNotFound, "booking not found", nil)
	}

	return nil
}
