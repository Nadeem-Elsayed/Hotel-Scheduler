# Hotel Scheduler & Operations Hub

A desktop application designed for hotel front-desk operations, guest reservation management, staff shift scheduling, and bi-weekly payroll tracking. Built with Electron, React, TypeScript, and SQLite, it runs entirely offline with local data storage.

---

## Features

### Guest Operations & Front-Desk Ledger
- Daily overview toggling between today's and yesterday's guest activity.
- Real-time search by guest name or room number with status filtering (Expected, Confirmed, Checked In, Checked Out).
- Ledger tracking for total charge, amount paid, balance due, payment channel, and settlement status.
- Automatic calculation of length of stay and Average Daily Rate (ADR).
- Guest details drawer for editing reservation information and processing check-outs.

### Staff Scheduling & Payroll
- 14-day bi-weekly pay cycle schedule matrix with forward and backward period navigation.
- Real-time hours calculation aggregating total hours worked per employee per pay period.
- 24-hour daily roster view with multi-lane shift layout to identify and manage overlaps.
- Employee directory with support for archiving staff and creating custom roles with color assignments.
- Shift management drawer for assigning and modifying employee shifts and notes.

### Reporting & Data Management
- Export schedules to Google Calendar-compatible CSV files.
- Export yearly payroll reports to CSV formatted with human-readable dates and total hours.
- Bulk CSV import for historical guest and shift data.
- Automated daily database backups saved to the user's Documents folder with a 15-backup rolling retention policy.
- Built-in database restore and yearly archive/purge utilities.

---

## Tech Stack

- **Framework:** Electron 42, Vite 5, Electron Forge
- **Frontend:** React 19, TypeScript
- **Database:** SQLite3 (local embedded storage)
- **Packaging:** Squirrel.Windows (.exe)

---

## Installation

### For Users
Download the latest Windows installer (`hotel-scheduler-<version> Setup.exe`) from the repository's Releases page and run the installer.

### For Developers

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Nadeem-Elsayed/Hotel-Scheduler.git
   cd Hotel-Scheduler
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```

4. **Build the Windows installer:**
   ```bash
   npm run make
   ```

---

## License

This project is licensed under the [MIT License](LICENSE).
