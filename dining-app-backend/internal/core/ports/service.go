package ports

import (
    "context"
    "github.com/arnavsingh03/dining-app/internal/core/domain"
)

type UserService interface {
    Register(ctx context.Context, user *domain.User) error
    Login(ctx context.Context, email, password string) (string, *domain.User, error)
    GetProfile(ctx context.Context, userID int64) (*domain.User, error)
    UpdateProfile(ctx context.Context, user *domain.User) error
}

type RestaurantService interface {
    Create(ctx context.Context, restaurant *domain.Restaurant) error
    GetByID(ctx context.Context, id int64) (*domain.Restaurant, error)
    List(ctx context.Context, page, pageSize int) ([]*domain.Restaurant, error)
    Update(ctx context.Context, restaurant *domain.Restaurant) error
    Delete(ctx context.Context, id int64) error
}

type TableService interface {
    CreateTable(ctx context.Context, restaurantID int64, table *domain.Table) error
    GetRestaurantTables(ctx context.Context, restaurantID int64) ([]*domain.Table, error)
    UpdateTableAvailability(ctx context.Context, tableID int64, isAvailable bool) error
}

type BookingService interface {
    CreateBooking(ctx context.Context, booking *domain.Booking) error
    GetUserBookings(ctx context.Context, userID int64) ([]*domain.Booking, error)
    UpdateBookingStatus(ctx context.Context, bookingID int64, userID int64, status domain.BookingStatus) error
}