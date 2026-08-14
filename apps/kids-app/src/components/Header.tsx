import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';
import { Search, LogOut, Tv, Smile } from 'lucide-react';

export const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');

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
            <div className="kids-avatar-badge">
              <Smile size={18} color="#fff" />
              <span className="header-username">{profileName}</span>
            </div>
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
    </header>
  );
};
