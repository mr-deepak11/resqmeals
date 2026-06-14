# 🍽️ ResQMeals – Food Donation & Distribution Platform
A full-stack web application built with HTML, CSS, JavaScript, Node.js, Express.js, and MySQL.
---

## 📁 Project Structure

```text
ResQMeals/
├── public/
│   ├── index.html
│   ├── css/
│   ├── js/
│   └── assets/
├── server.js
├── check_db.js
├── db.sql
├── package.json
├── package-lock.json
├── node_modules/
├── .env
└── README.md
```

---

## ⚙️ Prerequisites

| Tool    | Version |
| ------- | ------- |
| Node.js | v18+    |
| npm     | v9+     |
| MySQL   | v8.0+   |

---

## 🚀 Installation & Setup

### Step 1 — Download Project

Extract the ResQMeals project folder.

### Step 2 — Install Dependencies

```bash
npm install
```

### Step 3 — Configure MySQL

Create database and import schema:

```sql
CREATE DATABASE resqmeals;
USE resqmeals;
SOURCE db.sql;
```

### Step 4 — Configure Database Connection

Edit server.js:

```javascript
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: 'YOUR_PASSWORD',
    database: 'resqmeals'
};
```

### Step 5 — Start Server

```bash
node server.js
```

### Step 6 — Open Browser

```text
http://localhost:5001
```

---

## 🗄️ Database Tables

| Table          | Purpose                           |
| -------------- | --------------------------------- |
| users          | Volunteer, NGO and donor details  |
| donations      | Food donation records             |
| ngo_needs      | NGO food requirements             |
| notifications  | System notifications              |
| alerts         | Emergency SOS alerts              |
| blockchain_log | Audit trail and verification logs |

---

## 🔌 API Endpoints

### State

| Method | Endpoint   | Description                      |
| ------ | ---------- | -------------------------------- |
| GET    | /api/state | Fetch complete application state |

### Donations

| Method | Endpoint                  | Description     |
| ------ | ------------------------- | --------------- |
| POST   | /api/donations            | Create donation |
| PATCH  | /api/donations/:id/status | Update donation |
| DELETE | /api/donations/:id        | Delete donation |

### NGO Needs

| Method | Endpoint       | Description        |
| ------ | -------------- | ------------------ |
| POST   | /api/needs     | Create NGO request |
| PATCH  | /api/needs/:id | Update NGO request |
| DELETE | /api/needs/:id | Delete NGO request |

### Alerts

| Method | Endpoint    | Description      |
| ------ | ----------- | ---------------- |
| POST   | /api/alerts | Create SOS alert |

### Users

| Method | Endpoint              | Description        |
| ------ | --------------------- | ------------------ |
| PATCH  | /api/users/:id/status | Update user status |

---

## ✨ Key Features

### Donor Dashboard

* Create food donation requests
* Track donation status
* Monitor food pickup progress
* View donation history

### Volunteer Dashboard

* Accept food pickups
* Update delivery progress
* Track assigned donations
* Route optimization support

### NGO Dashboard

* Create food requirements
* Match with available donations
* Track incoming food supplies
* Manage requests

### Admin Dashboard

* Monitor all donations
* Manage volunteers
* Verify transactions
* View blockchain logs
* System-wide analytics

---

## 🔒 Blockchain Verification

Every donation transaction is recorded in:

```text
blockchain_log
```

to maintain transparency and accountability.

---

## 📊 System Workflow

```text
Donor
   ↓
Create Donation
   ↓
Volunteer Assignment
   ↓
Food Pickup
   ↓
NGO Delivery
   ↓
Verification & Logging
```

---

## 🛠️ Tech Stack

| Layer    | Technology              |
| -------- | ----------------------- |
| Frontend | HTML5, CSS3, JavaScript |
| Backend  | Node.js, Express.js     |
| Database | MySQL                   |
| Security | Blockchain Logging      |
| API      | REST API                |

---

## 🐛 Troubleshooting

### Database Connection Error

Check:

```text
MySQL service is running
Password is correct
Database resqmeals exists
```

### Port Already In Use

Change:

```javascript
PORT = 5001
```

to another available port.

### API Returning 500

Verify:

```sql
SHOW TABLES;
```

Required tables:

```text
users
donations
ngo_needs
notifications
alerts
blockchain_log
```

---

