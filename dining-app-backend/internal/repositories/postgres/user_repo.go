package postgres

import (
    "context"
    "database/sql"
    "github.com/jmoiron/sqlx"
    "github.com/arnavsingh03/dining-app/internal/core/domain"
    "github.com/arnavsingh03/dining-app/pkg/apperrors"
)

type userRepository struct {
    db *sqlx.DB
}

func NewUserRepository(db *sqlx.DB) *userRepository {
    return &userRepository{
        db: db,
    }
}

func (r *userRepository) Create(ctx context.Context, user *domain.User) error {
    query := `
        INSERT INTO users (name, email, password, role)
        VALUES ($1, $2, $3, $4)
        RETURNING id, created_at, updated_at`

    err := r.db.QueryRowContext(
        ctx,
        query,
        user.Name,
        user.Email,
        user.Password,
        user.Role,
    ).Scan(&user.ID, &user.CreatedAt, &user.UpdatedAt)

    if err != nil {
        // Check for unique constraint violation
        if isPgUniqueViolation(err) {
            return apperrors.NewError(apperrors.ErrorTypeValidation, "email already exists", err)
        }
        return apperrors.NewError(apperrors.ErrorTypeInternal, "failed to create user", err)
    }

    return nil
}

func (r *userRepository) GetByID(ctx context.Context, id int64) (*domain.User, error) {
    var user domain.User
    query := `
        SELECT id, name, email, role, created_at, updated_at
        FROM users
        WHERE id = $1`

    err := r.db.GetContext(ctx, &user, query, id)
    if err != nil {
        if err == sql.ErrNoRows {
            return nil, apperrors.NewError(apperrors.ErrorTypeNotFound, "user not found", nil)
        }
        return nil, apperrors.NewError(apperrors.ErrorTypeInternal, "failed to get user", err)
    }

    return &user, nil
}

func (r *userRepository) GetByEmail(ctx context.Context, email string) (*domain.User, error) {
    var user domain.User
    query := `
        SELECT id, name, email, password, role, created_at, updated_at
        FROM users
        WHERE email = $1`

    err := r.db.GetContext(ctx, &user, query, email)
    if err != nil {
        if err == sql.ErrNoRows {
            return nil, apperrors.NewError(apperrors.ErrorTypeNotFound, "user not found", nil)
        }
        return nil, apperrors.NewError(apperrors.ErrorTypeInternal, "failed to get user", err)
    }

    return &user, nil
}

func (r *userRepository) Update(ctx context.Context, user *domain.User) error {
    query := `
        UPDATE users
        SET name = $1, email = $2, updated_at = CURRENT_TIMESTAMP
        WHERE id = $3
        RETURNING updated_at`

    err := r.db.QueryRowContext(
        ctx,
        query,
        user.Name,
        user.Email,
        user.ID,
    ).Scan(&user.UpdatedAt)

    if err != nil {
        if err == sql.ErrNoRows {
            return apperrors.NewError(apperrors.ErrorTypeNotFound, "user not found", nil)
        }
        if isPgUniqueViolation(err) {
            return apperrors.NewError(apperrors.ErrorTypeValidation, "email already exists", err)
        }
        return apperrors.NewError(apperrors.ErrorTypeInternal, "failed to update user", err)
    }

    return nil
}

func (r *userRepository) Delete(ctx context.Context, id int64) error {
    query := `DELETE FROM users WHERE id = $1`

    result, err := r.db.ExecContext(ctx, query, id)
    if err != nil {
        return apperrors.NewError(apperrors.ErrorTypeInternal, "failed to delete user", err)
    }

    rowsAffected, err := result.RowsAffected()
    if err != nil {
        return apperrors.NewError(apperrors.ErrorTypeInternal, "failed to get affected rows", err)
    }

    if rowsAffected == 0 {
        return apperrors.NewError(apperrors.ErrorTypeNotFound, "user not found", nil)
    }

    return nil
}