import { useState } from 'react';
import { useRoastingStore } from '../../store/useRoastingStore';
import { Button, Input, Card, CardHeader, CardTitle, CardContent } from '../ui';
import { Play, Square, Save, FileJson, FileSpreadsheet, CloudSun } from 'lucide-react';
import type { MachineType } from '../../types/domain';
import { exportToJSON, exportToCSV, importFromJSON } from '../../lib/export-utils';
import { PRODUCTS_BY_MACHINE } from '../../lib/constants';

export function RoastingControls() {
    const { status, startRoasting, stopRoasting, machine, roasterName, productName, setMetadata, restoreSession, settings, fetchWeather, weather } = useRoastingStore();

    // Local state for start inputs
    const [startTemp, setStartTemp] = useState<string>(settings.defaultStartTemp.toString());
    const [startHeat, setStartHeat] = useState<string>(settings.defaultStartHeat.toString());

    // Local state for end inputs
    const [endTemp, setEndTemp] = useState<string>('');
    const [endNotes, setEndNotes] = useState<string>('');

    if (status === 'completed') {
        return (
            <Card className="mb-6 bg-slate-50 dark:bg-slate-900 border-dashed">
                <CardContent className="p-6 flex flex-col gap-4 items-center">
                    <div className="text-green-600 font-bold flex items-center gap-2">
                        <Save className="h-5 w-5" />
                        로스팅 데이터가 저장되었습니다.
                    </div>
                    <div className="flex gap-2 flex-wrap justify-center">
                        <Button variant="outline" onClick={() => {
                            const state = useRoastingStore.getState();
                            // We need to reconstruct full session object. 
                            const session = {
                                id: state.sessionId!,
                                date: new Date(state.startTime!).toISOString(),
                                machine: state.machine,
                                roasterName: state.roasterName,
                                productName: state.productName,
                                beanWeight: state.beanWeight,
                                logs: state.logs,
                                events: state.events,
                                status: 'completed',
                                startTemperature: state.logs[0].temperature || 0,
                                startHeatLevel: state.logs[0].heatLevel,
                                endTime: undefined, // Need helper or store
                                endTemperature: undefined // Not in 'state' but in DB
                            } as any;
                            exportToJSON(session);
                        }}>
                            <FileJson className="mr-2 h-4 w-4" /> JSON 내보내기
                        </Button>
                        <Button variant="outline" onClick={() => {
                            const state = useRoastingStore.getState();
                            const session = {
                                id: state.sessionId!,
                                date: new Date(state.startTime!).toISOString(),
                                logs: state.logs,
                                events: state.events,
                            } as any;
                            exportToCSV(session);
                        }}>
                            <FileSpreadsheet className="mr-2 h-4 w-4" /> CSV 내보내기
                        </Button>
                        <div className="relative">
                            <input
                                type="file"
                                accept=".json"
                                className="hidden"
                                id="import-json-input"
                                onChange={async (e) => {
                                    const file = e.target.files?.[0];
                                    if (!file) return;
                                    try {
                                        const session = await importFromJSON(file);
                                        if (confirm(`${session.date}의 로스팅 기록을 불러오시겠습니까? 현재 작업 내용은 사라질 수 있습니다.`)) {
                                            restoreSession(session);
                                        }
                                    } catch (err) {
                                        alert('파일을 불러오는데 실패했습니다: ' + (err as Error).message);
                                    } finally {
                                        e.target.value = ''; // Reset
                                    }
                                }}
                            />
                            <Button variant="outline" onClick={() => document.getElementById('import-json-input')?.click()}>
                                <FileJson className="mr-2 h-4 w-4" /> 가져오기
                            </Button>
                        </div>
                        <Button onClick={() => useRoastingStore.getState().reset()}>
                            새로운 로스팅 시작하기
                        </Button>
                    </div>
                </CardContent>
            </Card>
        )
    }

    if (status === 'roasting') {
        return (
            <Card className="mb-6 border-red-200 dark:border-red-900">
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2 text-red-600">
                        <Square className="h-4 w-4 fill-current" /> 로스팅 종료
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex gap-4 items-end">
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                        <label htmlFor="endTemp" className="text-sm font-medium">배출 온도 (°F)</label>
                        <Input
                            id="endTemp"
                            type="number"
                            placeholder="예: 400"
                            value={endTemp}
                            onChange={(e) => setEndTemp(e.target.value)}
                        />
                    </div>
                    <div className="grid w-full gap-1.5 flex-1">
                        <label htmlFor="notes" className="text-sm font-medium">메모</label>
                        <Input
                            id="notes"
                            placeholder="특이사항 입력..."
                            value={endNotes}
                            onChange={(e) => setEndNotes(e.target.value)}
                        />
                    </div>
                    <Button
                        variant="destructive"
                        onClick={() => {
                            if (!endTemp) return alert('배출 온도를 입력해주세요.');
                            stopRoasting(Number(endTemp), endNotes);
                        }}
                    >
                        종료 및 저장
                    </Button>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="mb-6">
            <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                    <Play className="h-4 w-4 fill-current text-green-600" /> 로스팅 시작 설정
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    {/* Machine Select */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">로스팅 머신</label>
                        <select
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            value={machine}
                            onChange={(e) => {
                                const newMachine = e.target.value as MachineType;
                                const defaultProduct = PRODUCTS_BY_MACHINE[newMachine]?.[0] || '';
                                setMetadata({
                                    machine: newMachine,
                                    productName: defaultProduct
                                });
                            }}
                        >
                            <option value="G60">G60</option>
                            <option value="P25">P25</option>
                            <option value="L12">L12</option>
                        </select>
                    </div>

                    {/* Roaster Name */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">로스터 이름</label>
                        <Input
                            value={roasterName}
                            onChange={(e) => setMetadata({ roasterName: e.target.value })}
                            placeholder="이름 입력"
                        />
                    </div>

                    {/* Product Name */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">제품명</label>
                        <select
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            value={productName}
                            onChange={(e) => setMetadata({ productName: e.target.value })}
                        >
                            {PRODUCTS_BY_MACHINE[machine]?.map((prod) => (
                                <option key={prod} value={prod}>{prod}</option>
                            ))}
                        </select>
                    </div>

                    {/* BBP (Between Batch Protocol) - Replaces Bean Weight */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-black-600">BBP </label>
                        <Input
                            value={useRoastingStore.getState().bbp || ''}
                            onChange={(e) => setMetadata({ bbp: e.target.value })}
                            placeholder="예: 380F"
                        />
                    </div>
                </div>

                {/* Weather Information */}
                <div className="border-t pt-4 mt-4">
                    <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-semibold flex items-center gap-2">
                            <CloudSun className="h-4 w-4" /> 날씨 정보
                        </h4>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => fetchWeather()}
                            className="text-xs h-7"
                        >
                            📍 날씨 가져오기
                        </Button>
                    </div>
                    {weather ? (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm bg-slate-50 p-3 rounded-md">
                            <div>
                                <span className="text-slate-500 block text-xs">기온</span>
                                <span className="font-medium">{weather.temperature}°C</span>
                            </div>
                            <div>
                                <span className="text-slate-500 block text-xs">습도</span>
                                <span className="font-medium">{weather.humidity}%</span>
                            </div>
                            <div>
                                <span className="text-slate-500 block text-xs">풍속</span>
                                <span className="font-medium">{weather.windSpeed}m/s</span>
                            </div>
                            <div>
                                <span className="text-slate-500 block text-xs">풍향</span>
                                <span className="font-medium">{weather.windDirection}°</span>
                            </div>
                        </div>
                    ) : (
                        <div className="text-xs text-slate-400 text-center py-2 bg-slate-50 rounded-md">
                            버튼을 눌러 현재 날씨를 기록하세요.
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t pt-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-orange-600">투입 온도 (°F)</label>
                        <Input
                            id="startTempInput"
                            type="number"
                            value={startTemp}
                            onChange={(e) => setStartTemp(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    document.getElementById('startHeatInput')?.focus();
                                }
                            }}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-red-600">시작 화력 (%)</label>
                        <Input
                            id="startHeatInput"
                            type="number"
                            value={startHeat}
                            onChange={(e) => setStartHeat(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    if (!startTemp || !startHeat) return alert('투입 온도와 시작 화력을 입력해주세요.');
                                    startRoasting(Number(startTemp), Number(startHeat));
                                }
                            }}
                        />
                    </div>
                    <div className="flex items-end">
                        <Button
                            className="w-full bg-green-600 hover:bg-green-700 font-bold"
                            size="lg"
                            onClick={() => {
                                if (!startTemp || !startHeat) return alert('투입 온도와 시작 화력을 입력해주세요.');
                                startRoasting(Number(startTemp), Number(startHeat));
                            }}
                        >
                            <Play className="mr-2 h-4 w-4" /> 로스팅 시작
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
