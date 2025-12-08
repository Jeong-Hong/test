// @Brief: 지난 로스팅 세션과 현재 세션을 비교하는 위젯 (Upgrade)
// 1. 비교 대상 세션 선택 기능 (Recent 20)
// 2. 현재 vs 비교 대상의 제품명 표시
// 3. Grid View UI 개선 (배경색 제거, Mininal design)

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useRoastingStore } from "../../store/useRoastingStore";
import { getRecentSessions } from "../../db/db";
import type { RoastingSession } from "../../types/domain";
import { RefreshCw } from "lucide-react";
// import { Button } from "../ui/button"; // Button not used, removed import to fix lint if unused. Wait, RefreshCw uses Button? 
// No, previously Button was imported. Checking usage...
// <Button variant="ghost" ... > <RefreshCw ... /> </Button> 
// Ah, it IS used. Re-adding.
import { Button } from "../ui/button";

export function LastSessionWidget() {
    const { logs, status, duration, productName } = useRoastingStore();
    const [recentSessions, setRecentSessions] = useState<RoastingSession[]>([]);
    const [selectedSessionId, setSelectedSessionId] = useState<string>("");
    const [loading, setLoading] = useState(true);

    // Load recent sessions on mount
    useEffect(() => {
        const loadSessions = async () => {
            setLoading(true);
            try {
                const sessions = await getRecentSessions(20);
                if (sessions.length > 0) {
                    setRecentSessions(sessions);
                    setSelectedSessionId(sessions[0].id); // Default to latest
                }
            } catch (error) {
                console.error("Failed to load sessions:", error);
            } finally {
                setLoading(false);
            }
        };
        loadSessions();
    }, []);

    const targetSession = recentSessions.find(s => s.id === selectedSessionId);

    const timeSlots = Array.from({ length: 18 }, (_, i) => i);
    const isTimerRunning = status === 'roasting';
    const currentMinutes = Math.floor(duration / 60);

    if (loading) {
        return (
            <Card>
                <CardHeader className="py-3">
                    <CardTitle className="text-sm font-medium">비교 분석</CardTitle>
                </CardHeader>
                <CardContent className="py-3 text-sm text-muted-foreground">로딩 중...</CardContent>
            </Card>
        );
    }

    if (recentSessions.length === 0) {
        return (
            <Card>
                <CardHeader className="py-3">
                    <CardTitle className="text-sm font-medium">비교 분석</CardTitle>
                </CardHeader>
                <CardContent className="py-3 text-sm text-muted-foreground">이전 로스팅 기록이 없습니다.</CardContent>
            </Card>
        );
    }

    return (
        <Card className="max-h-[400px] flex flex-col border shadow-sm">
            <CardHeader className="py-3 border-b bg-card">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                        비교 분석
                    </CardTitle>
                    <select
                        className="text-xs h-7 rounded border border-input bg-transparent px-2 py-1 shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        value={selectedSessionId}
                        onChange={(e) => setSelectedSessionId(e.target.value)}
                    >
                        {recentSessions.map(session => (
                            <option key={session.id} value={session.id}>
                                {new Date(session.date).toLocaleDateString()} - {session.productName || '무제'}
                            </option>
                        ))}
                    </select>
                </div>
                {targetSession && (
                    <div className="text-xs text-muted-foreground mt-2 flex justify-between px-1">
                        <span>현재: <strong>{productName || '새 로스팅'}</strong></span>
                        <span>비교: <strong>{targetSession.productName || '무제'}</strong></span>
                    </div>
                )}
            </CardHeader>
            <CardContent className="p-0 flex-1 overflow-auto">
                <table className="w-full text-xs text-center border-collapse">
                    <thead className="bg-muted/50 text-muted-foreground sticky top-0 z-10">
                        <tr>
                            <th className="py-2 px-1 font-medium border-b w-[20%]">시간</th>
                            <th className="py-2 px-1 font-medium border-b w-[25%] bg-blue-50/50 dark:bg-blue-900/10">Ref</th>
                            <th className="py-2 px-1 font-medium border-b w-[25%] bg-orange-50/50 dark:bg-orange-900/10">Cur</th>
                            <th className="py-2 px-1 font-medium border-b w-[30%]">Diff</th>
                        </tr>
                    </thead>
                    <tbody>
                        {timeSlots.map((minute) => {
                            const currentLog = logs[minute];
                            const lastLog = targetSession?.logs[minute];

                            const curTemp = currentLog?.temperature;
                            const lastTemp = lastLog?.temperature;

                            let diffStr = '-';
                            let diffClass = "text-muted-foreground";

                            if (curTemp != null && lastTemp != null) {
                                const diffVal = curTemp - lastTemp;
                                const absDiff = Math.abs(diffVal).toFixed(1);
                                if (diffVal > 0) {
                                    diffStr = `+${absDiff}`;
                                    diffClass = "text-red-600 font-bold";
                                } else if (diffVal < 0) {
                                    diffStr = `-${absDiff}`;
                                    diffClass = "text-blue-600 font-bold";
                                } else {
                                    diffStr = "0.0";
                                    diffClass = "text-gray-400";
                                }
                            }

                            const isCurrentRow = isTimerRunning && currentMinutes === minute;

                            return (
                                <tr key={minute} className={`border-b last:border-0 hover:bg-muted/30 transition-colors ${isCurrentRow ? 'bg-yellow-50 dark:bg-yellow-900/20' : ''}`}>
                                    <td className="py-2 px-1 font-medium text-muted-foreground">
                                        {minute.toString().padStart(2, '0')}:00
                                    </td>
                                    <td className="py-2 px-1 text-muted-foreground bg-blue-50/10 dark:bg-blue-900/5">
                                        {lastTemp != null ? lastTemp.toFixed(1) : '-'}
                                    </td>
                                    <td className={`py-2 px-1 font-medium bg-orange-50/10 dark:bg-orange-900/5 ${curTemp != null ? 'text-foreground' : 'text-muted-foreground/30'}`}>
                                        {curTemp != null ? curTemp.toFixed(1) : '-'}
                                    </td>
                                    <td className={`py-2 px-1 ${diffClass}`}>
                                        {diffStr}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </CardContent>
        </Card>
    );
}
