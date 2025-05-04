package auth

import (
    "time"
    "github.com/golang-jwt/jwt/v4"
    "github.com/arnavsingh03/AutoScaleOps-AI-Powered-DevOps-for-Go-Applications-/internal/config"
)

type Service struct {
	config *config.JWTConfig
}

type Claims struct {
	UserID int64  `json:"user_id"`
	Role   string `json:"role"`
	jwt.StandardClaims
}

func NewAuthService(config *config.JWTConfig) *Service {
	return &Service{
		config: config,
	}
}

func (s *Service) GenerateToken(userID int64, role string) (string, error) {
	claims := &Claims{
		UserID: userID,
		Role:   role,
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: time.Now().Add(time.Hour * time.Duration(s.config.TokenExpiry)).Unix(),
			IssuedAt:  time.Now().Unix(),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(s.config.Secret))
}

func (s *Service) ValidateToken(tokenString string) (*Claims, error) {
	token, err := jwt.ParseWithClaims(tokenString, &Claims{}, func(token *jwt.Token) (interface{}, error) {
		return []byte(s.config.Secret), nil
	})

	if err != nil {
		return nil, err
	}

	if claims, ok := token.Claims.(*Claims); ok && token.Valid {
		return claims, nil
	}

	return nil, jwt.ErrSignatureInvalid
}
