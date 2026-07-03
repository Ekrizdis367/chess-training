import { useState, useEffect, useRef } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const CALIENTE_PIECES_BASE = 'https://raw.githubusercontent.com/lichess-org/lila/master/public/piece/caliente';

const THEME_KEY = 'theme';

function getTheme() {
  return document.documentElement.getAttribute('data-theme') || 'light';
}

export function Layout() {
  const { auth, signOut } = useAuth();
  const [theme, setTheme] = useState(getTheme);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const isLoggedIn = !!auth;
  const avatarPiece =
    theme === 'light'
      ? auth?.role === 'coach'
        ? 'bQ'
        : 'bN'
      : auth?.role === 'coach'
        ? 'wQ'
        : 'wN';

  useEffect(() => {
    if (!profileOpen) return;
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [profileOpen]);

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => {
      if (!localStorage.getItem(THEME_KEY)) {
        const next = media.matches ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', next);
        setTheme(next);
      }
    };
    media.addEventListener('change', handler);
    return () => media.removeEventListener('change', handler);
  }, []);

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    localStorage.setItem(THEME_KEY, next);
    document.documentElement.setAttribute('data-theme', next);
    setTheme(next);
  };

  return (
    <div className="app-layout">
      <header className="app-header">
        <div className="app-header-left">
          <NavLink to="/" className="app-title" aria-label="Home">
            <img src="/tavern-logo.png" alt="" className="app-logo" />
          </NavLink>
        </div>
        <nav className="app-nav" aria-label="Main">
          <NavLink to="/openings">Openings</NavLink>
          <NavLink to="/endgames">Endgames</NavLink>
          <NavLink to="/memory">Memory</NavLink>
          <NavLink to="/coaching">Coaching</NavLink>
        </nav>
        <div className="app-header-right">
          <div className="auth-area">
          {isLoggedIn ? (
            <div className="auth-profile-wrap" ref={profileRef}>
              <button
                type="button"
                className="auth-avatar"
                onClick={() => setProfileOpen((o) => !o)}
                aria-label="Profile menu"
                aria-expanded={profileOpen}
                aria-haspopup="true"
              >
                <img
                  src={`${CALIENTE_PIECES_BASE}/${avatarPiece}.svg`}
                  alt=""
                  width={36}
                  height={36}
                  className="auth-avatar-img"
                />
              </button>
              {profileOpen && (
                <div className="auth-profile-dropdown">
                  <button
                    type="button"
                    className="auth-profile-dropdown-item auth-profile-dropdown-item-with-icon"
                    onClick={() => {
                      toggleTheme();
                      setProfileOpen(false);
                    }}
                    aria-label={theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme'}
                  >
                    <img
                      src={theme === 'light' ? `${CALIENTE_PIECES_BASE}/bP.svg` : `${CALIENTE_PIECES_BASE}/wP.svg`}
                      alt=""
                      width={28}
                      height={28}
                      className="auth-profile-dropdown-item-icon"
                    />
                    {theme === 'light' ? 'Dark' : 'Light'}
                  </button>
                  <button
                    type="button"
                    className="auth-profile-dropdown-item auth-profile-dropdown-item-signout"
                    onClick={() => {
                      signOut();
                      setProfileOpen(false);
                    }}
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <button
                type="button"
                className="theme-toggle theme-toggle-pawn"
                onClick={toggleTheme}
                aria-label={theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme'}
                title={theme === 'light' ? 'Dark' : 'Light'}
              >
                <img
                  src={theme === 'light' ? `${CALIENTE_PIECES_BASE}/bP.svg` : `${CALIENTE_PIECES_BASE}/wP.svg`}
                  alt=""
                  width={36}
                  height={36}
                  className="theme-toggle-icon"
                />
              </button>
              <NavLink to="/sign-in" className="sign-in">
                Sign in
              </NavLink>
            </>
          )}
          </div>
        </div>
      </header>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
