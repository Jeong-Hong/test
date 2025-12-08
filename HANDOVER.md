# Coffee Roasting Log System - Developer Handover

## 1. Project Overview
This project is a **client-side web application** for coffee roasters to record and assist their roasting process in real-time. It replaces manual paper logs with a digital interface that offers timers, temperature logging (Fahrenheit), RoR (Rate of Rise) calculation, and data visualization.

**Current Status**: Phase 2 In Progress.
- Core MVP features complete.
- **JSON Import & History View** implemented.
- **UX Improvements** pending.

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
│   ├── dashboard/       # Dashboard widgets (Chart, Controls, EventLog, Grid, Status)
│   ├── history/         # History View Components
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
| **JSON Import** | ✅ Done | Restore sessions from JSON backup files. |
| **History Page** | ✅ Done | List past sessions, view details, and restore to dashboard. |

### Recent Enhancements (v1.2)
- **History System**: 
  - Store-based routing (`view` state) to switch between Dashboard and History.
  - List view of past sessions with restore functionality.
- **JSON Import**: 
  - Restore full session state from backup files.
- **Dashboard Refactor**: 
  - Separated dashboard components from `App.tsx` to `Dashboard.tsx`.

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
    - ✅ **Completed**: `importFromJSON` utility and UI button implemented.

3.  **History View**:
    - ✅ **Completed**: `/history` view implemented using State-based routing (no react-router).

4.  **UX Polish**:
    - Consider adding a dedicated settings modal for adjusting default values (e.g., if user wants to change default Start Temp from 400).

5.  **Type Safety**:
    - `verbatimModuleSyntax` is enabled. Use `import type`.

6.  **Build Environment**:
    - ⚠️ **Issue**: Local PowerShell execution policies (`PSSecurityException`) may prevent `npm run build`. 
    - **Workaround**: Verify with `npm run dev` or adjust local policies.

## 6. Resources
- **PRD**: `PRD.md` (Root directory) - The source of truth for requirements.
- **Store**: `src/store/useRoastingStore.ts` - The brain of the application.
- **DB Schema**: `src/db/db.ts` - Schema definition.
