USE reservo;
CREATE TABLE User_Activity (
    activity_id INT AUTO_INCREMENT PRIMARY KEY,

    user_id INT NOT NULL,

    activity_type VARCHAR(50) NOT NULL,

    activity_description VARCHAR(255),

    ip_address VARCHAR(45),

    device_info VARCHAR(255),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_user_activity_user
        FOREIGN KEY (user_id)
        REFERENCES Users(user_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE 
);
INSERT INTO User_Activity (
    user_id,
    activity_type,
    activity_description,
    ip_address,
    device_info
) VALUES

(1,
 'Login',
 'User logged into the application',
 '192.168.1.101',
 'Chrome on Windows'),

(2,
 'Search',
 'User searched for resorts in Goa',
 '192.168.1.102',
 'Chrome on Windows'),

(3,
 'Booking',
 'User created a new resort booking',
 '192.168.1.103',
 'Android Mobile'),

(4,
 'Profile Update',
 'User updated profile information',
 '192.168.1.104',
 'Chrome on Windows'),

(5,
 'Wishlist',
 'User added a resort to wishlist',
 '192.168.1.105',
 'iPhone Safari'),

(6,
 'Review',
 'User submitted a resort review',
 '192.168.1.106',
 'Chrome on Windows'),

(7,
 'Logout',
 'User logged out from the application',
 '192.168.1.107',
 'Firefox on Windows'),

(8,
 'Search',
 'User searched for resorts in Manali',
 '192.168.1.108',
 'Android Mobile'),

(9,
 'Payment',
 'User completed a booking payment',
 '192.168.1.109',
 'Chrome on Windows'),

(10,
 'Login',
 'User logged into the application',
 '192.168.1.110',
 'Safari on macOS');
 
CREATE TABLE Notifications (
    notification_id INT AUTO_INCREMENT PRIMARY KEY,

    user_id INT NOT NULL,

    notification_type VARCHAR(50) NOT NULL,

    title VARCHAR(150) NOT NULL,

    message TEXT NOT NULL,

    is_read BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    read_at TIMESTAMP NULL,

    CONSTRAINT fk_notification_user
        FOREIGN KEY (user_id)
        REFERENCES Users(user_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

INSERT INTO Notifications (
    user_id,
    notification_type,
    title,
    message,
    is_read,
    read_at
) VALUES

(1,
 'Booking',
 'Booking Confirmed',
 'Your booking RES20260001 has been confirmed successfully.',
 TRUE,
 '2026-08-10 10:30:00'),

(2,
 'Booking',
 'Booking Confirmed',
 'Your booking RES20260002 has been confirmed.',
 TRUE,
 '2026-08-10 11:00:00'),

(3,
 'Payment',
 'Payment Successful',
 'Your payment for booking RES20260003 was received successfully.',
 TRUE,
 '2026-08-11 09:15:00'),

(4,
 'Booking',
 'Check-in Reminder',
 'Your resort check-in date is approaching.',
 FALSE,
 NULL),

(5,
 'Offer',
 'New Resort Offer',
 'A new special offer is available at Ocean Breeze Resort.',
 FALSE,
 NULL),

(6,
 'Review',
 'Review Published',
 'Your resort review has been published successfully.',
 TRUE,
 '2026-08-12 14:20:00'),

(7,
 'Booking',
 'Booking Cancelled',
 'Your booking has been cancelled successfully.',
 TRUE,
 '2026-08-12 16:00:00'),

(8,
 'Offer',
 'Weekend Discount',
 'Get 15% off on selected weekend resort bookings.',
 FALSE,
 NULL),

(9,
 'Payment',
 'Payment Successful',
 'Your booking payment has been completed successfully.',
 TRUE,
 '2026-08-13 12:45:00'),

(10,
 'System',
 'Welcome',
 'Welcome to our Resort Booking platform.',
 FALSE,
 NULL);
 