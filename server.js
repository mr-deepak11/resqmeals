const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Database connection
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: 'Deepak@1',
    database: 'resqmeals'
};

let pool;

async function initDB() {
    try {
        pool = await mysql.createPool(dbConfig);
        console.log('Connected to MySQL');
    } catch (err) {
        console.error('MySQL connection error:', err);
    }
}

// --- Helper for Blockchain ---
async function addToBlockchain(data, refId) {
    try {
        const [last] = await pool.query('SELECT hash FROM blockchain_log ORDER BY id DESC LIMIT 1');
        const prevHash = last.length > 0 ? last[0].hash : '0'.repeat(64);
        
        const newHash = crypto.createHash('sha256')
            .update(prevHash + data + new Date().toISOString())
            .digest('hex');
            
        await pool.query(
            'INSERT INTO blockchain_log (hash, prev_hash, data, ref_id) VALUES (?, ?, ?, ?)',
            [newHash, prevHash, data, refId]
        );
    } catch (err) {
        console.error('Blockchain error:', err);
    }
}

// --- API ROUTES ---

app.get('/api/state', async (req, res) => {
    try {
        const [donations] = await pool.query('SELECT * FROM donations ORDER BY created_at DESC');
        const [users] = await pool.query('SELECT * FROM users');
        const [needs] = await pool.query('SELECT * FROM ngo_needs ORDER BY created_at DESC');
        const [blockchain] = await pool.query('SELECT * FROM blockchain_log ORDER BY id DESC LIMIT 50');
        
        res.json({ donations, users, ngoNeeds: needs, blockchain });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/donations', async (req, res) => {
    try {
        const d = req.body;
        const query = `
            INSERT INTO donations 
            (id, donor_name, donor_type, food_name, qty, loc, expiry_hours, expiry_min, emoji, ngo_match, priority, risk_level, points, step) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        await pool.query(query, [
            d.id, d.donor, d.type, d.food, d.qty, d.loc, d.expiry, d.expiryMin, d.emoji, 
            d.ngoMatch, d.priority, d.riskLevel, d.points || 40, d.step || 0
        ]);
        
        await addToBlockchain(`Donation posted: ${d.food} by ${d.donor}`, d.id);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.patch('/api/donations/:id/status', async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;
        
        const updateFields = [];
        const values = [];
        const fieldMap = {
            vol: 'vol_name',
            food: 'food_name',
            donor: 'donor_name',
            qty: 'qty',
            status: 'status',
            step: 'step'
        };

        for (const [key, value] of Object.entries(data)) {
            const dbKey = fieldMap[key] || key;
            updateFields.push(`${dbKey} = ?`);
            values.push(value);
        }

        if (updateFields.length === 0) return res.json({ success: true });
        
        values.push(id);
        const query = `UPDATE donations SET ${updateFields.join(', ')} WHERE id = ?`;
        await pool.query(query, values);
        
        await addToBlockchain(`Donation ${id} updated: ${JSON.stringify(data)}`, id);
        res.json({ success: true });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            error: err.message,
            code: err.code,
            sqlMessage: err.sqlMessage
        });
    }
});

app.post('/api/alerts', async (req, res) => {
    try {
        const { userId, userName, type, msg, loc } = req.body;
        await pool.query(
            'INSERT INTO alerts (user_id, user_name, type, msg, loc) VALUES (?, ?, ?, ?, ?)',
            [userId, userName || 'Anonymous', type || 'emergency', msg, loc]
        );
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.patch('/api/users/:id/status', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        await pool.query('UPDATE users SET status = ? WHERE id = ?', [status, id]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/needs', async (req, res) => {
    try {
        const n = req.body;
        const query = `
            INSERT INTO ngo_needs (id, ngo_id, food_name, qty, by_when, urgency, notes) 
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        await pool.query(query, [
            n.id, n.ngo_id || 3, n.food, n.qty, n.by, n.urgency, n.notes
        ]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.patch('/api/needs/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        await pool.query('UPDATE ngo_needs SET status = ? WHERE id = ?', [status, id]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/donations/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM donations WHERE id = ?', [id]);
        await addToBlockchain(`Donation deleted: ${id}`, id);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/needs/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM ngo_needs WHERE id = ?', [id]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Start server
initDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Node.js server running on port ${PORT}`);
    });
});
