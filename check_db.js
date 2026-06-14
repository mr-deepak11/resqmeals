const mysql = require('mysql2/promise');

const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: 'Deepak@1',
    database: 'resqmeals'
};

async function check() {
    try {
        const connection = await mysql.createConnection(dbConfig);
        console.log('\n--- 📦 CURRENT DONATIONS IN DATABASE ---');
        
        const [rows] = await connection.query('SELECT id, donor_name, food_name, qty, loc, status, created_at FROM donations ORDER BY created_at DESC');
        
        if (rows.length === 0) {
            console.log('No donations found in the database.');
        } else {
            console.table(rows);
        }
        
        console.log('\n--- 🚨 RECENT SOS ALERTS ---');
        const [alerts] = await connection.query('SELECT id, user_name, type, msg, loc, created_at FROM alerts ORDER BY created_at DESC');
        if (alerts.length === 0) {
            console.log('No alerts found.');
        } else {
            console.table(alerts);
        }

        console.log('\n--- 🔗 RECENT BLOCKCHAIN LOGS ---');
        const [logs] = await connection.query('SELECT id, data, created_at FROM blockchain_log ORDER BY id DESC LIMIT 5');
        console.table(logs);

        await connection.end();
    } catch (err) {
        console.error('Error connecting to MySQL:', err.message);
        console.log('\nTip: Make sure your MySQL server is running and the "resqmeals" database exists.');
    }
}

check();
