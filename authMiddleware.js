/**
 * AAWeb.tech
 * https://aaweb.tech
 */

const db = require('./db');

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized: Bearer token is missing.' });
    }

    // Check if the token exists in the 'tokens' table
    const query = 'SELECT * FROM tokens WHERE token = ? AND deleted_at IS NULL';
    db.get(query, [token], (err, row) => {
        if (err) {
            console.error('Error checking token existence:', err);
            return res.status(500).json({ error: 'Failed to check token existence.' });
        }

        if (!row) {
            return res.status(404).json({ error: 'Token does not exist. You can generate one at /api/tokens via GET request.' });
        }

        // Proceed
        next();
    });
}

module.exports = authenticateToken;


