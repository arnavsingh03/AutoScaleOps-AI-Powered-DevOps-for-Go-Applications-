package services

import (
	"context"

	"github.com/arnavsingh03/AutoScaleOps-AI-Powered-DevOps-for-Go-Applications-/dining-app-backend/internal/core/domain"
	"github.com/arnavsingh03/AutoScaleOps-AI-Powered-DevOps-for-Go-Applications-/dining-app-backend/internal/core/ports"
	"github.com/arnavsingh03/AutoScaleOps-AI-Powered-DevOps-for-Go-Applications-/dining-app-backend/internal/infrastructure/logger"
	"go.uber.org/zap"
)

type restaurantService struct {
	restaurantRepo ports.RestaurantRepository
	logger         *logger.Logger
}

func (s *restaurantService) GetByID(ctx context.Context, id int64) (*domain.Restaurant, error) {
	s.logger.Info("Getting restaurant by ID", zap.Int64("restaurantID", id))

	restaurant, err := s.restaurantRepo.GetByID(ctx, id)
	if err != nil {
		s.logger.Error("Failed to get restaurant",
			zap.Int64("restaurantID", id),
			zap.Error(err),
		)
		return nil, err
	}
	return restaurant, nil
}

func (s *restaurantService) Create(ctx context.Context, restaurant *domain.Restaurant) error {
	s.logger.Info("Creating restaurant", zap.String("name", restaurant.Name))
	return s.restaurantRepo.Create(ctx, restaurant)
}

func (s *restaurantService) Delete(ctx context.Context, id int64) error {
	s.logger.Info("Deleting restaurant", zap.Int64("restaurantID", id))
	return s.restaurantRepo.Delete(ctx, id)
}

func (s *restaurantService) List(ctx context.Context, offset, limit int) ([]*domain.Restaurant, error) {
	s.logger.Info("Listing restaurants", zap.Int("offset", offset), zap.Int("limit", limit))
	return s.restaurantRepo.List(ctx, offset, limit)
}
func (s *restaurantService) Update(ctx context.Context, restaurant *domain.Restaurant) error {
	s.logger.Info("Updating restaurant", zap.Int64("restaurantID", restaurant.ID))
	return s.restaurantRepo.Update(ctx, restaurant)
}
func NewRestaurantService(restaurantRepo ports.RestaurantRepository, logger *logger.Logger) *restaurantService {
	return &restaurantService{
		restaurantRepo: restaurantRepo,
		logger:         logger,
	}
}
