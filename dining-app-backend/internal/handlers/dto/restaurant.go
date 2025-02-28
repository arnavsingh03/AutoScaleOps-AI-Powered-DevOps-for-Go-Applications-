package dto

type CreateRestaurantRequest struct {
    Name        string `json:"name" binding:"required,min=2,max=100"`
    Description string `json:"description"`
    Address     string `json:"address" binding:"required"`
    CuisineType string `json:"cuisine_type" binding:"required"`
    OpeningTime string `json:"opening_time" binding:"required"`
    ClosingTime string `json:"closing_time" binding:"required"`
}

type UpdateRestaurantRequest struct {
    Name        string `json:"name,omitempty"`
    Description string `json:"description,omitempty"`
    Address     string `json:"address,omitempty"`
    CuisineType string `json:"cuisine_type,omitempty"`
    OpeningTime string `json:"opening_time,omitempty"`
    ClosingTime string `json:"closing_time,omitempty"`
}

type RestaurantResponse struct {
    ID          int64  `json:"id"`
    Name        string `json:"name"`
    Description string `json:"description"`
    Address     string `json:"address"`
    CuisineType string `json:"cuisine_type"`
    OpeningTime string `json:"opening_time"`
    ClosingTime string `json:"closing_time"`
}

type ListRestaurantsResponse struct {
    Restaurants []RestaurantResponse `json:"restaurants"`
    Total      int                  `json:"total"`
    Page       int                  `json:"page"`
    PageSize   int                  `json:"page_size"`
}