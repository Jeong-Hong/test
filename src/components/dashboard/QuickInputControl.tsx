import { useState, useEffect, type KeyboardEvent } from 'react';
import { useRoastingStore } from '../../store/useRoastingStore';
import { Input, Card, CardContent, Button } from '../ui';
import { Thermometer, ChevronLeft, ChevronRight } from 'lucide-react';

export function QuickInputControl() {
    const { status, logs, updateLog, duration } = useRoastingStore();

    // Initialize target minute. default to 1 since 0 is usually 'Charge' temp.
    const [targetMinute, setTargetMinute] = useState(() => {
        const current = Math.floor(duration / 60);
        return Math.max(1, current);
    });

    const [localTemp, setLocalTemp] = useState('');

    // Update local temp when targetMinute changes or the underlying log changes (external edit)
    useEffect(() => {
        const val = logs[targetMinute]?.temperature;
        setLocalTemp(val !== null && val !== undefined ? String(val) : '');
    }, [targetMinute, logs]); // check logs dependency, might be heavy? logs[targetMinute] is better but logs updates ref

    // Optimization: Sync only when switching minutes or if the SPECIFIC log entry changes from outside
    // But honestly, for this app size, 'logs' dependency is likely fine. 
    // Let's rely on standard useEffect behavior.

    const handleChange = (val: string) => {
        setLocalTemp(val);
    };

    const handleCommit = (advance = false) => {
        if (localTemp !== '') {
            const currentLog = logs[targetMinute];
            updateLog(targetMinute, Number(localTemp), currentLog.heatLevel);
        }
        if (advance) {
            setTargetMinute((prev) => Math.min(prev + 1, 17));
        }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault(); // Prevent form submission behavior if any
            handleCommit(true);
            // Do NOT blur, keep focus for next entry
        }
    };

    // Manual navigation helper
    const nav = (delta: number) => {
        setTargetMinute(prev => Math.min(Math.max(0, prev + delta), 17));
    };

    if (status !== 'roasting') return null;

    return (
        <Card className="mb-6 border-blue-400 dark:border-blue-800 shadow-md">
            <CardContent className="p-4 flex items-center gap-4">
                <div className="flex items-center gap-2 text-blue-600 min-w-[150px]">
                    <Thermometer className="h-6 w-6" />
                    <div className="flex items-center gap-1">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => nav(-1)}
                            disabled={targetMinute <= 0}
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <span className="font-bold text-lg whitespace-nowrap min-w-[2ch] text-center">
                            {targetMinute}
                        </span>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => nav(1)}
                            disabled={targetMinute >= 17}
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                        <span className="font-bold text-lg whitespace-nowrap">
                            분 온도
                        </span>
                    </div>
                </div>

                <div className="flex-1">
                    <Input
                        className="text-lg h-12 font-mono"
                        placeholder={`${targetMinute}분 온도 (°F)`}
                        type="number"
                        value={localTemp}
                        onChange={(e) => handleChange(e.target.value)}
                        onBlur={() => handleCommit(false)}
                        onKeyDown={handleKeyDown}
                        autoFocus
                    />
                </div>
            </CardContent>
        </Card>
    );
}


