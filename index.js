/**
 * AAWeb.tech
 * https://aaweb.tech
 */

const express = require('express');
const bodyParser = require('body-parser');
const quoteRouter = require('./quoteRouter');
const tokenRouter = require('./tokenRouter');
const authenticateToken = require('./authMiddleware');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use('/api/tokens', tokenRouter);
app.use(authenticateToken);
app.use('/api/quotes', quoteRouter);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

