import { Layout } from './components/layout/Layout';
import { Dashboard } from './components/dashboard/Dashboard';
import { HistoryPage } from './components/history/HistoryPage';
import { AnalysisView } from './components/analysis/AnalysisView';
import { useRoastingStore } from './store/useRoastingStore';

function App() {
  const view = useRoastingStore((state) => state.view);

  return (
    <Layout>
      {view === 'history' && <HistoryPage />}
      {view === 'analysis' && <AnalysisView />}
      {view === 'dashboard' && <Dashboard />}
    </Layout>
  );
}

export default App;
