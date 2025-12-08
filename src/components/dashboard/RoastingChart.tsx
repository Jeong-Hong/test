import { useMemo } from 'react';
import { useRoastingStore } from '../../store/useRoastingStore';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../ui';

export function RoastingChart() {
    const { logs, events } = useRoastingStore();

    const data = useMemo(() => {
        return logs.map(log => ({
            time: log.time,
            temperature: log.temperature,
            ror: log.ror,
        }));
    }, [logs]);

    // Transform events for visualization?
    // We can just plot them as ReferenceDots if we map time to X-axis
    // The Chart X-axis is minutes (0, 1, 2...). 
    // Events have exact time (e.g. 2:30 -> 2.5 min).
    // If we want exact positioning, XAxis needs to be linear type.
    // But our logs are discrete minutes.
    // For Phase 1, fitting events to the nearest log or using "time" (seconds/60) on X-axis is better.
    // Let's stick to categorical "minute" for logs, but use a linear X-axis so we can plot events accurately?
    // If XAxis is 'number' we can do it.

    return (
        <Card className="h-[400px] w-full">
            <CardHeader className="pb-2">
                <CardTitle className="text-lg">로스팅 프로파일 (Roasting Profile)</CardTitle>
            </CardHeader>
            <CardContent className="h-[340px] p-0 md:p-4">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                        <XAxis
                            dataKey="time"
                            type="number"
                            domain={[0, 17]}
                            tickCount={18}
                            unit="분"
                        />
                        <YAxis
                            yAxisId="left"
                            domain={['auto', 'auto']}
                            label={{ value: '온도 (°C)', angle: -90, position: 'insideLeft' }}
                        />
                        <YAxis
                            yAxisId="right"
                            orientation="right"
                            domain={[0, 20]}
                            label={{ value: 'RoR', angle: 90, position: 'insideRight' }}
                        />
                        <Tooltip />
                        <Legend />
                        <Line
                            yAxisId="left"
                            type="monotone"
                            dataKey="temperature"
                            stroke="#f97316" // Orange
                            strokeWidth={3}
                            name="온도"
                            dot={{ r: 4 }}
                            activeDot={{ r: 6 }}
                            connectNulls
                        />
                        <Line
                            yAxisId="right"
                            type="monotone"
                            dataKey="ror"
                            stroke="#3b82f6" // Blue
                            strokeDasharray="5 5"
                            name="RoR"
                            connectNulls
                        />

                        {/* Event Markers */}
                        {events.map((evt) => {
                            // Convert timestamp (seconds) to minutes
                            const min = evt.timestamp / 60;
                            let color = 'gray';
                            if (evt.type === 'TP') color = 'green';
                            if (evt.type === 'HEAT_CHANGE') color = 'orange';
                            if (evt.type.includes('CRACK')) color = 'red';

                            return (
                                <ReferenceLine
                                    key={evt.id}
                                    x={min}
                                    stroke={color}
                                    label={{ value: evt.type, position: 'top', fill: color, fontSize: 10 }}
                                    yAxisId="left"
                                />
                            );
                        })}
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
