/**
 * AAWeb.tech
 * https://aaweb.tech
 */

const express = require('express');
const quoteRouter = express.Router();
const db = require('./db');

// Validation middleware for creating and updating quotes
async function validateQuote(req, res, next) {
    const text = req.body.text || null;
    const author = req.body.author || 'Unknown'; // Set author to 'Unknown' if not provided


    if (req.method !== 'PUT') {
        // Check if text and author are not empty
        if (!text || !author) {
            return res.status(400).json({ error: 'Quote text and author are required.' });
        }

        // Check text length
        // No smartass approach to insert 10+ whitespaces as you know this would pass validation. Be nice. It ain't a production API after all. :)
        if (text.length < 10 || text.length > 500) {
            return res.status(400).json({ error: 'Quote text should be between 10 and 500 characters.' });
        }

        // Check author length
        // Same as above, don't do smartass things. Behave like a regular user. :)
        if (author.length < 3 || author.length > 50) {
            return res.status(400).json({ error: 'Author name should be between 3 and 50 characters.' });
        }
    }

    // check if the quote text is unique on create / update
    let params = null;
    let query = null;
    let quoteId = null;
    if(req.method === 'PUT') {
        quoteId = req.params.id;
        query = 'SELECT id FROM quotes WHERE text = ? AND id != ?';
        params = [text, quoteId];
    } else {
        query = 'SELECT id FROM quotes WHERE text = ?';
        params = [text];
    }

    db.get(query, params, (err, row) => {
        if (err) {
            console.error('Error checking quote existence:', err);
            return res.status(500).json({ error: 'Failed to check quote existence.' });
        }
        if (row) {
            return res.status(409).json({ error: 'Quote with the same text already exists.' });
        }

        // If validation passes, proceed
        next();
    });

}

// Get all quotes
quoteRouter.get('/', (req, res) => {
    db.all('SELECT * FROM quotes', (err, rows) => {
        if (err) {
            console.error('Error fetching quotes:', err);
            return res.status(500).json({ error: 'Failed to fetch quotes.' });
        }
        res.json(rows);
    });
});

// Get quote with the given id
quoteRouter.get('/:id', (req, res) => {
    const quoteId = req.params.id;
    db.all('SELECT * FROM quotes WHERE id = ?', [quoteId], (err, rows) => {
        if (err) {
            console.error('Error fetching quotes:', err);
            return res.status(500).json({ error: 'Failed to fetch quotes.' });
        }

        if(rows.length === 0) {
            return res.status(404).json({ error: 'Quote not found.' });
        }

        res.json(rows);
    });
});

// Create a new quote
quoteRouter.post('/', validateQuote, (req, res) => {
    const text = req.body.text;
    const author = req.body.author || 'Unknown'; // Set author to 'Unknown' if not provided
    const now = new Date().toISOString();
    const query = 'INSERT INTO quotes (text, author, created_at, updated_at) VALUES (?, ?, ?, ?)';

    db.run(query, [text, author, now, now], function (err) {
        if (err) {
            console.error('Error inserting quote:', err);
            return res.status(500).json({ error: 'Failed to insert quote.' });
        }

        const newQuoteId = this.lastID;
        res.status(201).json({ id: newQuoteId, text, author });
    });
});

// Update quote with the given id
quoteRouter.put('/:id', validateQuote, (req, res) => {
    const quoteId = req.params.id;
    const text = req.body.text || null;
    const author = req.body.author || null;
    const now = new Date().toISOString();

    /**
     * Updating the quote can be a lil' bit tricky :) because if author name is not provided it can be set to `Unknown`, so this is the suggested and implemented logic.
     * If only quote text is provided, update only the quote text
     * If only author name is provided, update only the author name
     * If both quote text and author name are provided, update both
     */

    // Check if text and author are not empty
    if (!text && !author) {
        return res.status(400).json({ error: 'Quote text and / or author are required.' });
    }

    // Check text length
    if (text !== null && (text?.length < 10 || text?.length > 500)) {
        return res.status(400).json({ error: 'Quote text should be between 10 and 500 characters.' });
    }

    // Check author length
    if (author !== null && (author?.length < 3 || author?.length > 50)) {
        return res.status(400).json({ error: 'Author name should be between 3 and 50 characters.' });
    }

    let query = 'UPDATE quotes SET ';
    let params = [];

    // Yoda conditions :)
    if (null !== text && null === author) {
        query += 'text = ?';
        params.push(text);
    } else if (null === text && null !== author) {
        query += 'author = ?';
        params.push(author);
    } else if (null !== text && null !== author) {
        query += 'text = ?, author = ?';
        params.push(text);
        params.push(author);
    }
    params.push(now);
    params.push(quoteId);
    query += ', updated_at = ? WHERE id = ?';

    db.run(query, params, function (err) {
        if (err) {
            console.error('Error updating quote:', err);
            return res.status(500).json({ error: 'Failed to update quote.' });
        }

        if (this.changes === 0) {
            return res.status(404).json({ error: 'Quote not found.' });
        }
    });

    db.all('SELECT * FROM quotes WHERE id = ?', [quoteId], (err, rows) => {
        if (err) {
            console.error('Error fetching quotes:', err);
            return res.status(500).json({ error: 'Failed to fetch quotes.' });
        }

        if(rows.length === 0) {
            return res.status(404).json({ error: 'Quote not found.' });
        }

        res.json(rows);
    });
});

// Delete all quotes
quoteRouter.delete('/all', (req, res) => {
    const query = 'DELETE FROM quotes';

    db.run(query, function (err) {
        if (err) {
            console.error('Error deleting quotes:', err);
            return res.status(500).json({ error: 'Failed to delete quotes.' });
        }

        // Get the number of rows affected (i.e., number of deleted quotes)
        const deletedRows = this.changes;

        // Send a success response with the number of deleted quotes
        res.json({ message: `Successfully deleted ${deletedRows} quotes.` });
    });
});

// Delete quote with the given id
quoteRouter.delete('/:id', (req, res) => {
    const quoteId = req.params.id;
    const query = 'DELETE FROM quotes WHERE id = ?';

    db.run(query, quoteId, function (err) {
        if (err) {
            console.error('Error deleting quote:', err);
            return res.status(500).json({ error: 'Failed to delete quote.' });
        }

        if (this.changes === 0) {
            return res.status(404).json({ error: 'Quote not found.' });
        }

        res.json({ message: 'Quote deleted successfully.' });
    });
});

module.exports = quoteRouter;
