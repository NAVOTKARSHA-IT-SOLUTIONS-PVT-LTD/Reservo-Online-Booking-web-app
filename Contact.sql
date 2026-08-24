USE reservo;

CREATE TABLE Contact (
    contact_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(15),
    subject VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    status ENUM('Pending', 'In Progress', 'Resolved', 'Closed')
        DEFAULT 'Pending',
    admin_response TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_contact_user
        FOREIGN KEY (user_id)
        REFERENCES Users(user_id)
        ON DELETE SET NULL
        ON UPDATE CASCADE,

    INDEX idx_contact_user_id (user_id),
    INDEX idx_contact_status (status),
    INDEX idx_contact_created_at (created_at)
);

INSERT INTO Contact (
    user_id,
    name,
    email,
    phone,
    subject,
    message,
    status,
    admin_response
) VALUES

(1,
 'Vishal Jagtap',
 'vishal@example.com',
 '9876543210',
 'Booking Confirmation',
 'I have completed my booking but have not received the confirmation email.',
 'Resolved',
 'Your booking has been confirmed successfully. The confirmation email has been sent.'),

(2,
 'Rahul Patil',
 'rahul@example.com',
 '9876543211',
 'Payment Issue',
 'My payment was deducted but the booking is still showing as pending.',
 'In Progress',
 'We are checking the payment transaction and will update you shortly.'),

(3,
 'Sneha Kulkarni',
 'sneha@example.com',
 '9876543212',
 'Resort Information',
 'I would like to know whether the resort provides free Wi-Fi.',
 'Resolved',
 'Yes, free Wi-Fi is available throughout the resort.'),

(4,
 'Amit Sharma',
 'amit@example.com',
 '9876543213',
 'Cancellation Request',
 'I want to cancel my upcoming resort booking.',
 'Resolved',
 'Your cancellation request has been processed successfully.'),

(5,
 'Priya Deshmukh',
 'priya@example.com',
 '9876543214',
 'Refund Status',
 'I cancelled my booking and would like to know the refund status.',
 'In Progress',
 'Your refund has been initiated and will be processed according to the payment provider timeline.'),

(NULL,
 'Rohan Kumar',
 'rohan.kumar@gmail.com',
 '9876543220',
 'General Inquiry',
 'Can I book a resort without creating an account?',
 'Pending',
 NULL),

(7,
 'Neha Joshi',
 'neha@example.com',
 '9876543216',
 'Check-in Time',
 'What is the standard check-in and check-out time?',
 'Resolved',
 'Standard check-in is at 2:00 PM and check-out is at 11:00 AM.'),

(8,
 'Rohit Shinde',
 'rohit@example.com',
 '9876543217',
 'Special Request',
 'Can I request an early check-in for my booking?',
 'Pending',
 NULL),

(NULL,
 'Anjali Mehta',
 'anjali.mehta@gmail.com',
 '9876543221',
 'Resort Facilities',
 'Does the resort have a swimming pool and restaurant?',
 'Closed',
 'Yes, the resort provides both a swimming pool and an on-site restaurant.'),

(10,
 'Raj Mehta',
 'raj@example.com',
 '9876543219',
 'Account Problem',
 'I am unable to update my profile information.',
 'In Progress',
 'Our support team is checking the issue with your account.');