USE reservo;

CREATE TABLE Reviews (
    review_id INT AUTO_INCREMENT PRIMARY KEY,

    booking_id INT NOT NULL,

    user_id INT NOT NULL,

    resort_id INT NOT NULL,

    rating DECIMAL(2,1) NOT NULL,

    review_title VARCHAR(150),

    review_text TEXT,

    review_status ENUM(
        'Pending',
        'Published',
        'Hidden',
        'Rejected'
    ) DEFAULT 'Pending',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_review_booking
        FOREIGN KEY (booking_id)
        REFERENCES Bookings(booking_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_review_user
        FOREIGN KEY (user_id)
        REFERENCES Users(user_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_review_resort
        FOREIGN KEY (resort_id)
        REFERENCES Resorts(resort_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT chk_review_rating
        CHECK (rating >= 1.0 AND rating <= 5.0),

    CONSTRAINT uq_booking_review
        UNIQUE (booking_id)
);
INSERT INTO Reviews (
    booking_id,
    user_id,
    resort_id,
    rating,
    review_title,
    review_text,
    review_status
) VALUES

(1, 1, 1, 4.5,
 'Excellent Stay',
 'The resort was beautiful and the staff were very friendly. The room was clean and comfortable.',
 'Published'),

(2, 2, 2, 4.0,
 'Beautiful Location',
 'Amazing mountain views and peaceful surroundings. Overall it was a very good experience.',
 'Published'),

(3, 3, 3, 5.0,
 'Wonderful Resort',
 'Everything was perfect from check-in to check-out. The lake view was amazing.',
 'Published'),

(4, 4, 4, 4.0,
 'Good Family Stay',
 'Nice resort for families. The rooms were spacious and the staff was helpful.',
 'Published'),

(5, 5, 5, 4.5,
 'Amazing Beach Experience',
 'Great location near the beach. The food and service were excellent.',
 'Published'),

(6, 6, 6, 3.5,
 'Good But Can Improve',
 'The room was comfortable but the check-in process took longer than expected.',
 'Published'),

(7, 8, 7, 4.0,
 'Peaceful Place',
 'A nice place to relax with beautiful surroundings and good service.',
 'Pending'),

(8, 9, 8, 5.0,
 'Fantastic Experience',
 'The resort was excellent. The staff, food and rooms were all wonderful.',
 'Published'),

(9, 10, 9, 4.5,
 'Beautiful Backwaters',
 'Amazing location and very relaxing atmosphere. Highly recommended.',
 'Published'),

(10, 1, 10, 3.5,
 'Nice Resort',
 'The location was good and the rooms were clean. Some facilities could be improved.',
 'Pending');
 
 ----------------------------------------------------------------------------------------------------------------
CREATE TABLE Review_Images (
    image_id INT AUTO_INCREMENT PRIMARY KEY,

    review_id INT NOT NULL,

    image_url VARCHAR(500) NOT NULL,

    display_order INT DEFAULT 0,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_review_image_review
        FOREIGN KEY (review_id)
        REFERENCES Reviews(review_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);
INSERT INTO Review_Images (
    review_id,
    image_url,
    display_order
) VALUES

(1, 'https://example.com/reviews/review1-room.jpg', 1),

(1, 'https://example.com/reviews/review1-pool.jpg', 2),

(2, 'https://example.com/reviews/review2-view.jpg', 1),

(3, 'https://example.com/reviews/review3-lake.jpg', 1),

(4, 'https://example.com/reviews/review4-room.jpg', 1),

(5, 'https://example.com/reviews/review5-beach.jpg', 1),

(6, 'https://example.com/reviews/review6-room.jpg', 1),

(8, 'https://example.com/reviews/review8-resort.jpg', 1),

(9, 'https://example.com/reviews/review9-backwater.jpg', 1),

(10, 'https://example.com/reviews/review10-room.jpg', 1);
 ------------------------------------------------------------------------------------------------------------------------
CREATE TABLE Review_Replies (
    reply_id INT AUTO_INCREMENT PRIMARY KEY,

    review_id INT NOT NULL,

    replied_by INT NOT NULL,

    reply_text TEXT NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_review_reply_review
        FOREIGN KEY (review_id)
        REFERENCES Reviews(review_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_review_reply_user
        FOREIGN KEY (replied_by)
        REFERENCES Users(user_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

INSERT INTO Review_Replies (
    review_id,
    replied_by,
    reply_text
) VALUES

(1, 4,
 'Thank you for your wonderful review. We are happy that you enjoyed your stay.'),

(2, 5,
 'Thank you for visiting us. We are glad you enjoyed the mountain views.'),

(3, 6,
 'Thank you for your excellent feedback. We look forward to welcoming you again.'),

(4, 4,
 'Thank you for choosing our resort for your family trip.'),

(5, 5,
 'We are delighted that you enjoyed the beach and our hospitality.'),

(6, 6,
 'Thank you for your feedback. We will work on improving our check-in process.'),

(7, 7,
 'Thank you for sharing your experience. We hope to welcome you again.'),

(8, 5,
 'Thank you for the fantastic review. We are glad you had a wonderful experience.'),

(9, 6,
 'Thank you for your kind words. We are happy that you enjoyed the backwaters.'),

(10, 4,
 'Thank you for your feedback. We will continue improving our facilities.');