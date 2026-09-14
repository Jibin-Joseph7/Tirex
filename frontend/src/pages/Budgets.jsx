import { useEffect, useState } from 'react';
import client from '../api/client';

const Budgets = () => {
  const [budgets, setBudgets] = useState([]);
  const [form, setForm] = useState({ category: '', limit: '' });

  const load = () => client.get('/budgets').then((res) => setBudgets(res.data));
  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await client.post('/budgets', { ...form, limit: Number(form.limit) });
    setForm({ category: '', limit: '' });
    load();
  };

  return (
    <div style={{ padding: '1.5rem' }}>
      <h2>Budgets</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        <input placeholder="Category" value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })} required />
        <input type="number" placeholder="Monthly limit" value={form.limit}
          onChange={(e) => setForm({ ...form, limit: e.target.value })} required />
        <button type="submit">Set Budget</button>
      </form>

      <div style={{ display: 'grid', gap: 12 }}>
        {budgets.map((b) => (
          <div key={b._id} className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <strong>{b.category}</strong>
              <span style={{ color: b.overspent ? 'crimson' : 'inherit' }}>
                ?{b.spent.toLocaleString()} / ?{b.limit.toLocaleString()}
              </span>
            </div>
            <div style={{ background: 'var(--border)', borderRadius: 6, height: 8, marginTop: 8 }}>
              <div style={{
                width: `${Math.min(b.percentUsed, 100)}%`,
                background: b.overspent ? 'crimson' : 'var(--primary)',
                height: 8, borderRadius: 6,
              }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Budgets;
