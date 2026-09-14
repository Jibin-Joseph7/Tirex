import { useEffect, useState } from 'react';
import client from '../api/client';

const Investments = () => {
  const [data, setData] = useState({ investments: [], totalInvested: 0, totalCurrent: 0, totalGainLoss: 0 });
  const [form, setForm] = useState({ type: 'stock', name: '', units: 1, purchasePrice: '', currentValue: '' });

  const load = () => client.get('/investments').then((res) => setData(res.data));
  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await client.post('/investments', {
      ...form, units: Number(form.units), purchasePrice: Number(form.purchasePrice), currentValue: Number(form.currentValue),
    });
    setForm({ type: 'stock', name: '', units: 1, purchasePrice: '', currentValue: '' });
    load();
  };

  return (
    <div style={{ padding: '1.5rem' }}>
      <h2>Investments</h2>
      <div className="card" style={{ marginBottom: 16 }}>
        <p>Invested: ?{data.totalInvested.toLocaleString()} � Current: ?{data.totalCurrent.toLocaleString()} �
          Gain/Loss: <span style={{ color: data.totalGainLoss >= 0 ? 'green' : 'crimson' }}>?{data.totalGainLoss.toLocaleString()}</span>
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
        <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
          <option value="stock">Stock</option>
          <option value="mutual_fund">Mutual Fund</option>
          <option value="fd">Fixed Deposit</option>
          <option value="crypto">Crypto</option>
          <option value="gold">Gold</option>
        </select>
        <input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <input type="number" placeholder="Units" value={form.units} onChange={(e) => setForm({ ...form, units: e.target.value })} />
        <input type="number" placeholder="Purchase price" value={form.purchasePrice} onChange={(e) => setForm({ ...form, purchasePrice: e.target.value })} required />
        <input type="number" placeholder="Current value" value={form.currentValue} onChange={(e) => setForm({ ...form, currentValue: e.target.value })} required />
        <button type="submit">Add</button>
      </form>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
        {data.investments.map((i) => (
          <div key={i._id} className="card">
            <strong>{i.name}</strong>
            <p>{i.type} � {i.units} units</p>
<p className={i.gainLoss >= 0 ? 'gain' : 'loss'}>₹{i.gainLoss.toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Investments;
