import sqlite3 from 'sqlite3';
import path from 'path';
import { app } from 'electron';

// 1. Determine where to safely store the database file on the user's computer
const dbPath = path.join(app.getPath('userData'), 'hotel-scheduler.sqlite');

// 2. Initialize the connection
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database', err.message);
  } else {
    console.log('Successfully connected to the local SQLite database.');
    console.log(`Database located at: ${dbPath}`);
  }
});

// 3. Create the Tables if they don't exist
export const initDB = () => {
  db.serialize(() => {
    db.run(`
      CREATE TABLE IF NOT EXISTS guests (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        guestName TEXT NOT NULL,
        roomNumber TEXT,
        checkInDate TEXT NOT NULL,
        checkOutDate TEXT NOT NULL,
        totalAmount REAL DEFAULT 0.0,
        amountPaid REAL DEFAULT 0.0,
        paymentMethod TEXT,
        paymentStatus TEXT,
        notes TEXT,
        status TEXT DEFAULT 'Confirmed'
      )
    `);

    // 2. The Migration: Safely inject the column into your existing local file
    db.run(`ALTER TABLE guests ADD COLUMN status TEXT DEFAULT 'Confirmed'`, () => {});

    db.run(`
      CREATE TABLE IF NOT EXISTS shifts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        employeeName TEXT NOT NULL,
        role TEXT NOT NULL,
        shiftDate TEXT NOT NULL,
        startTime TEXT NOT NULL,
        endTime TEXT NOT NULL,
        totalHours REAL DEFAULT 0.0,
        notes TEXT
      )
    `);
  });
};

export default db;