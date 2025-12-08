import { Layout } from './components/layout/Layout';
import { Dashboard } from './components/dashboard/Dashboard';
import { HistoryPage } from './components/history/HistoryPage';
import { useRoastingStore } from './store/useRoastingStore';

function App() {
  const view = useRoastingStore((state) => state.view);

  return (
    <Layout>
      {view === 'history' ? <HistoryPage /> : <Dashboard />}
    </Layout>
  );
}

export default App;
