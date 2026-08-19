-- ============================================================
-- BUS BOOKING SYSTEM - COMPLETE DATABASE SCHEMA
-- MySQL 8.0+
-- ============================================================

CREATE DATABASE IF NOT EXISTS bus_booking;

USE bus_booking;

SET FOREIGN_KEY_CHECKS = 0;


-- ============================================================
-- DROP TABLES
-- ============================================================

DROP TABLE IF EXISTS booking_seats;
DROP TABLE IF EXISTS bookings;
DROP TABLE IF EXISTS schedule_seats;
DROP TABLE IF EXISTS schedules;
DROP TABLE IF EXISTS seats;
DROP TABLE IF EXISTS buses;
DROP TABLE IF EXISTS routes;
DROP TABLE IF EXISTS users;


-- ============================================================
-- USERS
-- ============================================================

CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    name VARCHAR(100) NOT NULL,

    email VARCHAR(150) NOT NULL UNIQUE,

    password VARCHAR(255) NOT NULL,

    phone VARCHAR(20),

    role ENUM('CUSTOMER', 'ADMIN')
        NOT NULL DEFAULT 'CUSTOMER',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- ============================================================
-- ROUTES
-- ============================================================

CREATE TABLE routes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    source VARCHAR(100) NOT NULL,

    destination VARCHAR(100) NOT NULL,

    distance_km DECIMAL(10,2),

    duration_minutes INT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_route_source (source),

    INDEX idx_route_destination (destination)
);


-- ============================================================
-- BUSES
-- ============================================================

CREATE TABLE buses (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    bus_number VARCHAR(50) NOT NULL UNIQUE,

    bus_name VARCHAR(100) NOT NULL,

    bus_type ENUM(
        'AC_SEATER',
        'NON_AC_SEATER',
        'AC_SLEEPER',
        'NON_AC_SLEEPER'
    ) NOT NULL,

    total_seats INT NOT NULL,

    route_id BIGINT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_bus_route (route_id),

    CONSTRAINT fk_bus_route
        FOREIGN KEY (route_id)
        REFERENCES routes(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
);


-- ============================================================
-- SEATS
-- ============================================================

CREATE TABLE seats (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    bus_id BIGINT NOT NULL,

    seat_number VARCHAR(10) NOT NULL,

    seat_type ENUM(
        'WINDOW',
        'AISLE',
        'MIDDLE'
    ) DEFAULT 'WINDOW',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_seat_bus (bus_id),

    UNIQUE KEY unique_bus_seat (
        bus_id,
        seat_number
    ),

    CONSTRAINT fk_seat_bus
        FOREIGN KEY (bus_id)
        REFERENCES buses(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);


-- ============================================================
-- SCHEDULES
-- ============================================================

CREATE TABLE schedules (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    bus_id BIGINT NOT NULL,

    route_id BIGINT NOT NULL,

    travel_date DATE NOT NULL,

    departure_time TIME NOT NULL,

    arrival_time TIME NOT NULL,

    fare DECIMAL(10,2) NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_schedule_bus (bus_id),

    INDEX idx_schedule_route (route_id),

    INDEX idx_schedule_date (travel_date),

    INDEX idx_schedule_search (
        route_id,
        travel_date
    ),

    CONSTRAINT fk_schedule_bus
        FOREIGN KEY (bus_id)
        REFERENCES buses(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_schedule_route
        FOREIGN KEY (route_id)
        REFERENCES routes(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);


-- ============================================================
-- SCHEDULE SEATS
--
-- This table connects every seat with every schedule.
--
-- Example:
--
-- Schedule 1 + Seat 1
-- Schedule 1 + Seat 2
-- ...
-- Schedule 1 + Seat 40
--
-- Schedule 2 + Seat 1
-- Schedule 2 + Seat 2
-- ...
--
-- This fixes:
-- "One or more seats are invalid"
-- ============================================================

CREATE TABLE schedule_seats (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    schedule_id BIGINT NOT NULL,

    seat_id BIGINT NOT NULL,

    status ENUM(
        'AVAILABLE',
        'BOOKED'
    ) DEFAULT 'AVAILABLE',

    booking_id BIGINT NULL,

    INDEX idx_schedule_seats_schedule (
        schedule_id
    ),

    INDEX idx_schedule_seats_seat (
        seat_id
    ),

    INDEX idx_schedule_seats_booking (
        booking_id
    ),

    UNIQUE KEY unique_schedule_seat (
        schedule_id,
        seat_id
    ),

    CONSTRAINT fk_schedule_seat_schedule
        FOREIGN KEY (schedule_id)
        REFERENCES schedules(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_schedule_seat_seat
        FOREIGN KEY (seat_id)
        REFERENCES seats(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);


-- ============================================================
-- BOOKINGS
-- ============================================================

CREATE TABLE bookings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    user_id BIGINT NOT NULL,

    schedule_id BIGINT NOT NULL,

    booking_reference VARCHAR(50) NOT NULL UNIQUE,

    total_amount DECIMAL(10,2) NOT NULL,

    status ENUM(
        'PENDING',
        'CONFIRMED',
        'CANCELLED'
    ) DEFAULT 'PENDING',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_booking_user (
        user_id
    ),

    INDEX idx_booking_schedule (
        schedule_id
    ),

    INDEX idx_booking_status (
        status
    ),

    CONSTRAINT fk_booking_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_booking_schedule
        FOREIGN KEY (schedule_id)
        REFERENCES schedules(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);


-- ============================================================
-- BOOKING SEATS
-- ============================================================

CREATE TABLE booking_seats (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    booking_id BIGINT NOT NULL,

    seat_id BIGINT NOT NULL,

    price DECIMAL(10,2) NOT NULL,

    INDEX idx_booking_seat_booking (
        booking_id
    ),

    INDEX idx_booking_seat_seat (
        seat_id
    ),

    CONSTRAINT fk_booking_seat_booking
        FOREIGN KEY (booking_id)
        REFERENCES bookings(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_booking_seat_seat
        FOREIGN KEY (seat_id)
        REFERENCES seats(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);


-- ============================================================
-- ROUTE DATA
-- ============================================================

INSERT INTO routes
(
    source,
    destination,
    distance_km,
    duration_minutes
)
VALUES
('Bangalore', 'Shimoga', 270.00, 360),
('Bangalore', 'Shimoga', 300.00, 360),
('Bangalore', 'Mysore', 145.00, 210),
('Bangalore', 'Mangalore', 350.00, 420),
('Bangalore', 'Hubli', 410.00, 450),
('Bangalore', 'Chennai', 350.00, 390),
('Bangalore', 'Hyderabad', 570.00, 600),
('Mysore', 'Bangalore', 145.00, 210),
('Mysore', 'Mangalore', 255.00, 330),
('Chennai', 'Bangalore', 350.00, 390),
('Chennai', 'Coimbatore', 500.00, 510),
('Hyderabad', 'Bangalore', 570.00, 600),
('Hyderabad', 'Chennai', 630.00, 690),
('Mangalore', 'Bangalore', 350.00, 420),
('Hubli', 'Bangalore', 410.00, 450),
('Pune', 'Bangalore', 840.00, 900);


-- ============================================================
-- BUS DATA
-- ============================================================

INSERT INTO buses
(
    bus_number,
    bus_name,
    bus_type,
    total_seats,
    route_id
)
VALUES
(
    'KA01AB1234',
    'Express One',
    'AC_SEATER',
    40,
    1
),
(
    'KA01AB1001',
    'VRL Express',
    'AC_SEATER',
    40,
    1
),
(
    'KA01AB1002',
    'KSRTC Airavat',
    'AC_SEATER',
    40,
    2
),
(
    'KA01AB1003',
    'Coastal Rider',
    'AC_SLEEPER',
    30,
    3
),
(
    'KA01AB1004',
    'North Karnataka Express',
    'NON_AC_SEATER',
    40,
    4
),
(
    'KA01AB1005',
    'Chennai Express',
    'AC_SLEEPER',
    30,
    5
),
(
    'KA01AB1006',
    'Deccan Express',
    'AC_SEATER',
    40,
    6
),
(
    'KA09AB1007',
    'Mysore Express',
    'NON_AC_SEATER',
    40,
    7
),
(
    'KA09AB1008',
    'Coorg Travels',
    'AC_SEATER',
    40,
    8
),
(
    'TN01AB1009',
    'Chennai Bangalore Express',
    'AC_SLEEPER',
    30,
    9
),
(
    'TN01AB1010',
    'Tamil Nadu Express',
    'AC_SEATER',
    40,
    10
),
(
    'TS01AB1011',
    'Hyderabad Bangalore Express',
    'AC_SLEEPER',
    30,
    11
),
(
    'TS01AB1012',
    'Telangana Express',
    'AC_SEATER',
    40,
    12
),
(
    'KA19AB1013',
    'Mangalore Express',
    'AC_SLEEPER',
    30,
    13
),
(
    'KA25AB1014',
    'Hubli Bangalore Express',
    'NON_AC_SEATER',
    40,
    14
),
(
    'MH12AB1015',
    'Pune Bangalore Express',
    'AC_SLEEPER',
    30,
    15
);


-- ============================================================
-- CREATE SEATS FOR EVERY BUS
--
-- 40 seats for 40-seat buses
-- 30 seats for 30-seat buses
--
-- Seat type:
-- 1 = WINDOW
-- 2 = AISLE
-- 3 = MIDDLE
-- ============================================================

INSERT INTO seats
(
    bus_id,
    seat_number,
    seat_type
)
WITH RECURSIVE seat_numbers AS
(
    SELECT 1 AS n

    UNION ALL

    SELECT n + 1
    FROM seat_numbers
    WHERE n < 40
)
SELECT
    b.id,
    CAST(sn.n AS CHAR),

    CASE
        WHEN MOD(sn.n, 4) IN (1, 0)
            THEN 'WINDOW'

        WHEN MOD(sn.n, 4) = 2
            THEN 'AISLE'

        ELSE
            'MIDDLE'
    END

FROM buses b

JOIN seat_numbers sn
    ON sn.n <= b.total_seats;


-- ============================================================
-- CREATE SCHEDULES
--
-- Every bus gets schedules for multiple dates.
--
-- This means searching:
--
-- Bangalore -> Shimoga
-- 2026-08-25
--
-- will return buses.
-- ============================================================

INSERT INTO schedules
(
    bus_id,
    route_id,
    travel_date,
    departure_time,
    arrival_time,
    fare
)
WITH RECURSIVE dates AS
(
    SELECT DATE('2026-08-25') AS travel_date

    UNION ALL

    SELECT DATE_ADD(
        travel_date,
        INTERVAL 1 DAY
    )

    FROM dates

    WHERE travel_date < DATE('2026-09-30')
)

SELECT
    b.id,
    b.route_id,
    d.travel_date,

    CASE
        WHEN MOD(b.id, 6) = 1
            THEN '06:00:00'

        WHEN MOD(b.id, 6) = 2
            THEN '07:30:00'

        WHEN MOD(b.id, 6) = 3
            THEN '09:00:00'

        WHEN MOD(b.id, 6) = 4
            THEN '18:00:00'

        WHEN MOD(b.id, 6) = 5
            THEN '20:00:00'

        ELSE
            '22:00:00'
    END,

    CASE
        WHEN MOD(b.id, 6) = 1
            THEN ADDTIME(
                '06:00:00',
                SEC_TO_TIME(
                    r.duration_minutes * 60
                )
            )

        WHEN MOD(b.id, 6) = 2
            THEN ADDTIME(
                '07:30:00',
                SEC_TO_TIME(
                    r.duration_minutes * 60
                )
            )

        WHEN MOD(b.id, 6) = 3
            THEN ADDTIME(
                '09:00:00',
                SEC_TO_TIME(
                    r.duration_minutes * 60
                )
            )

        WHEN MOD(b.id, 6) = 4
            THEN ADDTIME(
                '18:00:00',
                SEC_TO_TIME(
                    r.duration_minutes * 60
                )
            )

        WHEN MOD(b.id, 6) = 5
            THEN ADDTIME(
                '20:00:00',
                SEC_TO_TIME(
                    r.duration_minutes * 60
                )
            )

        ELSE
            ADDTIME(
                '22:00:00',
                SEC_TO_TIME(
                    r.duration_minutes * 60
                )
            )
    END,

    CASE
        WHEN b.bus_type = 'AC_SLEEPER'
            THEN 1200.00

        WHEN b.bus_type = 'NON_AC_SLEEPER'
            THEN 900.00

        WHEN b.bus_type = 'AC_SEATER'
            THEN 800.00

        ELSE
            600.00
    END

FROM buses b

JOIN routes r
    ON r.id = b.route_id

CROSS JOIN dates d;


-- ============================================================
-- CREATE SCHEDULE SEATS
--
-- THIS IS THE IMPORTANT PART
--
-- Every schedule receives all seats belonging to its bus.
--
-- Example:
--
-- Schedule 1 -> Bus 1 -> Seats 1-40
-- Schedule 2 -> Bus 1 -> Seats 1-40
-- Schedule 3 -> Bus 2 -> Seats 41-80
--
-- Therefore every valid seat displayed in frontend
-- exists in schedule_seats.
-- ============================================================

INSERT INTO schedule_seats
(
    schedule_id,
    seat_id,
    status,
    booking_id
)
SELECT
    sc.id,
    s.id,
    'AVAILABLE',
    NULL

FROM schedules sc

JOIN seats s
    ON s.bus_id = sc.bus_id;


-- ============================================================
-- OPTIONAL ADMIN USER
--
-- Password below is:
--
-- password
--
-- IMPORTANT:
-- If your backend uses bcrypt, this is a bcrypt hash.
-- ============================================================

INSERT INTO users
(
    name,
    email,
    password,
    phone,
    role
)
VALUES
(
    'System Admin',
    'admin@busbooking.com',
    '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    '9999999999',
    'ADMIN'
);


-- ============================================================
-- FOREIGN KEY CHECKS ON
-- ============================================================

SET FOREIGN_KEY_CHECKS = 1;


-- ============================================================
-- VERIFICATION
-- ============================================================

SELECT
    'DATABASE INITIALIZATION COMPLETED' AS message;

SELECT
    COUNT(*) AS total_users
FROM users;

SELECT
    COUNT(*) AS total_routes
FROM routes;

SELECT
    COUNT(*) AS total_buses
FROM buses;

SELECT
    COUNT(*) AS total_seats
FROM seats;

SELECT
    COUNT(*) AS total_schedules
FROM schedules;

SELECT
    COUNT(*) AS total_schedule_seats
FROM schedule_seats;

SELECT
    COUNT(*) AS total_bookings
FROM bookings;