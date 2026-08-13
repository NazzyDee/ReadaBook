import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';
import { Search, LogOut, Tv } from 'lucide-react';

export const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');

  // Sync search input with URL search param
  useEffect(() => {
    const query = searchParams.get('search') || '';
    setSearchQuery(query);
  }, [searchParams]);

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
          ReadaBook <span>Live</span>
        </Link>
      </div>

      <div className="header-center">
        <form onSubmit={handleSearchSubmit} className="header-search-form">
          <input 
            type="text" 
            placeholder="Search streams, books, genres..." 
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
            <Link to="/dashboard" className="btn-dashboard-link" title="Streamer Dashboard">
              <Tv size={18} />
              <span className="hide-mobile">Dashboard</span>
            </Link>
            <span className="header-username">{user.email?.split('@')[0]}</span>
            <button onClick={logout} className="btn-signout" title="Sign Out">
              <LogOut size={16} />
            </button>
          </div>
        ) : (
          <Link to="/login" className="btn-primary" style={{ textDecoration: 'none' }}>
            Sign In
          </Link>
        )}
      </div>
    </header>
  );
};
