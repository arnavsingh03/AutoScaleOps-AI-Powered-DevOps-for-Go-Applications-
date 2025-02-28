package logger

import (
    "go.uber.org/zap"
    "go.uber.org/zap/zapcore"
)

// Logger wraps zap logger
type Logger struct {
    *zap.Logger
}

// NewLogger creates a new logger instance
func NewLogger(environment string) (*Logger, error) {
    var config zap.Config

    if environment == "production" {
        config = zap.NewProductionConfig()
        config.EncoderConfig.TimeKey = "timestamp"
        config.EncoderConfig.EncodeTime = zapcore.ISO8601TimeEncoder
    } else {
        config = zap.NewDevelopmentConfig()
        config.EncoderConfig.EncodeLevel = zapcore.CapitalColorLevelEncoder
    }

    // Create logger
    logger, err := config.Build(zap.AddCallerSkip(1))
    if err != nil {
        return nil, err
    }

    return &Logger{logger}, nil
}

// Info logs info level message
func (l *Logger) Info(msg string, fields ...zapcore.Field) {
    l.Logger.Info(msg, fields...)
}

// Error logs error level message
func (l *Logger) Error(msg string, fields ...zapcore.Field) {
    l.Logger.Error(msg, fields...)
}

// Fatal logs fatal level message and exits
func (l *Logger) Fatal(msg string, fields ...zapcore.Field) {
    l.Logger.Fatal(msg, fields...)
}

// With creates a child logger with additional fields
func (l *Logger) With(fields ...zapcore.Field) *Logger {
    return &Logger{l.Logger.With(fields...)}
}

// Sync flushes any buffered log entries
func (l *Logger) Sync() error {
    return l.Logger.Sync()
}