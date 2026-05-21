import { Routes, Route, Navigate } from 'react-router-dom';
import useAuthStore from './store/authStore';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import CreateTripPage from './pages/CreateTripPage';
import TripViewPage from './pages/TripViewPage';
import JoinTripPage from './pages/JoinTripPage';
const ProtectedRoute = ({ children }) => {
  const { user } = useAuthStore();
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-gray-900">
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        <Route path="/" element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        } />
        
        <Route path="/create-trip" element={
          <ProtectedRoute>
            <CreateTripPage />
          </ProtectedRoute>
        } />
        <Route path="/trip/:id" element={
  <ProtectedRoute>
    <TripViewPage />
  </ProtectedRoute>
} />
      <Route path="/trip/:id/join" element={<ProtectedRoute><JoinTripPage /></ProtectedRoute>} />
      </Routes>
    </div>
  );
}

export default App;