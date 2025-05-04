package handlers

import (
	"net/http"
	"strconv"

	"github.com/arnavsingh03/AutoScaleOps-AI-Powered-DevOps-for-Go-Applications-/internal/core/domain"
	"github.com/arnavsingh03/AutoScaleOps-AI-Powered-DevOps-for-Go-Applications-/internal/core/ports"
	"github.com/arnavsingh03/AutoScaleOps-AI-Powered-DevOps-for-Go-Applications-/internal/handlers/dto"
	"github.com/arnavsingh03/AutoScaleOps-AI-Powered-DevOps-for-Go-Applications-/pkg/apperrors"
	"github.com/arnavsingh03/AutoScaleOps-AI-Powered-DevOps-for-Go-Applications-/pkg/utils"
	"github.com/gin-gonic/gin"
)

type RestaurantHandler struct {
	restaurantService ports.RestaurantService
	validator         *utils.CustomValidator
}

func NewRestaurantHandler(restaurantService ports.RestaurantService, validator *utils.CustomValidator) *RestaurantHandler {
	return &RestaurantHandler{
		restaurantService: restaurantService,
		validator:         validator,
	}
}

func (h *RestaurantHandler) Create(c *gin.Context) {
	var req dto.CreateRestaurantRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"errors": h.validator.FormatValidationErrors(err),
		})
		return
	}

	restaurant := &domain.Restaurant{
		Name:        req.Name,
		Description: req.Description,
		Address:     req.Address,
		CuisineType: req.CuisineType,
		OpeningTime: req.OpeningTime,
		ClosingTime: req.ClosingTime,
	}

	if err := h.validator.Validate(restaurant); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"errors": h.validator.FormatValidationErrors(err),
		})
		return
	}

	if err := h.restaurantService.Create(c.Request.Context(), restaurant); err != nil {
		appErr := err.(*apperrors.Error)
		c.JSON(apperrors.GetStatusCode(appErr), appErr)
		return
	}

	c.JSON(http.StatusCreated, toRestaurantResponse(restaurant))
}

func (h *RestaurantHandler) GetByID(c *gin.Context) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, apperrors.NewError(apperrors.ErrorTypeValidation, "invalid restaurant id", err))
		return
	}

	restaurant, err := h.restaurantService.GetByID(c.Request.Context(), id)
	if err != nil {
		appErr := err.(*apperrors.Error)
		c.JSON(apperrors.GetStatusCode(appErr), appErr)
		return
	}

	c.JSON(http.StatusOK, toRestaurantResponse(restaurant))
}

func (h *RestaurantHandler) List(c *gin.Context) {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	pageSize, _ := strconv.Atoi(c.DefaultQuery("page_size", "10"))

	restaurants, err := h.restaurantService.List(c.Request.Context(), page, pageSize)
	if err != nil {
		appErr := err.(*apperrors.Error)
		c.JSON(apperrors.GetStatusCode(appErr), appErr)
		return
	}

	response := dto.ListRestaurantsResponse{
		Restaurants: make([]dto.RestaurantResponse, len(restaurants)),
		Page:        page,
		PageSize:    pageSize,
	}

	for i, restaurant := range restaurants {
		response.Restaurants[i] = toRestaurantResponse(restaurant)
	}

	c.JSON(http.StatusOK, response)
}

func (h *RestaurantHandler) Update(c *gin.Context) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, apperrors.NewError(apperrors.ErrorTypeValidation, "invalid restaurant id", err))
		return
	}

	var req dto.UpdateRestaurantRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"errors": h.validator.FormatValidationErrors(err),
		})
		return
	}

	restaurant := &domain.Restaurant{
		ID:          id,
		Name:        req.Name,
		Description: req.Description,
		Address:     req.Address,
		CuisineType: req.CuisineType,
		OpeningTime: req.OpeningTime,
		ClosingTime: req.ClosingTime,
	}

	if err := h.validator.Validate(restaurant); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"errors": h.validator.FormatValidationErrors(err),
		})
		return
	}

	if err := h.restaurantService.Update(c.Request.Context(), restaurant); err != nil {
		appErr := err.(*apperrors.Error)
		c.JSON(apperrors.GetStatusCode(appErr), appErr)
		return
	}

	c.JSON(http.StatusOK, toRestaurantResponse(restaurant))
}

func (h *RestaurantHandler) Delete(c *gin.Context) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, apperrors.NewError(apperrors.ErrorTypeValidation, "invalid restaurant id", err))
		return
	}

	if err := h.restaurantService.Delete(c.Request.Context(), id); err != nil {
		appErr := err.(*apperrors.Error)
		c.JSON(apperrors.GetStatusCode(appErr), appErr)
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "restaurant deleted successfully"})
}

func toRestaurantResponse(restaurant *domain.Restaurant) dto.RestaurantResponse {
	return dto.RestaurantResponse{
		ID:          restaurant.ID,
		Name:        restaurant.Name,
		Description: restaurant.Description,
		Address:     restaurant.Address,
		CuisineType: restaurant.CuisineType,
		OpeningTime: restaurant.OpeningTime,
		ClosingTime: restaurant.ClosingTime,
	}
}
