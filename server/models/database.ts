import sqlite3 from 'sqlite3';
import path from 'path';

// Type definitions
export interface Visitor {
    id: number;
    name: string;
    mobile: string;
    govt_id: string;
    purpose: string;
    qr_code: string;
    check_in?: string;
    check_out?: string;
    created_at: string;
}

export interface User {
    id: number;
    username: string;
    password: string;
    role: string;
    created_at: string;
}

// Database setup
const dbPath = path.resolve(__dirname, '../database/visitor.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error connecting to database:', err);
    } else {
        console.log('Connected to SQLite database');
        initializeTables();
    }
});

function initializeTables() {
    db.run(`
        CREATE TABLE IF NOT EXISTS visitors (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            mobile TEXT NOT NULL,
            govt_id TEXT NOT NULL,
            purpose TEXT NOT NULL,
            qr_code TEXT NOT NULL,
            check_in DATETIME,
            check_out DATETIME,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `, [], (err) => {
        if (err) console.error('Error creating visitors table:', err);
    });

    db.run(`
        CREATE TABLE IF NOT EXISTS visits (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            visitor_id INTEGER,
            check_in DATETIME,
            check_out DATETIME,
            FOREIGN KEY(visitor_id) REFERENCES visitors(id)
        )
    `, [], (err) => {
        if (err) console.error('Error creating visits table:', err);
    });

    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            role TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `, [], (err) => {
        if (err) console.error('Error creating users table:', err);
    });
}

export default db; 