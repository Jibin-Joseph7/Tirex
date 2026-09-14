import { useEffect, useState } from 'react';
import client from '../api/client';

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    client.get('/admin/users').then((res) => setUsers(res.data));
    client.get('/admin/stats').then((res) => setStats(res.data));
  }, []);

  return (
    <div style={{ padding: '1.5rem' }}>
      <h2>Admin</h2>
      {stats && (
        <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
          <div className="card">Users: {stats.userCount}</div>
          <div className="card">Accounts: {stats.accountCount}</div>
          <div className="card">Transactions: {stats.transactionCount}</div>
        </div>
      )}
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead><tr><th>Name</th><th>Email</th><th>Role</th></tr></thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id}><td>{u.name}</td><td>{u.email}</td><td>{u.role}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Admin;
