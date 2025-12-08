# Coffee Roasting Log System - Developer Handover

## 1. Project Overview
This project is a **client-side web application** for coffee roasters to record and assist their roasting process in real-time. It replaces manual paper logs with a digital interface that offers timers, temperature logging, RoR (Rate of Rise) calculation, and data visualization.

**Current Status**: MVP (Minimum Viable Product) Complete.
- All core requirements from `PRD.md` are implemented.
- The app builds successfully and runs locally.

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
| **Roasting Session** | ✅ Done | Start/Stop logic, Metadata inputs (Machine, Bean, Weight). |
| **Real-time Log** | ✅ Done | Minute-by-minute inputs for Temp/Heat. Auto-calculates RoR. |
| **Event Logging** | ✅ Done | Log TP, Heat Change, Cracks with one click. |
| **Chart** | ✅ Done | Visualizes Temp curve and RoR. Event markers included. |
| **Persistence** | ✅ Done | Auto-saves to IndexedDB. Restores state on reload via Zustand. |
| **Export** | ✅ Done | Download session as JSON (backup) or CSV (analysis). |

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
    - Currently using Tailwind v3.4.17 because the v4 installation caused PostCSS conflict errors. Stick to v3 or carefully migrate config if v4 is strictly needed.

2.  **Import Logic**:
    - The "Export to JSON" feature is built (`src/lib/export-utils.ts`), but the **"Import JSON"** UI button and logic need to be implemented.

3.  **History View**:
    - The database (`src/db/db.ts`) saves all sessions, but there is currently no UI to **browse past sessions**. The current UI only shows the *active* or *just completed* session.
    - **Task**: Create a `/history` page or a modal to list records from `db.sessions`.

4.  **UX Polish**:
    - The `TemperatureGrid` allows editing past minutes, but validation could be stricter (e.g., prevent negative RoR logic overrides if needed).

5.  **Type Safety**:
    - `verbatimModuleSyntax` is enabled in `tsconfig`. Ensure you use `import type { ... }` when importing interfaces.

## 6. Resources
- **PRD**: `PRD.md` (Root directory) - The source of truth for requirements.
- **Store**: `src/store/useRoastingStore.ts` - The brain of the application.
- **DB Schema**: `src/db/db.ts` - Schema definition.
