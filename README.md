# 🏨 Hotel Scheduler & Operations Hub

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Electron](https://img.shields.io/badge/Electron-42.x-47848F?logo=electron&logoColor=white)](https://www.electronjs.org/)
[![React](https://img.shields.io/badge/React-19.x-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.5+-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![SQLite](https://img.shields.io/badge/Database-SQLite3-003B57?logo=sqlite&logoColor=white)](https://www.sqlite.org/)
[![Platform](https://img.shields.io/badge/Platform-Windows%20%7C%20Cross--Platform-lightgrey.svg)]()

> A modern, secure, and offline-first desktop workstation engineered for hotel front-desk operations, guest reservation ledgers, staff shift scheduling, and bi-weekly payroll reporting.

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
  - [Guest Operations & Ledger](#1-guest-operations--ledger)
  - [Staff Roster & Scheduling](#2-staff-roster--scheduling)
  - [Bi-Weekly Payroll Breakdown](#3-bi-weekly-payroll-breakdown)
  - [Data Protection & Disaster Recovery](#4-data-protection--disaster-recovery)
  - [CSV Imports & Exports](#5-csv-imports--exports)
- [Architecture & Tech Stack](#-architecture--tech-stack)
- [Installation (For End Users)](#-installation-for-end-users)
- [Developer Setup](#-developer-setup)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Available Scripts](#available-scripts)
  - [Packaging & Installers](#packaging--installers)
- [Data Storage & Directory Structure](#-data-storage--directory-structure)
- [Creating a GitHub Release](#-creating-a-github-release)
- [License](#-license)

---

## 🌟 Overview

**Hotel Scheduler** is a tailored desktop solution designed specifically for front-desk clerks, hotel managers, and administrative staff. Running as a standalone application powered by Electron and SQLite, it eliminates dependencies on external servers, internet connections, or recurring cloud subscriptions while delivering desktop performance and data ownership.

---

## ✨ Key Features

### 1. Guest Operations & Ledger
- **Live Operations Dashboard:** View all guest activity for *Today* or *Yesterday* with a single click.
- **Dynamic Search & Status Filters:** Instantly search by guest name, room number, or status (`Expected`, `Confirmed`, `Checked In`, `Checked Out`).
- **Real-Time Financial Ledger:**
  - Automated remaining balance computation.
  - Visual status color codes (Paid in Full vs Outstanding Balance).
  - Channel tracking (Expedia Collect, Booking.com, Direct Website, Walk-in).
  - Terminal & settlement method tracking (Cash, EVC Machine, Pending).
- **Metric Insights:** Live calculation of Average Daily Rate (ADR) and total length-of-stay.
- **Guest Drawer:** Full profile editing, check-in date adjustments, and quick checkout transitions.

### 2. Staff Roster & Scheduling
- **14-Day Pay Period Matrix:** Calendar view segmented into standard 2-week pay cycles with forward and backward period navigation.
- **24-Hour Timeline Swimlanes:** Detailed daily roster showing hour-by-hour shift schedules across parallel columns to avoid scheduling conflicts.
- **Custom Staff & Role Directory:** Manage active employees, assign default roles, archive past employees, and create custom roles with color pickers.
- **Shift Drawer & Editor:** Shift assignment with automated total hour calculation and notes.

### 3. Bi-Weekly Payroll Breakdown
- **Real-Time Hours Summary:** Aggregates total hours worked by employee across each 14-day pay cycle.
- **Yearly Payroll CSV Export:** Generates tax-ready and payroll-ready spreadsheets formatted with human-readable dates, hours, and employee breakdowns.
- **Google Calendar Export:** Exports schedules directly into a Google Calendar/Outlook-compatible `.csv` file.

### 4. Data Protection & Disaster Recovery
- **Automated Daily Backups:** Automatically creates a dated snapshot of the SQLite database in the user's `Documents/HotelScheduler_Backups` folder upon startup.
- **15-Day Retention Policy:** Automatically maintains a 15-backup rolling history to protect against data corruption without cluttering storage.
- **One-Click Backup Access:** Dedicated button to immediately open the backups folder in native Windows Explorer.
- **Safe Database Restore:** Interactive file selector allowing users to restore previous database states with automatic app relaunch.
- **Archive & Purge System:** Archives and purges historical records older than 1 year to keep the live database lean and fast.

### 5. CSV Imports & Exports
- **Bulk CSV Data Importer:** Upload past guests and past shift records directly into the SQLite database. Auto-detects headers and auto-creates missing employee profiles.

---

## 🏗️ Architecture & Tech Stack

```
Hotel-Scheduler/
├── src/
│   ├── assets/              # Branding assets & icons
│   ├── components/          # React UI components
│   │   ├── LandingPage.tsx      # Main application hub
│   │   ├── GuestDashboard.tsx   # Guest operations & filters
│   │   ├── GuestGrid.tsx        # Guest ledger table
│   │   ├── GuestDrawer.tsx      # Guest profile & payment editor
│   │   ├── GuestForm.tsx        # Add new guest modal
│   │   ├── ShiftDashboard.tsx   # Staff scheduling dashboard
│   │   ├── ShiftCalendar.tsx    # 14-day pay period calendar
│   │   ├── DailyRoster.tsx      # 24-hour visual shift timeline
│   │   ├── StaffManager.tsx     # Staff & role directory modal
│   │   └── SettingsPage.tsx     # App settings & danger zone
│   ├── database.ts          # SQLite initialization, migrations & schema
│   ├── main.ts              # Electron main process, backups, IPC handlers
│   ├── preload.ts           # Secure contextBridge API bindings
│   ├── app.tsx              # Root React component & view routing
│   └── types/               # TypeScript interfaces
├── forge.config.ts          # Electron Forge packager & Squirrel maker config
├── vite.main.config.ts      # Vite configuration for main process
├── vite.preload.config.ts   # Vite configuration for preload script
└── vite.renderer.config.ts  # Vite configuration for React renderer
```

- **Runtime:** [Electron 42](https://www.electronjs.org/)
- **UI Engine:** [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build System:** [Vite 5](https://vitejs.dev/) + [Electron Forge](https://www.electronforge.io/)
- **Embedded Database:** [SQLite3](https://github.com/TryGhost/node-sqlite3)
- **Security:**
  - Context Isolation enabled
  - Node integration disabled in renderer
  - Strict TypeScript IPC definitions
  - Electron Fuses configured (embedded asar validation, cookie encryption)

---

## 🚀 Installation (For End Users)

1. Navigate to the **[Releases](https://github.com/Nadeem-Elsayed/Hotel-Scheduler/releases)** tab on GitHub.
2. Download the latest installer executable: `hotel-scheduler-<version> Setup.exe`.
3. Double-click the `.exe` file. The application installs automatically and creates a desktop shortcut.
4. Launch **Hotel Scheduler** from your Start Menu or Desktop.

---

## 💻 Developer Setup

### Prerequisites
- **Node.js** >= 18.0.0
- **npm** >= 9.0.0
- **Windows Build Tools** (Python & Visual Studio C++ build tools, required if recompiling `sqlite3` from source)

### Installation

Clone the repository and install dependencies:
```bash
git clone https://github.com/Nadeem-Elsayed/Hotel-Scheduler.git
cd Hotel-Scheduler
npm install
```

### Available Scripts

| Command | Description |
| :--- | :--- |
| `npm start` | Launches the Electron app in development mode with Vite hot-reloading. |
| `npm run lint` | Runs ESLint across TypeScript and React files. |
| `npm run package` | Compiles Vite bundles and packages the app into the `out/` folder. |
| `npm run make` | Generates distribution installers (e.g., Squirrel Windows `.exe`). |
| `npm run publish` | Publishes distributables to configured release targets. |

### Packaging & Installers

To create the Windows installer:
```bash
npm run make
```
The distributables will be generated in:
```
out/make/squirrel.windows/x64/
  ├── hotel-scheduler-<version> Setup.exe
  ├── hotel_scheduler-<version>-full.nupkg
  └── RELEASES
```

---

## 📂 Data Storage & Directory Structure

The application operates locally without transmitting data over the network:

| Asset | Location |
| :--- | :--- |
| **Active SQLite Database** | `%APPDATA%\hotel-scheduler\hotel-scheduler.sqlite` |
| **Automated Backups** | `%USERPROFILE%\Documents\HotelScheduler_Backups\` |
| **Purge Archives** | `%USERPROFILE%\Documents\HotelScheduler_Backups\ARCHIVE_Pre-Purge_*.sqlite` |

---

## 🏷️ Creating a GitHub Release

Follow these steps to publish a new release:

1. **Verify Code & Run Linter:**
   ```bash
   npm run lint
   ```
2. **Build Distribution Installers:**
   ```bash
   npm run make
   ```
3. **Commit & Tag Version:**
   ```bash
   git add .
   git commit -m "Prepare 1.0.1 release"
   git tag -a v1.0.1 -m "Release v1.0.1"
   git push origin main --tags
   ```
4. **Publish on GitHub:**
   - Go to `https://github.com/Nadeem-Elsayed/Hotel-Scheduler/releases/new`.
   - Select tag `v1.0.1`.
   - Title: `Hotel Scheduler v1.0.1`.
   - Attach `out/make/squirrel.windows/x64/hotel-scheduler-1.0.1 Setup.exe`.
   - Click **Publish release**.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
Copyright (c) 2026 Nadeem Elsayed.
