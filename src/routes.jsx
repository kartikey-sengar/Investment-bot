import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import ProfileSetup from './pages/ProfileSetup.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Goals from './pages/Goals.jsx';
import Expenses from './pages/Expenses.jsx';
import AIAdvisor from './pages/AIAdvisor.jsx';
import Simulator from './pages/Simulator.jsx';
import NotFound from './pages/NotFound.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import ProtectedRoute from './components/common/ProtectedRoute.jsx';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/setup" element={<ProfileSetup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/goals" element={<Goals />} />
        <Route path="/expenses" element={<Expenses />} />
        <Route path="/advisor" element={<AIAdvisor />} />
        <Route path="/simulator" element={<Simulator />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
