package dto

type CreateTableRequest struct {
	TableNumber string `json:"table_number" validate:"required"`
	Capacity    int    `json:"capacity" validate:"required,min=1"`
}

type UpdateTableAvailabilityRequest struct {
	IsAvailable bool `json:"is_available"`
}

type TableResponse struct {
	ID           int64  `json:"id"`
	RestaurantID int64  `json:"restaurant_id"`
	TableNumber  string `json:"table_number"`
	Capacity     int    `json:"capacity"`
	IsAvailable  bool   `json:"is_available"`
}
