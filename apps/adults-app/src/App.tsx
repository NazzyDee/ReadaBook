import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import type { ReactElement } from 'react';
import { BrowsePage } from './pages/BrowsePage';
import { StreamPage } from './pages/StreamPage';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { Sidebar } from './components/Sidebar';
import { useAuth } from './lib/AuthContext';
import './index.css';

const ProtectedRoute = ({ children }: { children: ReactElement }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Layout wrapper including the Twitch-like sidebar
const AppLayout = ({ children }: { children: ReactElement }) => {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="app-main-content">
        {children}
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        
        {/* Protected app routes sharing sidebar layout */}
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <AppLayout>
                <BrowsePage />
              </AppLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/stream/:streamerId" 
          element={
            <ProtectedRoute>
              <AppLayout>
                <StreamPage />
              </AppLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <AppLayout>
                <DashboardPage />
              </AppLayout>
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
