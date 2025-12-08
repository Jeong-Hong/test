import { StatusPanel } from './StatusPanel';
import { RoastingControls } from './RoastingControls';
import { TemperatureGrid } from './TemperatureGrid';
import { EventLog } from './EventLog';
import { RoastingChart } from './RoastingChart';
import { QuickInputControl } from './QuickInputControl';
import { useRoastingStore } from '../../store/useRoastingStore';

export function Dashboard() {
    const status = useRoastingStore((state) => state.status);

    return (
        <div className="space-y-6">
            {/* Top: Status & Controls */}
            <StatusPanel />
            <RoastingControls />

            {/* Middle: Visualization & Events */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <RoastingChart />
                </div>
                <div>
                    <EventLog />
                </div>
            </div>

            {/* Bottom: Data Entry Grid */}
            <div>
                {status === 'roasting' && <QuickInputControl />}
                <h3 className="text-lg font-bold mb-4">상세 온도 기록</h3>
                <TemperatureGrid />
            </div>
        </div>
    );
}
