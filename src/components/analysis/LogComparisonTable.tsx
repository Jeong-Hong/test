import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import type { RoastingSession } from "../../types/domain";

interface LogComparisonTableProps {
    sessionA: RoastingSession | null;
    sessionB: RoastingSession | null;
}

export function LogComparisonTable({ sessionA, sessionB }: LogComparisonTableProps) {
    if (!sessionA && !sessionB) return null;

    // Create array of minutes 0-17
    const minutes = Array.from({ length: 18 }, (_, i) => i);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Temperature Log Comparison</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-center">
                        <thead>
                            <tr className="border-b bg-muted/50">
                                <th className="py-2 px-2 text-left">Time</th>
                                <th className="py-2 px-2 text-orange-600">Temp A</th>
                                <th className="py-2 px-2 text-orange-400">RoR A</th>
                                <th className="py-2 px-2 text-slate-600">Temp B</th>
                                <th className="py-2 px-2 text-slate-400">RoR B</th>
                                <th className="py-2 px-2 font-bold">Δ Temp (B-A)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {minutes.map((min) => {
                                const logA = sessionA?.logs.find(l => l.time === min);
                                const logB = sessionB?.logs.find(l => l.time === min);

                                // Skip empty rows if both sessions have no data for this minute
                                // But usually we want to show the scale. Let's filter out only if completely empty at the end?
                                // Actually, standard practice is to show up to the max time.
                                // Let's show all minutes where at least one session has data or it's within standard range.
                                // If both are null, it's just empty cells.
                                if (!logA?.temperature && !logB?.temperature && min > 15) return null;

                                const tempA = logA?.temperature ?? null;
                                const tempB = logB?.temperature ?? null;
                                const rorA = logA?.ror ?? null;
                                const rorB = logB?.ror ?? null;

                                const diff = (tempA !== null && tempB !== null)
                                    ? (tempB - tempA).toFixed(1)
                                    : '-';

                                return (
                                    <tr key={min} className="border-b hover:bg-muted/20">
                                        <td className="py-2 px-2 text-left font-medium">{min}m</td>
                                        <td className="py-2 px-2">{tempA !== null ? `${tempA}°F` : '-'}</td>
                                        <td className="py-2 px-2 text-muted-foreground">{rorA !== null ? rorA : '-'}</td>
                                        <td className="py-2 px-2">{tempB !== null ? `${tempB}°F` : '-'}</td>
                                        <td className="py-2 px-2 text-muted-foreground">{rorB !== null ? rorB : '-'}</td>
                                        <td className={`py-2 px-2 font-medium ${diff !== '-' && Number(diff) > 0 ? 'text-red-500' :
                                                diff !== '-' && Number(diff) < 0 ? 'text-blue-500' : ''
                                            }`}>
                                            {diff !== '-' ? `${Number(diff) > 0 ? '+' : ''}${diff}` : '-'}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    );
}
