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

type TableHandler struct {
	tableService ports.TableService
	validator    *utils.CustomValidator
}

func NewTableHandler(tableService ports.TableService, validator *utils.CustomValidator) *TableHandler {
	return &TableHandler{
		tableService: tableService,
		validator:    validator,
	}
}

func (h *TableHandler) CreateTable(c *gin.Context) {
	restaurantID, err := strconv.ParseInt(c.Param("restaurantId"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, apperrors.NewError(apperrors.ErrorTypeValidation, "invalid restaurant id", err))
		return
	}

	var req dto.CreateTableRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"errors": h.validator.FormatValidationErrors(err),
		})
		return
	}

	table := &domain.Table{
		TableNumber: req.TableNumber,
		Capacity:    req.Capacity,
	}

	if err := h.validator.Validate(table); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"errors": h.validator.FormatValidationErrors(err),
		})
		return
	}

	if err := h.tableService.CreateTable(c.Request.Context(), restaurantID, table); err != nil {
		appErr := err.(*apperrors.Error)
		c.JSON(apperrors.GetStatusCode(appErr), appErr)
		return
	}

	c.JSON(http.StatusCreated, toTableResponse(table))
}

func (h *TableHandler) GetRestaurantTables(c *gin.Context) {
	restaurantID, err := strconv.ParseInt(c.Param("restaurantId"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, apperrors.NewError(apperrors.ErrorTypeValidation, "invalid restaurant id", err))
		return
	}

	tables, err := h.tableService.GetRestaurantTables(c.Request.Context(), restaurantID)
	if err != nil {
		appErr := err.(*apperrors.Error)
		c.JSON(apperrors.GetStatusCode(appErr), appErr)
		return
	}

	response := make([]dto.TableResponse, len(tables))
	for i, table := range tables {
		response[i] = toTableResponse(table)
	}

	c.JSON(http.StatusOK, response)
}

func (h *TableHandler) UpdateAvailability(c *gin.Context) {
	tableID, err := strconv.ParseInt(c.Param("tableId"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, apperrors.NewError(apperrors.ErrorTypeValidation, "invalid table id", err))
		return
	}

	var req dto.UpdateTableAvailabilityRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"errors": h.validator.FormatValidationErrors(err),
		})
		return
	}

	if err := h.tableService.UpdateTableAvailability(c.Request.Context(), tableID, req.IsAvailable); err != nil {
		appErr := err.(*apperrors.Error)
		c.JSON(apperrors.GetStatusCode(appErr), appErr)
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "table availability updated successfully"})
}

func toTableResponse(table *domain.Table) dto.TableResponse {
	return dto.TableResponse{
		ID:           table.ID,
		RestaurantID: table.RestaurantID,
		TableNumber:  table.TableNumber,
		Capacity:     table.Capacity,
		IsAvailable:  table.IsAvailable,
	}
}
