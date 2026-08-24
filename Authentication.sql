CREATE DATABASE reservo;
USE reservo;
SELECT database();

USE reservo;

CREATE TABLE Roles (
    role_id INT AUTO_INCREMENT PRIMARY KEY,
    role_name VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO Roles (
    role_name,
    description
) VALUES
('Customer', 'Normal resort booking customer'),
('Resort Owner', 'Manages resorts and rooms'),
('Admin', 'Manages the entire platform');

describe Roles;

CREATE TABLE Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50),
	email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(15) UNIQUE,

    profile_image VARCHAR(255),

    date_of_birth DATE,
    gender ENUM(
        'Male',
        'Female',
        'Other',
        'Prefer not to say'
    ),

    role_id INT NOT NULL,

    status ENUM(
        'Active',
        'Inactive',
        'Blocked'
    ) DEFAULT 'Active',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_users_role
        FOREIGN KEY (role_id)
        REFERENCES Roles(role_id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
);

INSERT INTO Users (
    first_name,
    last_name,
    email,
    phone,
    profile_image,
    date_of_birth,
    gender,
    role_id,
    status
) VALUES

('Vishal', 'Jagtap', 'vishal@example.com', '9876543210',
 'vishal.jpg', '2001-05-15', 'Male', 1, 'Active'),

('Rahul', 'Patil', 'rahul@example.com', '9876543211',
 'rahul.jpg', '1999-08-20', 'Male', 1, 'Active'),

('Sneha', 'Kulkarni', 'sneha@example.com', '9876543212',
 'sneha.jpg', '2000-02-10', 'Female', 1, 'Active'),

('Amit', 'Sharma', 'amit@example.com', '9876543213',
 'amit.jpg', '1998-11-25', 'Male', 2, 'Active'),

('Priya', 'Deshmukh', 'priya@example.com', '9876543214',
 'priya.jpg', '1997-06-18', 'Female', 2, 'Active'),

('Akash', 'Pawar', 'akash@example.com', '9876543215',
 'akash.jpg', '2001-01-12', 'Male', 2, 'Active'),

('Admin', 'User', 'admin@example.com', '9876543216',
 'admin.jpg', '1995-03-05', 'Male', 3, 'Active'),

('Neha', 'Joshi', 'neha@example.com', '9876543217',
 'neha.jpg', '2000-09-22', 'Female', 1, 'Active'),

('Rohit', 'Shinde', 'rohit@example.com', '9876543218',
 'rohit.jpg', '1999-12-14', 'Male', 1, 'Active'),

('Pooja', 'Mane', 'pooja@example.com', '9876543219',
 'pooja.jpg', '2002-04-30', 'Female', 1, 'Active');
 
describe Users;

CREATE TABLE User_Authentication (
    auth_id INT AUTO_INCREMENT PRIMARY KEY,

    user_id INT NOT NULL UNIQUE,

    password_hash VARCHAR(255) NOT NULL,

    password_algorithm VARCHAR(30) NOT NULL DEFAULT 'Argon2id',

    password_updated_at TIMESTAMP NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_auth_user
        FOREIGN KEY (user_id)
        REFERENCES Users(user_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

INSERT INTO User_Authentication (
    user_id,
    password_hash,
    password_algorithm,
    password_updated_at
) VALUES
(1, '$2a$10$DemoHashUser001', 'Argon2id', CURRENT_TIMESTAMP),
(2, '$2a$10$DemoHashUser002', 'Argon2id', CURRENT_TIMESTAMP),
(3, '$2a$10$DemoHashUser003', 'Argon2id', CURRENT_TIMESTAMP),
(4, '$2a$10$DemoHashUser004', 'Argon2id', CURRENT_TIMESTAMP),
(5, '$2a$10$DemoHashUser005', 'Argon2id', CURRENT_TIMESTAMP),
(6, '$2a$10$DemoHashUser006', 'Argon2id', CURRENT_TIMESTAMP),
(7, '$2a$10$DemoHashUser007', 'Argon2id', CURRENT_TIMESTAMP),
(8, '$2a$10$DemoHashUser008', 'Argon2id', CURRENT_TIMESTAMP),
(9, '$2a$10$DemoHashUser009', 'Argon2id', CURRENT_TIMESTAMP),
(10, '$2a$10$DemoHashUser010', 'Argon2id', CURRENT_TIMESTAMP);

DESCRIBE User_Authentication;

CREATE TABLE User_Sessions (
    session_id INT AUTO_INCREMENT PRIMARY KEY,

    user_id INT NOT NULL,

    session_token_hash VARCHAR(255) NOT NULL UNIQUE,

    device_info VARCHAR(255),

    ip_address VARCHAR(45),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    expires_at TIMESTAMP NOT NULL,

    revoked_at TIMESTAMP NULL,

    CONSTRAINT fk_session_user
        FOREIGN KEY (user_id)
        REFERENCES Users(user_id)
        ON DELETE CASCADE
		ON UPDATE CASCADE,

    INDEX idx_sessions_user_id (user_id),

    INDEX idx_sessions_expires_at (expires_at)
);

INSERT INTO User_Sessions (
    user_id,
    session_token_hash,
    device_info,
    ip_address,
    expires_at
) VALUES
(1, 'session_hash_001', 'Chrome on Windows', '192.168.1.101',
 '2026-08-20 23:59:59'),

(2, 'session_hash_002', 'Chrome on Windows', '192.168.1.102',
 '2026-08-20 23:59:59'),

(3, 'session_hash_003', 'Android Chrome', '192.168.1.103',
 '2026-08-21 23:59:59'),

(4, 'session_hash_004', 'Chrome on Windows', '192.168.1.104',
 '2026-08-21 23:59:59'),

(5, 'session_hash_005', 'iPhone Safari', '192.168.1.105',
 '2026-08-22 23:59:59'),

(6, 'session_hash_006', 'Android Chrome', '192.168.1.106',
 '2026-08-22 23:59:59'),

(7, 'session_hash_007', 'Chrome on Windows', '192.168.1.107',
 '2026-08-23 23:59:59'),

(8, 'session_hash_008', 'Firefox on Windows', '192.168.1.108',
'2026-08-23 23:59:59'),

(9, 'session_hash_009', 'Android Chrome', '192.168.1.109',
 '2026-08-24 23:59:59'),

(10, 'session_hash_010', 'Chrome on Windows', '192.168.1.110',
 '2026-08-24 23:59:59');
 
describe User_Sessions; 

CREATE TABLE OTP_Verification (
    otp_id INT AUTO_INCREMENT PRIMARY KEY,

    user_id INT,

    destination VARCHAR(255) NOT NULL,

    otp_hash VARCHAR(255) NOT NULL,

    purpose ENUM(
        'Email Verification',
        'Phone Verification',
        'Password Reset',
        'Login Verification'
    ) NOT NULL,

    attempts INT DEFAULT 0,

    expires_at TIMESTAMP NOT NULL,

    verified_at TIMESTAMP NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_otp_user
        FOREIGN KEY (user_id)
        REFERENCES Users(user_id)
        ON DELETE CASCADE
		ON UPDATE CASCADE,

    INDEX idx_otp_user_id (user_id),

    INDEX idx_otp_destination (destination),

    INDEX idx_otp_expires_at (expires_at)
);
INSERT INTO OTP_Verification (
    user_id,
    destination,
    otp_hash,
    purpose,
    attempts,
    expires_at,
    verified_at
) VALUES
(1, 'vishal@example.com', 'otp_hash_001',
 'Email Verification', 0, '2026-08-11 22:00:00', NULL),

(2, 'rahul@example.com', 'otp_hash_002',
 'Email Verification', 1, '2026-08-11 22:05:00', '2026-08-11 21:55:00'),

(3, '9876543212', 'otp_hash_003',
 'Phone Verification', 0, '2026-08-11 22:10:00', NULL),

(4, 'amit@example.com', 'otp_hash_004',
 'Password Reset', 0, '2026-08-11 22:15:00', NULL),

(5, '9876543214', 'otp_hash_005',
 'Phone Verification', 2, '2026-08-11 22:20:00', NULL),

(6, 'akash@example.com', 'otp_hash_006',
 'Login Verification', 1, '2026-08-11 22:25:00', '2026-08-11 22:00:00'),

(7, 'admin@example.com', 'otp_hash_007',
 'Login Verification', 0, '2026-08-11 22:30:00', NULL),

(8, 'neha@example.com', 'otp_hash_008',
 'Email Verification', 0, '2026-08-11 22:35:00', '2026-08-11 22:10:00'),

(9, '9876543218', 'otp_hash_009',
 'Password Reset', 1, '2026-08-11 22:40:00', NULL),

(10, 'pooja@example.com', 'otp_hash_010',
 'Email Verification', 0, '2026-08-11 22:45:00', NULL);
 
SHOW TABLES;

CREATE TABLE User_Profile (
    profile_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    bio TEXT,
    preferred_language VARCHAR(50),
    preferred_currency VARCHAR(10),
    loyalty_points INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_user_profile_user
        FOREIGN KEY (user_id)
        REFERENCES Users(user_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

INSERT INTO User_Profile (
    user_id,
    bio,
    preferred_language,
    preferred_currency,
    loyalty_points
) VALUES

(1,
 'Travel enthusiast who enjoys beach resorts.',
 'English',
 'INR',
 1200),

(2,
 'Frequent traveler and adventure lover.',
 'English',
 'INR',
 850),

(3,
 'Enjoys peaceful mountain destinations.',
 'English',
 'INR',
 1500),

(4,
 'Resort owner managing premium properties.',
 'English',
 'INR',
 2000),

(5,
 'Resort owner focused on customer experience.',
 'Hindi',
 'INR',
 1750),

(6,
 'Resort operations manager.',
 'English',
 'INR',
 900),

(7,
 'Front desk and guest service professional.',
 'English',
 'INR',
 600),

(8,
 'Customer support specialist.',
 'English',
 'INR',
 450),

(9,
 'Content manager for resort listings.',
 'English',
 'INR',
 700),

(10,
 'Platform administrator.',
 'English',
 'INR',
 3000);
 
 
CREATE TABLE Search_History (
    search_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(150),
    destination VARCHAR(150),
    check_in DATE,
    check_out DATE,
    guests INT,
    budget DECIMAL(10,2),
    searched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_search_history_user
        FOREIGN KEY (user_id)
        REFERENCES Users(user_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
	
    INDEX idx_search_user_id (user_id),

    INDEX idx_search_destination (destination),

    INDEX idx_search_searched_at (searched_at)
     
);

INSERT INTO Search_History (
    user_id,
    title,
    destination,
    check_in,
    check_out,
    guests,
    budget
) VALUES

(1,
 'Beach Resort',
 'Goa',
 '2026-09-01',
 '2026-09-04',
 2,
 15000.00),

(2,
 'Mountain Resort',
 'Manali',
 '2026-09-05',
 '2026-09-07',
 3,
 12000.00),

(3,
 'Lake View Resort',
 'Udaipur',
 '2026-09-10',
 '2026-09-14',
 2,
 20000.00),

(4,
 'Family Resort',
 'Lonavala',
 '2026-09-15',
 '2026-09-18',
 4,
 18000.00),

(5,
 'Beach Holiday',
 'Goa',
 '2026-09-20',
 '2026-09-23',
 3,
 25000.00),

(6,
 'Luxury Resort',
 'Bengaluru',
 '2026-10-01',
 '2026-10-05',
 2,
 30000.00),

(7,
 'Lake Resort',
 'Nainital',
 '2026-10-10',
 '2026-10-12',
 2,
 12000.00),

(8,
 'Desert Resort',
 'Jaisalmer',
 '2026-10-15',
 '2026-10-18',
 2,
 18000.00),

(9,
 'Backwater Resort',
 'Alappuzha',
 '2026-11-01',
 '2026-11-05',
 4,
 30000.00),

(10,
 'Hill Station Resort',
 'Mahabaleshwar',
 '2026-11-10',
 '2026-11-13',
 2,
 15000.00);
 
 