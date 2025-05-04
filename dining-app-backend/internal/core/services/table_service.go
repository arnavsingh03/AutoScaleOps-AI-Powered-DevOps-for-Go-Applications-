package services

import (
	"context"

	"github.com/arnavsingh03/AutoScaleOps-AI-Powered-DevOps-for-Go-Applications-/internal/core/domain"
	"github.com/arnavsingh03/AutoScaleOps-AI-Powered-DevOps-for-Go-Applications-/internal/core/ports"
	"github.com/arnavsingh03/AutoScaleOps-AI-Powered-DevOps-for-Go-Applications-/internal/infrastructure/logger"
	"github.com/arnavsingh03/AutoScaleOps-AI-Powered-DevOps-for-Go-Applications-/pkg/apperrors"
	"go.uber.org/zap"
)

type tableService struct {
	tableRepo      ports.TableRepository
	restaurantRepo ports.RestaurantRepository
	logger         *logger.Logger
}

func NewTableService(
	tableRepo ports.TableRepository,
	restaurantRepo ports.RestaurantRepository,
	logger *logger.Logger,
) *tableService {
	return &tableService{
		tableRepo:      tableRepo,
		restaurantRepo: restaurantRepo,
		logger:         logger,
	}
}

func (s *tableService) CreateTable(ctx context.Context, restaurantID int64, table *domain.Table) error {
	s.logger.Info("Creating new table",
		zap.Int64("restaurantID", restaurantID),
		zap.Int("tableNumber", table.TableNumber),
		zap.Int("capacity", table.Capacity),
	)

	// Verify restaurant exists
	restaurant, err := s.restaurantRepo.GetByID(ctx, restaurantID)
	if err != nil {
		s.logger.Error("Failed to get restaurant",
			zap.Int64("restaurantID", restaurantID),
			zap.Error(err),
		)
		return err
	}

	if restaurant == nil {
		return apperrors.NewError(apperrors.ErrorTypeNotFound, "restaurant not found", nil)
	}

	// Check if table number already exists for this restaurant
	existingTables, err := s.tableRepo.GetByRestaurantID(ctx, restaurantID)
	if err != nil {
		s.logger.Error("Failed to check existing tables", zap.Error(err))
		return err
	}

	for _, existingTable := range existingTables {
		if existingTable.TableNumber == table.TableNumber {
			return apperrors.NewError(apperrors.ErrorTypeValidation, "table number already exists", nil)
		}
	}

	table.RestaurantID = restaurantID
	table.IsAvailable = true // Default to available

	if err := s.tableRepo.Create(ctx, table); err != nil {
		s.logger.Error("Failed to create table", zap.Error(err))
		return err
	}

	s.logger.Info("Table created successfully",
		zap.Int64("tableID", table.ID),
		zap.Int64("restaurantID", restaurantID),
	)
	return nil
}

func (s *tableService) GetRestaurantTables(ctx context.Context, restaurantID int64) ([]*domain.Table, error) {
	s.logger.Info("Fetching restaurant tables", zap.Int64("restaurantID", restaurantID))

	// Verify restaurant exists
	restaurant, err := s.restaurantRepo.GetByID(ctx, restaurantID)
	if err != nil {
		s.logger.Error("Failed to get restaurant",
			zap.Int64("restaurantID", restaurantID),
			zap.Error(err),
		)
		return nil, err
	}

	if restaurant == nil {
		return nil, apperrors.NewError(apperrors.ErrorTypeNotFound, "restaurant not found", nil)
	}

	tables, err := s.tableRepo.GetByRestaurantID(ctx, restaurantID)
	if err != nil {
		s.logger.Error("Failed to get restaurant tables", zap.Error(err))
		return nil, err
	}

	return tables, nil
}

func (s *tableService) UpdateTableAvailability(ctx context.Context, tableID int64, isAvailable bool) error {
	s.logger.Info("Updating table availability",
		zap.Int64("tableID", tableID),
		zap.Bool("isAvailable", isAvailable),
	)

	// Verify table exists
	table, err := s.tableRepo.GetByID(ctx, tableID)
	if err != nil {
		s.logger.Error("Failed to get table",
			zap.Int64("tableID", tableID),
			zap.Error(err),
		)
		return err
	}

	if table == nil {
		return apperrors.NewError(apperrors.ErrorTypeNotFound, "table not found", nil)
	}

	if err := s.tableRepo.UpdateAvailability(ctx, tableID, isAvailable); err != nil {
		s.logger.Error("Failed to update table availability", zap.Error(err))
		return err
	}

	s.logger.Info("Table availability updated successfully",
		zap.Int64("tableID", tableID),
		zap.Bool("isAvailable", isAvailable),
	)
	return nil
}
