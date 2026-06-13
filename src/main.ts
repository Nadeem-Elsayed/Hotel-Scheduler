import { app, BrowserWindow, ipcMain, dialog, shell } from 'electron'; 
import path from 'node:path';
import started from 'electron-squirrel-startup';
import db, { initDB } from './database';
import fs from 'fs';


if (started) {
  app.quit();
}

process.on('uncaughtException', (error) => {
  dialog.showErrorBox('Fatal Application Error', error.toString() + '\n' + error.stack);
});

const createWindow = () => {
  // Initialize the SQLite Database file and schema
  initDB();

  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    title: 'Pod Inn Hotel Scheduler',
    icon: path.join(__dirname, '../../icon.ico'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
  }

  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    // DevTools only in development; keep the receptionist build clean.
    mainWindow.webContents.openDevTools();
  }
};

app.whenReady().then(() => {
  createWindow();
  performDailyBackup(); // Ensure backup runs on app start as well

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
// AUTO-BACKUP SYSTEM (With 30-Day Retention Policy)
// ====================================================================
function performDailyBackup() {
  try {
    const dbSource = path.join(app.getPath('userData'), 'hotel-scheduler.sqlite'); 
    const backupDir = path.join(app.getPath('documents'), 'HotelScheduler_Backups');
    
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }

    const todayStr = new Date().toISOString().split('T')[0];
    const backupDest = path.join(backupDir, `db_backup_${todayStr}.sqlite`);

    // 1. Create today's snapshot (if it hasn't been made yet)
    if (fs.existsSync(dbSource) && !fs.existsSync(backupDest)) {
      fs.copyFileSync(dbSource, backupDest);
      console.log('Daily database backup secured at:', backupDest);
    }

    // 2. Enforce the Backup Cap (Retention Policy)
    const MAX_BACKUPS = 15; // Keeps exactly a biweekly period + one day of backups
    
    // Read all files in the backup directory
    const files = fs.readdirSync(backupDir)
      .filter(f => f.startsWith('db_backup_') && f.endsWith('.sqlite'));

    if (files.length > MAX_BACKUPS) {
      // Sort files chronologically (oldest to newest)
      // Since filenames use ISO dates (YYYY-MM-DD), standard string sorting works perfectly
      files.sort(); 
      
      // Calculate how many files exceed our cap
      const filesToDelete = files.length - MAX_BACKUPS;
      
      // Delete the oldest files
      for (let i = 0; i < filesToDelete; i++) {
        const oldFile = path.join(backupDir, files[i]);
        fs.unlinkSync(oldFile);
        console.log('Retention policy applied. Cleaned up old backup:', files[i]);
      }
    }
  } catch (error) {
    console.error('Failed to perform daily backup:', error);
  }
}

// ====================================================================
// DATA IMPORT ENGINE (CSV)
// ====================================================================

// Helper function to safely parse CSV lines, ignoring commas inside quotes
function parseCSVLine(text: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (char === '"' && text[i + 1] === '"') {
      current += '"'; // Escaped quote
      i++;
    } else if (char === '"') {
      inQuotes = !inQuotes; // Toggle quote state
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = ''; // Reset for next column
    } else {
      current += char;
    }
  }
  result.push(current.trim()); // Push the final column
  return result.map(val => val.replace(/^"|"$/g, '')); // Strip boundary quotes
}

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
    
    db.all(query, [targetDate, targetDate], (err: any, rows: any[]) => {
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

    db.run(query, params, function (this: any, err: any) {
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

    db.run(query, params, function (this: any, err: any) {
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
    db.all(query, [startDate, endDate], (err: any, rows: any[]) => {
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
    
    db.run(query, params, function (this: any, err: any) {
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

    db.run(query, params, function (this: any, err: any) {
      if (err) resolve({ success: false, error: err.message });
      else resolve({ success: true });
    });
  });
});

// --- EMPLOYEE DIRECTORY IPC HANDLERS ---
ipcMain.handle('get-employees', async () => {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM employees ORDER BY name ASC', [], (err: any, rows: any[]) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
});

ipcMain.handle('add-employee', async (_, empData) => {
  return new Promise((resolve) => {
    const query = `INSERT INTO employees (name, defaultRole) VALUES (?, ?)`;
    db.run(query, [empData.name, empData.defaultRole], function (this: any, err: any) {
      if (err) resolve({ success: false, error: err.message });
      else resolve({ success: true, id: this.lastID });
    });
  });
});

ipcMain.handle('archive-employee', async (_, id: number) => {
  return new Promise((resolve) => {
    const query = `UPDATE employees SET status = 'Archived' WHERE id = ?`;
    db.run(query, [id], (err: any) => {
      if (err) resolve({ success: false, error: err.message });
      else resolve({ success: true });
    });
  });
});

ipcMain.handle('get-roles', async () => {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM roles', [], (err: any, rows: any[]) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
});

ipcMain.handle('add-role', async (_, roleData) => {
  return new Promise((resolve) => {
    // Note: Ensure your roles table exists before running this!
    const query = `INSERT INTO roles (name, color) VALUES (?, ?)`;
    db.run(query, [roleData.name, roleData.color], (err: any) => {
      if (err) {
        console.error("Role insertion failed:", err);
        resolve({ success: false });
      } else {
        resolve({ success: true });
      }
    });
  });
});

ipcMain.handle('delete-role', async (_, id: number) => {
  return new Promise((resolve) => {
    db.run(`DELETE FROM roles WHERE id = ?`, [id], (err: any) => {
      resolve({ success: !err });
    });
  });
});

// Add this alongside your other ipcMain handlers
ipcMain.handle('delete-shift', async (_, id: number) => {
  return new Promise((resolve) => {
    db.run(`DELETE FROM shifts WHERE id = ?`, [id], (err: any) => {
      if (err) {
        console.error("Failed to delete shift:", err);
        resolve({ success: false, error: err.message });
      } else {
        resolve({ success: true });
      }
    });
  });
});

ipcMain.handle('delete-guest', async (_, id: number) => {
  return new Promise((resolve) => {
    db.run(`DELETE FROM guests WHERE id = ?`, [id], (err: any) => {
      resolve({ success: !err, error: err?.message });
    });
  });
});

ipcMain.handle('export-calendar-csv', async (_, startDate: string, endDate: string) => {
  return new Promise((resolve) => {
    const query = `SELECT * FROM shifts WHERE shiftDate >= ? AND shiftDate <= ? ORDER BY shiftDate ASC, startTime ASC`;
    
    db.all(query, [startDate, endDate], async (err: any, rows: any[]) => {
      if (err) return resolve({ success: false, error: err.message });
      
      // Google Calendar format
      let csvContent = "Subject,Start Date,Start Time,End Date,End Time,Description\n";
      
      rows.forEach((s: any) => {
        const subject = `Shift: ${s.employeeName} (${s.role})`;
        const desc = s.notes ? s.notes.replace(/,/g, '') : ''; // Strip commas from notes
        csvContent += `"${subject}",${s.shiftDate},${s.startTime},${s.shiftDate},${s.endTime},"${desc}"\n`;
      });

      const { filePath, canceled } = await dialog.showSaveDialog({
        title: 'Export Google Calendar Schedule',
        defaultPath: `Schedule_${startDate}_to_${endDate}.csv`,
        filters: [{ name: 'CSV', extensions: ['csv'] }]
      });

      if (canceled || !filePath) return resolve({ success: false, error: 'cancelled' });

      fs.writeFile(filePath, csvContent, (err) => {
        if (err) resolve({ success: false, error: err.message });
        else resolve({ success: true });
      });
    });
  });
});

// Export Yearly Report for Payroll/Tax calculation
// Replace the existing 'export-yearly-csv' handler with this one:
ipcMain.handle('export-yearly-csv', async (_, year: string) => {
  return new Promise((resolve) => {
    // 1. Query the database
    db.all(`SELECT * FROM shifts WHERE shiftDate LIKE ? ORDER BY shiftDate ASC`, [`${year}-%`], async (err: any, rows: any[]) => {
      if (err) return resolve({ success: false, error: err.message });
      
      // 2. Format CSV data
      let csvContent = "Employee Name,Role,Full Date,Start Time,End Time,Total Hours,Notes\n";
      
      rows.forEach(s => {
        const desc = s.notes ? s.notes.replace(/,/g, '') : '';
        
        // Convert YYYY-MM-DD to a human-readable Full Date string
        // Adding the 'T12:00:00' timestamp prevents timezone shifting bugs
        const fullDateStr = new Date(s.shiftDate + 'T12:00:00').toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });

        csvContent += `"${s.employeeName}","${s.role}","${fullDateStr}",${s.startTime},${s.endTime},${s.totalHours},"${desc}"\n`;
      });

      // 3. Prompt user for save location
      const today = new Date();
      const day = String(today.getDate()).padStart(2, '0');
      const month = String(today.getMonth() + 1).padStart(2, '0'); // +1 because January is 0

      // 2. Prompt user for save location (Fixed typo: showSaveDialog)
      const { filePath, canceled } = await dialog.showSaveDialog({
        title: `Export Yearly Payroll (${year})`,
        defaultPath: `Payroll_Report_${day}-${month}-${year}.csv`,
        filters: [{ name: 'CSV Files', extensions: ['csv'] }]
      });

      if (canceled || !filePath) return resolve({ success: false, error: 'cancelled' });

      // 4. Write file and resolve
      fs.writeFile(filePath, csvContent, (writeErr) => {
        if (writeErr) resolve({ success: false, error: writeErr.message });
        else resolve({ success: true });
      });
    });
  });
});

ipcMain.handle('open-backup-folder', async () => {
  const backupDir = path.join(app.getPath('documents'), 'HotelScheduler_Backups');
  // If the folder doesn't exist yet, create it so it doesn't throw an error
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }
  // Opens the native Windows/macOS file explorer to this specific folder
  shell.openPath(backupDir);
});

ipcMain.handle('restore-database', async () => {
  return new Promise(async (resolve) => {
    // 1. Warn the user and let them pick a .sqlite file
    const { filePaths, canceled } = await dialog.showOpenDialog({
      title: 'Select Database Backup to Restore',
      properties: ['openFile'],
      filters: [{ name: 'SQLite Database', extensions: ['sqlite', 'db'] }],
      message: 'WARNING: This will completely overwrite your current live data. The application will restart.'
    });

    if (canceled || filePaths.length === 0) {
      return resolve({ success: false, error: 'cancelled' });
    }

    const selectedBackupPath = filePaths[0];
    const liveDbPath = path.join(app.getPath('userData'), 'hotel-scheduler.sqlite');

    try {
      // 2. Overwrite the live database with the selected backup
      fs.copyFileSync(selectedBackupPath, liveDbPath);
      
      // 3. Relaunch the application to load the new database into memory
      app.relaunch();
      app.exit(0);
      resolve({ success: true }); 
    } catch (err: any) {
      console.error("Failed to restore database:", err);
      resolve({ success: false, error: err.message });
    }
  });
});

// Fetch a setting (or return the default if it doesn't exist yet)
ipcMain.handle('get-setting', async (_, key: string, defaultValue: string) => {
  return new Promise((resolve) => {
    db.get(`SELECT value FROM settings WHERE key = ?`, [key], (err: any, row: any) => {
      if (err || !row) resolve(defaultValue);
      else resolve(row.value);
    });
  });
});

// Update or Insert a setting
ipcMain.handle('update-setting', async (_, key: string, value: string) => {
  return new Promise((resolve) => {
    const query = `INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value`;
    db.run(query, [key, value], (err: any) => {
      resolve({ success: !err });
    });
  });
});

// Archive and Purge old records
ipcMain.handle('purge-database', async () => {
  return new Promise((resolve) => {
    try {
      const liveDbPath = path.join(app.getPath('userData'), 'hotel-scheduler.sqlite');
      const backupDir = path.join(app.getPath('documents'), 'HotelScheduler_Backups');
      
      const todayStr = new Date().toISOString().split('T')[0];
      const archiveDest = path.join(backupDir, `ARCHIVE_Pre-Purge_${todayStr}.sqlite`);

      // 1. Create the permanent archive snapshot FIRST
      fs.copyFileSync(liveDbPath, archiveDest);

      // 2. Calculate the cutoff date (Exactly 1 year ago)
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
      const cutoffDate = oneYearAgo.toISOString().split('T')[0];

      // 3. Purge old records from the live database
      db.serialize(() => {
        db.run(`DELETE FROM shifts WHERE shiftDate < ?`, [cutoffDate]);
        db.run(`DELETE FROM guests WHERE checkOutDate < ?`, [cutoffDate], (err: any) => {
          if (err) resolve({ success: false, error: err.message });
          else resolve({ success: true });
        });
      });
    } catch (err: any) {
      resolve({ success: false, error: err.message });
    }
  });
});

ipcMain.handle('import-csv', async (_, type: 'guests' | 'shifts') => {
  return new Promise(async (resolve) => {
    // 1. Let the user select the CSV file
    const { filePaths, canceled } = await dialog.showOpenDialog({
      title: `Import ${type.toUpperCase()} CSV`,
      properties: ['openFile'],
      filters: [{ name: 'CSV Files', extensions: ['csv'] }]
    });

    if (canceled || filePaths.length === 0) return resolve({ success: false, error: 'cancelled' });

    try {
      // 2. Read the file
      const filePath = filePaths[0];
      const fileContent = fs.readFileSync(filePath, 'utf8');
      
      // Split by newlines, handling both Windows (\r\n) and Mac/Linux (\n)
      const lines = fileContent.split(/\r?\n/).filter(line => line.trim() !== '');
      
      if (lines.length < 2) {
        return resolve({ success: false, error: 'File is empty or missing data rows.' });
      }

      // 3. Extract Headers to figure out column mapping
      const headers = parseCSVLine(lines[0]).map(h => h.toLowerCase().trim());
      
      let successCount = 0;

      // 4. Begin Safe Database Transaction using db.serialize
      db.serialize(() => {
        db.run('BEGIN TRANSACTION');

        // Prepare statements based on the import type
        const stmt = type === 'guests' 
          ? db.prepare(`INSERT INTO guests (guestName, roomNumber, checkInDate, checkOutDate, totalAmount, amountPaid, paymentMethod, paymentStatus, notes, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
          : db.prepare(`INSERT INTO shifts (employeeName, role, shiftDate, startTime, endTime, totalHours, notes) VALUES (?, ?, ?, ?, ?, ?, ?)`);

        // Prepare a statement to auto-create employees if importing shifts
        const empStmt = type === 'shifts' 
          ? db.prepare(`INSERT OR IGNORE INTO employees (name, defaultRole, status) VALUES (?, ?, 'Active')`) 
          : null;

        for (let i = 1; i < lines.length; i++) {
          const values = parseCSVLine(lines[i]);
          
          if (type === 'guests') {
            // Map values based on expected header names (Fallback to array index if headers differ)
            const name = values[headers.findIndex(h => h.includes('name'))] || values[0] || 'Unknown Guest';
            const room = values[headers.findIndex(h => h.includes('room'))] || values[1] || '';
            const checkIn = values[headers.findIndex(h => h.includes('in'))] || values[2] || '';
            const checkOut = values[headers.findIndex(h => h.includes('out'))] || values[3] || '';
            const total = parseFloat(values[headers.findIndex(h => h.includes('total'))] || values[4]) || 0;
            const paid = parseFloat(values[headers.findIndex(h => h.includes('paid'))] || values[5]) || 0;
            const method = values[headers.findIndex(h => h.includes('method') || h.includes('channel'))] || values[6] || '';
            const status = values[headers.findIndex(h => h.includes('status'))] || values[7] || 'Confirmed';
            const notes = values[headers.findIndex(h => h.includes('note'))] || values[8] || '';

            stmt.run([name, room, checkIn, checkOut, total, paid, method, 'Imported', notes, status]);
          } 
          else if (type === 'shifts') {
            const name = values[headers.findIndex(h => h.includes('name') || h.includes('employee'))] || values[0] || 'Unknown';
            const role = values[headers.findIndex(h => h.includes('role'))] || values[1] || 'Imported Role';
            const date = values[headers.findIndex(h => h.includes('date'))] || values[2] || '';
            const start = values[headers.findIndex(h => h.includes('start'))] || values[3] || '00:00';
            const end = values[headers.findIndex(h => h.includes('end'))] || values[4] || '00:00';
            const hours = parseFloat(values[headers.findIndex(h => h.includes('hour'))] || values[5]) || 0;
            const notes = values[headers.findIndex(h => h.includes('note'))] || values[6] || '';

            // Execute the auto-creation (ignores if name already exists due to UNIQUE constraint)
            if (empStmt) empStmt.run([name, role]);

            stmt.run([name, role, date, start, end, hours, notes]);
          }
          successCount++;
        }

        stmt.finalize();
        if (empStmt) empStmt.finalize(); // Clean up memory
        
        // Commit the transaction to save everything at once
        db.run('COMMIT', (err: any) => {
          if (err) {
            db.run('ROLLBACK');
            resolve({ success: false, error: 'Database error during commit: ' + err.message });
          } else {
            // Show a success dialog natively
            dialog.showMessageBox({
              type: 'info',
              title: 'Import Successful',
              message: `Successfully imported ${successCount} ${type} records into the database.`
            });
            resolve({ success: true });
          }
        });
      });

    } catch (err: any) {
      resolve({ success: false, error: 'Failed to process file: ' + err.message });
    }
  });
});

// Add this near your other ipcMain.handle blocks
ipcMain.handle('show-message', async (_, message: string, title = 'Notification') => {
  await dialog.showMessageBox({
    type: 'info',
    title: title,
    message: message,
    buttons: ['OK']
  });
});

ipcMain.handle('show-confirm', async (_, message: string, title = 'Confirm Action') => {
  const { response } = await dialog.showMessageBox({
    type: 'warning',
    title: title,
    message: message,
    buttons: ['Cancel', 'OK'],
    defaultId: 1, // 'OK' is the default highlighted button
    cancelId: 0   // 'Cancel' is the safe escape button
  });
  return response === 1; // Returns true if they clicked 'OK'
});