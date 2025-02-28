package services

import (
    "context"
    "github.com/arnavsingh03/dining-app/internal/core/domain"
    "github.com/arnavsingh03/dining-app/internal/core/ports"
    "github.com/arnavsingh03/dining-app/pkg/apperrors"
    "github.com/arnavsingh03/dining-app/pkg/auth"
    "github.com/arnavsingh03/dining-app/internal/infrastructure/logger"
    "go.uber.org/zap"
    "golang.org/x/crypto/bcrypt"
)

type userService struct {
    userRepo    ports.UserRepository
    authService *auth.Service
    logger      *logger.Logger
}

func NewUserService(userRepo ports.UserRepository, authService *auth.Service, logger *logger.Logger) *userService {
    return &userService{
        userRepo:    userRepo,
        authService: authService,
        logger:      logger,
    }
}

func (s *userService) Register(ctx context.Context, user *domain.User) error {
    s.logger.Info("Registering new user", zap.String("email", user.Email))

    // Check if user already exists
    existingUser, err := s.userRepo.GetByEmail(ctx, user.Email)
    if err != nil {
        // Only return error if it's not a "not found" error
        if _, ok := err.(*apperrors.Error); !ok || err.(*apperrors.Error).Type != apperrors.ErrorTypeNotFound {
            s.logger.Error("Failed to check existing user", zap.Error(err))
            return apperrors.NewError(apperrors.ErrorTypeInternal, "failed to check existing user", err)
        }
    }

    if existingUser != nil {
        s.logger.Warn("User already exists", zap.String("email", user.Email))
        return apperrors.NewError(apperrors.ErrorTypeValidation, "email already registered", nil)
    }

    // Hash password
    hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
    if err != nil {
        s.logger.Error("Failed to hash password", zap.Error(err))
        return apperrors.NewError(apperrors.ErrorTypeInternal, "failed to hash password", err)
    }

    user.Password = string(hashedPassword)
    
    // Ensure role is set
    if user.Role == "" {
        user.Role = domain.RoleUser
    }

    if err := s.userRepo.Create(ctx, user); err != nil {
        s.logger.Error("Failed to create user", zap.Error(err))
        return apperrors.NewError(apperrors.ErrorTypeInternal, "failed to create user", err)
    }

    s.logger.Info("User registered successfully", 
        zap.Int64("userID", user.ID),
        zap.String("role", user.Role),
    )
    return nil
}

func (s *userService) Login(ctx context.Context, email, password string) (string, *domain.User, error) {
    s.logger.Info("Attempting login", zap.String("email", email))

    user, err := s.userRepo.GetByEmail(ctx, email)
    if err != nil {
        s.logger.Warn("Login failed: user not found", zap.String("email", email))
        return "", nil, apperrors.NewError(apperrors.ErrorTypeUnauthorized, "invalid credentials", nil)
    }

    if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password)); err != nil {
        s.logger.Warn("Login failed: invalid password", zap.String("email", email))
        return "", nil, apperrors.NewError(apperrors.ErrorTypeUnauthorized, "invalid credentials", nil)
    }

    token, err := s.authService.GenerateToken(user.ID, user.Role)
    if err != nil {
        s.logger.Error("Failed to generate token", zap.Error(err))
        return "", nil, apperrors.NewError(apperrors.ErrorTypeInternal, "failed to generate token", err)
    }

    // Clear sensitive data before returning
    user.Password = ""

    s.logger.Info("User logged in successfully", 
        zap.Int64("userID", user.ID),
        zap.String("role", user.Role),
    )
    return token, user, nil
}

func (s *userService) GetProfile(ctx context.Context, userID int64) (*domain.User, error) {
    s.logger.Info("Fetching user profile", zap.Int64("userID", userID))

    user, err := s.userRepo.GetByID(ctx, userID)
    if err != nil {
        if _, ok := err.(*apperrors.Error); !ok {
            err = apperrors.NewError(apperrors.ErrorTypeInternal, "failed to get user profile", err)
        }
        s.logger.Error("Failed to get user profile", 
            zap.Int64("userID", userID),
            zap.Error(err),
        )
        return nil, err
    }

    // Clear sensitive data
    user.Password = ""

    return user, nil
}

func (s *userService) UpdateProfile(ctx context.Context, user *domain.User) error {
    s.logger.Info("Updating user profile", zap.Int64("userID", user.ID))

    // Get current user to preserve role and other fields
    currentUser, err := s.userRepo.GetByID(ctx, user.ID)
    if err != nil {
        s.logger.Error("Failed to get current user", 
            zap.Int64("userID", user.ID),
            zap.Error(err),
        )
        if _, ok := err.(*apperrors.Error); !ok {
            err = apperrors.NewError(apperrors.ErrorTypeInternal, "failed to get current user", err)
        }
        return err
    }

    // Preserve role and password
    user.Role = currentUser.Role
    user.Password = currentUser.Password

    // Check if email is being changed and if it's already taken
    if user.Email != currentUser.Email {
        existingUser, err := s.userRepo.GetByEmail(ctx, user.Email)
        if err != nil && !isNotFoundError(err) {
            s.logger.Error("Failed to check email availability", 
                zap.String("email", user.Email),
                zap.Error(err),
            )
            return apperrors.NewError(apperrors.ErrorTypeInternal, "failed to check email availability", err)
        }
        if existingUser != nil {
            return apperrors.NewError(apperrors.ErrorTypeValidation, "email already taken", nil)
        }
    }

    if err := s.userRepo.Update(ctx, user); err != nil {
        s.logger.Error("Failed to update user profile", 
            zap.Int64("userID", user.ID),
            zap.Error(err),
        )
        if _, ok := err.(*apperrors.Error); !ok {
            err = apperrors.NewError(apperrors.ErrorTypeInternal, "failed to update user profile", err)
        }
        return err
    }

    s.logger.Info("User profile updated successfully", 
        zap.Int64("userID", user.ID),
        zap.String("email", user.Email),
    )
    return nil
}

// Helper function to check if error is "not found" error
func isNotFoundError(err error) bool {
    if appErr, ok := err.(*apperrors.Error); ok {
        return appErr.Type == apperrors.ErrorTypeNotFound
    }
    return false
}