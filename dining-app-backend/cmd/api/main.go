package main

import (
	"log"
	"github.com/arnavsingh03/AutoScaleOps-AI-Powered-DevOps-for-Go-Applications-/dining-app-backend/internal/core/config"
	"github.com/arnavsingh03/AutoScaleOps-AI-Powered-DevOps-for-Go-Applications-/dining-app-backend/internal/core/services"
	"github.com/arnavsingh03/AutoScaleOps-AI-Powered-DevOps-for-Go-Applications-/dining-app-backend/internal/handlers"
	"github.com/arnavsingh03/AutoScaleOps-AI-Powered-DevOps-for-Go-Applications-/dining-app-backend/internal/infrastructure/database"
	"github.com/arnavsingh03/AutoScaleOps-AI-Powered-DevOps-for-Go-Applications-/dining-app-backend/internal/infrastructure/logger"
	"github.com/arnavsingh03/AutoScaleOps-AI-Powered-DevOps-for-Go-Applications-/dining-app-backend/internal/middleware"
	"github.com/arnavsingh03/AutoScaleOps-AI-Powered-DevOps-for-Go-Applications-/dining-app-backend/internal/repositories/postgres"
	"github.com/arnavsingh03/AutoScaleOps-AI-Powered-DevOps-for-Go-Applications-/dining-app-backend/pkg/auth"
	"github.com/arnavsingh03/AutoScaleOps-AI-Powered-DevOps-for-Go-Applications-/dining-app-backend/pkg/utils"
	"github.com/gin-gonic/gin"
	"go.uber.org/zap"
)

func main() {
	// Load configuration
	cfg, err := config.LoadConfig()
	if err != nil {
		log.Fatalf("Failed to load config: %v", err)
	}

	// Initialize logger
	logger, err := logger.NewLogger(cfg.Server.Environment)
	if err != nil {
		log.Fatalf("Failed to initialize logger: %v", err)
	}
	defer logger.Sync()

	// Initialize database
	db, err := database.NewPostgresDB(cfg.Database)
	if err != nil {
		logger.Fatal("Failed to connect to database", zap.Error(err))
	}
	defer db.Close()

	// Initialize validator
	validator := utils.NewCustomValidator()

	// Initialize repositories
	userRepo := postgres.NewUserRepository(db.DB)
	restaurantRepo := postgres.NewRestaurantRepository(db.DB)
	tableRepo := postgres.NewTableRepository(db.DB)
	bookingRepo := postgres.NewBookingRepository(db.DB)

	// Initialize auth service
	authService := auth.NewAuthService(&cfg.JWT)

	// Initialize services
	userService := services.NewUserService(userRepo, authService, logger)
	restaurantService := services.NewRestaurantService(restaurantRepo, logger)
	tableService := services.NewTableService(tableRepo, restaurantRepo, logger)
	bookingService := services.NewBookingService(bookingRepo, tableRepo, restaurantRepo, logger)

	// Initialize handlers
	userHandler := handlers.NewUserHandler(userService, validator)
	restaurantHandler := handlers.NewRestaurantHandler(restaurantService, validator)
	tableHandler := handlers.NewTableHandler(tableService, validator)
	bookingHandler := handlers.NewBookingHandler(bookingService, validator)

	// Initialize router
	router := gin.Default()

	// Apply global middleware
	router.Use(middleware.CORS())

	// Initialize routes
	setupRoutes(
		router,
		userHandler,
		restaurantHandler,
		tableHandler,
		bookingHandler,
		authService,
	)

	// Start server
	logger.Info("Server starting",
		zap.String("port", cfg.Server.Port),
		zap.String("environment", cfg.Server.Environment),
	)

	if err := router.Run(":" + cfg.Server.Port); err != nil {
		logger.Fatal("Failed to start server", zap.Error(err))
	}
}
