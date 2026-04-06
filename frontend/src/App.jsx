import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './hooks/useAuth';
import { LoanProvider } from './context/LoanContext';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { LenderDashboard } from './pages/lender/LenderDashboard';
import { BorrowerDashboard } from './pages/borrower/BorrowerDashboard';
import { AnalystDashboard } from './pages/analyst/AnalystDashboard';
import './App.css';
import './styles/global.css';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          background: 'var(--light-bg)',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div className="spinner"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to={`/${user.role}`} replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <LoanProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route
              path="/admin"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/lender"
              element={
                <ProtectedRoute requiredRole="lender">
                  <LenderDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/borrower"
              element={
                <ProtectedRoute requiredRole="borrower">
                  <BorrowerDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/analyst"
              element={
                <ProtectedRoute requiredRole="analyst">
                  <AnalystDashboard />
                </ProtectedRoute>
              }
            />

            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
        </LoanProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
