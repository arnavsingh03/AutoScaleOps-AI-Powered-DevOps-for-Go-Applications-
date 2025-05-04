package main

import (
    "github.com/gin-gonic/gin"
    "github.com/arnavsingh03/AutoScaleOps-AI-Powered-DevOps-for-Go-Applications-/internal/handlers"
    "github.com/arnavsingh03/AutoScaleOps-AI-Powered-DevOps-for-Go-Applications-/internal/middleware"
    "github.com/arnavsingh03/AutoScaleOps-AI-Powered-DevOps-for-Go-Applications-/pkg/auth"
)

func setupRoutes(
    router *gin.Engine,
    userHandler *handlers.UserHandler,
    restaurantHandler *handlers.RestaurantHandler,
    tableHandler *handlers.TableHandler,
    bookingHandler *handlers.BookingHandler,
    authService *auth.Service,
) {
    // API version group
    api := router.Group("/api/v1")

    // Auth routes
    auth := api.Group("/auth")
    {
        auth.POST("/register", userHandler.Register)
        auth.POST("/login", userHandler.Login)
    }

    // Public restaurant routes
    restaurants := api.Group("/restaurants")
    {
        restaurants.GET("", restaurantHandler.List)
        restaurants.GET("/:id", restaurantHandler.GetByID)
    }

    // Protected routes
    protected := api.Group("")
    protected.Use(middleware.AuthMiddleware(authService))
    {
        // User profile routes
        profile := protected.Group("/profile")
        {
            profile.GET("", userHandler.GetProfile)
            profile.PUT("", userHandler.UpdateProfile)
        }

        // Protected booking routes
        bookings := protected.Group("/bookings")
        {
            bookings.POST("", bookingHandler.CreateBooking)
            bookings.GET("", bookingHandler.GetUserBookings)
            bookings.PUT("/:id/status", bookingHandler.UpdateBookingStatus)
        }

        // Admin routes
        admin := protected.Group("")
        admin.Use(middleware.AdminMiddleware())
        {
            // Admin restaurant routes
            adminRestaurants := admin.Group("/restaurants")
            {
                adminRestaurants.POST("", restaurantHandler.Create)
                adminRestaurants.PUT("/:id", restaurantHandler.Update)
                adminRestaurants.DELETE("/:id", restaurantHandler.Delete)
            }

            // Admin table routes
            tables := admin.Group("/tables")
            {
                tables.POST("/restaurant/:restaurantId", tableHandler.CreateTable)
                tables.GET("/restaurant/:restaurantId", tableHandler.GetRestaurantTables)
                tables.PUT("/:id/availability", tableHandler.UpdateAvailability)
            }
        }
    }
}