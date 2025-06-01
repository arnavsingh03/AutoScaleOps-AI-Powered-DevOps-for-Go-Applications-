package postgres

import (
	"context"
	"database/sql"

	"github.com/arnavsingh03/AutoScaleOps-AI-Powered-DevOps-for-Go-Applications-/dining-app-backend/internal/core/domain"
	"github.com/arnavsingh03/AutoScaleOps-AI-Powered-DevOps-for-Go-Applications-/dining-app-backend/pkg/apperrors"
	"github.com/jmoiron/sqlx"
)

type TableRepository struct {
	db *sqlx.DB
}

func NewTableRepository(db *sqlx.DB) *TableRepository {
	return &TableRepository{
		db: db,
	}
}

func (r *TableRepository) Create(ctx context.Context, table *domain.Table) error {
	query := `
        INSERT INTO tables (
            restaurant_id, table_number, capacity, is_available
        )
        VALUES ($1, $2, $3, $4)
        RETURNING id, created_at, updated_at`

	err := r.db.QueryRowContext(
		ctx,
		query,
		table.RestaurantID,
		table.TableNumber,
		table.Capacity,
		table.IsAvailable,
	).Scan(&table.ID, &table.CreatedAt, &table.UpdatedAt)

	if err != nil {
		if isPgUniqueViolation(err) {
			return apperrors.NewError(apperrors.ErrorTypeValidation, "table number already exists for this restaurant", err)
		}
		return apperrors.NewError(apperrors.ErrorTypeInternal, "failed to create table", err)
	}

	return nil
}

func (r *TableRepository) GetByID(ctx context.Context, id int64) (*domain.Table, error) {
	var table domain.Table
	query := `
        SELECT id, restaurant_id, table_number, capacity, 
               is_available, created_at, updated_at
        FROM tables
        WHERE id = $1`

	err := r.db.GetContext(ctx, &table, query, id)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, apperrors.NewError(apperrors.ErrorTypeNotFound, "table not found", nil)
		}
		return nil, apperrors.NewError(apperrors.ErrorTypeInternal, "failed to get table", err)
	}

	return &table, nil
}

func (r *TableRepository) GetByRestaurantID(ctx context.Context, restaurantID int64) ([]*domain.Table, error) {
	query := `
        SELECT id, restaurant_id, table_number, capacity, 
               is_available, created_at, updated_at
        FROM tables
        WHERE restaurant_id = $1
        ORDER BY table_number`

	tables := []*domain.Table{}
	err := r.db.SelectContext(ctx, &tables, query, restaurantID)
	if err != nil {
		return nil, apperrors.NewError(apperrors.ErrorTypeInternal, "failed to get restaurant tables", err)
	}

	return tables, nil
}

func (r *TableRepository) UpdateAvailability(ctx context.Context, tableID int64, isAvailable bool) error {
	query := `
        UPDATE tables
        SET is_available = $1, updated_at = CURRENT_TIMESTAMP
        WHERE id = $2
        RETURNING updated_at`

	var updatedAt sql.NullTime
	err := r.db.QueryRowContext(ctx, query, isAvailable, tableID).Scan(&updatedAt)
	if err != nil {
		if err == sql.ErrNoRows {
			return apperrors.NewError(apperrors.ErrorTypeNotFound, "table not found", nil)
		}
		return apperrors.NewError(apperrors.ErrorTypeInternal, "failed to update table availability", err)
	}

	return nil
}

func (r *TableRepository) Delete(ctx context.Context, id int64) error {
	query := `DELETE FROM tables WHERE id = $1`

	result, err := r.db.ExecContext(ctx, query, id)
	if err != nil {
		return apperrors.NewError(apperrors.ErrorTypeInternal, "failed to delete table", err)
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return apperrors.NewError(apperrors.ErrorTypeInternal, "failed to get affected rows", err)
	}

	if rowsAffected == 0 {
		return apperrors.NewError(apperrors.ErrorTypeNotFound, "table not found", nil)
	}

	return nil
}
