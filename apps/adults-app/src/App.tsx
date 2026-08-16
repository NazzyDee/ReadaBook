import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import type { ReactElement } from 'react';
import { BrowsePage } from './pages/BrowsePage';
import { FollowingPage } from './pages/FollowingPage';
import { CategoryDetailPage } from './pages/CategoryDetailPage';
import { DropsPage } from './pages/DropsPage';
import { StreamPage } from './pages/StreamPage';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { VideoProducerPage } from './pages/VideoProducerPage';
import { ChannelRolesPage } from './pages/ChannelRolesPage';
import { EmoteStudioPage } from './pages/EmoteStudioPage';
import { WatchPage } from './pages/WatchPage';
import { BookClubsPage } from './pages/BookClubsPage';
import { ClipsPage } from './pages/ClipsPage';
import { SquadStreamPage } from './pages/SquadStreamPage';
import { ChannelPage } from './pages/ChannelPage';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { WhisperDock } from './components/WhisperDock';
import { ShortcutsModal } from './components/ShortcutsModal';
import { useAuth } from './lib/AuthContext';
import { ThemeProvider } from './lib/ThemeContext';
import { PointsProvider } from './lib/PointsContext';
import './index.css';

const ProtectedRoute = ({ children }: { children: ReactElement }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Layout wrapper including the global header, Twitch-like sidebar, Whispers dock, and Shortcuts listener
const AppLayout = ({ children }: { children: ReactElement }) => {
  const [showShortcuts, setShowShortcuts] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // If pressing '?' and not typing inside an input/textarea
      if (
        e.key === '?' &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA'
      ) {
        e.preventDefault();
        setShowShortcuts(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="app-container-root">
      <Header />
      <div className="app-layout">
        <Sidebar />
        <div className="app-main-content">
          {children}
        </div>
      </div>
      <WhisperDock />
      {showShortcuts && <ShortcutsModal onClose={() => setShowShortcuts(false)} />}
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <PointsProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            
            {/* Browse / Home Directory */}
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

            {/* Twitch Following Directory */}
            <Route 
              path="/following" 
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <FollowingPage />
                  </AppLayout>
                </ProtectedRoute>
              } 
            />

            {/* Twitch Drops & Community Rewards */}
            <Route 
              path="/drops" 
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <DropsPage />
                  </AppLayout>
                </ProtectedRoute>
              } 
            />

            {/* Twitch Category Detail Hub */}
            <Route 
              path="/directory/category/:genre" 
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <CategoryDetailPage />
                  </AppLayout>
                </ProtectedRoute>
              } 
            />

            {/* Clips Directory */}
            <Route 
              path="/clips" 
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <ClipsPage />
                  </AppLayout>
                </ProtectedRoute>
              } 
            />

            {/* Squad Streams (Multi-Stream) */}
            <Route 
              path="/squads" 
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <SquadStreamPage />
                  </AppLayout>
                </ProtectedRoute>
              } 
            />

            {/* Channel Profile Page */}
            <Route 
              path="/channel/:channelId" 
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <ChannelPage />
                  </AppLayout>
                </ProtectedRoute>
              } 
            />
            
            {/* Live Watching Room */}
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
            
            {/* Creator Studio Dashboard */}
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

            {/* Creator Analytics Hub */}
            <Route 
              path="/analytics" 
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <AnalyticsPage />
                  </AppLayout>
                </ProtectedRoute>
              } 
            />

            {/* Video Producer / VOD Manager */}
            <Route 
              path="/producer" 
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <VideoProducerPage />
                  </AppLayout>
                </ProtectedRoute>
              } 
            />

            {/* Channel Roles & Permissions */}
            <Route 
              path="/roles" 
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <ChannelRolesPage />
                  </AppLayout>
                </ProtectedRoute>
              } 
            />

            {/* Emotes & Badges Studio */}
            <Route 
              path="/emotes" 
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <EmoteStudioPage />
                  </AppLayout>
                </ProtectedRoute>
              } 
            />
            
            {/* Recorded Storytimes Player (VOD) */}
            <Route 
              path="/watch/:recordingId" 
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <WatchPage />
                  </AppLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/videos/:recordingId" 
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <WatchPage />
                  </AppLayout>
                </ProtectedRoute>
              } 
            />
            
            {/* Book Discussion Clubs */}
            <Route 
              path="/clubs" 
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <BookClubsPage />
                  </AppLayout>
                </ProtectedRoute>
              } 
            />
          </Routes>
        </Router>
      </PointsProvider>
    </ThemeProvider>
  );
}

export default App;
