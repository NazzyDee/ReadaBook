import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { StreamPage } from './pages/StreamPage';
import { LoginPage } from './pages/LoginPage';
import { useAuth } from './lib/AuthContext';
import './index.css';

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <StreamPage />
            </ProtectedRoute>
          } 
        />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </Router>
  );
}

export default App;
