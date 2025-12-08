import { useState } from 'react';
import { useRoastingStore } from '../../store/useRoastingStore';
import { Button, Input, Card, CardHeader, CardTitle, CardContent } from '../ui';
import type { EventType } from '../../types/domain';
import { Flag, Flame, Zap } from 'lucide-react';
import { formatTime } from '../../lib/utils';

export function EventLog() {
    const { status, currentHeat, addEvent, events, duration } = useRoastingStore();

    // State for active form
    const [activeEventType, setActiveEventType] = useState<EventType | null>(null);

    // Form States
    const [evtTemp, setEvtTemp] = useState<string>('');
    const [evtHeat, setEvtHeat] = useState<string>('');

    const handleOpenForm = (type: EventType) => {
        setActiveEventType(type);
        // Pre-fill
        setEvtTemp('');
        setEvtHeat(currentHeat?.toString() || '');
    };

    const handleSubmit = () => {
        if (!activeEventType) return;
        addEvent(activeEventType, Number(evtTemp), Number(evtHeat));
        setActiveEventType(null);
    };

    const renderForm = () => {
        if (!activeEventType) return null;

        let title = '';
        switch (activeEventType) {
            case 'TP': title = 'Turning Point (TP)'; break;
            case 'HEAT_CHANGE': title = '화력 조절'; break;
            case 'FIRST_CRACK': title = '1차 크랙'; break;
            case 'SECOND_CRACK': title = '2차 크랙'; break;
        }

        return (
            <div className="mt-4 p-4 border rounded-md bg-accent animate-in fade-in slide-in-from-top-2">
                <h4 className="font-bold mb-3 flex justify-between items-center">
                    {title} 입력
                    <span className="text-sm font-normal text-muted-foreground">현재 시간: {formatTime(duration)}</span>
                </h4>
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="space-y-1">
                        <label className="text-xs">온도 (°F)</label>
                        <Input
                            id="evtTempInput"
                            value={evtTemp}
                            onChange={e => setEvtTemp(e.target.value)}
                            type="number"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    if (activeEventType === 'TP') {
                                        handleSubmit();
                                    } else {
                                        document.getElementById('evtHeatInput')?.focus();
                                    }
                                }
                            }}
                            autoFocus
                        />
                    </div>
                    {activeEventType !== 'TP' && (
                        <div className="space-y-1">
                            <label className="text-xs">화력 (%)</label>
                            <Input
                                id="evtHeatInput"
                                value={evtHeat}
                                onChange={e => setEvtHeat(e.target.value)}
                                type="number"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleSubmit();
                                }}
                            />
                        </div>
                    )}
                </div>
                <div className="flex justify-end gap-2">
                    <Button variant="ghost" onClick={() => setActiveEventType(null)} size="sm">취소</Button>
                    <Button onClick={handleSubmit} size="sm">저장</Button>
                </div>
            </div>
        );
    };

    const getEventIcon = (type: EventType) => {
        switch (type) {
            case 'TP': return <Flag className="h-4 w-4 text-green-500" />;
            case 'HEAT_CHANGE': return <Flame className="h-4 w-4 text-orange-500" />;
            case 'FIRST_CRACK': return <Zap className="h-4 w-4 text-yellow-500" />;
            case 'SECOND_CRACK': return <Zap className="h-4 w-4 text-red-500" />;
        }
    };

    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle className="text-lg">주요 이벤트</CardTitle>
            </CardHeader>
            <CardContent>
                {/* Default Buttons */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mb-4">
                    <Button
                        variant="outline"
                        className="border-green-200 hover:bg-green-50 hover:text-green-700"
                        onClick={() => handleOpenForm('TP')}
                        disabled={status !== 'roasting'}
                    >
                        <Flag className="mr-2 h-4 w-4" /> TP
                    </Button>
                    <Button
                        variant="outline"
                        className="border-orange-200 hover:bg-orange-50 hover:text-orange-700"
                        onClick={() => handleOpenForm('HEAT_CHANGE')}
                        disabled={status !== 'roasting'}
                    >
                        <Flame className="mr-2 h-4 w-4" /> 화력조절
                    </Button>
                    <Button
                        variant="outline"
                        className="border-yellow-200 hover:bg-yellow-50 hover:text-yellow-700"
                        onClick={() => handleOpenForm('FIRST_CRACK')}
                        disabled={status !== 'roasting'}
                    >
                        <Zap className="mr-2 h-4 w-4" /> 1차 크랙
                    </Button>
                    <Button
                        variant="outline"
                        className="border-red-200 hover:bg-red-50 hover:text-red-700"
                        onClick={() => handleOpenForm('SECOND_CRACK')}
                        disabled={status !== 'roasting'}
                    >
                        <Zap className="mr-2 h-4 w-4" /> 2차 크랙
                    </Button>
                </div>

                {/* Active Input Form */}
                {renderForm()}

                {/* Event List */}
                <div className="mt-6 space-y-2">
                    <h5 className="text-sm font-medium text-muted-foreground mb-2">기록된 이벤트</h5>
                    {events.length === 0 && <p className="text-sm text-gray-400">아직 기록된 이벤트가 없습니다.</p>}
                    {events.map((evt) => (
                        <div key={evt.id} className="flex items-center justify-between p-2 border rounded-md text-sm">
                            <div className="flex items-center gap-2">
                                {getEventIcon(evt.type)}
                                <span className="font-bold">{evt.type}</span>
                            </div>
                            <div className="flex items-center gap-3 text-muted-foreground">
                                <span>{evt.time}</span>
                                <span>{evt.temperature}°F</span>
                                <span>{evt.heatLevel}%</span>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
