import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import type { RoastingSession, RoastingEvent } from "../../types/domain";

interface EventDiffTableProps {
    sessionA: RoastingSession | null;
    sessionB: RoastingSession | null;
}

export function EventDiffTable({ sessionA, sessionB }: EventDiffTableProps) {
    if (!sessionA && !sessionB) return null;

    // Helper to find matching event
    const getEvent = (session: RoastingSession | null, type: string) => {
        return session?.events.find(e => e.type === type);
    };

    const renderEventRow = (label: string, type: string) => {
        const evtA = getEvent(sessionA, type);
        const evtB = getEvent(sessionB, type);

        if (!evtA && !evtB) return null;

        return (
            <tr className="border-b">
                <td className="py-2 px-4 font-medium">{label}</td>
                <td className="py-2 px-4 text-center">
                    {evtA ? `${evtA.time} (${evtA.temperature}°F)` : '-'}
                </td>
                <td className="py-2 px-4 text-center">
                    {evtB ? `${evtB.time} (${evtB.temperature}°F)` : '-'}
                </td>
                <td className="py-2 px-4 text-center text-muted-foreground">
                    {/* Simple Time Diff Calculation could go here if we parsed time strings */}
                    {evtA && evtB ? (
                        Math.abs(evtA.temperature - evtB.temperature) > 0
                            ? `${(evtB.temperature - evtA.temperature).toFixed(1)}°F`
                            : '-'
                    ) : '-'}
                </td>
            </tr>
        );
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Detailed Comparison</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b bg-muted/50">
                                <th className="py-2 px-4 text-left">Metric</th>
                                <th className="py-2 px-4 text-center w-1/3">
                                    {sessionA ? sessionA.productName || 'Session A' : 'Session A'}
                                </th>
                                <th className="py-2 px-4 text-center w-1/3">
                                    {sessionB ? sessionB.productName || 'Session B' : 'Session B'}
                                </th>
                                <th className="py-2 px-4 text-center">Diff (B-A)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* General Metrics */}
                            <tr className="border-b">
                                <td className="py-2 px-4 font-medium">Machine</td>
                                <td className="py-2 px-4 text-center">{sessionA?.machine || '-'}</td>
                                <td className="py-2 px-4 text-center">{sessionB?.machine || '-'}</td>
                                <td className="py-2 px-4 text-center">-</td>
                            </tr>
                            <tr className="border-b">
                                <td className="py-2 px-4 font-medium">Roast Time</td>
                                <td className="py-2 px-4 text-center">{sessionA?.endTime || '-'}</td>
                                <td className="py-2 px-4 text-center">{sessionB?.endTime || '-'}</td>
                                <td className="py-2 px-4 text-center">-</td>
                            </tr>
                            <tr className="border-b">
                                <td className="py-2 px-4 font-medium">End Temp</td>
                                <td className="py-2 px-4 text-center">{sessionA?.endTemperature ? `${sessionA.endTemperature}°F` : '-'}</td>
                                <td className="py-2 px-4 text-center">{sessionB?.endTemperature ? `${sessionB.endTemperature}°F` : '-'}</td>
                                <td className="py-2 px-4 text-center">
                                    {sessionA?.endTemperature && sessionB?.endTemperature
                                        ? `${(sessionB.endTemperature - sessionA.endTemperature).toFixed(1)}°F`
                                        : '-'}
                                </td>
                            </tr>
                            <tr className="border-b">
                                <td className="py-2 px-4 font-medium">Bean Weight</td>
                                <td className="py-2 px-4 text-center">{sessionA?.beanWeight ? `${sessionA.beanWeight}g` : '-'}</td>
                                <td className="py-2 px-4 text-center">{sessionB?.beanWeight ? `${sessionB.beanWeight}g` : '-'}</td>
                                <td className="py-2 px-4 text-center">
                                    {sessionA?.beanWeight && sessionB?.beanWeight
                                        ? `${sessionB.beanWeight - sessionA.beanWeight}g`
                                        : '-'}
                                </td>
                            </tr>

                            {/* Event Comparison */}
                            {renderEventRow('Turning Point (TP)', 'TP')}
                            {renderEventRow('First Crack', 'FIRST_CRACK')}
                            {renderEventRow('Second Crack', 'SECOND_CRACK')}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    );
}
