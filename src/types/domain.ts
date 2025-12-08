export type RoastingStatus = 'idle' | 'roasting' | 'completed';

export type MachineType = 'G60' | 'P25' | 'L12';

export interface TemperatureRecord {
    time: number; // Minute (0-17)
    temperature: number | null; // Nullable if not yet entered
    ror: number | null; // Calculated on the fly or stored? Stored is better for history.
    heatLevel: number;
    note?: string;
}

export type EventType = 'TP' | 'HEAT_CHANGE' | 'FIRST_CRACK' | 'SECOND_CRACK';

export interface RoastingEvent {
    id: string; // UUID
    type: EventType;
    time: string; // "MM:SS" format for display, or seconds? Let's store seconds for calculation, string for UI?
    // PRD says "Time: Auto Input".
    // Let's store timestamp (seconds from start).
    timestamp: number;
    temperature: number;
    heatLevel: number;
    notes?: string;
}

export interface RoastingSession {
    id: string;
    date: string; // ISO String

    // Metadata
    machine: MachineType;
    roasterName?: string;
    productName?: string;
    beanWeight?: number;

    // Start Data
    startTemperature: number;
    startHeatLevel: number;

    // End Data
    endTemperature?: number;
    endTime?: string; // "MM:SS"
    coolingTime?: string; // Optional

    // Logs
    logs: TemperatureRecord[];

    // Events
    events: RoastingEvent[];

    // Notes
    notes?: string;

    status: RoastingStatus;
}
