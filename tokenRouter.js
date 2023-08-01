/**
 * AAWeb.tech
 * https://aaweb.tech
 */

const express = require('express');
const tokenRouter = express.Router();
const db = require('./db');
const crypto = require('crypto');

tokenRouter.get('/', (req, res) => {
    // Generate a random 64-character hexadecimal string for the token
    const token = crypto.randomBytes(32).toString('hex');

    // Get the current date and time
    const now = new Date().toISOString();

    // Insert the token into the 'tokens' table in the database
    const query = 'INSERT INTO tokens (token, created_at) VALUES (?, ?)';
    db.run(query, [token, now], function (err) {
        if (err) {
            console.error('Error inserting token:', err);
            return res.status(500).json({ error: 'Failed to insert token.' });
        }

        // Send the token as the response
        res.json({ token: `${token}` });
    });
});

tokenRouter.delete('/:token', (req, res) => {
    const { token } = req.params;
    const now = new Date().toISOString();

    // Update the 'deleted_at' field in the 'tokens' table for the provided token
    const query = 'UPDATE tokens SET deleted_at = ? WHERE token = ?';
    db.run(query, [now, token], function (err) {
        if (err) {
            console.error('Error updating token:', err);
            return res.status(500).json({ error: 'Failed to update token.' });
        }

        if (this.changes === 0) {
            // If no rows were affected, the token does not exist in the database
            return res.status(404).json({ error: 'Token not found.' });
        }

        // Token successfully updated, send success response
        res.json({ message: 'Token successfully deleted.' });
    });
});

module.exports = tokenRouter;
