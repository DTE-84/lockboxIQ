import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Subscriptions from './pages/Subscriptions';
import Vault from './pages/Vault';
import Breakdown from './pages/Breakdown';

function App() {
  return (
    <Router basename="/subscriptionIQ">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="subscriptions" element={<Subscriptions />} />
          <Route path="vault" element={<Vault />} />
          <Route path="breakdown" element={<Breakdown />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
