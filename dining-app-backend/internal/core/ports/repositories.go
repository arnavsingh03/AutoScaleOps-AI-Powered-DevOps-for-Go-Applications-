package ports

import (
	"context"
	"time"

	"github.com/arnavsingh03/dining-app/internal/core/domain"
)

type UserRepository interface {
	Create(ctx context.Context, user *domain.User) error
	GetByID(ctx context.Context, id int64) (*domain.User, error)
	GetByEmail(ctx context.Context, email string) (*domain.User, error)
	Update(ctx context.Context, user *domain.User) error
	Delete(ctx context.Context, id int64) error
}

type RestaurantRepository interface {
	Create(ctx context.Context, restaurant *domain.Restaurant) error
	GetByID(ctx context.Context, id int64) (*domain.Restaurant, error)
	List(ctx context.Context, offset, limit int) ([]*domain.Restaurant, error)
	Update(ctx context.Context, restaurant *domain.Restaurant) error
	Delete(ctx context.Context, id int64) error
}

type TableRepository interface {
	Create(ctx context.Context, table *domain.Table) error
	GetByID(ctx context.Context, id int64) (*domain.Table, error)
	GetByRestaurantID(ctx context.Context, restaurantID int64) ([]*domain.Table, error)
	UpdateAvailability(ctx context.Context, tableID int64, isAvailable bool) error
	Delete(ctx context.Context, id int64) error
}

type BookingRepository interface {
	Create(ctx context.Context, booking *domain.Booking) error
	GetByID(ctx context.Context, id int64) (*domain.Booking, error)
	GetUserBookings(ctx context.Context, userID int64) ([]*domain.Booking, error)
	CheckTableAvailability(ctx context.Context, tableID int64, date time.Time, startTime, endTime string) (bool, error)
	UpdateStatus(ctx context.Context, bookingID int64, status domain.BookingStatus) error
	Delete(ctx context.Context, id int64) error
}
