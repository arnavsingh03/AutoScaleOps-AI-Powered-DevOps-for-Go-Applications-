package handlers

import (
	"net/http"
	"strconv"
	"time"

	"github.com/arnavsingh03/AutoScaleOps-AI-Powered-DevOps-for-Go-Applications-/internal/core/domain"
	"github.com/arnavsingh03/AutoScaleOps-AI-Powered-DevOps-for-Go-Applications-/internal/core/ports"
	"github.com/arnavsingh03/AutoScaleOps-AI-Powered-DevOps-for-Go-Applications-/internal/handlers/dto"
	"github.com/arnavsingh03/AutoScaleOps-AI-Powered-DevOps-for-Go-Applications-/pkg/apperrors"
	"github.com/arnavsingh03/AutoScaleOps-AI-Powered-DevOps-for-Go-Applications-/pkg/utils"
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
		c.JSON(http.StatusBadRequest, gin.H{
			"errors": h.validator.FormatValidationErrors(err),
		})
		return
	}

	bookingDate, err := time.Parse("2006-01-02", req.BookingDate)
	if err != nil {
		c.JSON(http.StatusBadRequest, apperrors.NewError(apperrors.ErrorTypeValidation, "invalid booking date format", err))
		return
	}

	booking := &domain.Booking{
		UserID:          userID.(int64),
		TableID:         req.TableID,
		BookingDate:     bookingDate,
		StartTime:       req.StartTime,
		EndTime:         req.EndTime,
		NumberOfGuests:  req.NumberOfGuests,
		SpecialRequests: req.SpecialRequests,
	}

	if err := h.validator.Validate(booking); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"errors": h.validator.FormatValidationErrors(err),
		})
		return
	}

	if err := h.bookingService.CreateBooking(c.Request.Context(), booking); err != nil {
		appErr := err.(*apperrors.Error)
		c.JSON(apperrors.GetStatusCode(appErr), appErr)
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
	}
}
