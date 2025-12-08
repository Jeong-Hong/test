import { useEffect, useState } from 'react';
import { useRoastingStore } from '../../store/useRoastingStore';
import { Card, CardContent } from '../ui';
import { formatTime } from '../../lib/utils';
import { getTodaySessionCount } from '../../db/db';
import { Clock, Flame, Activity, Hash } from 'lucide-react';

export function StatusPanel() {
    const { status, duration, currentHeat, tick } = useRoastingStore();
    const [batchCount, setBatchCount] = useState<number>(0);

    // Fetch batch count on mount
    useEffect(() => {
        getTodaySessionCount().then(count => setBatchCount(count));
    }, []);

    // Timer Effect
    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;
        if (status === 'roasting') {
            interval = setInterval(() => {
                tick();
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [status, tick]);

    const getStatusColor = () => {
        switch (status) {
            case 'idle': return 'text-gray-500';
            case 'roasting': return 'text-green-600 animate-pulse';
            case 'completed': return 'text-blue-600';
            default: return 'text-gray-500';
        }
    };

    const getStatusText = () => {
        switch (status) {
            case 'idle': return '대기 중 (Idle)';
            case 'roasting': return '로스팅 진행 중 (Roasting)';
            case 'completed': return '로스팅 완료 (Completed)';
            default: return '알 수 없음';
        }
    };

    return (
        <Card className="mb-6">
            <CardContent className="p-4 flex flex-wrap items-center justify-between gap-4">
                {/* Status */}
                <div className="flex items-center gap-2 min-w-[200px]">
                    <Activity className={`h-5 w-5 ${getStatusColor()}`} />
                    <span className={`font-bold text-lg ${getStatusColor()}`}>
                        {getStatusText()}
                    </span>
                </div>

                {/* Timer */}
                <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    <span className="text-2xl font-mono font-bold tracking-wider">
                        {formatTime(duration)}
                    </span>
                </div>

                {/* Batch Count (Replaces Temp) */}
                <div className="flex items-center gap-2">
                    <Hash className="h-5 w-5 text-purple-500" />
                    <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground">배치</span>
                        <span className="text-xl font-bold">#{status === 'roasting' ? batchCount + 1 : batchCount}</span>
                    </div>
                </div>

                {/* Current Heat */}
                <div className="flex items-center gap-2">
                    <Flame className="h-5 w-5 text-red-500" />
                    <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground">현재 화력</span>
                        <span className="text-xl font-bold">{currentHeat}%</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
