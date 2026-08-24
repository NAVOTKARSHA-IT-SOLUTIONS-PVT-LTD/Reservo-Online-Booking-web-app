USE reservo; 

CREATE TABLE Admin_Audit_Logs (
    audit_id INT AUTO_INCREMENT PRIMARY KEY,

    admin_id INT NOT NULL,

    action VARCHAR(100) NOT NULL,

    entity_type VARCHAR(50),

    entity_id INT,

    old_value TEXT,

    new_value TEXT,

    ip_address VARCHAR(45),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_admin_audit_admin
        FOREIGN KEY (admin_id)
        REFERENCES Users(user_id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
);
INSERT INTO Admin_Audit_Logs (
    admin_id,
    action,
    entity_type,
    entity_id,
    old_value,
    new_value,
    ip_address
) VALUES
(7, 'Approve Resort', 'Resort', 1,
 NULL,
 'Status changed to Approved',
 '192.168.1.101'),

(7, 'Update User Status', 'User', 9,
 'Inactive',
 'Active',
 '192.168.1.101'),

(7, 'Block User', 'User', 10,
 'Active',
 'Blocked',
 '192.168.1.102'),

(7, 'Update Resort Status', 'Resort', 2,
 'Pending',
 'Approved',
 '192.168.1.103'),

(7, 'Reject Resort', 'Resort', 3,
 'Pending',
 'Rejected',
 '192.168.1.103'),

(7, 'Update Platform Setting', 'Platform_Settings', 1,
 '10',
 '15',
 '192.168.1.104'),

(7, 'Delete Review', 'Review', 5,
 'Pending',
 'Deleted',
 '192.168.1.104'),

(7, 'Approve Review', 'Review', 6,
 'Pending',
 'Approved',
 '192.168.1.105'),

(7, 'Suspend Resort', 'Resort', 4,
 'Approved',
 'Suspended',
 '192.168.1.106'),

(7, 'Update User Role', 'User', 5,
 'Customer',
 'Resort Owner',
 '192.168.1.107');
 ------------------------------------------------------------------------------------
CREATE TABLE Platform_Settings (
    setting_id INT AUTO_INCREMENT PRIMARY KEY,

    setting_key VARCHAR(100) NOT NULL UNIQUE,

    setting_value TEXT,

    description VARCHAR(255),

    updated_by INT,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_platform_setting_user
        FOREIGN KEY (updated_by)
        REFERENCES Users(user_id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
);
INSERT INTO Platform_Settings (
    setting_key,
    setting_value,
    description,
    updated_by
) VALUES
('site_name',
 'RESERVO',
 'Name of the resort booking platform',
 7),

('currency',
 'INR',
 'Default platform currency',
 7),

('tax_percentage',
 '18',
 'Default GST percentage applied to bookings',
 7),

('booking_cancellation_hours',
 '24',
 'Minimum hours before check-in for cancellation',
 7),

('max_booking_rooms',
 '10',
 'Maximum number of rooms allowed per booking',
 7),

('review_approval_required',
 'true',
 'Whether reviews require admin approval',
 7),

('maintenance_mode',
 'false',
 'Enable or disable platform maintenance mode',
 7),

('support_email',
 'support@reservo.com',
 'Platform customer support email',
 7),

('support_phone',
 '+91-9876543210',
 'Platform customer support phone number',
 7),
 
 ('contact_address',
 'Pune, Maharashtra, India',
 'Official platform address',
 7),

('max_children_per_booking',
 '5',
 'Maximum number of children allowed in one booking',
 NULL);