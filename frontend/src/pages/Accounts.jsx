import { useEffect, useState } from 'react';
import client from '../api/client';

const Accounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [form, setForm] = useState({ accountName: '', accountType: 'checking', balance: 0 });

  const load = () => client.get('/accounts').then((res) => setAccounts(res.data));
  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await client.post('/accounts', form);
    setForm({ accountName: '', accountType: 'checking', balance: 0 });
    load();
  };

  return (
    <div style={{ padding: '1.5rem' }}>
      <h2>Accounts</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        <input placeholder="Account name" value={form.accountName}
          onChange={(e) => setForm({ ...form, accountName: e.target.value })} required />
        <select value={form.accountType} onChange={(e) => setForm({ ...form, accountType: e.target.value })}>
          <option value="checking">Checking</option>
          <option value="savings">Savings</option>
          <option value="credit">Credit</option>
          <option value="investment">Investment</option>
        </select>
        <input type="number" placeholder="Opening balance" value={form.balance}
          onChange={(e) => setForm({ ...form, balance: Number(e.target.value) })} />
        <button type="submit">Add Account</button>
      </form>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
        {accounts.map((a) => (
          <div key={a._id} className="card">
            <strong>{a.accountName}</strong>
            <p>{a.accountType} · {a.accountNumber}</p>
            <h3>₹{a.balance.toLocaleString()}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Accounts;