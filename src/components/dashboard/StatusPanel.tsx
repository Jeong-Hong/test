import { useEffect, useState } from 'react';
import { useRoastingStore } from '../../store/useRoastingStore';
import { Card, CardContent } from '../ui';
import { formatTime } from '../../lib/utils';
import { getTodaySessionCount } from '../../db/db';
import { Clock, Flame, Activity, Hash, CloudSun, Wind, Droplets, MapPin } from 'lucide-react';

export function StatusPanel() {
    const { status, duration, currentHeat, tick, fetchWeather, weather } = useRoastingStore();
    const [batchCount, setBatchCount] = useState<number>(0);

    // Weather Auto-fetch (1 Hour Interval)
    useEffect(() => {
        fetchWeather();
        const interval = setInterval(() => {
            fetchWeather();
        }, 3600000); // 1 hour (3,600,000 ms)

        return () => clearInterval(interval);
    }, [fetchWeather]);

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

                {/* Weather Info (Compact) */}
                {weather && (
                    <div className="flex items-center gap-3 border-l pl-4 hidden xl:flex">
                        <div className="flex flex-col items-end">
                            <div className="text-[10px] text-muted-foreground flex items-center gap-1">
                                <Clock className="h-3 w-3" /> {weather.description}
                            </div>
                            <div className="flex gap-3 text-sm mt-0.5">
                                <div className="flex items-center gap-1" title="기온">
                                    <CloudSun className="h-4 w-4 text-orange-500" />
                                    <span className="font-bold">{weather.temperature}°C</span>
                                </div>
                                <div className="flex items-center gap-1" title="습도">
                                    <Droplets className="h-4 w-4 text-blue-500" />
                                    <span className="font-medium">{weather.humidity}%</span>
                                </div>
                                <div className="flex items-center gap-1" title="풍향/풍속">
                                    <Wind className="h-4 w-4 text-gray-500" />
                                    <span className="font-medium">{weather.windSpeed}m/s</span>
                                    <span className="text-xs text-gray-400">({weather.windDirection}°)</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
