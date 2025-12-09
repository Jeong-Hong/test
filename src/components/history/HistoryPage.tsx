import { useEffect, useState } from 'react';
import { useRoastingStore } from '../../store/useRoastingStore';
import { getAllSessions, db } from '../../db/db';
import type { RoastingSession } from '../../types/domain';
import { Card, CardContent, Button } from '../ui';
import { Calendar, RefreshCw, FileJson } from 'lucide-react';
import { exportToJSON } from '../../lib/export-utils';

export function HistoryPage() {
    const [sessions, setSessions] = useState<RoastingSession[]>([]);
    const [loading, setLoading] = useState(true);
    const { restoreSession, setView } = useRoastingStore();

    useEffect(() => {
        loadHistory();
    }, []);

    const loadHistory = async () => {
        setLoading(true);
        try {
            const data = await getAllSessions();
            setSessions(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleRestore = (session: RoastingSession) => {
        if (confirm('이 세션을 불러와서 대시보드에서 보시겠습니까? 현재 진행 중인 내용은 사라질 수 있습니다.')) {
            restoreSession(session);
            setView('dashboard');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                    <Calendar className="h-6 w-6" /> 로스팅 이력
                </h2>
                <Button variant="outline" size="sm" onClick={loadHistory}>
                    <RefreshCw className="h-4 w-4 mr-2" /> 새로고침
                </Button>
            </div>

            {loading ? (
                <div className="text-center py-10">데이터를 불러오는 중...</div>
            ) : sessions.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground bg-slate-50 dark:bg-slate-900 rounded-lg">
                    저장된 로스팅 기록이 없습니다.
                </div>
            ) : (
                <div className="grid gap-4">
                    {sessions.map((session) => (
                        <Card key={session.id} className="hover:bg-accent/50 transition-colors">
                            <CardContent className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="space-y-1">
                                    <div className="font-semibold text-lg">
                                        {session.productName || '제품명 미입력'}
                                    </div>
                                    <div className="text-sm text-muted-foreground flex gap-3 text-slate-500">
                                        <span>{new Date(session.date).toLocaleString()}</span>
                                        <span>•</span>
                                        <span>{session.machine}</span>
                                        <span>•</span>
                                        <span>{session.roasterName || '알 수 없음'}</span>
                                    </div>
                                    <div className="text-sm font-mono mt-1">
                                        {session.endTime} 소요 / 최종 {session.endTemperature}°F / {session.status}
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="secondary" size="sm" onClick={() => exportToJSON(session)}>
                                        <FileJson className="h-4 w-4 mr-1" /> JSON
                                    </Button>
                                    <Button size="sm" onClick={() => handleRestore(session)}>
                                        불러오기
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
