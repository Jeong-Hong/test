import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { RoastingSession, TemperatureRecord, RoastingEvent, MachineType, RoastingStatus } from '../types/domain';
import { calculateRoR } from '../lib/utils';
import { saveSessionToDB } from '../db/db';

interface RoastingState {
    // Session Data
    sessionId: string | null;
    status: RoastingStatus;
    startTime: number | null; // Timestamp
    duration: number; // Seconds

    // Settings
    settings: {
        defaultStartTemp: number;
        defaultStartHeat: number;
    };

    // Navigation View State
    view: 'dashboard' | 'history' | 'analysis';
    setView: (view: 'dashboard' | 'history' | 'analysis') => void;

    // Analysis State
    analysisSessions: { sessionA: string | null; sessionB: string | null };

    // Metadata Inputs
    machine: MachineType;
    roasterName: string;
    productName: string;
    beanWeight: number;
    bbp: string;

    // Real-time Data
    currentTemp: number; // Display only? Or derived?
    currentHeat: number;

    // Logs (0-17 mins)
    logs: TemperatureRecord[];

    // Events
    events: RoastingEvent[];

    // Actions
    setMetadata: (data: Partial<Pick<RoastingState, 'machine' | 'roasterName' | 'productName' | 'beanWeight' | 'bbp'>>) => void;
    updateSettings: (settings: Partial<RoastingState['settings']>) => void;
    setAnalysisSessions: (sessionA: string | null, sessionB: string | null) => void;
    startRoasting: (startTemp: number, startHeat: number) => void;
    stopRoasting: (endTemp: number, notes?: string) => Promise<void>;
    tick: () => void;
    updateLog: (minute: number, temp: number | null, heat: number) => void;
    addEvent: (type: RoastingEvent['type'], temp: number, heat: number, notes?: string) => void;
    restoreSession: (session: RoastingSession) => void;
    reset: () => void;
}

const INITIAL_LOGS: TemperatureRecord[] = Array.from({ length: 18 }, (_, i) => ({
    time: i,
    temperature: null,
    ror: null,
    heatLevel: 0,
    note: ''
}));

// Helper for format time
function formatTimeSeconds(seconds: number): string {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export const useRoastingStore = create<RoastingState>()(
    persist(
        (set, get) => ({
            sessionId: null,
            status: 'idle',
            startTime: null,
            duration: 0,

            settings: {
                defaultStartTemp: 400,
                defaultStartHeat: 80
            },

            view: 'dashboard',
            setView: (view) => set({ view }),

            analysisSessions: { sessionA: null, sessionB: null },
            setAnalysisSessions: (sessionA, sessionB) => set({ analysisSessions: { sessionA, sessionB } }),

            machine: 'G60',
            roasterName: '',
            productName: '',
            beanWeight: 0,
            bbp: '',

            currentTemp: 0,
            currentHeat: 0,

            logs: INITIAL_LOGS,
            events: [],

            setMetadata: (data) => set((state) => ({ ...state, ...data })),

            updateSettings: (newSettings) => set((state) => ({
                settings: { ...state.settings, ...newSettings }
            })),

            startRoasting: (startTemp, startHeat) => {
                const id = crypto.randomUUID();
                const logs = [...INITIAL_LOGS];
                // Set first log (0 min)
                logs[0] = { ...logs[0], temperature: startTemp, heatLevel: startHeat, note: '투입' };

                set({
                    sessionId: id,
                    status: 'roasting',
                    startTime: Date.now(),
                    duration: 0,
                    currentTemp: startTemp,
                    currentHeat: startHeat,
                    logs,
                    events: []
                });
            },

            stopRoasting: async (endTemp, notes) => {
                const state = get();
                const session: RoastingSession = {
                    id: state.sessionId!,
                    date: new Date(state.startTime!).toISOString(),
                    machine: state.machine,
                    roasterName: state.roasterName,
                    productName: state.productName,
                    beanWeight: state.beanWeight,
                    bbp: state.bbp,
                    startTemperature: state.logs[0].temperature || 0,
                    startHeatLevel: state.logs[0].heatLevel,
                    endTemperature: endTemp,
                    endTime: formatTimeSeconds(state.duration),
                    coolingTime: undefined,
                    status: 'completed',
                    logs: state.logs,
                    events: state.events,
                    notes
                };

                await saveSessionToDB(session);

                // Auto-Backup
                import('../lib/backup-service').then(async ({ saveSessionToBackup }) => {
                    const result = await saveSessionToBackup(session);
                    if (result.success) {
                        console.log(result.message);
                        // Optional: Toast notification here if we had a toast system
                    } else {
                        console.warn(result.message);
                    }
                });

                set({ status: 'completed' });
            },

            tick: () => set((state) => {
                if (state.status !== 'roasting') return state;
                return { duration: state.duration + 1 };
            }),

            updateLog: (minute, temp, heat) => {
                set((state) => {
                    const newLogs = [...state.logs];
                    const prevLog = minute > 0 ? newLogs[minute - 1] : null;

                    let ror = null;
                    if (temp !== null && prevLog && prevLog.temperature !== null) {
                        ror = calculateRoR(temp, prevLog.temperature);
                    }

                    newLogs[minute] = {
                        ...newLogs[minute],
                        temperature: temp,
                        ror,
                        heatLevel: heat
                    };

                    return { logs: newLogs, currentTemp: temp ?? state.currentTemp, currentHeat: heat };
                });
            },

            addEvent: (type, temp, heat, notes) => {
                set((state) => {
                    const newEvent: RoastingEvent = {
                        id: crypto.randomUUID(),
                        type,
                        time: formatTimeSeconds(state.duration),
                        timestamp: state.duration,
                        temperature: temp,
                        heatLevel: heat,
                        notes
                    };

                    // SYNC: Add event type to the corresponding minute log
                    const logIndex = Math.min(Math.floor(state.duration / 60), 17);
                    const newLogs = [...state.logs];
                    const existingNote = newLogs[logIndex].note || '';

                    newLogs[logIndex] = {
                        ...newLogs[logIndex],
                        note: existingNote ? `${existingNote}, ${type}` : type
                    };

                    return {
                        events: [...state.events, newEvent],
                        logs: newLogs
                    };
                });
            },

            restoreSession: (session: RoastingSession) => {
                // Parse duration from endTime string (MM:SS) -> seconds
                const [m, s] = (session.endTime || "00:00").split(':').map(Number);
                const durationSeconds = (m * 60) + s;

                set({
                    sessionId: session.id,
                    status: session.status || 'completed',
                    startTime: new Date(session.date).getTime(),
                    duration: durationSeconds,

                    machine: session.machine,
                    roasterName: session.roasterName || '',
                    productName: session.productName || '',
                    beanWeight: session.beanWeight || 0,

                    // Recover last know state or start state
                    currentTemp: session.endTemperature || session.startTemperature,
                    currentHeat: session.logs[session.logs.length - 1]?.heatLevel || session.startHeatLevel,

                    logs: session.logs,
                    events: session.events
                });
            },

            reset: () => set({
                status: 'idle',
                sessionId: null,
                duration: 0,
                startTime: null,
                logs: INITIAL_LOGS,
                events: []
            })
        }),
        {
            name: 'roasting-session-storage',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                view: state.view, // Persist view state too
                analysisSessions: state.analysisSessions, // Persist analysis sessions
                settings: state.settings,
                sessionId: state.sessionId,
                status: state.status,
                startTime: state.startTime,
                duration: state.duration,
                machine: state.machine,
                roasterName: state.roasterName,
                productName: state.productName,
                beanWeight: state.beanWeight,
                bbp: state.bbp,
                logs: state.logs,
                events: state.events
            }),
        }
    )
);
