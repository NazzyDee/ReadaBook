import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';
import { useTheme } from '../lib/ThemeContext';
import { NotificationsDropdown } from './NotificationsDropdown';
import { books } from '../lib/booksData';
import { STREAMERS } from '../lib/streamersData';
import {
  Search,
  LogOut,
  Tv,
  Bell,
  Video,
  Users,
  Compass,
  Sparkles,
  User,
  ChevronDown,
  Heart,
  HelpCircle,
  Gift,
  Settings,
  Award,
  Headphones,
  BookMarked
} from 'lucide-react';
import { ShortcutsModal } from './ShortcutsModal';
import { UserSettingsModal } from './UserSettingsModal';
import { BookwormBattlePassModal } from './BookwormBattlePassModal';
import { CoListeningRoomModal } from './CoListeningRoomModal';
import { ReaderPassportModal } from './ReaderPassportModal';

export const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showShortcutsModal, setShowShortcutsModal] = useState(false);
  const [showUserSettingsModal, setShowUserSettingsModal] = useState(false);
  const [showBattlePassModal, setShowBattlePassModal] = useState(false);
  const [showCoListeningModal, setShowCoListeningModal] = useState(false);
  const [showPassportModal, setShowPassportModal] = useState(false);
  const [userStatus, setUserStatus] = useState<'Online' | 'Reading' | 'Away'>('Online');

  const searchContainerRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Sync search input with URL search param
  useEffect(() => {
    const query = searchParams.get('search') || '';
    setSearchQuery(query);
  }, [searchParams]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setShowSearchDropdown(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSearchDropdown(false);
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/');
    }
  };

  // Search matches for live dropdown
  const queryLower = searchQuery.toLowerCase().trim();
  const matchingBooks = queryLower
    ? books.filter(b => b.title.toLowerCase().includes(queryLower) || b.author.toLowerCase().includes(queryLower)).slice(0, 3)
    : [];
  const matchingStreamers = queryLower
    ? Object.values(STREAMERS).filter(s => s.username.toLowerCase().includes(queryLower) || s.displayName.toLowerCase().includes(queryLower)).slice(0, 3)
    : [];

  return (
    <header className="header twitch-header">
      {/* Left Navigation */}
      <div className="header-left">
        <Link to="/" className="header-logo">
          <span className="logo-icon">📖</span>
          <span>ReadaBook</span>
          <span className="logo-live-tag">LIVE</span>
        </Link>

        <nav className="header-nav-links">
          <Link to="/following" className={`header-nav-item ${location.pathname === '/following' ? 'active' : ''}`}>
            <Heart size={16} />
            <span>Following</span>
          </Link>
          <Link to="/" className={`header-nav-item ${location.pathname === '/' ? 'active' : ''}`}>
            <Compass size={16} />
            <span>Browse</span>
          </Link>
          <Link to="/drops" className={`header-nav-item ${location.pathname === '/drops' ? 'active' : ''}`}>
            <Gift size={16} />
            <span>Drops</span>
          </Link>
          <Link to="/clips" className={`header-nav-item ${location.pathname === '/clips' ? 'active' : ''}`}>
            <Video size={16} />
            <span>Clips</span>
          </Link>
          <Link to="/squads" className={`header-nav-item ${location.pathname === '/squads' ? 'active' : ''}`}>
            <Users size={16} />
            <span>Squads</span>
          </Link>
          <Link to="/clubs" className={`header-nav-item ${location.pathname === '/clubs' ? 'active' : ''}`}>
            <Sparkles size={16} />
            <span>Clubs</span>
          </Link>
        </nav>
      </div>

      {/* Center Search with Instant Autocomplete */}
      <div className="header-center" ref={searchContainerRef}>
        <form onSubmit={handleSearchSubmit} className="header-search-form">
          <input
            type="text"
            placeholder="Search streams, authors, books, genres..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSearchDropdown(true);
            }}
            onFocus={() => setShowSearchDropdown(true)}
            className="header-search-input"
          />
          <button type="submit" className="header-search-btn" title="Search">
            <Search size={16} />
          </button>
        </form>

        {showSearchDropdown && (matchingBooks.length > 0 || matchingStreamers.length > 0) && (
          <div className="search-autocomplete-dropdown">
            {matchingStreamers.length > 0 && (
              <div className="autocomplete-section">
                <span className="autocomplete-section-title">Storytellers & Streamers</span>
                {matchingStreamers.map(s => (
                  <Link
                    key={s.id}
                    to={`/channel/${s.id}`}
                    onClick={() => setShowSearchDropdown(false)}
                    className="autocomplete-item"
                  >
                    <img src={s.avatarUrl} alt="" className="autocomplete-avatar" />
                    <div className="autocomplete-item-info">
                      <span className="autocomplete-name">{s.displayName}</span>
                      <span className="autocomplete-meta">
                        {s.isLive ? '🔴 LIVE Now' : 'Offline'} • {(s.followersCount / 1000).toFixed(1)}k followers
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {matchingBooks.length > 0 && (
              <div className="autocomplete-section">
                <span className="autocomplete-section-title">Books & Novels</span>
                {matchingBooks.map(b => (
                  <div
                    key={b.id}
                    onClick={() => {
                      setShowSearchDropdown(false);
                      navigate(`/?search=${encodeURIComponent(b.title)}`);
                    }}
                    className="autocomplete-item"
                    style={{ cursor: 'pointer' }}
                  >
                    <img src={b.coverUrl} alt="" className="autocomplete-book-thumb" />
                    <div className="autocomplete-item-info">
                      <span className="autocomplete-name">{b.title}</span>
                      <span className="autocomplete-meta">by {b.author} • {b.genre}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right User Actions */}
      <div className="header-right" ref={userMenuRef}>
        {user ? (
          <div className="header-user-menu">
            {/* Reader Passport Button */}
            <button
              onClick={() => setShowPassportModal(true)}
              className="btn-battlepass-nav-chip"
              style={{ color: '#ffd700', borderColor: 'rgba(255, 215, 0, 0.4)' }}
              title="Reader Passport & Virtual Bookshelf"
            >
              <BookMarked size={14} color="#ffd700" />
              <span>Passport</span>
            </button>

            {/* Co-Listening Lounges Button */}
            <button
              onClick={() => setShowCoListeningModal(true)}
              className="btn-battlepass-nav-chip"
              style={{ color: '#00e5ff', borderColor: 'rgba(0, 229, 255, 0.4)' }}
              title="Community Co-Listening Lounges"
            >
              <Headphones size={14} color="#00e5ff" />
              <span>Lounges</span>
            </button>

            {/* Odyssey Battle Pass Button */}
            <button
              onClick={() => setShowBattlePassModal(true)}
              className="btn-battlepass-nav-chip"
              title="Bookworm Odyssey Pass - Season 4"
            >
              <Award size={14} color="#ffd700" />
              <span>Odyssey Pass</span>
            </button>

            {/* Streamer Dashboard Shortcut */}
            <Link to="/dashboard" className="btn-dashboard-pill" title="Creator Studio">
              <Tv size={16} />
              <span>Studio</span>
            </Link>

            {/* Notifications Bell */}
            <div className="header-icon-btn-wrapper">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className={`btn-header-icon ${showNotifications ? 'active' : ''}`}
                title="Notifications"
              >
                <Bell size={18} />
                <span className="notification-badge-dot"></span>
              </button>

              {showNotifications && (
                <NotificationsDropdown onClose={() => setShowNotifications(false)} />
              )}
            </div>

            {/* User Profile Dropdown Button */}
            <div className="header-user-profile-wrapper">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="btn-user-avatar-trigger"
              >
                <div className="user-avatar-disc">
                  <span>{user.email ? user.email.substring(0, 2).toUpperCase() : 'U'}</span>
                  <span className={`status-indicator-dot status-${userStatus.toLowerCase()}`}></span>
                </div>
                <ChevronDown size={14} />
              </button>

              {showUserMenu && (
                <div className="user-menu-popover">
                  <div className="user-menu-header">
                    <div className="user-avatar-large">
                      <span>{user.email ? user.email.substring(0, 2).toUpperCase() : 'U'}</span>
                    </div>
                    <div className="user-menu-info">
                      <span className="user-menu-email">{user.email?.split('@')[0]}</span>
                      <span className="user-menu-sublabel">ReadaBook Member</span>
                    </div>
                  </div>

                  {/* Status Switcher */}
                  <div className="user-status-row">
                    <span className="status-label">Status:</span>
                    {(['Online', 'Reading', 'Away'] as const).map(st => (
                      <button
                        key={st}
                        className={`btn-status-pill ${userStatus === st ? 'active' : ''}`}
                        onClick={() => setUserStatus(st)}
                      >
                        {st}
                      </button>
                    ))}
                  </div>

                  <hr className="menu-divider" />

                  {/* Theme Switcher */}
                  <div className="menu-theme-section">
                    <span className="menu-section-label">Theme Palette:</span>
                    <div className="theme-pills-row">
                      <button
                        className={`theme-pill ${theme === 'dark' ? 'active' : ''}`}
                        onClick={() => setTheme('dark')}
                        title="Twitch Violet"
                      >
                        Violet
                      </button>
                      <button
                        className={`theme-pill ${theme === 'oled' ? 'active' : ''}`}
                        onClick={() => setTheme('oled')}
                        title="Pure Black"
                      >
                        OLED
                      </button>
                      <button
                        className={`theme-pill ${theme === 'sepia' ? 'active' : ''}`}
                        onClick={() => setTheme('sepia')}
                        title="Antique Paper"
                      >
                        Sepia
                      </button>
                      <button
                        className={`theme-pill ${theme === 'light' ? 'active' : ''}`}
                        onClick={() => setTheme('light')}
                        title="Day Light"
                      >
                        Light
                      </button>
                    </div>
                  </div>

                  <hr className="menu-divider" />

                  <Link
                    to="/channel/mock_lillyreads"
                    onClick={() => setShowUserMenu(false)}
                    className="user-menu-item"
                  >
                    <User size={16} />
                    <span>My Channel</span>
                  </Link>

                  <Link
                    to="/following"
                    onClick={() => setShowUserMenu(false)}
                    className="user-menu-item"
                  >
                    <Heart size={16} />
                    <span>Following</span>
                  </Link>

                  <Link
                    to="/drops"
                    onClick={() => setShowUserMenu(false)}
                    className="user-menu-item"
                  >
                    <Gift size={16} />
                    <span>Drops & Rewards</span>
                  </Link>

                  <Link
                    to="/dashboard"
                    onClick={() => setShowUserMenu(false)}
                    className="user-menu-item"
                  >
                    <Tv size={16} />
                    <span>Creator Dashboard</span>
                  </Link>

                  <Link
                    to="/analytics"
                    onClick={() => setShowUserMenu(false)}
                    className="user-menu-item"
                  >
                    <span style={{ fontSize: '15px' }}>📊</span>
                    <span>Channel Analytics</span>
                  </Link>

                  <Link
                    to="/producer"
                    onClick={() => setShowUserMenu(false)}
                    className="user-menu-item"
                  >
                    <span style={{ fontSize: '15px' }}>🎬</span>
                    <span>Video Producer</span>
                  </Link>

                  <Link
                    to="/roles"
                    onClick={() => setShowUserMenu(false)}
                    className="user-menu-item"
                  >
                    <span style={{ fontSize: '15px' }}>🛡️</span>
                    <span>Roles & Permissions</span>
                  </Link>

                  <Link
                    to="/emotes"
                    onClick={() => setShowUserMenu(false)}
                    className="user-menu-item"
                  >
                    <span style={{ fontSize: '15px' }}>🎨</span>
                    <span>Emotes & Badges</span>
                  </Link>

                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      setShowUserSettingsModal(true);
                    }}
                    className="user-menu-item"
                  >
                    <Settings size={16} />
                    <span>Settings</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      setShowShortcutsModal(true);
                    }}
                    className="user-menu-item"
                  >
                    <HelpCircle size={16} />
                    <span>Keyboard Shortcuts (?)</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      logout();
                    }}
                    className="user-menu-item sign-out-item"
                  >
                    <LogOut size={16} />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <Link to="/login" className="btn-primary" style={{ textDecoration: 'none' }}>
            Sign In
          </Link>
        )}
      </div>

      {showShortcutsModal && (
        <ShortcutsModal onClose={() => setShowShortcutsModal(false)} />
      )}

      {showUserSettingsModal && (
        <UserSettingsModal onClose={() => setShowUserSettingsModal(false)} />
      )}

      {showBattlePassModal && (
        <BookwormBattlePassModal onClose={() => setShowBattlePassModal(false)} />
      )}

      {showCoListeningModal && (
        <CoListeningRoomModal onClose={() => setShowCoListeningModal(false)} />
      )}

      {showPassportModal && (
        <ReaderPassportModal onClose={() => setShowPassportModal(false)} />
      )}
    </header>
  );
};
