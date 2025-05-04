package handlers

import (
	"net/http"

	"github.com/arnavsingh03/AutoScaleOps-AI-Powered-DevOps-for-Go-Applications-/dining-app-backend/internal/core/domain"
	"github.com/arnavsingh03/AutoScaleOps-AI-Powered-DevOps-for-Go-Applications-/dining-app-backend/internal/core/ports"
	"github.com/arnavsingh03/AutoScaleOps-AI-Powered-DevOps-for-Go-Applications-/dining-app-backend/internal/handlers/dto"
	"github.com/arnavsingh03/AutoScaleOps-AI-Powered-DevOps-for-Go-Applications-/dining-app-backend/pkg/apperrors"
	"github.com/arnavsingh03/AutoScaleOps-AI-Powered-DevOps-for-Go-Applications-/dining-app-backend/pkg/utils"
	"github.com/gin-gonic/gin"
)

type UserHandler struct {
	userService ports.UserService
	validator   *utils.CustomValidator
}

func NewUserHandler(userService ports.UserService, validator *utils.CustomValidator) *UserHandler {
	return &UserHandler{
		userService: userService,
		validator:   validator,
	}
}

func (h *UserHandler) Register(c *gin.Context) {
	var req dto.RegisterRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"errors": h.validator.FormatValidationErrors(err),
		})
		return
	}

	user := &domain.User{
		Name:     req.Name,
		Email:    req.Email,
		Password: req.Password,
		Role:     domain.RoleUser, // Set default role
	}

	if err := h.validator.Validate(user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"errors": h.validator.FormatValidationErrors(err),
		})
		return
	}

	if err := h.userService.Register(c.Request.Context(), user); err != nil {
		if appErr, ok := err.(*apperrors.Error); ok {
			c.JSON(apperrors.GetStatusCode(appErr), appErr)
		} else {
			c.JSON(http.StatusInternalServerError, apperrors.NewError(
				apperrors.ErrorTypeInternal,
				"failed to register user",
				err,
			))
		}
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "user registered successfully",
		"user": dto.UserProfile{
			ID:    user.ID,
			Name:  user.Name,
			Email: user.Email,
			Role:  user.Role,
		},
	})
}

func (h *UserHandler) Login(c *gin.Context) {
	var req dto.LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"errors": h.validator.FormatValidationErrors(err),
		})
		return
	}

	token, user, err := h.userService.Login(c.Request.Context(), req.Email, req.Password)
	if err != nil {
		if appErr, ok := err.(*apperrors.Error); ok {
			c.JSON(apperrors.GetStatusCode(appErr), appErr)
		} else {
			c.JSON(http.StatusInternalServerError, apperrors.NewError(
				apperrors.ErrorTypeInternal,
				"failed to login",
				err,
			))
		}
		return
	}

	c.JSON(http.StatusOK, dto.LoginResponse{
		Token: token,
		User: dto.UserProfile{
			ID:    user.ID,
			Name:  user.Name,
			Email: user.Email,
			Role:  user.Role,
		},
	})
}

func (h *UserHandler) GetProfile(c *gin.Context) {
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, apperrors.NewError(apperrors.ErrorTypeUnauthorized, "unauthorized", nil))
		return
	}

	user, err := h.userService.GetProfile(c.Request.Context(), userID.(int64))
	if err != nil {
		if appErr, ok := err.(*apperrors.Error); ok {
			c.JSON(apperrors.GetStatusCode(appErr), appErr)
		} else {
			c.JSON(http.StatusInternalServerError, apperrors.NewError(
				apperrors.ErrorTypeInternal,
				"failed to get profile",
				err,
			))
		}
		return
	}

	c.JSON(http.StatusOK, dto.UserProfile{
		ID:    user.ID,
		Name:  user.Name,
		Email: user.Email,
		Role:  user.Role,
	})
}

func (h *UserHandler) UpdateProfile(c *gin.Context) {
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, apperrors.NewError(apperrors.ErrorTypeUnauthorized, "unauthorized", nil))
		return
	}

	var req dto.UpdateProfileRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"errors": h.validator.FormatValidationErrors(err),
		})
		return
	}

	// Get current user to preserve role
	currentUser, err := h.userService.GetProfile(c.Request.Context(), userID.(int64))
	if err != nil {
		if appErr, ok := err.(*apperrors.Error); ok {
			c.JSON(apperrors.GetStatusCode(appErr), appErr)
		} else {
			c.JSON(http.StatusInternalServerError, apperrors.NewError(
				apperrors.ErrorTypeInternal,
				"failed to get current user",
				err,
			))
		}
		return
	}

	user := &domain.User{
		ID:    userID.(int64),
		Name:  req.Name,
		Email: req.Email,
		Role:  currentUser.Role, // Preserve current role
	}

	if err := h.validator.Validate(user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"errors": h.validator.FormatValidationErrors(err),
		})
		return
	}

	if err := h.userService.UpdateProfile(c.Request.Context(), user); err != nil {
		if appErr, ok := err.(*apperrors.Error); ok {
			c.JSON(apperrors.GetStatusCode(appErr), appErr)
		} else {
			c.JSON(http.StatusInternalServerError, apperrors.NewError(
				apperrors.ErrorTypeInternal,
				"failed to update profile",
				err,
			))
		}
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "profile updated successfully",
		"user": dto.UserProfile{
			ID:    user.ID,
			Name:  user.Name,
			Email: user.Email,
			Role:  user.Role,
		},
	})
}
