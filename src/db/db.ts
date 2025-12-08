import Dexie, { type EntityTable } from 'dexie';
import type { RoastingSession } from '../types/domain';

const db = new Dexie('RoastingDatabase') as Dexie & {
    sessions: EntityTable<
        RoastingSession,
        'id' // primary key "id" (for the typings only)
    >;
};

// Schema definition
db.version(1).stores({
    sessions: 'id, date, machine, productName, status' // indexes
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
