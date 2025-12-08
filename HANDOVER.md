# Coffee Roasting Log System - Developer Handover

## 1. Project Overview
This project is a **client-side web application** for coffee roasters to record and assist their roasting process in real-time. It replaces manual paper logs with a digital interface that offers timers, temperature logging (Fahrenheit), RoR (Rate of Rise) calculation, and data visualization.

**Current Status**: MVP Refined & Enhanced.
- All core requirements from `PRD.md` are implemented.
- **Fahrenheit (€°F)** conversion complete.
- UX improvements regarding data entry and navigation implemented.

## 2. Tech Stack & Architecture
- **Framework**: React 19 + Vite 7 + TypeScript
- **Styling**: TailwindCSS 3.4 (Downgraded from v4 for compatibility) + Lucide React Icons
- **State Management**: Zustand (with Persist middleware for session recovery)
- **Database**: IndexedDB via Dexie.js (Local offline storage)
- **Visualization**: Recharts (Line charts for Temp & RoR)

### Directory Structure
```
src/
├── components/
│   ├── dashboard/       # Feature-specific widgets (Chart, Controls, EventLog, Grid, Status)
│   ├── layout/          # Main App Layout (Header, Container)
│   └── ui/              # Reusable atoms (Button, Input, Card)
├── db/                  # Dexie.js database configuration
├── lib/                 # Pure utility functions (Time format, RoR calculation, Export)
├── store/               # Zustand Global Store (useRoastingStore)
└── types/               # TypeScript Domain Interfaces
```

## 3. Implemented Features
| Feature | Status | Description |
| :--- | :--- | :--- |
| **Roasting Session** | ✅ Done | Start/Stop logic, Metadata inputs. **Temperature in °F**. |
| **Real-time Log** | ✅ Done | Minute-by-minute inputs. **Quick Input Bar** added for simpler entry. |
| **Event Logging** | ✅ Done | Log TP, Heat Change, Cracks. **Auto-syncs to Remarks**. TP Heat input hidden. |
| **Chart** | ✅ Done | Visualizes Temp curve and RoR in Fahrenheit. |
| **Persistence** | ✅ Done | Auto-saves to IndexedDB. Restores state on reload. |
| **Export** | ✅ Done | Download session as JSON (backup) or CSV (analysis). |
| **Status Panel** | ✅ Done | Shows Timer, Heat, and **Today's Batch Count**. |

### Recent Enhancements (v1.1)
- **Fahrenheit Conversion**: All units updated from Celsius to Fahrenheit (default start 400°F).
- **Quick Input**:
  - Located between Chart and Grid.
  - Auto-initializes at Minute 1.
  - **Enter key** auto-advances to the next minute.
- **Event Logic**:
  - Events (TP, Cracks) append text to the `note` field in the log.
  - "TP" event hides the heat input (preserves current heat).
  - Event input fields start empty (no auto-fill).
  - Enter key supports form submission.
- **Keyboard Navigation**: Added Enter key support in Controls and Event forms for faster workflow.

## 4. How to Run
### Development
```bash
npm run dev
# Server starts at http://localhost:5173
```

### Production Build
```bash
npm run build
# Outputs to /dist directory
```

## 5. Known Issues & Next Steps
These are the recommended tasks for the next developer:

1.  **Tailwind Configuration**:
    - Currently using Tailwind v3.4.17. Stick to v3 or carefully migrate to v4 if needed.

2.  **Import Logic**:
    - The "Export to JSON" feature is built (`src/lib/export-utils.ts`), but the **"Import JSON"** UI button and logic need to be implemented.

3.  **History View**:
    - The database (`src/db/db.ts`) saves all sessions.
    - **Task**: Create a `/history` page or a modal to list records from `db.sessions`.
    - Currently, only "Batch Count" in the status panel uses this historical data.

4.  **UX Polish**:
    - Consider adding a dedicated settings modal for adjusting default values (e.g., if user wants to change default Start Temp from 400).

5.  **Type Safety**:
    - `verbatimModuleSyntax` is enabled. Use `import type`.

## 6. Resources
- **PRD**: `PRD.md` (Root directory) - The source of truth for requirements.
- **Store**: `src/store/useRoastingStore.ts` - The brain of the application.
- **DB Schema**: `src/db/db.ts` - Schema definition.
