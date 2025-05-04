package services

import (
    "context"
    "github.com/arnavsingh03/AutoScaleOps-AI-Powered-DevOps-for-Go-Applications-/dining-app-backend/internal/core/domain"
    "github.com/arnavsingh03/AutoScaleOps-AI-Powered-DevOps-for-Go-Applications-/dining-app-backend/internal/core/ports"
    "github.com/arnavsingh03/AutoScaleOps-AI-Powered-DevOps-for-Go-Applications-/dining-app-backend/pkg/apperrors"
    "github.com/arnavsingh03/AutoScaleOps-AI-Powered-DevOps-for-Go-Applications-/dining-app-backend/internal/infrastructure/logger"
    "go.uber.org/zap"
)

type restaurantService struct {
    restaurantRepo ports.RestaurantRepository
    logger         *logger.Logger
}

func NewRestaurantService(restaurantRepo ports.RestaurantRepository, logger *logger.Logger) *restaurantService {
    return &restaurantService{
        restaurantRepo: restaurantRepo,
        logger:         logger,
    }
}

func (s *restaurantService) Create(ctx context.Context, restaurant *domain.Restaurant) error {
    s.logger.Info("Creating new restaurant", 
        zap.String("name", restaurant.Name),
        zap.String("cuisine", restaurant.CuisineType),
    )

    if err := s.restaurantRepo.Create(ctx, restaurant); err != nil {
        s.logger.Error("Failed to create restaurant", 
            zap.String("name", restaurant.Name),
            zap.Error(err),
        )
        return err
    }

    s.logger.Info("Restaurant created successfully", zap.Int64("restaurantID", restaurant.ID))
    return nil
}

func (s *restaurantService) GetByID(ctx context.Context, id int64) (*domain.Restaurant, error) {
    s.logger.Info("Fetching restaurant", zap.Int64("restaurantID", id))

    restaurant, err := s.restaurantRepo.GetByID(ctx, id)
    if err != nil {
        s.logger.Error("Failed to get restaurant", zap.Int64("restaurantID", id), zap.Error(err))
        return nil, err
    }

    return restaurant, nil
}

func (s *restaurantService) List(ctx context.Context, page, pageSize int) ([]*domain.Restaurant, error) {
    s.logger.Info("Listing restaurants", zap.Int("page", page), zap.Int("pageSize", pageSize))

    if page < 1 {
        page = 1
    }
    if pageSize < 1 || pageSize > 100 {
        pageSize = 10
    }

    offset := (page - 1) * pageSize
    restaurants, err := s.restaurantRepo.List(ctx, offset, pageSize)
    if err != nil {
        s.logger.Error("Failed to list restaurants", zap.Error(err))
        return nil, err
    }

    return restaurants, nil
}

func (s *restaurantService) Update(ctx context.Context, restaurant *domain.Restaurant) error {
    s.logger.Info("Updating restaurant", zap.Int64("restaurantID", restaurant.ID))

    // Check if restaurant exists
    existing, err := s.restaurantRepo.GetByID(ctx, restaurant.ID)
    if err != nil {
        s.logger.Error("Failed to get restaurant for update", 
            zap.Int64("restaurantID", restaurant.ID),
            zap.Error(err),
        )
        return err
    }

    if existing == nil {
        return apperrors.NewError(apperrors.ErrorTypeNotFound, "restaurant not found", nil)
    }

    if err := s.restaurantRepo.Update(ctx, restaurant); err != nil {
        s.logger.Error("Failed to update restaurant", 
            zap.Int64("restaurantID", restaurant.ID),
            zap.Error(err),
        )
        return err
    }

    s.logger.Info("Restaurant updated successfully", zap.Int64("restaurantID", restaurant.ID))
    return nil
}

func (s *restaurantService) Delete(ctx context.Context, id int64) error {
    s.logger.Info("Deleting restaurant", zap.Int64("restaurantID", id))

    if err := s.restaurantRepo.Delete(ctx, id); err != nil {
        s.logger.Error("Failed to delete restaurant", 
            zap.Int64("restaurantID", id),
            zap.Error(err),
        )
        return err
    }

    s.logger.Info("Restaurant deleted successfully", zap.Int64("restaurantID", id))
    return nil
}