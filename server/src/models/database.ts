import sqlite3 from 'sqlite3';
import path from 'path';
import fs from 'fs';

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
const dbPath = process.env.DB_PATH || path.resolve(__dirname, '../../database/visitor.db');
console.log('Database path:', dbPath);

// Ensure database directory exists
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error connecting to database:', err);
    } else {
        console.log('Connected to SQLite database');
        createTables().then(() => {
            insertDefaultUsers();
        }).catch(err => {
            console.error('Error initializing database:', err);
        });
    }
});

async function createTables() {
    return new Promise<void>((resolve, reject) => {
        db.serialize(() => {
            // Create visitors table
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
            `);

            // Create users table
            db.run(`
                CREATE TABLE IF NOT EXISTS users (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    username TEXT UNIQUE NOT NULL,
                    password TEXT NOT NULL,
                    role TEXT NOT NULL,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            `, (err) => {
                if (err) reject(err);
                else resolve();
            });
        });
    });
}

function insertDefaultUsers() {
    const defaultUsers = [
        { username: 'admin', password: 'admin123', role: 'admin' },
        { username: 'security', password: 'security123', role: 'security' }
    ];

    db.serialize(() => {
        const stmt = db.prepare('INSERT OR IGNORE INTO users (username, password, role) VALUES (?, ?, ?)');
        defaultUsers.forEach(user => {
            stmt.run([user.username, user.password, user.role], (err) => {
                if (err) {
                    console.error('Error inserting user:', err);
                } else {
                    console.log(`User ${user.username} created/verified`);
                }
            });
        });
        stmt.finalize();
    });
}

export default db; 