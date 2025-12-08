import { useRoastingStore } from '../../store/useRoastingStore';
import { Input } from '../ui';

export function TemperatureGrid() {
    const { logs, updateLog, status } = useRoastingStore();

    const handleTempChange = (minute: number, value: string) => {
        const temp = value === '' ? null : Number(value);
        const currentLog = logs[minute];
        updateLog(minute, temp, currentLog.heatLevel);
    };

    const handleHeatChange = (minute: number, value: string) => {
        const heat = Number(value);
        const currentLog = logs[minute];
        updateLog(minute, currentLog.temperature, heat);
    };

    return (
        <div className="border rounded-md overflow-hidden">
            <table className="w-full text-sm text-left">
                <thead className="bg-muted text-muted-foreground font-medium">
                    <tr>
                        <th className="p-3 w-20">시간</th>
                        <th className="p-3">온도 (°C)</th>
                        <th className="p-3">RoR</th>
                        <th className="p-3">화력 (%)</th>
                        <th className="p-3">비고</th>
                    </tr>
                </thead>
                <tbody className="divide-y">
                    {logs.map((log) => {
                        const rorDisplay = log.ror !== null && log.ror > 0 ? log.ror : (log.ror !== null ? 'N/A' : '-');

                        return (
                            <tr key={log.time} className={`hover:bg-muted/50 ${status !== 'roasting' && log.time > 0 ? 'opacity-70' : ''}`}>
                                <td className="p-3 font-mono">{log.time.toString().padStart(2, '0')}:00</td>
                                <td className="p-2">
                                    <Input
                                        className="h-8 max-w-[100px]"
                                        type="number"
                                        value={log.temperature ?? ''}
                                        onChange={(e) => handleTempChange(log.time, e.target.value)}
                                        disabled={status === 'completed'}
                                        placeholder="-"
                                    />
                                </td>
                                <td className={`p-3 font-mono ${Number(rorDisplay) > 10 ? 'text-red-500' : 'text-blue-600'}`}>
                                    {rorDisplay}
                                </td>
                                <td className="p-2">
                                    <Input
                                        className="h-8 max-w-[100px]"
                                        type="number"
                                        value={log.heatLevel}
                                        onChange={(e) => handleHeatChange(log.time, e.target.value)}
                                        disabled={status === 'completed'}
                                    />
                                </td>
                                <td className="p-3 text-xs text-muted-foreground">
                                    {log.time === 0 ? '투입' : ''}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
