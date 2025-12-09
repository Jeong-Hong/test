import { db } from '../db/db';
import type { RoastingSession } from '../types/domain';

// Define the type for the FileSystemHandle (native type, but may need polyfill types if TS complains)
// We assume modern browser environment.

const SETTINGS_KEY = 'backup_directory_handle';

export async function pickBackupDirectory(): Promise<boolean> {
    try {
        // @ts-ignore - window.showDirectoryPicker is experimental but supported in Chrome/Edge
        const handle = await window.showDirectoryPicker();

        // Save handle to IndexedDB
        // IndexedDB can store StructuredCloneable objects, which FileSystemHandle is.
        await db.table('settings').put({ key: SETTINGS_KEY, value: handle });
        return true;
    } catch (error) {
        // User cancelled or not supported
        console.error('Directory picker failed:', error);
        return false;
    }
}

export async function getBackupDirectoryHandle(): Promise<FileSystemDirectoryHandle | null> {
    const record = await db.table('settings').get(SETTINGS_KEY);
    return record?.value || null;
}

export async function verifyPermission(handle: FileSystemDirectoryHandle, readWrite: boolean): Promise<boolean> {
    const options: FileSystemHandlePermissionDescriptor = { mode: readWrite ? 'readwrite' : 'read' };

    // Check if permission was already granted
    if ((await handle.queryPermission(options)) === 'granted') {
        return true;
    }

    // Request permission
    if ((await handle.requestPermission(options)) === 'granted') {
        return true;
    }

    return false;
}

export async function saveSessionToBackup(session: RoastingSession): Promise<{ success: boolean; message: string }> {
    try {
        const handle = await getBackupDirectoryHandle();

        if (!handle) {
            return { success: false, message: 'No backup folder configured' };
        }

        // Verify permission before writing make sure we can write
        const hasPermission = await verifyPermission(handle, true);
        if (!hasPermission) {
            return { success: false, message: 'Permission denied to backup folder' };
        }

        // Create filename: 2024-12-09_12-30_ProductName.json
        const dateStr = session.date.split('T')[0]; // YYYY-MM-DD
        const timeStr = new Date(session.date).toTimeString().split(' ')[0].replace(/:/g, '-').slice(0, 5); // 12-30
        const safeName = (session.productName || 'Untitled').replace(/[^a-z0-9가-힣]/gi, '_'); // Sanitize
        const filename = `ROAST_${dateStr}_${timeStr}_${safeName}.json`;

        // Write file
        const fileHandle = await handle.getFileHandle(filename, { create: true });
        const writable = await fileHandle.createWritable();

        // Use existing export logic to get formatted string
        // We need to refactor logic slightly or just replicate JSON stringify here
        const content = JSON.stringify(session, null, 2);

        await writable.write(content);
        await writable.close();

        return { success: true, message: `Backup saved: ${filename}` };

    } catch (error) {
        console.error('Auto-backup failed:', error);
        return { success: false, message: `Backup failed: ${error instanceof Error ? error.message : 'Unknown error'}` };
    }
}
