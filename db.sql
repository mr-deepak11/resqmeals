-- ResQMeals Database Schema

CREATE DATABASE IF NOT EXISTS resqmeals;
USE resqmeals;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    role ENUM('donor', 'volunteer', 'ngo', 'admin') NOT NULL,
    loc VARCHAR(255),
    status VARCHAR(50) DEFAULT 'verified',
    color VARCHAR(20),
    pts INT DEFAULT 0,
    completions INT DEFAULT 0,
    avgRating DECIMAL(3,2) DEFAULT 0.0,
    online BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Donations Table
CREATE TABLE IF NOT EXISTS donations (
    id VARCHAR(50) PRIMARY KEY,
    donor_name VARCHAR(255),
    donor_type VARCHAR(50),
    food_name VARCHAR(255) NOT NULL,
    qty VARCHAR(100),
    loc VARCHAR(255),
    expiry_hours INT,
    expiry_min INT,
    status VARCHAR(50) DEFAULT 'pending',
    volunteer_id INT,
    vol_name VARCHAR(255),
    ngo_match VARCHAR(255),
    emoji VARCHAR(10),
    proof BOOLEAN DEFAULT FALSE,
    proof_ok BOOLEAN DEFAULT FALSE,
    step INT DEFAULT 0,
    rating INT DEFAULT 0,
    points INT DEFAULT 0,
    priority INT DEFAULT 3,
    risk_level VARCHAR(20) DEFAULT 'low',
    route_saved VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (volunteer_id) REFERENCES users(id)
);

-- NGO Needs Table
CREATE TABLE IF NOT EXISTS ngo_needs (
    id VARCHAR(50) PRIMARY KEY,
    ngo_id INT,
    food_name VARCHAR(255),
    qty VARCHAR(100),
    by_when VARCHAR(100),
    urgency VARCHAR(20),
    notes TEXT,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ngo_id) REFERENCES users(id)
);

-- Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    title VARCHAR(255),
    sub TEXT,
    type VARCHAR(50),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Blockchain Log (Audit Trail)
CREATE TABLE IF NOT EXISTS blockchain_log (
    id INT AUTO_INCREMENT PRIMARY KEY,
    hash VARCHAR(64),
    prev_hash VARCHAR(64),
    data TEXT,
    ref_id VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- SOS Alerts Table
CREATE TABLE IF NOT EXISTS alerts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(50),
    user_name VARCHAR(255),
    type VARCHAR(50), -- 'emergency', 'help', 'delay'
    msg TEXT,
    loc VARCHAR(255),
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed Initial Users (Matching Frontend IDs)
INSERT INTO users (id, name, role, loc, status, color, pts, completions, avgRating, online) VALUES
(1, 'Ravi Kumar', 'volunteer', 'Koramangala', 'verified', '#2d9e5a', 1240, 42, 4.9, TRUE),
(2, 'Priya Menon', 'volunteer', 'Jayanagar', 'verified', '#9333ea', 980, 38, 4.8, TRUE),
(3, 'Smile Foundation', 'ngo', 'Koramangala', 'verified', '#1a6b3a', 0, 0, 0.0, TRUE),
(4, 'Hope Shelter', 'ngo', 'Jayanagar', 'verified', '#dc3545', 0, 0, 0.0, TRUE)
ON DUPLICATE KEY UPDATE name=VALUES(name);

