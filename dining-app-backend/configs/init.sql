-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create restaurants table
CREATE TABLE IF NOT EXISTS restaurants (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    address TEXT NOT NULL,
    cuisine_type VARCHAR(100) NOT NULL,
    opening_time VARCHAR(50) NOT NULL,
    closing_time VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create tables table
CREATE TABLE IF NOT EXISTS tables (
    id SERIAL PRIMARY KEY,
    restaurant_id INTEGER REFERENCES restaurants(id) ON DELETE CASCADE,
    table_number VARCHAR(20) NOT NULL,
    capacity INTEGER NOT NULL,
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(restaurant_id, table_number)
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    table_id INTEGER REFERENCES tables(id) ON DELETE CASCADE,
    booking_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    number_of_guests INTEGER NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    special_requests TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_restaurants_cuisine_type ON restaurants(cuisine_type);
CREATE INDEX IF NOT EXISTS idx_bookings_user ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_table ON bookings(table_id);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings(booking_date);

-- Insert restaurants
INSERT INTO restaurants (name, description, address, cuisine_type, opening_time, closing_time)
VALUES
  ('La Bella Italia', 'Authentic Italian cuisine in an elegant setting', '123 Main St, Downtown', 'Italian', '11:00 AM', '10:00 PM'),
  ('Sakura Japanese', 'Premium sushi and traditional Japanese dishes', '456 Midtown Ave, Midtown', 'Japanese', '12:00 PM', '11:00 PM'),
  ('Spice Route', 'Flavorful Indian dishes with modern twists', '789 West End Blvd, West End', 'Indian', '11:30 AM', '10:30 PM'),
  ('El Mariachi', 'Authentic Mexican street food and traditional dishes', '101 South Side Rd, South Side', 'Mexican', '11:00 AM', '10:00 PM'),
  ('The American Grill', 'Classic American steakhouse with modern flair', '202 East Side Dr, East Side', 'American', '11:00 AM', '10:00 PM');

-- Insert tables for La Bella Italia (restaurant_id = 1)
INSERT INTO tables (restaurant_id, table_number, capacity, is_available)
VALUES
  (1, 'T1', 2, true),
  (1, 'T2', 2, true),
  (1, 'T3', 4, true),
  (1, 'T4', 4, true),
  (1, 'T5', 6, true),
  (1, 'T6', 8, true);

-- Insert tables for Sakura Japanese (restaurant_id = 2)
INSERT INTO tables (restaurant_id, table_number, capacity, is_available)
VALUES
  (2, 'T1', 2, true),
  (2, 'T2', 2, true),
  (2, 'T3', 4, true),
  (2, 'T4', 4, true),
  (2, 'T5', 6, true),
  (2, 'T6', 8, true);

-- Insert tables for Spice Route (restaurant_id = 3)
INSERT INTO tables (restaurant_id, table_number, capacity, is_available)
VALUES
  (3, 'T1', 2, true),
  (3, 'T2', 2, true),
  (3, 'T3', 4, true),
  (3, 'T4', 4, true),
  (3, 'T5', 6, true),
  (3, 'T6', 8, true);

-- Insert tables for El Mariachi (restaurant_id = 4)
INSERT INTO tables (restaurant_id, table_number, capacity, is_available)
VALUES
  (4, 'T1', 2, true),
  (4, 'T2', 2, true),
  (4, 'T3', 4, true),
  (4, 'T4', 4, true),
  (4, 'T5', 6, true),
  (4, 'T6', 8, true);

-- Insert tables for The American Grill (restaurant_id = 5)
INSERT INTO tables (restaurant_id, table_number, capacity, is_available)
VALUES
  (5, 'T1', 2, true),
  (5, 'T2', 2, true),
  (5, 'T3', 4, true),
  (5, 'T4', 4, true),
  (5, 'T5', 6, true),
  (5, 'T6', 8, true); 