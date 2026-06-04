import sqlite3 from 'sqlite3';
import path from 'path';
import { app } from 'electron';

const dbPath = path.join(app.getPath('userData'), 'hotel-scheduler.sqlite');
const db = new sqlite3.Database(dbPath);

export const initDB = () => {
  db.serialize(() => {
    // 1. Ensure Tables Exist
    db.run(`CREATE TABLE IF NOT EXISTS guests (
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
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS employees (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      defaultRole TEXT
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS shifts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      employeeName TEXT NOT NULL,
      role TEXT NOT NULL,
      shiftDate TEXT NOT NULL,
      startTime TEXT NOT NULL,
      endTime TEXT NOT NULL,
      totalHours REAL DEFAULT 0.0,
      notes TEXT
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS roles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      color TEXT NOT NULL
    )`);

    // 2. Safe Migrations (Checks if column exists before adding)
    
    // Fix for Guests table status
    db.all("PRAGMA table_info(guests)", (_, rows: any[]) => {
      if (!rows.some(row => row.name === 'status')) {
        db.run(`ALTER TABLE guests ADD COLUMN status TEXT DEFAULT 'Confirmed'`);
      }
    });

    // Fix for Employees table status
    db.all("PRAGMA table_info(employees)", (_, rows: any[]) => {
      if (!rows.some(row => row.name === 'status')) {
        db.run(`ALTER TABLE employees ADD COLUMN status TEXT DEFAULT 'Active'`);
      }
    });
    // Cleanup orphaned shifts
  });
};

export default db;