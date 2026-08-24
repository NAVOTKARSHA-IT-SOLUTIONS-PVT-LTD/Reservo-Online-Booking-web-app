USE reservo; 

CREATE TABLE Resorts (
    resort_id INT AUTO_INCREMENT PRIMARY KEY,

    owner_id INT NOT NULL,

    resort_name VARCHAR(150) NOT NULL,

    description TEXT,

    address VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100),
    country VARCHAR(100) DEFAULT 'India',
    pincode VARCHAR(10),

    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),

    check_in_time TIME,
    check_out_time TIME,

    rating DECIMAL(2,1) DEFAULT 0.0,
    review_count INT DEFAULT 0,

    status ENUM(
        'Pending',
        'Approved',
        'Rejected',
        'Suspended'
    ) DEFAULT 'Pending',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_resort_owner
        FOREIGN KEY (owner_id)
        REFERENCES Users(user_id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    CONSTRAINT chk_resort_rating
        CHECK (rating >= 0 AND rating <= 5)
);
INSERT INTO Resorts (
    owner_id,
    resort_name,
    description,
    address,
    city,
    state,
    country,
    pincode,
    latitude,
    longitude,
    check_in_time,
    check_out_time,
    rating,
    review_count,
    status
) VALUES
(4,
 'Palm Paradise Resort',
 'Beautiful beach resort with modern rooms and ocean views.',
 'Calangute Beach Road',
 'Goa',
 'Goa',
 'India',
 '403516',
 15.54480000,
 73.75530000,
 '14:00:00',
 '11:00:00',
 4.5,
 125,
 'Approved'),

(5,
 'Mountain View Retreat',
 'Peaceful mountain resort surrounded by beautiful landscapes.',
 'Manali Main Road',
 'Manali',
 'Himachal Pradesh',
 'India',
 '175131',
 32.24320000,
 77.18920000,
 '13:00:00',
 '11:00:00',
 4.7,
 98,
 'Approved'),

(6,
 'Royal Lake Palace Resort',
 'Luxury resort overlooking the beautiful Lake Pichola.',
 'Lake Pichola Road',
 'Udaipur',
 'Rajasthan',
 'India',
 '313001',
 24.57620000,
 73.68350000,
 '14:00:00',
 '12:00:00',
 4.8,
 210,
 'Approved'),

(4,
 'Green Valley Resort',
 'Nature resort offering peaceful rooms and outdoor activities.',
 'Lonavala Road',
 'Lonavala',
 'Maharashtra',
 'India',
 '410401',
 18.75460000,
 73.40620000,
 '13:00:00',
 '11:00:00',
 4.3,
 75,
 'Approved'),

(5,
 'Ocean Breeze Resort',
 'Premium beachfront resort with swimming pool and spa.',
 'Candolim Beach Road',
 'Goa',
 'Goa',
 'India',
 '403515',
 15.51820000,
 73.76270000,
 '14:00:00',
 '11:00:00',
 4.6,
 156,
 'Approved'),

(6,
 'Royal Orchid Resort',
 'Elegant resort with luxury rooms and excellent dining.',
 'MG Road',
 'Bengaluru',
 'Karnataka',
 'India',
 '560001',
 12.97160000,
 77.59460000,
 '14:00:00',
 '11:00:00',
 4.4,
 132,
 'Approved'),

(4,
 'Lake Breeze Resort',
 'Family-friendly resort near the scenic lakeside.',
 'Lake Road',
 'Nainital',
 'Uttarakhand',
 'India',
 '263001',
 29.39190000,
 79.45420000,
 '13:00:00',
 '11:00:00',
 4.2,
 87,
 'Pending'),

(5,
 'Desert Pearl Resort',
 'Luxury desert resort with traditional Rajasthani hospitality.',
 'Sam Sand Dunes Road',
 'Jaisalmer',
 'Rajasthan',
 'India',
 '345001',
 26.91570000,
 70.90830000,
 '14:00:00',
 '11:00:00',
 4.5,
 64,
 'Approved'),

(6,
 'Backwater Bliss Resort',
 'Relaxing resort surrounded by Kerala backwaters.',
 'Alleppey Backwater Road',
 'Alappuzha',
 'Kerala',
 'India',
 '688001',
 9.49810000,
 76.33880000,
 '13:00:00',
 '11:00:00',
 4.7,
 118,
 'Approved'),

(4,
 'Sunset Valley Resort',
 'Comfortable resort offering panoramic sunset views.',
 'Mahabaleshwar Road',
 'Mahabaleshwar',
 'Maharashtra',
 'India',
 '412806',
 17.93070000,
 73.64770000,
 '14:00:00',
 '11:00:00',
 4.1,
 53,
 'Pending');


CREATE TABLE Amenities (
    amenity_id INT AUTO_INCREMENT PRIMARY KEY,

    amenity_name VARCHAR(100) NOT NULL UNIQUE,

    description VARCHAR(255),

    icon VARCHAR(255),

    category VARCHAR(100),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    
);

INSERT INTO Amenities (
    amenity_name,
    description,
    icon,
    category
) VALUES
('Swimming Pool',
 'Outdoor swimming pool for guests.',
 'pool-icon.png',
 'Recreation'),

('Free WiFi',
 'Complimentary high-speed WiFi.',
 'wifi-icon.png',
 'Connectivity'),

('Parking',
 'Free parking facility for guests.',
 'parking-icon.png',
 'Transport'),

('Restaurant',
 'On-site multi-cuisine restaurant.',
 'restaurant-icon.png',
 'Food'),

('Spa',
 'Professional spa and wellness services.',
 'spa-icon.png',
 'Wellness'),

('Gym',
 'Fully equipped fitness center.',
 'gym-icon.png',
 'Fitness'),

('Room Service',
 '24-hour room service available.',
 'room-service-icon.png',
 'Services'),

('Airport Transfer',
 'Airport pickup and drop-off service.',
 'airport-icon.png',
 'Transport'),

('Beach Access',
 'Direct access to the nearby beach.',
 'beach-icon.png',
 'Recreation'),

('Conference Hall',
 'Meeting and conference facilities.',
 'conference-icon.png',
 'Business');
 -------------------------------------------------------------------------------------------------

CREATE TABLE Resort_Amenities (
    resort_id INT NOT NULL,

    amenity_id INT NOT NULL,

    PRIMARY KEY (resort_id, amenity_id),

    CONSTRAINT fk_resort_amenity_resort
        FOREIGN KEY (resort_id)
        REFERENCES Resorts(resort_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_resort_amenity_amenity
        FOREIGN KEY (amenity_id)
        REFERENCES Amenities(amenity_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);
INSERT INTO Resort_Amenities (
    resort_id,
    amenity_id
) VALUES
(1, 1),
(1, 2),
(2, 3),
(2, 4),
(3, 5),
(3, 6),
(4, 7),
(5, 8),
(6, 9),
(7, 10);

SELECT amenity_id, amenity_name
FROM Amenities
ORDER BY amenity_id;
--------------------------------------------------------------------------------------------------------------
CREATE TABLE Resort_Images (
     image_id INT auto_increment primary key,
     resort_id INT NOT NULL,
     image_url VARCHAR (500) NOT NULL, 
     image_type VARCHAR (50) NOT NULL,
     is_primary BOOLEAN DEFAULT FALSE, 
     display_order INT default 0,
     created_at TIMESTAMP DEFAULT current_timestamp, 
     
	 CONSTRAINT fk_resort_image_resort
        FOREIGN KEY (resort_id)
        REFERENCES Resorts(resort_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
		INDEX idx_resort_images_resort_id (resort_id)
);

INSERT INTO Resort_Images (
    resort_id,
    image_url,
    image_type,
    is_primary,
    display_order
) VALUES
(1, 'https://example.com/resorts/palm-paradise-1.jpg', 'Exterior', TRUE, 1),

(1, 'https://example.com/resorts/palm-paradise-2.jpg', 'Room', FALSE, 2),

(2, 'https://example.com/resorts/mountain-view-1.jpg', 'Exterior', TRUE, 1),

(2, 'https://example.com/resorts/mountain-view-2.jpg', 'Room', FALSE, 2),

(3, 'https://example.com/resorts/lake-palace-1.jpg', 'Exterior', TRUE, 1),

(4, 'https://example.com/resorts/green-valley-1.jpg', 'Exterior', TRUE, 1),

(5, 'https://example.com/resorts/ocean-breeze-1.jpg', 'Beach', TRUE, 1),

(6, 'https://example.com/resorts/royal-orchid-1.jpg', 'Exterior', TRUE, 1),

(8, 'https://example.com/resorts/desert-pearl-1.jpg', 'Exterior', TRUE, 1),

(9, 'https://example.com/resorts/backwater-bliss-1.jpg', 'Exterior', TRUE, 1);

----------------------------------------------------------------------------------------------------------------------------------
CREATE TABLE Resort_Documents (
    document_id INT AUTO_INCREMENT PRIMARY KEY,

    resort_id INT NOT NULL,

    document_name VARCHAR(150) NOT NULL,

    document_type VARCHAR(100) NOT NULL,

    document_url VARCHAR(500) NOT NULL,

    expiry_date DATE,

    verification_status ENUM(
        'Pending',
        'Verified',
        'Rejected',
        'Expired'
    ) DEFAULT 'Pending',

    verified_by INT,

    verified_at TIMESTAMP NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_resort_document_resort
        FOREIGN KEY (resort_id)
        REFERENCES Resorts(resort_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_resort_document_verifier
        FOREIGN KEY (verified_by)
        REFERENCES Users(user_id)
        ON DELETE SET NULL
         ON UPDATE CASCADE,

    INDEX idx_resort_documents_resort_id (resort_id),

    INDEX idx_resort_documents_verified_by (verified_by)

);
INSERT INTO Resort_Documents (
    resort_id,
    document_name,
    document_type,
    document_url,
    expiry_date,
    verification_status,
    verified_by,
    verified_at
) VALUES

(1,
 'GST Certificate - Palm Paradise Resort',
 'GST Number: 27ABCDE1234F1Z5',
 'https://example.com/documents/palm-paradise-gst.pdf',
 NULL,
 'Verified',
 7,
 '2026-08-01 10:00:00'),

(2,
 'GST Certificate - Mountain View Retreat',
 'GST Number: 02BCDEF2345G1Z6',
 'https://example.com/documents/mountain-view-gst.pdf',
 NULL,
 'Verified',
 7,
 '2026-08-02 10:00:00'),

(3,
 'GST Certificate - Royal Lake Palace Resort',
 'GST Number: 08CDEFG3456H1Z7',
 'https://example.com/documents/lake-palace-gst.pdf',
 NULL,
 'Verified',
 7,
 '2026-08-02 11:00:00'),

(4,
 'GST Certificate - Green Valley Resort',
 'GST Number: 27DEFGH4567J1Z8',
 'https://example.com/documents/green-valley-gst.pdf',
 NULL,
 'Pending',
 NULL,
 NULL),

(5,
 'GST Certificate - Ocean Breeze Resort',
 'GST Number: 30EFGHI5678K1Z9',
 'https://example.com/documents/ocean-breeze-gst.pdf',
 NULL,
 'Verified',
 7,
 '2026-08-03 09:30:00'),

(6,
 'GST Certificate - Royal Orchid Resort',
 'GST Number: 29FGHIJ6789L1Z0',
 'https://example.com/documents/royal-orchid-gst.pdf',
 NULL,
 'Verified',
 7,
 '2026-08-03 10:00:00'),

(7,
 'GST Certificate - Lake Breeze Resort',
 'GST Number: 05GHIJK7890M1Z1',
 'https://example.com/documents/lake-breeze-gst.pdf',
 NULL,
 'Pending',
 NULL,
 NULL),

(8,
 'GST Certificate - Desert Pearl Resort',
 'GST Number: 08HIJKL8901N1Z2',
 'https://example.com/documents/desert-pearl-gst.pdf',
 NULL,
 'Verified',
 7,
 '2026-08-04 11:00:00'),

(9,
 'GST Certificate - Backwater Bliss Resort',
 'GST Number: 32IJKLM9012P1Z3',
 'https://example.com/documents/backwater-bliss-gst.pdf',
 NULL,
 'Verified',
 7,
 '2026-08-04 12:00:00'),

(10,
 'GST Certificate - Sunset Valley Resort',
 'GST Number: 27JKLMN0123Q1Z4',
 'https://example.com/documents/sunset-valley-gst.pdf',
 NULL,
 'Rejected',
 7,
 '2026-08-05 10:00:00');

-------------------------------------------------------------------------------------------------
CREATE TABLE Resort_Offers (
    offer_id INT AUTO_INCREMENT PRIMARY KEY,

    resort_id INT NOT NULL,

    offer_title VARCHAR(150) NOT NULL,

    description TEXT,

    discount_type ENUM(
        'Percentage',
        'Fixed'
    ) NOT NULL,

    discount_value DECIMAL(10,2) NOT NULL,

    minimum_amount DECIMAL(10,2) DEFAULT 0.00,

    maximum_discount DECIMAL(10,2),

    valid_from DATE NOT NULL,

    valid_to DATE NOT NULL,

    status ENUM(
        'Active',
        'Expired'
    ) DEFAULT 'Active',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_resort_offer_resort
        FOREIGN KEY (resort_id)
        REFERENCES Resorts(resort_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT chk_offer_dates
        CHECK (valid_to >= valid_from),

    CONSTRAINT chk_offer_value
        CHECK (discount_value > 0),
        
	CONSTRAINT chk_offer_minimum_amount
        CHECK (minimum_amount >= 0),

	INDEX idx_resort_offers_resort_id (resort_id),
    INDEX idx_resort_offers_dates (valid_from, valid_to)

);

INSERT INTO Resort_Offers (
    resort_id,
    offer_title,
    description,
    discount_type,
    discount_value,
    minimum_amount,
    maximum_discount,
    valid_from,
    valid_to,
    status
) VALUES
(1, 'Goa Summer Special',
 'Special discount for summer bookings.',
 'Percentage',
 15.00,
 5000.00,
 3000.00,
 '2026-08-01',
 '2026-09-30',
 'Active'),

(2, 'Mountain Escape',
 'Discount on weekend stays.',
 'Percentage',
 10.00,
 4000.00,
 2000.00,
 '2026-08-15',
 '2026-10-15',
 'Active'),

(3, 'Luxury Weekend',
 'Fixed discount for luxury rooms.',
 'Fixed',
 2000.00,
 10000.00,
 2000.00,
 '2026-09-01',
 '2026-11-30',
 'Active'),

(4, 'Lonavala Family Offer',
 'Family booking special discount.',
 'Percentage',
 12.00,
 6000.00,
 2500.00,
 '2026-08-20',
 '2026-10-31',
 'Active'),

(5, 'Beach Holiday Offer',
 'Special discount for beach holidays.',
 'Percentage',
 20.00,
 8000.00,
 4000.00,
 '2026-09-01',
 '2026-12-31',
 'Active'),

(6, 'City Luxury Deal',
 'Luxury stay discount.',
 'Fixed',
 1500.00,
 7000.00,
 1500.00,
 '2026-08-01',
 '2026-09-30',
 'Active'),

(7, 'Lake View Discount',
 'Discount for lake view rooms.',
 'Percentage',
 10.00,
 5000.00,
 2000.00,
 '2026-07-01',
 '2026-08-31',
 'Expired'),

(8, 'Desert Adventure',
 'Special desert resort offer.',
 'Percentage',
 15.00,
 9000.00,
 3000.00,
 '2026-10-01',
 '2026-12-31',
 'Active'),

(9, 'Kerala Backwater Offer',
 'Special offer for backwater stays.',
 'Percentage',
 18.00,
 7000.00,
 3500.00,
 '2026-09-01',
 '2026-12-31',
 'Active'),

(10, 'Mahabaleshwar Weekend',
 'Weekend getaway discount.',
 'Fixed',
 1000.00,
 5000.00,
 1000.00,
 '2026-09-01',
 '2026-10-31',
 'Active');
-----------------------------------------------------------------------------------------------------
CREATE TABLE Room_Types (
    room_type_id INT AUTO_INCREMENT PRIMARY KEY,

    resort_id INT NOT NULL,

    room_type_name VARCHAR(100) NOT NULL,

    description TEXT,

    max_adults INT NOT NULL DEFAULT 2,
    max_children INT NOT NULL DEFAULT 0,

    base_price DECIMAL(10,2) NOT NULL,

    total_rooms INT NOT NULL DEFAULT 1,

    status ENUM(
        'Active',
        'Inactive'
    ) DEFAULT 'Active',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_room_type_resort
        FOREIGN KEY (resort_id)
        REFERENCES Resorts(resort_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
        
	CONSTRAINT uq_resort_room_type
        UNIQUE (resort_id, room_type_name),

    CONSTRAINT chk_room_type_capacity
        CHECK ( max_adults >= 1
            AND max_children >= 0 ),

    CONSTRAINT chk_room_type_price
        CHECK (base_price >= 0),

    CONSTRAINT chk_room_type_quantity
        CHECK (total_rooms >= 1),
    
     INDEX idx_room_types_resort_id (resort_id)
);
INSERT INTO Room_Types (
    resort_id,
    room_type_name,
    description,
    max_adults,
    max_children,
    base_price,
    total_rooms,
    status
) VALUES
(1, 'Deluxe Room',
 'Comfortable deluxe room with modern facilities.',
 2, 1, 4500.00, 10, 'Active'),

(1, 'Premium Suite',
 'Large suite with balcony and premium facilities.',
 3, 2, 7500.00, 5, 'Active'),

(2, 'Mountain Deluxe',
 'Mountain-facing deluxe room.',
 2, 1, 4000.00, 8, 'Active'),

(2, 'Family Suite',
 'Spacious suite suitable for families.',
 4, 2, 6500.00, 5, 'Active'),

(3, 'Lake View Room',
 'Room with beautiful lake views.',
 2, 1, 6000.00, 8, 'Active'),

(4, 'Garden Room',
 'Peaceful garden-facing room.',
 2, 1, 3500.00, 10, 'Active'),

(5, 'Beach Suite',
 'Premium suite with beach views.',
 3, 2, 8000.00, 6, 'Active'),

(6, 'Executive Room',
 'Luxury executive room for business travelers.',
 2, 1, 5000.00, 12, 'Active'),

(8, 'Desert Tent',
 'Traditional luxury desert accommodation.',
 2, 1, 5500.00, 8, 'Active'),

(9, 'Backwater Villa',
 'Private villa overlooking the backwaters.',
 4, 2, 9000.00, 5, 'Active');
-----------------------------------------------------------------------------------------------------------------------
CREATE TABLE Rooms (
    room_id INT AUTO_INCREMENT PRIMARY KEY,

    room_type_id INT NOT NULL,

    room_number VARCHAR(20) NOT NULL,

    floor_number INT,

    room_status ENUM(
        'Available',
        'Occupied',
        'Maintenance',
        'Inactive'
    ) DEFAULT 'Available',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_room_room_type
        FOREIGN KEY (room_type_id)
        REFERENCES Room_Types(room_type_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT uq_room_number_per_type
        UNIQUE (room_type_id, room_number),
        
	INDEX idx_rooms_room_type_id (room_type_id),

    INDEX idx_rooms_status (room_status)
);
 INSERT INTO Rooms (
    room_type_id,
    room_number,
    floor_number,
    room_status
) VALUES
(1, '101', 1, 'Available'),

(1, '102', 1, 'Occupied'),

(2, '201', 2, 'Available'),

(3, '301', 3, 'Available'),

(4, '401', 4, 'Maintenance'),

(5, '501', 5, 'Available'),

(6, '601', 6, 'Occupied'),

(7, '701', 7, 'Available'),

(9, '901', 9, 'Available'),

(10, '1001', 10, 'Available');
----------------------------------------------------------------------------------------------------
CREATE TABLE Room_Images (
    image_id INT AUTO_INCREMENT PRIMARY KEY,

    room_id INT NOT NULL,

    image_url VARCHAR(500) NOT NULL,

    image_type VARCHAR(50),

    is_primary BOOLEAN DEFAULT FALSE,

    display_order INT DEFAULT 0,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_room_image_room
        FOREIGN KEY (room_id)
        REFERENCES Rooms(room_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE, 
        
	INDEX idx_room_images_room_id (room_id)
);

INSERT INTO Room_Images (
    room_id,
    image_url,
    image_type,
    is_primary,
    display_order
) VALUES
(1, 'https://example.com/rooms/101-1.jpg',
 'Bedroom', TRUE, 1),

(1, 'https://example.com/rooms/101-2.jpg',
 'Bathroom', FALSE, 2),

(2, 'https://example.com/rooms/102-1.jpg',
 'Bedroom', TRUE, 1),

(3, 'https://example.com/rooms/201-1.jpg',
 'Bedroom', TRUE, 1),

(4, 'https://example.com/rooms/301-1.jpg',
 'Bedroom', TRUE, 1),

(5, 'https://example.com/rooms/401-1.jpg',
 'Bedroom', TRUE, 1),

(6, 'https://example.com/rooms/501-1.jpg',
 'Bedroom', TRUE, 1),

(7, 'https://example.com/rooms/601-1.jpg',
 'Bedroom', TRUE, 1),

(9, 'https://example.com/rooms/901-1.jpg',
 'Tent', TRUE, 1),

(10, 'https://example.com/rooms/1001-1.jpg',
 'Villa', TRUE, 1);
-------------------------------------------------------------------------------------------- 
CREATE TABLE Wishlists (
    wishlist_id INT AUTO_INCREMENT PRIMARY KEY,

    user_id INT NOT NULL,

    resort_id INT NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_wishlist_user
        FOREIGN KEY (user_id)
        REFERENCES Users(user_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_wishlist_resort
        FOREIGN KEY (resort_id)
        REFERENCES Resorts(resort_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT uq_user_resort_wishlist 
     UNIQUE (user_id, resort_id),
     
	INDEX idx_wishlist_resort_id (resort_id)
 );
 INSERT INTO Wishlists (
    user_id,
    resort_id
) VALUES
(1, 1),
(2, 2),
(3, 3),
(4, 4),
(5, 5),
(6, 6),
(8, 7),
(9, 8),
(10, 9),
(1, 10);
-----------------------------------------------------------------------------
 CREATE TABLE room_amenities (
  amenity_id int NOT NULL AUTO_INCREMENT,
  amenity_name varchar(100) NOT NULL,
  description varchar(255) DEFAULT NULL,
  icon varchar(255) DEFAULT NULL,
  status enum('Active','Inactive') DEFAULT 'Active',
  created_at timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  
  PRIMARY KEY (amenity_id),
  UNIQUE KEY amenity_name (amenity_name)
);
INSERT INTO room_amenities (
    amenity_name,
    description,
    icon,
    status
) VALUES
('Air Conditioning',
 'Central air conditioning.',
 'ac-icon.png',
 'Active'),

('King Size Bed',
 'Comfortable king size bed.',
 'king-bed-icon.png',
 'Active'),

('TV',
 'Smart LED television.',
 'tv-icon.png',
 'Active'),

('Mini Bar',
 'Mini refrigerator and minibar.',
 'minibar-icon.png',
 'Active'),

('Bathtub',
 'Private bathtub in bathroom.',
 'bathtub-icon.png',
 'Active'),

('Balcony',
 'Private room balcony.',
 'balcony-icon.png',
 'Active'),

('Work Desk',
 'Dedicated workspace and desk.',
 'desk-icon.png',
 'Active'),

('Coffee Maker',
 'Coffee and tea making facilities.',
 'coffee-icon.png',
 'Active'),

('Hair Dryer',
 'Hair dryer available in bathroom.',
 'hairdryer-icon.png',
 'Active'),

('Safe Locker',
 'Electronic personal safe locker.',
 'safe-icon.png',
 'Active');
----------------------------------------------------------------------------------
 CREATE TABLE room_amenity_mapping (
  room_id int NOT NULL,
  amenity_id int NOT NULL,
  PRIMARY KEY (room_id, amenity_id),
  KEY fk_room_amenity_amenity (amenity_id),
  CONSTRAINT fk_room_amenity_amenity 
  FOREIGN KEY (amenity_id) REFERENCES room_amenities (amenity_id) 
  ON DELETE CASCADE 
  ON UPDATE CASCADE,
  CONSTRAINT fk_room_amenity_room
  FOREIGN KEY (room_id) REFERENCES rooms (room_id) 
  ON DELETE CASCADE 
  ON UPDATE CASCADE
) ;
 INSERT INTO room_amenity_mapping (
    room_id,
    amenity_id
) VALUES
(1, 1),
(1, 2),
(2, 3),
(3, 4),
(4, 5),
(5, 6),
(6, 7),
(7, 8),
(9, 9),
(10, 10);

INSERT INTO room_amenity_mapping (room_id, amenity_id) VALUES
(1, 3),
(1, 8),
(2, 1),
(2, 6),
(3, 1);
-------------------------------------------------------------------------------------------
SHOW TABLES;
DESCRIBE Resorts;
DESCRIBE Amenities;
DESCRIBE Resort_Amenities;
DESCRIBE Resort_Images;
DESCRIBE Resort_Documents;
DESCRIBE Resort_Offers;
DESCRIBE Room_Types;
DESCRIBE Rooms;
DESCRIBE Room_Images;
DESCRIBE Wishlists;
DESCRIBE Room_Amenities;
DESCRIBE Room_Amenity_Mapping;

