package services

import (
    "context"
    "time"
    "github.com/arnavsingh03/dining-app/internal/core/domain"
    "github.com/arnavsingh03/dining-app/internal/core/ports"
    "github.com/arnavsingh03/dining-app/pkg/apperrors"
    "github.com/arnavsingh03/dining-app/internal/infrastructure/logger"
    "go.uber.org/zap"
)

type bookingService struct {
    bookingRepo    ports.BookingRepository
    tableRepo      ports.TableRepository
    restaurantRepo ports.RestaurantRepository
    logger         *logger.Logger
}

func NewBookingService(
    bookingRepo ports.BookingRepository,
    tableRepo ports.TableRepository,
    restaurantRepo ports.RestaurantRepository,
    logger *logger.Logger,
) *bookingService {
    return &bookingService{
        bookingRepo:    bookingRepo,
        tableRepo:      tableRepo,
        restaurantRepo: restaurantRepo,
        logger:         logger,
    }
}

func (s *bookingService) CreateBooking(ctx context.Context, booking *domain.Booking) error {
    s.logger.Info("Creating new booking",
        zap.Int64("userID", booking.UserID),
        zap.Int64("tableID", booking.TableID),
        zap.Time("bookingDate", booking.BookingDate),
    )

    // Validate booking date is in the future
    if booking.BookingDate.Before(time.Now().Truncate(24 * time.Hour)) {
        return apperrors.NewError(apperrors.ErrorTypeValidation, "booking date must be in the future", nil)
    }

    // Check if table exists and has sufficient capacity
    table, err := s.tableRepo.GetByID(ctx, booking.TableID)
    if err != nil {
        s.logger.Error("Failed to get table", zap.Error(err))
        return err
    }

    if !table.IsAvailable {
        return apperrors.NewError(apperrors.ErrorTypeValidation, "table is not available", nil)
    }

    if table.Capacity < booking.NumberOfGuests {
        return apperrors.NewError(apperrors.ErrorTypeValidation, "table capacity is insufficient", nil)
    }

    // Check table availability for the requested time
    isAvailable, err := s.bookingRepo.CheckTableAvailability(
        ctx,
        booking.TableID,
        booking.BookingDate,
        booking.StartTime,
        booking.EndTime,
    )
    if err != nil {
        s.logger.Error("Failed to check table availability", zap.Error(err))
        return err
    }

    if !isAvailable {
        return apperrors.NewError(apperrors.ErrorTypeValidation, "table is not available for the requested time", nil)
    }

    booking.Status = domain.BookingStatusPending

    // Create booking in a transaction
    err = s.bookingRepo.Create(ctx, booking)
    if err != nil {
        s.logger.Error("Failed to create booking", zap.Error(err))
        return err
    }

    s.logger.Info("Booking created successfully",
        zap.Int64("bookingID", booking.ID),
        zap.String("status", string(booking.Status)),
    )
    return nil
}

func (s *bookingService) GetUserBookings(ctx context.Context, userID int64) ([]*domain.Booking, error) {
    s.logger.Info("Fetching user bookings", zap.Int64("userID", userID))

    bookings, err := s.bookingRepo.GetUserBookings(ctx, userID)
    if err != nil {
        s.logger.Error("Failed to get user bookings",
            zap.Int64("userID", userID),
            zap.Error(err),
        )
        return nil, err
    }

    return bookings, nil
}

func (s *bookingService) UpdateBookingStatus(ctx context.Context, bookingID int64, userID int64, status domain.BookingStatus) error {
    s.logger.Info("Updating booking status",
        zap.Int64("bookingID", bookingID),
        zap.Int64("userID", userID),
        zap.String("status", string(status)),
    )

    // Verify booking exists and belongs to user
    booking, err := s.bookingRepo.GetByID(ctx, bookingID)
    if err != nil {
        s.logger.Error("Failed to get booking", zap.Error(err))
        return err
    }

    if booking.UserID != userID {
        return apperrors.NewError(apperrors.ErrorTypeUnauthorized, "unauthorized to update this booking", nil)
    }

    // Validate status transition
    if !isValidStatusTransition(booking.Status, status) {
        return apperrors.NewError(apperrors.ErrorTypeValidation, "invalid status transition", nil)
    }

    if err := s.bookingRepo.UpdateStatus(ctx, bookingID, status); err != nil {
        s.logger.Error("Failed to update booking status", zap.Error(err))
        return err
    }

    s.logger.Info("Booking status updated successfully",
        zap.Int64("bookingID", bookingID),
        zap.String("status", string(status)),
    )
    return nil
}

// Helper function to validate booking status transitions
func isValidStatusTransition(current, new domain.BookingStatus) bool {
    switch current {
    case domain.BookingStatusPending:
        return new == domain.BookingStatusConfirmed || new == domain.BookingStatusCancelled
    case domain.BookingStatusConfirmed:
        return new == domain.BookingStatusCancelled
    case domain.BookingStatusCancelled:
        return false // Cannot transition from cancelled
    default:
        return false
    }
}