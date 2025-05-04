package postgres

import (
    "context"
    "database/sql"
    "github.com/jmoiron/sqlx"
    "github.com/arnavsingh03/AutoScaleOps-AI-Powered-DevOps-for-Go-Applications-/internal/core/domain"
    "github.com/arnavsingh03/AutoScaleOps-AI-Powered-DevOps-for-Go-Applications-/pkg/apperrors"
)

type restaurantRepository struct {
    db *sqlx.DB
}

func NewRestaurantRepository(db *sqlx.DB) *restaurantRepository {
    return &restaurantRepository{
        db: db,
    }
}

func (r *restaurantRepository) Create(ctx context.Context, restaurant *domain.Restaurant) error {
    query := `
        INSERT INTO restaurants (
            name, description, address, cuisine_type, opening_time, closing_time
        )
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id, created_at, updated_at`

    err := r.db.QueryRowContext(
        ctx,
        query,
        restaurant.Name,
        restaurant.Description,
        restaurant.Address,
        restaurant.CuisineType,
        restaurant.OpeningTime,
        restaurant.ClosingTime,
    ).Scan(&restaurant.ID, &restaurant.CreatedAt, &restaurant.UpdatedAt)

    if err != nil {
        if isPgUniqueViolation(err) {
            return apperrors.NewError(apperrors.ErrorTypeValidation, "restaurant already exists", err)
        }
        return apperrors.NewError(apperrors.ErrorTypeInternal, "failed to create restaurant", err)
    }

    return nil
}

func (r *restaurantRepository) GetByID(ctx context.Context, id int64) (*domain.Restaurant, error) {
    var restaurant domain.Restaurant
    query := `
        SELECT id, name, description, address, cuisine_type, 
               opening_time, closing_time, created_at, updated_at
        FROM restaurants
        WHERE id = $1`

    err := r.db.GetContext(ctx, &restaurant, query, id)
    if err != nil {
        if err == sql.ErrNoRows {
            return nil, apperrors.NewError(apperrors.ErrorTypeNotFound, "restaurant not found", nil)
        }
        return nil, apperrors.NewError(apperrors.ErrorTypeInternal, "failed to get restaurant", err)
    }

    return &restaurant, nil
}

func (r *restaurantRepository) List(ctx context.Context, offset, limit int) ([]*domain.Restaurant, error) {
    query := `
        SELECT id, name, description, address, cuisine_type, 
               opening_time, closing_time, created_at, updated_at
        FROM restaurants
        ORDER BY name
        LIMIT $1 OFFSET $2`

    restaurants := []*domain.Restaurant{}
    err := r.db.SelectContext(ctx, &restaurants, query, limit, offset)
    if err != nil {
        return nil, apperrors.NewError(apperrors.ErrorTypeInternal, "failed to list restaurants", err)
    }

    return restaurants, nil
}

func (r *restaurantRepository) Update(ctx context.Context, restaurant *domain.Restaurant) error {
    query := `
        UPDATE restaurants
        SET name = $1, description = $2, address = $3, 
            cuisine_type = $4, opening_time = $5, closing_time = $6,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $7
        RETURNING updated_at`

    err := r.db.QueryRowContext(
        ctx,
        query,
        restaurant.Name,
        restaurant.Description,
        restaurant.Address,
        restaurant.CuisineType,
        restaurant.OpeningTime,
        restaurant.ClosingTime,
        restaurant.ID,
    ).Scan(&restaurant.UpdatedAt)

    if err != nil {
        if err == sql.ErrNoRows {
            return apperrors.NewError(apperrors.ErrorTypeNotFound, "restaurant not found", nil)
        }
        return apperrors.NewError(apperrors.ErrorTypeInternal, "failed to update restaurant", err)
    }

    return nil
}

func (r *restaurantRepository) Delete(ctx context.Context, id int64) error {
    query := `DELETE FROM restaurants WHERE id = $1`

    result, err := r.db.ExecContext(ctx, query, id)
    if err != nil {
        return apperrors.NewError(apperrors.ErrorTypeInternal, "failed to delete restaurant", err)
    }

    rowsAffected, err := result.RowsAffected()
    if err != nil {
        return apperrors.NewError(apperrors.ErrorTypeInternal, "failed to get affected rows", err)
    }

    if rowsAffected == 0 {
        return apperrors.NewError(apperrors.ErrorTypeNotFound, "restaurant not found", nil)
    }

    return nil
}