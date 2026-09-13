import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  const toggleDarkMode = () => {
    const root = document.documentElement;
    const isDark = root.getAttribute('data-theme') === 'dark';
    root.setAttribute('data-theme', isDark ? 'light' : 'dark');
  };

  return (
    <nav style={{ display: 'flex', gap: 16, padding: '1rem', borderBottom: '1px solid var(--border)' }}>
      <strong>Tirex</strong>
      {user && (
        <>
          <Link to="/dashboard">Dashboard</Link>
          <span style={{ marginLeft: 'auto' }}>
            <button onClick={toggleDarkMode}>🌓</button>
            <span style={{ margin: '0 8px' }}>{user.name}</span>
            <button onClick={logout}>Logout</button>
          </span>
        </>
      )}
    </nav>
  );
};

export default Navbar;