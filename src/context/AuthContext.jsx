import { createContext, useContext, useState, useEffect } from 'react';

const AUTH_KEY = 'chess-tavern-auth';

const AuthContext = createContext(null);

function readStoredAuth() {
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (data?.role === 'member' || data?.role === 'coach') return data;
  } catch (_) {}
  return null;
}

function storeAuth(auth) {
  if (auth) localStorage.setItem(AUTH_KEY, JSON.stringify(auth));
  else localStorage.removeItem(AUTH_KEY);
}

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(readStoredAuth);

  useEffect(() => {
    storeAuth(auth);
  }, [auth]);

  const signIn = (role) => {
    setAuth({ role: role === 'coach' ? 'coach' : 'member' });
  };

  const signOut = () => {
    setAuth(null);
  };

  return (
    <AuthContext.Provider value={{ auth, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
