package handlers

import (
	"fmt"
	"net/http"
	"strconv"
	"time"

	"github.com/arnavsingh03/AutoScaleOps-AI-Powered-DevOps-for-Go-Applications-/dining-app-backend/internal/core/domain"
	"github.com/arnavsingh03/AutoScaleOps-AI-Powered-DevOps-for-Go-Applications-/dining-app-backend/internal/core/ports"
	"github.com/arnavsingh03/AutoScaleOps-AI-Powered-DevOps-for-Go-Applications-/dining-app-backend/internal/handlers/dto"
	"github.com/arnavsingh03/AutoScaleOps-AI-Powered-DevOps-for-Go-Applications-/dining-app-backend/pkg/apperrors"
	"github.com/arnavsingh03/AutoScaleOps-AI-Powered-DevOps-for-Go-Applications-/dining-app-backend/pkg/utils"
	"github.com/gin-gonic/gin"
)

type BookingHandler struct {
	bookingService ports.BookingService
	validator      *utils.CustomValidator
}

func NewBookingHandler(bookingService ports.BookingService, validator *utils.CustomValidator) *BookingHandler {
	return &BookingHandler{
		bookingService: bookingService,
		validator:      validator,
	}
}

func (h *BookingHandler) CreateBooking(c *gin.Context) {
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, apperrors.NewError(apperrors.ErrorTypeUnauthorized, "unauthorized", nil))
		return
	}

	var req dto.CreateBookingRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		fmt.Printf("Binding error: %v\n", err)
		validationErrors := h.validator.FormatValidationErrors(err)
		fmt.Printf("Validation errors: %+v\n", validationErrors)
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Invalid request data",
			"errors":  validationErrors,
		})
		return
	}

	// Log the request payload for debugging
	fmt.Printf("Request payload: %+v\n", req)

	if err := h.validator.Validate(req); err != nil {
		fmt.Printf("Validation error: %v\n", err)
		validationErrors := h.validator.FormatValidationErrors(err)
		fmt.Printf("Validation errors: %+v\n", validationErrors)
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Validation failed",
			"errors":  validationErrors,
		})
		return
	}

	// Try parsing date in DD-MM-YYYY format first
	bookingDate, err := time.Parse("02-01-2006", req.BookingDate)
	if err != nil {
		// If that fails, try YYYY-MM-DD format
		bookingDate, err = time.Parse("2006-01-02", req.BookingDate)
		if err != nil {
			fmt.Printf("Date parsing error: %v\n", err)
			c.JSON(http.StatusBadRequest, gin.H{
				"message": "Invalid booking date format (use DD-MM-YYYY or YYYY-MM-DD)",
				"error":   err.Error(),
			})
			return
		}
	}

	// Parse start and end times
	startTime, err := time.Parse(time.RFC3339, req.StartTime)
	if err != nil {
		fmt.Printf("Start time parsing error: %v\n", err)
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Invalid start time format (use ISO 8601 format)",
			"error":   err.Error(),
		})
		return
	}

	endTime, err := time.Parse(time.RFC3339, req.EndTime)
	if err != nil {
		fmt.Printf("End time parsing error: %v\n", err)
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Invalid end time format (use ISO 8601 format)",
			"error":   err.Error(),
		})
		return
	}

	// Validate that the booking date is in the future
	if bookingDate.Before(time.Now().Truncate(24 * time.Hour)) {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "Booking date must be in the future",
		})
		return
	}

	// Validate that end time is after start time
	if !endTime.After(startTime) {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "End time must be after start time",
		})
		return
	}

	booking := &domain.Booking{
		UserID:          userID.(int64),
		TableID:         req.TableID,
		BookingDate:     bookingDate,
		StartTime:       startTime.Format("15:04"),
		EndTime:         endTime.Format("15:04"),
		NumberOfGuests:  req.NumberOfGuests,
		SpecialRequests: "", // Set to empty string since it's not provided in the form
		Status:          domain.BookingStatusPending,
	}

	if err := h.bookingService.CreateBooking(c.Request.Context(), booking); err != nil {
		appErr := err.(*apperrors.Error)
		fmt.Printf("Service error: %+v\n", appErr)
		c.JSON(apperrors.GetStatusCode(appErr), gin.H{
			"message": appErr.Message,
			"error":   appErr.Error(),
		})
		return
	}

	c.JSON(http.StatusCreated, toBookingResponse(booking))
}

func (h *BookingHandler) GetUserBookings(c *gin.Context) {
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, apperrors.NewError(apperrors.ErrorTypeUnauthorized, "unauthorized", nil))
		return
	}

	bookings, err := h.bookingService.GetUserBookings(c.Request.Context(), userID.(int64))
	if err != nil {
		appErr := err.(*apperrors.Error)
		c.JSON(apperrors.GetStatusCode(appErr), appErr)
		return
	}

	response := make([]dto.BookingResponse, len(bookings))
	for i, booking := range bookings {
		response[i] = toBookingResponse(booking)
	}

	c.JSON(http.StatusOK, response)
}

func (h *BookingHandler) UpdateBookingStatus(c *gin.Context) {
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, apperrors.NewError(apperrors.ErrorTypeUnauthorized, "unauthorized", nil))
		return
	}

	bookingID, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, apperrors.NewError(apperrors.ErrorTypeValidation, "invalid booking id", err))
		return
	}

	var req dto.UpdateBookingStatusRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"errors": h.validator.FormatValidationErrors(err),
		})
		return
	}

	if err := h.validator.Validate(req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"errors": h.validator.FormatValidationErrors(err),
		})
		return
	}

	if err := h.bookingService.UpdateBookingStatus(c.Request.Context(), bookingID, userID.(int64), domain.BookingStatus(req.Status)); err != nil {
		appErr := err.(*apperrors.Error)
		c.JSON(apperrors.GetStatusCode(appErr), appErr)
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "booking status updated successfully"})
}

func toBookingResponse(booking *domain.Booking) dto.BookingResponse {
	return dto.BookingResponse{
		ID:              booking.ID,
		BookingDate:     booking.BookingDate,
		StartTime:       booking.StartTime,
		EndTime:         booking.EndTime,
		NumberOfGuests:  booking.NumberOfGuests,
		Status:          string(booking.Status),
		SpecialRequests: booking.SpecialRequests,
		TableNumber:     booking.TableNumber,
		RestaurantName:  booking.RestaurantName,
	}
}
