# Release Notes - Hotel Scheduler v1.0.2

### Highlights & Features

#### Guest Operations & Front-Desk Ledger
* **Operations Hub:** Rapid toggle between Today's and Yesterday's guest lists.
* **Instant Filtering & Search:** Search guests by name or room number, with multi-status filters (Expected, Confirmed, Checked In, Checked Out).
* **Financial Ledger:** Real-time balance calculations, payment channel tracking (Expedia Collect, Booking.com, Website, Walk-in), and settlement method monitoring (Cash, EVC Machine, Pending).
* **Metric Calculations:** Real-time Average Daily Rate (ADR) and stay duration tracking.

#### Staff Roster & Bi-Weekly Payroll
* **14-Day Pay Period Engine:** Seamless navigation through 14-day bi-weekly pay cycles anchored to customizable start dates.
* **Bi-Weekly Hours Breakdown:** Automatic aggregation of per-employee hours worked for each pay cycle.
* **24-Hour Timeline Swimlanes:** Detailed daily roster preventing scheduling overlap and visual clutter.
* **Staff & Custom Role Management:** Employee directory with customizable role labels and hex color pickers.

#### Reporting & Integrations
* **Google Calendar Export:** Single-click CSV export compatible with Google Calendar and Outlook.
* **Yearly Payroll Export:** Comprehensive yearly CSV reports formatted for accountants and tax filing.
* **Bulk Data Importer:** Import historical CSV records for guests and shifts with auto-column mapping and employee provisioning.

#### Data Protection & Reliability
* **Embedded SQLite Database:** Offline-first local data storage.
* **Daily Auto-Backups:** Startup database snapshotting to Documents/HotelScheduler_Backups with a rolling 15-backup FIFO retention policy.
* **One-Click Restore & Purge:** Restore backups with automatic app relaunch and purge records older than 1 year with pre-purge archival.

#### Distribution & Packaging
* **Branded Windows Installer:** Bundled setup executable with application icon (logo.ico).
* **CI/CD Automation:** Added GitHub Actions workflow for automatic builds on release tags.

---

### Release Assets
* **Windows Installer:** `hotel-scheduler-1.0.2 Setup.exe`
* **Squirrel Package:** `hotel_scheduler-1.0.2-full.nupkg`
* **Release Manifest:** `RELEASES`
