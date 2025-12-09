
// ComparisonChart.tsx
import { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { RoastingSession } from '../../types/domain';

interface ComparisonChartProps {
    sessionA: RoastingSession | null;
    sessionB: RoastingSession | null;
}

export function ComparisonChart({ sessionA, sessionB }: ComparisonChartProps) {
    const data = useMemo(() => {
        // Create a merged dataset for 0-17 minutes
        const merged = [];
        for (let i = 0; i < 18; i++) {
            const logA = sessionA?.logs[i];
            const logB = sessionB?.logs[i];

            merged.push({
                time: i,
                tempA: logA?.temperature ?? null,
                rorA: logA?.ror ?? null,
                tempB: logB?.temperature ?? null,
                rorB: logB?.ror ?? null,
            });
        }
        return merged;
    }, [sessionA, sessionB]);

    return (
        <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis
                    dataKey="time"
                    type="number"
                    domain={[0, 17]}
                    tickCount={18}
                    unit="m"
                />
                <YAxis
                    yAxisId="left"
                    domain={['auto', 'auto']}
                    label={{ value: 'Temp (°F)', angle: -90, position: 'insideLeft' }}
                />
                <YAxis
                    yAxisId="right"
                    orientation="right"
                    domain={[0, 20]}
                    label={{ value: 'RoR', angle: 90, position: 'insideRight' }}
                />
                <Tooltip
                    labelFormatter={(label) => `${label} min`}
                    contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', fontSize: '12px' }}
                />
                <Legend />

                {/* Session A Lines (Primary) - Orange */}
                <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="tempA"
                    stroke="#f97316" // Orange-500
                    strokeWidth={3}
                    name={sessionA ? `Temp (A)` : 'Temp A'}
                    dot={{ r: 3 }}
                    activeDot={{ r: 5 }}
                    connectNulls
                />
                <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="rorA"
                    stroke="#fbbf24" // Amber-400
                    strokeDasharray="3 3"
                    name={sessionA ? `RoR (A)` : 'RoR A'}
                    connectNulls
                    dot={false}
                />

                {/* Session B Lines (Comparison) - Blue/Gray */}
                <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="tempB"
                    stroke="#64748b" // Slate-500
                    strokeWidth={2}
                    name={sessionB ? `Temp (B)` : 'Temp B'}
                    dot={{ r: 2 }}
                    activeDot={{ r: 4 }}
                    connectNulls
                    strokeOpacity={0.7}
                />
                <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="rorB"
                    stroke="#94a3b8" // Slate-400
                    strokeDasharray="3 3"
                    name={sessionB ? `RoR (B)` : 'RoR B'}
                    connectNulls
                    dot={false}
                    strokeOpacity={0.7}
                />
            </LineChart>
        </ResponsiveContainer>
    );
}
