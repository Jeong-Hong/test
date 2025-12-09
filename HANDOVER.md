# Coffee Roasting Log System - Developer Handover

## 1. Project Overview
This project is a **client-side web application** for coffee roasters to record and assist their roasting process in real-time. It replaces manual paper logs with a digital interface that offers timers, temperature logging (Fahrenheit), RoR (Rate of Rise) calculation, and data visualization.

**Current Status**: **v1.6 - Localization & UX Improvements.**
- Core Logging & Dashboard: Complete.
- History & Management: Complete.
- **Analysis Comparison**: Complete.
- **Data Safety (Auto-Backup)**: Complete.

## 2. Tech Stack & Architecture
- **Framework**: React 19 + Vite 7 + TypeScript
- **Styling**: TailwindCSS 3.4 + Lucide React Icons
- **State Management**: Zustand (Persist middleware)
- **Database**: IndexedDB via Dexie.js (Offline storage)
- **Charts**: Recharts (Multi-series support)
- **Local Integration**: **File System Access API** (For auto-backup)

### Directory Structure
```
src/
├── components/
│   ├── analysis/        # [NEW] Analysis Tab (Chart, DiffTable, LogTable)
│   ├── dashboard/       # Dashboard widgets
│   ├── history/         # History View
│   ├── layout/          # Layout & Navigation
│   ├── settings/        # [NEW] Backup & App Settings
│   └── ui/              # Reusable atoms
├── db/                  # Dexie.js (RoastingSession + Settings Schema)
├── lib/                 # Utilities (backup-service.ts added)
├── store/               # Global Store (useRoastingStore)
└── types/               # Domain Models
```

## 3. Implemented Features
| Feature | Status | Description |
| :--- | :--- | :--- |
| **Roasting Session** | ✅ Done | Start/Stop logic. **Temp in °F**. **BBP Field** added. |
| **Real-time Log** | ✅ Done | 0–17 min logging. **Smart Product Select** by machine. |
| **Event Logging** | ✅ Done | TP, Cracks, Heat Change. **Korean Labels**. Compact UI. |
| **Persistence** | ✅ Done | **1. IndexedDB**: Auto-save locally.<br>**2. Auto-Backup (NEW)**: Saves JSON to user's local disk automatically on completion. |
| **Dashboard** | ✅ Done | Status Widgets, Timer, Last Session Reference, Real-time Chart. **Fully Localized**. |
| **History** | ✅ Done | Session list, JSON export/restore, Detailed review. Localized UI. |
| **Analysis Tab** | ✅ Done | **[NEW]** Compare two sessions side-by-side.<br>- **Comparison Chart**: Overlay Temp/RoR curves.<br>- **Event Diff**: Compare Stats (End Temp, Time, Weight, Event Timings).<br>- **Log Table**: Minute-by-minute numerical comparison (Δ Temp). |
| **Settings** | ✅ Done | Default Start Temp/Heat + **Local Backup Folder Connection**. |

## 4. Key Implementation Details

### A. Analysis Tab (`AnalysisView.tsx`)
- **Dual Session Selection**: Uses native `<select>` or custom UI to pick Session A (Base) and Session B (Compare).
- **Visualization**: `ComparisonChart` overlays two datasets using distinct color schemes (Orange vs Slate) for clarity.
- **Data Drill-down**:
    - `EventDiffTable`: High-level metrics (Duration, End Temp) & crucial event milestones.
    - `LogComparisonTable`: Granular minute-by-minute difference (Delta) highlighting deviations.

### B. Auto-Backup (`backup-service.ts`)
- **Problem**: Browser storage (IndexedDB) can be cleared by user settings or "Incognito" mode, leading to data loss.
- **Solution**: Implemented **File System Access API**.
    - User grants permission to a specific local folder **once**.
    - The handle is stored in IndexedDB (`db.settings`).
    - `stopRoasting` triggers `saveSessionToBackup`, writing a standard JSON file directly to the user's disk.
    - **Note**: Browsers may require permission re-verification after a full restart.

## 5. Known Issues & Next Steps
1.  **Mobile Component**:
    - The Analysis Tab tables are optimized for Desktop. Mobile view needs specific CSS adjustments if phone usage is prioritized.
2.  **Linting**:
    - Minor unused imports or variable warnings in `backup-service.ts` or `Layout.tsx` (mostly cleanup done, but verify if changing strictness).
3.  **Chart Tooltips**:
    - Comparison chart tooltips can be dense. Consider custom formatting to separate Session A/B data more clearly.

## 6. How to Run
```bash
npm run dev   # Start dev server
npm run build # Production build
```
