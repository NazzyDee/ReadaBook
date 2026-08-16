import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';
import { Search, LogOut, Tv, Sparkles } from 'lucide-react';
import { KidAvatarStudioModal } from './KidAvatarStudioModal';

export const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [showAvatarStudio, setShowAvatarStudio] = useState(false);
  const [activeAvatar, setActiveAvatar] = useState<{ emoji: string; bg: string }>({ emoji: '🦊', bg: '#8338ec' });

  useEffect(() => {
    const query = searchParams.get('search') || '';
    setSearchQuery(query);
  }, [searchParams]);

  const [profileName, setProfileName] = useState('Friend');

  useEffect(() => {
    const saved = localStorage.getItem('readabook_active_profile');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.displayName) {
          setProfileName(parsed.displayName);
        }
      } catch (e) {}
    }
  }, [user]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/');
    }
  };

  return (
    <header className="header">
      <div className="header-left">
        <Link to="/" className="header-logo">
          🧸 ReadaBook <span>Kids</span>
        </Link>
      </div>

      <div className="header-center">
        <form onSubmit={handleSearchSubmit} className="header-search-form">
          <input 
            type="text" 
            placeholder="Find friendly stories & readers..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="header-search-input"
          />
          <button type="submit" className="header-search-btn">
            <Search size={16} />
          </button>
        </form>
      </div>

      <div className="header-right">
        {user ? (
          <div className="header-user-menu">
            <Link to="/dashboard" className="btn-dashboard-link" title="Parent Dashboard">
              <Tv size={18} />
              <span>Parent Panel</span>
            </Link>
            <button
              onClick={() => setShowAvatarStudio(true)}
              className="kids-avatar-badge btn-avatar-studio-trigger"
              style={{ backgroundColor: activeAvatar.bg }}
              title="Customize My Magical Avatar!"
            >
              <span className="avatar-mini-icon">{activeAvatar.emoji}</span>
              <span className="header-username">{profileName}</span>
              <Sparkles size={12} color="#ffd700" />
            </button>
            <button 
              onClick={() => {
                localStorage.removeItem('readabook_active_profile');
                logout();
              }} 
              className="btn-signout" 
              title="Sign Out"
            >
              <LogOut size={16} />
            </button>
          </div>
        ) : (
          <Link to="/login" className="btn-primary" style={{ textDecoration: 'none' }}>
            Parents Sign In
          </Link>
        )}
      </div>

      {showAvatarStudio && (
        <KidAvatarStudioModal
          onSaveAvatar={(data) => {
            setActiveAvatar({ emoji: data.base.emoji, bg: data.bg });
          }}
          onClose={() => setShowAvatarStudio(false)}
        />
      )}
    </header>
  );
};
