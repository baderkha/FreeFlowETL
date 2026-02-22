import { Navigate, Route, Routes } from 'react-router-dom';
import AppShell from './components/AppShell';
import ConnectionsPage from './pages/ConnectionsPage';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import LogoutPage from './pages/LogoutPage';
import SettingsPage from './pages/SettingsPage';

const AUTH_KEY = 'ff_auth_user';

const isAuthenticated = () => Boolean(localStorage.getItem(AUTH_KEY));

function ProtectedRoute({ children }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function PublicOnlyRoute({ children }) {
  if (isAuthenticated()) {
    return <Navigate to="/" replace />;
  }
  return children;
}

function App() {
  return (
    <Routes>
      <Route
        path="/login"
        element={(
          <PublicOnlyRoute>
            <LoginPage />
          </PublicOnlyRoute>
        )}
      />
      <Route path="/logout" element={<LogoutPage />} />

      <Route
        path="/"
        element={(
          <ProtectedRoute>
            <AppShell />
          </ProtectedRoute>
        )}
      >
        <Route index element={<DashboardPage />} />
        <Route path="connections" element={<ConnectionsPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>

      <Route path="*" element={<Navigate to={isAuthenticated() ? '/' : '/login'} replace />} />
    </Routes>
  );
}

export default App;
