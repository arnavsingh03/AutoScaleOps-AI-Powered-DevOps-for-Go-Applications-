package middleware

import (
    "net/http"
    "strings"
    "github.com/gin-gonic/gin"
    "github.com/arnavsingh03/AutoScaleOps-AI-Powered-DevOps-for-Go-Applications-/pkg/auth"
    "github.com/arnavsingh03/AutoScaleOps-AI-Powered-DevOps-for-Go-Applications-/pkg/apperrors"
)

func AuthMiddleware(authService *auth.Service) gin.HandlerFunc {
    return func(c *gin.Context) {
        authHeader := c.GetHeader("Authorization")
        if authHeader == "" {
            c.JSON(http.StatusUnauthorized, apperrors.NewError(apperrors.ErrorTypeUnauthorized, "missing authorization header", nil))
            c.Abort()
            return
        }

        tokenParts := strings.Split(authHeader, " ")
        if len(tokenParts) != 2 || tokenParts[0] != "Bearer" {
            c.JSON(http.StatusUnauthorized, apperrors.NewError(apperrors.ErrorTypeUnauthorized, "invalid authorization header", nil))
            c.Abort()
            return
        }

        claims, err := authService.ValidateToken(tokenParts[1])
        if err != nil {
            c.JSON(http.StatusUnauthorized, apperrors.NewError(apperrors.ErrorTypeUnauthorized, "invalid token", err))
            c.Abort()
            return
        }

        c.Set("userID", claims.UserID)
        c.Set("userRole", claims.Role)
        c.Next()
    }
}

func AdminMiddleware() gin.HandlerFunc {
    return func(c *gin.Context) {
        userRole, exists := c.Get("userRole")
        if !exists || userRole.(string) != "admin" {
            c.JSON(http.StatusForbidden, apperrors.NewError(apperrors.ErrorTypeUnauthorized, "admin access required", nil))
            c.Abort()
            return
        }
        c.Next()
    }
}