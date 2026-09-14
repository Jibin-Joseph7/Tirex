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
    <nav style={{
      display: 'flex', alignItems: 'center', gap: 20, padding: '0.9rem 1.5rem',
      background: 'var(--navy)', color: '#fff',
    }}>
      <strong style={{ fontSize: '1.1rem', letterSpacing: '0.02em' }}>Tirex</strong>
      {user && (
        <>
          <Link to="/dashboard" style={{ color: '#EAF0FA' }}>Dashboard</Link>
          <Link to="/accounts" style={{ color: '#EAF0FA' }}>Accounts</Link>
          <Link to="/transactions" style={{ color: '#EAF0FA' }}>Transactions</Link>
          <Link to="/budgets" style={{ color: '#EAF0FA' }}>Budgets</Link>
          <Link to="/investments" style={{ color: '#EAF0FA' }}>Investments</Link>
          {user.role === 'admin' && <Link to="/admin" style={{ color: 'var(--accent)' }}>Admin</Link>}
          <span style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
            <button onClick={toggleDarkMode} style={{ background: 'rgba(255,255,255,0.12)' }}>Mode</button>
            <span>{user.name}</span>
            <button onClick={logout} style={{ background: 'var(--danger)' }}>Logout</button>
          </span>
        </>
      )}
    </nav>
  );
};

export default Navbar;
