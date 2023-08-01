/**
 * AAWeb.tech
 * https://aaweb.tech
 */

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./quotes.sqlite');

db.serialize(() => {
    // Create the 'quotes' table if it doesn't exist
    db.run(`
        CREATE TABLE IF NOT EXISTS quotes(
             id INTEGER PRIMARY KEY,
             text TEXT NOT NULL,
             author TEXT NOT NULL,
             created_at TIMESTAMP NULL DEFAULT NULL,
             updated_at TIMESTAMP NULL DEFAULT NULL,
             UNIQUE(text)
        )
  `);

    // Create the 'tokens' table if it doesn't exist
    db.run(`
        CREATE TABLE IF NOT EXISTS tokens (
          id INTEGER PRIMARY KEY,
          token TEXT NOT NULL,
          created_at DATETIME NOT NULL,
          deleted_at DATETIME DEFAULT NULL
        )
  `);
});

module.exports = db;