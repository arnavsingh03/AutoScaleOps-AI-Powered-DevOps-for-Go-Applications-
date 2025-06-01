package dto

type RegisterRequest struct {
	Name     string `json:"name" binding:"required,min=2,max=100"`
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=6"`
	Role     string `json:"role" binding:"omitempty,oneof=user admin"`
}

type LoginRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

type LoginResponse struct {
	Token string      `json:"token"`
	User  UserProfile `json:"user"`
}

type UserProfile struct {
	ID    int64  `json:"id"`
	Name  string `json:"name"`
	Email string `json:"email"`
	Role  string `json:"role"`
}

type UpdateProfileRequest struct {
	Name  string `json:"name" binding:"required,min=2,max=100"`
	Email string `json:"email" binding:"required,email"`
}
