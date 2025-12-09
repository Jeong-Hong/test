import Dexie, { type EntityTable } from 'dexie';
import type { RoastingSession } from '../types/domain';

const db = new Dexie('RoastingDatabase') as Dexie & {
    sessions: EntityTable<
        RoastingSession,
        'id' // primary key "id" (for the typings only)
    >;
    settings: EntityTable<{ key: string; value: any }, 'key'>;
};

// Schema definition
db.version(1).stores({
    sessions: 'id, date, machine, productName, status', // indexes
    settings: 'key' // key-value store for app settings (including file handles)
});

export { db };

// Helper to save session
export async function saveSessionToDB(session: RoastingSession) {
    try {
        await db.sessions.put(session);
        console.log(`Session ${session.id} saved to IndexedDB`);
    } catch (error) {
        console.error('Failed to save session to IndexedDB:', error);
    }
}

export async function getAllSessions() {
    return await db.sessions.orderBy('date').reverse().toArray();
}

export async function getLastSession() {
    return await db.sessions.orderBy('date').reverse().first();
}

export async function getRecentSessions(limit = 20) {
    return await db.sessions.orderBy('date').reverse().limit(limit).toArray();
}

export async function getTodaySessionCount() {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
    return await db.sessions.where('date').aboveOrEqual(startOfDay).count();
}
