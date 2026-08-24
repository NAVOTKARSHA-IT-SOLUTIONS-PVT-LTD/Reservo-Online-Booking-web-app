USE reservo; 

CREATE TABLE AI_Chat_Sessions (
    session_id INT AUTO_INCREMENT PRIMARY KEY,

    user_id INT NOT NULL,

    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    ended_at TIMESTAMP NULL,

    status ENUM(
        'Active',
        'Completed',
        'Cancelled'
    ) DEFAULT 'Active',

    CONSTRAINT fk_ai_chat_session_user
        FOREIGN KEY (user_id)
        REFERENCES Users(user_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);
INSERT INTO AI_Chat_Sessions (
    user_id,
    started_at,
    ended_at,
    status
) VALUES
(1, '2026-08-10 10:00:00', '2026-08-10 10:15:00', 'Completed'),

(2, '2026-08-10 11:30:00', '2026-08-10 11:50:00', 'Completed'),

(3, '2026-08-10 14:00:00', NULL, 'Active'),

(4, '2026-08-11 09:15:00', '2026-08-11 09:40:00', 'Completed'),

(5, '2026-08-11 12:00:00', '2026-08-11 12:20:00', 'Completed'),

(6, '2026-08-11 15:30:00', NULL, 'Active'),

(7, '2026-08-12 10:45:00', '2026-08-12 11:05:00', 'Completed'),

(8, '2026-08-12 13:00:00', '2026-08-12 13:10:00', 'Cancelled'),

(9, '2026-08-12 16:00:00', '2026-08-12 16:30:00', 'Completed'),

(10, '2026-08-13 18:00:00', NULL, 'Active');
------------------------------------------------------------------------------
CREATE TABLE AI_Chat_Messages (
    message_id INT AUTO_INCREMENT PRIMARY KEY,

    session_id INT NOT NULL,

    sender_type ENUM(
        'User',
        'AI'
    ) NOT NULL,

    message TEXT NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_ai_chat_message_session
        FOREIGN KEY (session_id)
        REFERENCES AI_Chat_Sessions(session_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);
INSERT INTO AI_Chat_Messages (
    session_id,
    sender_type,
    message
) VALUES

(1, 'User', 'I want to book a resort in Goa.'),

(1, 'AI', 'Sure! I can help you find a suitable resort in Goa.'),

(2, 'User', 'Which resorts are good for a family vacation?'),

(2, 'AI', 'I recommend family-friendly resorts with pools, activities, and spacious rooms.'),

(3, 'User', 'Plan a 3 day trip to Manali.'),

(3, 'AI', 'Sure! I can create a 3-day Manali itinerary for you.'),

(4, 'User', 'What are the best resorts near Mumbai?'),

(4, 'AI', 'There are several excellent resorts near Mumbai, including options in Lonavala and Alibaug.'),

(5, 'User', 'I need a honeymoon resort in Kerala.'),

(5, 'AI', 'Kerala has many romantic resorts. I can suggest options based on your budget.'),

(6, 'User', 'What should I visit in Jaipur?'),

(6, 'AI', 'You can visit Amber Fort, City Palace, Hawa Mahal and Jantar Mantar.'),

(7, 'User', 'Find a budget resort in Pune.'),

(7, 'AI', 'I can help you find budget-friendly resorts around Pune.'),

(8, 'User', 'Cancel my previous trip plan.'),

(8, 'AI', 'Your itinerary request has been cancelled.'),

(9, 'User', 'Create a Goa itinerary for 5 days.'),

(9, 'AI', 'Absolutely! I will prepare a 5-day Goa travel itinerary.'),

(10, 'User', 'Suggest places to visit in Rajasthan.'),

(10, 'AI', 'Rajasthan offers Jaipur, Udaipur, Jodhpur, Jaisalmer and many other destinations.');

CREATE TABLE AI_Itineraries (
    itinerary_id INT AUTO_INCREMENT PRIMARY KEY,

    user_id INT NOT NULL,

    title VARCHAR(150) NOT NULL,

    destination VARCHAR(150) NOT NULL,

    start_date DATE,

    end_date DATE,

    itinerary_data JSON NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_ai_itinerary_user
        FOREIGN KEY (user_id)
        REFERENCES Users(user_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT chk_ai_itinerary_dates
        CHECK (
            end_date IS NULL
            OR start_date IS NULL
            OR end_date >= start_date
        )
);

INSERT INTO AI_Itineraries (
    user_id,
    title,
    destination,
    start_date,
    end_date,
    itinerary_data
) VALUES

(1,
 'Goa 3 Day Trip',
 'Goa',
 '2026-09-01',
 '2026-09-03',
 '{
   "days": [
     {"day": 1, "activities": ["Resort check-in", "Baga Beach", "Night market"]},
     {"day": 2, "activities": ["Calangute Beach", "Fort Aguada", "Dinner"]},
     {"day": 3, "activities": ["Old Goa", "Shopping", "Departure"]}
   ]
 }'),

(2,
 'Manali Family Trip',
 'Manali',
 '2026-09-05',
 '2026-09-08',
 '{
   "days": [
     {"day": 1, "activities": ["Check-in", "Mall Road"]},
     {"day": 2, "activities": ["Solang Valley", "Local sightseeing"]},
     {"day": 3, "activities": ["Hidimba Temple", "Old Manali"]},
     {"day": 4, "activities": ["Breakfast", "Departure"]}
   ]
 }'),

(3,
 'Kerala Honeymoon',
 'Kerala',
 '2026-10-01',
 '2026-10-05',
 '{
   "days": [
     {"day": 1, "activities": ["Kochi sightseeing", "Resort check-in"]},
     {"day": 2, "activities": ["Munnar sightseeing"]},
     {"day": 3, "activities": ["Tea garden", "Waterfalls"]},
     {"day": 4, "activities": ["Alleppey houseboat"]},
     {"day": 5, "activities": ["Departure"]}
   ]
 }'),

(4,
 'Jaipur Weekend',
 'Jaipur',
 '2026-09-12',
 '2026-09-14',
 '{
   "days": [
     {"day": 1, "activities": ["Amber Fort", "City Palace"]},
     {"day": 2, "activities": ["Hawa Mahal", "Jantar Mantar", "Local market"]},
     {"day": 3, "activities": ["Breakfast", "Departure"]}
   ]
 }'),

(5,
 'Mumbai Getaway',
 'Mumbai',
 '2026-09-20',
 '2026-09-22',
 '{
   "days": [
     {"day": 1, "activities": ["Gateway of India", "Marine Drive"]},
     {"day": 2, "activities": ["Elephanta Caves", "Colaba"]},
     {"day": 3, "activities": ["Shopping", "Departure"]}
   ]
 }'),

(6,
 'Rajasthan Adventure',
 'Rajasthan',
 '2026-10-10',
 '2026-10-15',
 '{
   "days": [
     {"day": 1, "activities": ["Jaipur arrival", "City Palace"]},
     {"day": 2, "activities": ["Amber Fort", "Hawa Mahal"]},
     {"day": 3, "activities": ["Jodhpur", "Mehrangarh Fort"]},
     {"day": 4, "activities": ["Jaisalmer", "Fort visit"]},
     {"day": 5, "activities": ["Desert safari", "Cultural show"]},
     {"day": 6, "activities": ["Departure"]}
   ]
 }'),

(7,
 'Pune Weekend Trip',
 'Pune',
 '2026-09-25',
 '2026-09-27',
 '{
   "days": [
     {"day": 1, "activities": ["Shaniwar Wada", "Local food"]},
     {"day": 2, "activities": ["Sinhagad Fort", "Shopping"]},
     {"day": 3, "activities": ["Breakfast", "Departure"]}
   ]
 }'),

(8,
 'Udaipur Romantic Trip',
 'Udaipur',
 '2026-11-01',
 '2026-11-04',
 '{
   "days": [
     {"day": 1, "activities": ["City Palace", "Lake Pichola"]},
     {"day": 2, "activities": ["Jag Mandir", "Boat ride"]},
     {"day": 3, "activities": ["Sajjangarh Palace", "Local market"]},
     {"day": 4, "activities": ["Breakfast", "Departure"]}
   ]
 }'),

(9,
 'Goa Beach Holiday',
 'Goa',
 '2026-12-10',
 '2026-12-14',
 '{
   "days": [
     {"day": 1, "activities": ["Check-in", "Baga Beach"]},
     {"day": 2, "activities": ["Water sports", "Calangute Beach"]},
     {"day": 3, "activities": ["Old Goa", "Churches"]},
     {"day": 4, "activities": ["Shopping", "Sunset cruise"]},
     {"day": 5, "activities": ["Breakfast", "Departure"]}
   ]
 }'),

(10,
 'Himachal Adventure',
 'Himachal Pradesh',
 '2026-12-20',
 '2026-12-25',
 '{
   "days": [
     {"day": 1, "activities": ["Arrival", "Resort check-in"]},
     {"day": 2, "activities": ["Mountain sightseeing"]},
     {"day": 3, "activities": ["Adventure activities"]},
     {"day": 4, "activities": ["Local village visit"]},
     {"day": 5, "activities": ["Shopping", "Local food"]},
     {"day": 6, "activities": ["Breakfast", "Departure"]}
   ]
 }'
 );
