USE reservo; 

CREATE TABLE Bookings (
    booking_id INT AUTO_INCREMENT PRIMARY KEY,

    booking_reference VARCHAR(20) NOT NULL UNIQUE,

    user_id INT NOT NULL,
    resort_id INT NOT NULL,
    room_id INT NOT NULL,

    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,

    number_of_rooms INT NOT NULL DEFAULT 1,
    number_of_adults INT NOT NULL DEFAULT 1,
    number_of_children INT NOT NULL DEFAULT 0,

    room_price DECIMAL(10,2) NOT NULL,
    discount_amount DECIMAL(10,2) DEFAULT 0.00,
    tax_amount DECIMAL(10,2) DEFAULT 0.00,
    total_amount DECIMAL(10,2) NOT NULL,

    booking_status ENUM(
        'Pending',
        'Confirmed',
        'Checked-In',
        'Checked-Out',
        'Cancelled',
        'Completed'
    ) DEFAULT 'Pending',

    payment_status ENUM(
        'Pending',
        'Paid',
        'Partially Paid',
        'Refunded'
    ) DEFAULT 'Pending',

    special_requests TEXT,

    booked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_booking_user
        FOREIGN KEY (user_id)
        REFERENCES Users(user_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_booking_resort
        FOREIGN KEY (resort_id)
        REFERENCES Resorts(resort_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_booking_room
        FOREIGN KEY (room_id)
        REFERENCES Rooms(room_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT chk_booking_dates
        CHECK (check_out_date > check_in_date),

    CONSTRAINT chk_booking_guests
        CHECK (number_of_adults >= 1 AND number_of_children >= 0),
        
	CONSTRAINT chk_booking_room_price
        CHECK (room_price >= 0),

    CONSTRAINT chk_booking_rooms
        CHECK (number_of_rooms >= 1),
        
	CONSTRAINT chk_booking_discount
        CHECK (discount_amount >= 0),

    CONSTRAINT chk_booking_tax
        CHECK (tax_amount >= 0),

    CONSTRAINT chk_booking_total
        CHECK (total_amount >= 0),

    INDEX idx_booking_user_id (user_id),

    INDEX idx_booking_resort_id (resort_id),

    INDEX idx_booking_room_id (room_id),

    INDEX idx_booking_dates (check_in_date, check_out_date),

    INDEX idx_booking_status (booking_status),

    INDEX idx_booking_payment_status (payment_status)
);

INSERT INTO Bookings (
    booking_reference,
    user_id,
    resort_id,
    room_id,
    check_in_date,
    check_out_date,
    number_of_rooms,
    number_of_adults,
    number_of_children,
    room_price,
    discount_amount,
    tax_amount,
    total_amount,
    booking_status,
    payment_status,
    special_requests
) VALUES

('RES20260001', 1, 1, 1,
 '2026-09-01', '2026-09-04',
 1, 2, 0,
 12000.00, 1000.00, 1980.00, 12980.00,
 'Confirmed', 'Paid',
 'Early check-in requested'),

('RES20260002', 2, 2, 2,
 '2026-09-05', '2026-09-07',
 1, 2, 1,
 9000.00, 500.00, 1530.00, 10030.00,
 'Confirmed', 'Paid',
 'Extra bed required'),

('RES20260003', 3, 3, 3,
 '2026-09-10', '2026-09-14',
 2, 4, 0,
 24000.00, 2000.00, 3960.00, 25960.00,
 'Completed', 'Paid',
 'Late check-out requested'),

('RES20260004', 4, 4, 4,
 '2026-09-15', '2026-09-18',
 1, 2, 0,
 15000.00, 1500.00, 2430.00, 15930.00,
 'Checked-In', 'Paid',
 'Sea view room preferred'),

('RES20260005', 5, 5, 5,
 '2026-09-20', '2026-09-23',
 1, 2, 1,
 13500.00, 1000.00, 2250.00, 14750.00,
 'Confirmed', 'Partially Paid',
 'Birthday decoration required'),

('RES20260006', 6, 6, 6,
 '2026-10-01', '2026-10-05',
 1, 2, 0,
 18000.00, 1500.00, 2970.00, 19470.00,
 'Pending', 'Pending',
 'Airport pickup required'),

('RES20260007', 8, 7, 7,
 '2026-10-10', '2026-10-12',
 1, 2, 0,
 8000.00, 500.00, 1350.00, 8850.00,
 'Cancelled', 'Refunded',
 'Cancellation requested by customer'),

('RES20260008', 9, 8, 8,
 '2026-10-15', '2026-10-18',
 1, 2, 1,
 10500.00, 750.00, 1755.00, 11505.00,
 'Completed', 'Paid',
 'Vegetarian meals required'),

('RES20260009', 10, 9, 9,
 '2026-11-01', '2026-11-05',
 2, 4, 2,
 28000.00, 2500.00, 4590.00, 30090.00,
 'Confirmed', 'Paid',
 'Connecting rooms requested'),

('RES20260010', 1, 10, 10,
 '2026-11-10', '2026-11-13',
 1, 2, 0,
 11000.00, 0.00, 1980.00, 12980.00,
 'Pending', 'Pending',
 'Quiet room preferred');
--------------------------------------------------------------------------------
CREATE TABLE Booking_Guests (
    booking_guest_id INT AUTO_INCREMENT PRIMARY KEY,

    booking_id INT NOT NULL,

    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50),
	age INT,

    guest_type ENUM(
        'Adult',
        'Child'
    ) NOT NULL DEFAULT 'Adult',

    phone VARCHAR(15),

    email VARCHAR(100),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_booking_guest_booking
        FOREIGN KEY (booking_id)
        REFERENCES Bookings(booking_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT chk_guest_age
        CHECK (age IS NULL OR age >= 0),
	  
	INDEX idx_booking_guests_booking_id (booking_id)
);
INSERT INTO Booking_Guests (
    booking_id,
    first_name,
    last_name,
    age,
    guest_type,
    phone,
    email
) VALUES

(1, 'Vishal', 'Jagtap', 25, 'Adult',
 '9876543210', 'vishal@example.com'),

(1, 'Sneha', 'Jagtap', 24, 'Adult',
 '9876543220', 'sneha@example.com'),

(2, 'Rahul', 'Patil', 27, 'Adult',
 '9876543211', 'rahul@example.com'),

(2, 'Priya', 'Patil', 25, 'Adult',
 '9876543221', 'priya@example.com'),

(2, 'Aarav', 'Patil', 8, 'Child',
 NULL, NULL),

(3, 'Sneha', 'Kulkarni', 26, 'Adult',
 '9876543212', 'sneha@example.com'),

(3, 'Amit', 'Kulkarni', 28, 'Adult',
 '9876543222', 'amit@example.com'),

(4, 'Amit', 'Sharma', 30, 'Adult',
 '9876543213', 'amit@example.com'),

(4, 'Neha', 'Sharma', 28, 'Adult',
 '9876543223', 'neha@example.com'),

(5, 'Priya', 'Deshmukh', 29, 'Adult',
 '9876543214', 'priya@example.com'),

(5, 'Rohan', 'Deshmukh', 31, 'Adult',
 '9876543224', 'rohan@example.com'),

(5, 'Anaya', 'Deshmukh', 6, 'Child',
 NULL, NULL),

(6, 'Akash', 'Pawar', 27, 'Adult',
 '9876543215', 'akash@example.com'),

(6, 'Pooja', 'Pawar', 26, 'Adult',
 '9876543225', 'pooja@example.com'),

(7, 'Neha', 'Joshi', 25, 'Adult',
 '9876543217', 'neha@example.com'),

(7, 'Riya', 'Joshi', 23, 'Adult',
 '9876543226', 'riya@example.com'),

(8, 'Rohit', 'Shinde', 29, 'Adult',
 '9876543218', 'rohit@example.com'),

(8, 'Kiran', 'Shinde', 27, 'Adult',
 '9876543227', 'kiran@example.com'),

(9, 'Pooja', 'Mane', 24, 'Adult',
 '9876543219', 'pooja@example.com'),

(9, 'Raj', 'Mane', 26, 'Adult',
 '9876543228', 'raj@example.com');
 
  INSERT INTO Booking_Guests (
    booking_id,
    first_name,
    last_name,
    age,
    guest_type
) VALUES
(9, 'Aanya', 'Mane', 7, 'Child'),
(9, 'Vihaan', 'Mane', 5, 'Child');
 ----------------------------------------------------------------------------------------------
 
CREATE TABLE Booking_History (
    history_id INT AUTO_INCREMENT PRIMARY KEY,

    booking_id INT NOT NULL,

    old_status VARCHAR(30),

    new_status VARCHAR(30) NOT NULL,

    changed_by INT,

    change_reason VARCHAR(255),

    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_booking_history_booking
        FOREIGN KEY (booking_id)
        REFERENCES Bookings(booking_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_booking_history_user
        FOREIGN KEY (changed_by)
        REFERENCES Users(user_id)
        ON DELETE SET NULL
        ON UPDATE CASCADE,
        
	INDEX idx_booking_history_booking_id (booking_id),

    INDEX idx_booking_history_changed_at (changed_at)
);
INSERT INTO Booking_History (
    booking_id,
    old_status,
    new_status,
    changed_by,
    change_reason
) VALUES

(1, NULL, 'Pending', 1,
 'Booking created'),

(1, 'Pending', 'Confirmed', 7,
 'Payment confirmed'),

(2, NULL, 'Pending', 2,
 'Booking created'),

(2, 'Pending', 'Confirmed', 7,
 'Booking approved'),

(3, NULL, 'Pending', 3,
 'Booking created'),

(3, 'Pending', 'Confirmed', 7,
 'Payment received'),

(3, 'Confirmed', 'Completed', 7,
 'Guest completed stay'),

(4, NULL, 'Pending', 4,
 'Booking created'),

(4, 'Pending', 'Confirmed', 7,
 'Booking confirmed'),

(4, 'Confirmed', 'Checked-In', 7,
 'Guest checked in'),

(5, NULL, 'Pending', 5,
 'Booking created'),

(5, 'Pending', 'Confirmed', 7,
 'Booking confirmed'),

(6, NULL, 'Pending', 6,
 'Booking created'),

(7, NULL, 'Pending', 8,
 'Booking created'),

(7, 'Pending', 'Cancelled', 8,
 'Customer cancelled booking'),

(8, NULL, 'Pending', 9,
 'Booking created'),

(8, 'Pending', 'Confirmed', 7,
 'Payment confirmed'),

(8, 'Confirmed', 'Completed', 7,
 'Stay completed'),

(9, NULL, 'Pending', 10,
 'Booking created'),

(9, 'Pending', 'Confirmed', 7,
 'Booking confirmed'),

(10, NULL, 'Pending', 1,
 'Booking created');


DESCRIBE Bookings;

DESCRIBE Booking_Guests;

DESCRIBE Booking_History;

SHOW TABLES;
