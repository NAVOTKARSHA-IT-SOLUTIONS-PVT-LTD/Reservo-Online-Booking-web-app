-- =============================================================================
-- RESERVO SAAS DATABASE SCHEMA
-- Generated for MySQL / H2 Fallback compatibility
-- Covers all transactional inventory, customer logs, admin panels, and AI Concierge models.
-- =============================================================================

-- DROP TABLES IN REVERSE ORDER OF DEPENDENCY (FOR CLEAN RUNS)
DROP TABLE IF EXISTS resort_posts;
DROP TABLE IF EXISTS ai_itineraries;
DROP TABLE IF EXISTS ai_chat_messages;
DROP TABLE IF EXISTS ai_chat_sessions;
DROP TABLE IF EXISTS resort_documents;
DROP TABLE IF EXISTS staff_members;
DROP TABLE IF EXISTS offers;
DROP TABLE IF EXISTS wishlists;
DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS payments;
DROP TABLE IF EXISTS bookings;
DROP TABLE IF EXISTS rooms;
DROP TABLE IF EXISTS resorts;
DROP TABLE IF EXISTS admin_audit_logs;
DROP TABLE IF EXISTS platform_settings;
DROP TABLE IF EXISTS users;

-- 1. USERS
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    role VARCHAR(50) NOT NULL CHECK (role IN ('ROLE_ADMIN', 'ROLE_OWNER', 'ROLE_CUSTOMER')),
    status VARCHAR(50) NOT NULL CHECK (status IN ('ACTIVE', 'INACTIVE', 'BLOCKED')),
    avatar_url VARCHAR(255),
    login_provider VARCHAR(50) DEFAULT 'LOCAL',
    email_verified BOOLEAN DEFAULT FALSE,
    account_locked BOOLEAN DEFAULT FALSE,
    last_login_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. RESORTS
CREATE TABLE resorts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    description TEXT,
    image_url VARCHAR(255),
    price_per_night DECIMAL(19, 2) NOT NULL,
    rating DOUBLE DEFAULT 4.5,
    review_count INT DEFAULT 0,
    featured_tag VARCHAR(255),
    discount_percentage INT,
    status VARCHAR(50) NOT NULL CHECK (status IN ('PENDING_APPROVAL', 'APPROVED', 'REJECTED', 'SUSPENDED')),
    owner_id BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE SET NULL
);

-- 3. ROOMS
CREATE TABLE rooms (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    room_number VARCHAR(50) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('DELUXE', 'PREMIUM', 'SUITE', 'DELUXE_SEA_VIEW', 'VILLA_WITH_POOL')),
    price_per_night DECIMAL(19, 2) NOT NULL,
    capacity INT NOT NULL,
    status VARCHAR(50) NOT NULL CHECK (status IN ('AVAILABLE', 'OCCUPIED', 'MAINTENANCE', 'BLOCKED')),
    cleaning_status VARCHAR(50) CHECK (cleaning_status IN ('CLEAN', 'DIRTY', 'CLEANING')),
    maintenance_details TEXT,
    resort_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (resort_id) REFERENCES resorts(id) ON DELETE CASCADE
);

-- 4. BOOKINGS
CREATE TABLE bookings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    booking_code VARCHAR(255) NOT NULL UNIQUE,
    user_id BIGINT NOT NULL,
    resort_id BIGINT NOT NULL,
    room_id BIGINT NOT NULL,
    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,
    guests_count INT DEFAULT 2,
    rooms_count INT DEFAULT 1,
    total_amount DECIMAL(19, 2) NOT NULL,
    status VARCHAR(50) NOT NULL CHECK (status IN ('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED')),
    booking_source VARCHAR(50) CHECK (booking_source IN ('DIRECT', 'SEARCH', 'REFERRAL', 'OTHERS')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (resort_id) REFERENCES resorts(id) ON DELETE CASCADE,
    FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE
);

-- 5. PAYMENTS
CREATE TABLE payments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    transaction_id VARCHAR(255) NOT NULL UNIQUE,
    booking_id BIGINT NOT NULL UNIQUE,
    amount DECIMAL(19, 2) NOT NULL,
    payment_method VARCHAR(100),
    status VARCHAR(50) NOT NULL CHECK (status IN ('PENDING', 'SUCCESS', 'FAILED', 'REFUNDED')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE
);

-- 6. REVIEWS
CREATE TABLE reviews (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    rating DOUBLE NOT NULL,
    comment TEXT,
    user_id BIGINT NOT NULL,
    resort_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (resort_id) REFERENCES resorts(id) ON DELETE CASCADE
);

-- 7. WISHLISTS
CREATE TABLE wishlists (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    resort_id BIGINT NOT NULL,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (resort_id) REFERENCES resorts(id) ON DELETE CASCADE
);

-- 8. OFFERS
CREATE TABLE offers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(255) NOT NULL UNIQUE,
    type VARCHAR(255) NOT NULL,
    discount VARCHAR(255) NOT NULL,
    status VARCHAR(255) NOT NULL,
    expiry_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 9. STAFF MEMBERS
CREATE TABLE staff_members (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL,
    department VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    status VARCHAR(255) NOT NULL,
    resort_id BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (resort_id) REFERENCES resorts(id) ON DELETE CASCADE
);

-- 10. RESORT DOCUMENTS
CREATE TABLE resort_documents (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    status VARCHAR(255) NOT NULL,
    expiry_date DATE,
    document_url VARCHAR(512),
    file_size VARCHAR(100),
    resort_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (resort_id) REFERENCES resorts(id) ON DELETE CASCADE
);

-- 11. PLATFORM SETTINGS
CREATE TABLE platform_settings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(255) NOT NULL UNIQUE,
    setting_value VARCHAR(255) NOT NULL,
    description VARCHAR(255),
    updated_by VARCHAR(255),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 12. ADMIN AUDIT LOGS
CREATE TABLE admin_audit_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    admin_username VARCHAR(255) NOT NULL,
    action VARCHAR(255) NOT NULL,
    target_entity VARCHAR(255),
    target_id VARCHAR(255),
    details TEXT,
    ip_address VARCHAR(255),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 13. AI CHAT SESSIONS
CREATE TABLE ai_chat_sessions (
    id VARCHAR(50) PRIMARY KEY,
    user_id BIGINT,
    mood VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 14. AI CHAT MESSAGES
CREATE TABLE ai_chat_messages (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    session_id VARCHAR(50) NOT NULL,
    sender VARCHAR(50) NOT NULL,
    message_text TEXT NOT NULL,
    recommended_resort_id BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (session_id) REFERENCES ai_chat_sessions(id) ON DELETE CASCADE
);

-- 15. AI ITINERARIES
CREATE TABLE ai_itineraries (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT,
    destination VARCHAR(255) NOT NULL,
    duration_days INT NOT NULL,
    budget_level VARCHAR(255) NOT NULL,
    itinerary_json TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 16. RESORT POSTS
CREATE TABLE resort_posts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    resort_id BIGINT NOT NULL,
    type VARCHAR(50),
    media_url VARCHAR(255),
    caption TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (resort_id) REFERENCES resorts(id) ON DELETE CASCADE
);
