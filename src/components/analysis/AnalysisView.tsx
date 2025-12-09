import { useState, useEffect } from "react";
import { useRoastingStore } from "../../store/useRoastingStore";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
// import { Button } from "../ui/button";
import { db } from "../../db/db";
import type { RoastingSession } from "../../types/domain";
import { ComparisonChart } from "./ComparisonChart";
import { EventDiffTable } from "./EventDiffTable";
import { LogComparisonTable } from "./LogComparisonTable";

// Helper for date formatting
const formatDate = (dateStr: string) => {
    return new Intl.DateTimeFormat('ko-KR', {
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    }).format(new Date(dateStr));
};

export function AnalysisView() {
    const { analysisSessions, setAnalysisSessions } = useRoastingStore();
    const [history, setHistory] = useState<RoastingSession[]>([]);
    const [sessionA, setSessionA] = useState<RoastingSession | null>(null);
    const [sessionB, setSessionB] = useState<RoastingSession | null>(null);

    // Load available sessions
    useEffect(() => {
        const loadHistory = async () => {
            const sessions = await db.sessions.orderBy('date').reverse().toArray();
            setHistory(sessions);

            // Load selected sessions from store if available
            if (analysisSessions.sessionA) {
                const sA = sessions.find(s => s.id === analysisSessions.sessionA);
                if (sA) setSessionA(sA);
            }
            if (analysisSessions.sessionB) {
                const sB = sessions.find(s => s.id === analysisSessions.sessionB);
                if (sB) setSessionB(sB);
            }
        };
        loadHistory();
    }, [analysisSessions]);

    const handleSelectA = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setAnalysisSessions(e.target.value || null, analysisSessions.sessionB);
    };

    const handleSelectB = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setAnalysisSessions(analysisSessions.sessionA, e.target.value || null);
    };

    // Prepare Comparison Data
    // We want to overlay Temperature Log.
    // X-Axis is time (0, 1, 2...)
    // Series: Temp A, Temp B

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                <h2 className="text-2xl font-bold">세션 분석</h2>
                <div className="flex gap-4 w-full md:w-auto">
                    <div className="w-full md:w-64">
                        <label className="text-sm font-medium mb-1 block">세션 A (기준)</label>
                        <select
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                            value={analysisSessions.sessionA || ""}
                            onChange={handleSelectA}
                        >
                            <option value="">세션 A 선택</option>
                            {history.map(session => (
                                <option key={session.id} value={session.id}>
                                    {formatDate(session.date)} - {session.productName || '제품명 없음'} (User: {session.roasterName || '-'})
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="w-full md:w-64">
                        <label className="text-sm font-medium mb-1 block">세션 B (비교)</label>
                        <select
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                            value={analysisSessions.sessionB || ""}
                            onChange={handleSelectB}
                        >
                            <option value="">세션 B 선택</option>
                            {history.map(session => (
                                <option key={session.id} value={session.id}>
                                    {formatDate(session.date)} - {session.productName || '제품명 없음'} (User: {session.roasterName || '-'})
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>온도 비교 (Temperature Comparison)</CardTitle>
                </CardHeader>
                <CardContent className="h-[400px]">
                    {sessionA || sessionB ? (
                        <ComparisonChart sessionA={sessionA} sessionB={sessionB} />
                    ) : (
                        <div className="flex h-full items-center justify-center text-muted-foreground">
                            분석할 세션을 하나 이상 선택하세요
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Event Diff Table */}
            <EventDiffTable sessionA={sessionA} sessionB={sessionB} />

            {/* Log Comparison Table */}
            <LogComparisonTable sessionA={sessionA} sessionB={sessionB} />
        </div>
    );
}
