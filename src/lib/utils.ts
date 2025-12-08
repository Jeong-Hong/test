import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merges class names with Tailwind conflict resolution
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 * Formats seconds into MM:SS string
 */
export function formatTime(seconds: number): string {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

/**
 * Calculates RoR (Rate of Rise)
 * RoR = (Current Temp - Previous Temp) / Time Diff (usually 1 min)
 * Returns null if invalid or previous temp missing
 */
export function calculateRoR(currentTemp: number, prevTemp: number | null): number | null {
    if (prevTemp === null) return null;
    // Assuming 1 minute interval for the main grid
    const ror = currentTemp - prevTemp;
    return Number(ror.toFixed(1)); // 1 decimal place
}
