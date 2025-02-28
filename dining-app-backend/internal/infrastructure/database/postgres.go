package database

import (
    "fmt"
    "time"
    "github.com/jmoiron/sqlx"
    _ "github.com/lib/pq"
    "github.com/arnavsingh03/dining-app/internal/config"
)

// PostgresDB wraps sqlx.DB to provide custom functionality
type PostgresDB struct {
    *sqlx.DB
}

// NewPostgresDB creates a new PostgreSQL database connection
func NewPostgresDB(cfg config.DatabaseConfig) (*PostgresDB, error) {
    dsn := fmt.Sprintf(
        "host=%s port=%d user=%s password=%s dbname=%s sslmode=%s",
        cfg.Host,
        cfg.Port,
        cfg.User,
        cfg.Password,
        cfg.DBName,
        cfg.SSLMode,
    )

    db, err := sqlx.Connect("postgres", dsn)
    if err != nil {
        return nil, fmt.Errorf("error connecting to the database: %w", err)
    }

    // Set connection pool settings
    db.SetMaxOpenConns(25)
    db.SetMaxIdleConns(5)
    db.SetConnMaxLifetime(5 * time.Minute)

    // Verify connection
    if err := db.Ping(); err != nil {
        return nil, fmt.Errorf("error pinging database: %w", err)
    }

    return &PostgresDB{DB: db}, nil
}

// Close closes the database connection
func (db *PostgresDB) Close() error {
    return db.DB.Close()
}

// Transaction executes a function within a database transaction
func (db *PostgresDB) Transaction(fn func(*sqlx.Tx) error) error {
    tx, err := db.Beginx()
    if err != nil {
        return err
    }

    defer func() {
        if p := recover(); p != nil {
            tx.Rollback()
            panic(p) // re-throw panic after rollback
        }
    }()

    if err := fn(tx); err != nil {
        tx.Rollback()
        return err
    }

    return tx.Commit()
}