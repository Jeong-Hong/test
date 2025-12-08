import { Layout } from './components/layout/Layout';
import { StatusPanel } from './components/dashboard/StatusPanel';
import { RoastingControls } from './components/dashboard/RoastingControls';
import { TemperatureGrid } from './components/dashboard/TemperatureGrid';
import { EventLog } from './components/dashboard/EventLog';
import { RoastingChart } from './components/dashboard/RoastingChart';

function App() {
  return (
    <Layout>
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
          <h3 className="text-lg font-bold mb-4">상세 온도 기록</h3>
          <TemperatureGrid />
        </div>
      </div>
    </Layout>
  );
}

export default App;
