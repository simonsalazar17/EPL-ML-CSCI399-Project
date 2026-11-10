import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Predictor from './pages/Predictor';
import Performance from './pages/Performance';
import Methodology from './pages/Methodology';
import Players from './pages/Players';
import { Link } from 'react-router-dom';

export default function App() {
  return <Layout><Routes>
    <Route path="/" element={<Dashboard />} />
    <Route path="/players" element={<Players />} />
    <Route path="/predict" element={<Predictor />} />
    <Route path="/performance" element={<Performance />} />
    <Route path="/methodology" element={<Methodology />} />
    <Route path="/about" element={<Navigate to="/methodology" replace />} />
    <Route path="*" element={<section className="panel"><h1>Page not found</h1><Link to="/">Return to dashboard →</Link></section>} />
  </Routes></Layout>;
}
