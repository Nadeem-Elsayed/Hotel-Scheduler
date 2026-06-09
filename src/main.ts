import { app, BrowserWindow, ipcMain } from 'electron'; 
import path from 'node:path';
import started from 'electron-squirrel-startup';
import db, { initDB } from './database'; 

if (started) {
  app.quit();
}

const createWindow = () => {
  // Initialize the SQLite Database file and schema
  initDB();

  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
  }

  // Open the DevTools by default for development tracking
  mainWindow.webContents.openDevTools();
};

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// ====================================================================
// SECURE DATABASE IPC HANDLERS
// ====================================================================

// 1. Channel: Fetch all guests active on a specific date
ipcMain.handle('get-guests-by-date', async (_, targetDate: string) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT * FROM guests 
      WHERE checkInDate <= ? AND checkOutDate >= ?
      ORDER BY roomNumber ASC
    `;
    
    db.all(query, [targetDate, targetDate], (err, rows) => {
      if (err) {
        console.error('SQL Error in get-guests-by-date:', err.message);
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
});

// 2. Channel: Insert a completely new guest profile
ipcMain.handle('add-guest', async (_, guestData) => {
  return new Promise((resolve) => {
    const query = `
      INSERT INTO guests (
        guestName, roomNumber, checkInDate, checkOutDate, 
        totalAmount, amountPaid, paymentMethod, paymentStatus, notes, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [
      guestData.guestName,
      guestData.roomNumber,
      guestData.checkInDate,
      guestData.checkOutDate,
      guestData.totalAmount,
      guestData.amountPaid,
      guestData.paymentMethod,
      guestData.paymentStatus,
      guestData.notes,
      guestData.status || 'Confirmed' 
    ];

    db.run(query, params, function (err) {
      if (err) resolve({ success: false, error: err.message });
      else resolve({ success: true, id: this.lastID });
    });
  });
});

// 3. Channel: Dynamically update an existing guest's record
ipcMain.handle('update-guest', async (_, id: number, updateData) => {
  return new Promise((resolve) => {
    const fields = Object.keys(updateData);
    if (fields.length === 0) {
      resolve({ success: true });
      return;
    }

    const setClause = fields.map(field => `${field} = ?`).join(', ');
    const params = fields.map(field => (updateData as any)[field]);
    params.push(id); 

    const query = `UPDATE guests SET ${setClause} WHERE id = ?`;

    db.run(query, params, function (err) {
      if (err) {
        console.error('SQL Error in update-guest:', err.message);
        resolve({ success: false, error: err.message });
      } else {
        resolve({ success: true });
      }
    });
  });
});

// ====================================================================
// EMPLOYEE SHIFT IPC HANDLERS
// ====================================================================

ipcMain.handle('get-shifts-by-range', async (_, startDate: string, endDate: string) => {
  return new Promise((resolve, reject) => {
    // Fetches all shifts within the 14-day window, ordered by date and then start time
    const query = `
      SELECT * FROM shifts 
      WHERE shiftDate >= ? AND shiftDate <= ? 
      ORDER BY shiftDate ASC, startTime ASC
    `;
    db.all(query, [startDate, endDate], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
});
ipcMain.handle('add-shift', async (_, shiftData) => {
  return new Promise((resolve) => {
    const query = `
      INSERT INTO shifts (employeeName, role, shiftDate, startTime, endTime, totalHours, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const params = [
      shiftData.employeeName, shiftData.role, shiftData.shiftDate, 
      shiftData.startTime, shiftData.endTime, shiftData.totalHours, shiftData.notes
    ];
    
    db.run(query, params, function(err) {
      if (err) resolve({ success: false, error: err.message });
      else resolve({ success: true, id: this.lastID });
    });
  });
});

ipcMain.handle('update-shift', async (_, id: number, updateData) => {
  return new Promise((resolve) => {
    const fields = Object.keys(updateData);
    if (fields.length === 0) return resolve({ success: true });

    const setClause = fields.map(field => `${field} = ?`).join(', ');
    const params = fields.map(field => (updateData as any)[field]);
    params.push(id);

    const query = `UPDATE shifts SET ${setClause} WHERE id = ?`;

    db.run(query, params, function(err) {
      if (err) resolve({ success: false, error: err.message });
      else resolve({ success: true });
    });
  });
});

// --- EMPLOYEE DIRECTORY IPC HANDLERS ---
ipcMain.handle('get-employees', async () => {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM employees ORDER BY name ASC', [], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
});

ipcMain.handle('add-employee', async (_, empData) => {
  return new Promise((resolve) => {
    const query = `INSERT INTO employees (name, defaultRole) VALUES (?, ?)`;
    db.run(query, [empData.name, empData.defaultRole], function (err) {
      if (err) resolve({ success: false, error: err.message });
      else resolve({ success: true, id: this.lastID });
    });
  });
});

ipcMain.handle('archive-employee', async (_, id: number) => {
  return new Promise((resolve) => {
    const query = `UPDATE employees SET status = 'Archived' WHERE id = ?`;
    db.run(query, [id], (err) => {
      if (err) resolve({ success: false, error: err.message });
      else resolve({ success: true });
    });
  });
});

ipcMain.handle('get-roles', async () => {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM roles', [], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
});

ipcMain.handle('add-role', async (_, roleData) => {
  return new Promise((resolve) => {
    // Note: Ensure your roles table exists before running this!
    const query = `INSERT INTO roles (name, color) VALUES (?, ?)`;
    db.run(query, [roleData.name, roleData.color], (err) => {
      if (err) {
        console.error("Role insertion failed:", err);
        resolve({ success: false });
      } else {
        resolve({ success: true });
      }
    });
  });
});