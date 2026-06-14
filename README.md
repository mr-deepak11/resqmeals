# ResQMeals Backend (Node.js)

This is the backend for the ResQMeals platform, built with Node.js, Express, and MySQL.

## Prerequisites
- Node.js (v14+)
- MySQL Server

## Setup
1. Create the database and tables using the provided SQL script:
   ```bash
   mysql -u root -p < db.sql
   ```
2. Install Node.js dependencies:
   ```bash
   npm install
   ```
3. Update database credentials in `server.js` if necessary:
   ```javascript
   const dbConfig = {
       host: 'localhost',
       user: 'root',
       password: 'your_password',
       database: 'resqmeals'
   };
   ```

## Running the Server
```bash
npm start
```
The server will run at `http://localhost:5001`.
Open `public/index.html` in your browser to access the platform.

## API Endpoints
- `GET /api/state`: Get current platform state (donations, users, needs, blockchain).
- `POST /api/donations`: Create a new food donation.
- `PATCH /api/donations/:id/status`: Update donation status or volunteer assignment.
- `POST /api/needs`: Create an NGO food need.
