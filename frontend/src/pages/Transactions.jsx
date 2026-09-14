import { useEffect, useState } from 'react';
import client from '../api/client';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [form, setForm] = useState({ account: '', type: 'expense', category: '', amount: '' });

  const load = () => client.get('/transactions').then((res) => setTransactions(res.data.transactions));

  useEffect(() => {
    load();
    client.get('/accounts').then((res) => setAccounts(res.data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await client.post('/transactions', { ...form, amount: Number(form.amount) });
    setForm({ account: form.account, type: 'expense', category: '', amount: '' });
    load();
  };

  return (
    <div style={{ padding: '1.5rem' }}>
      <h2>Transactions</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
        <select value={form.account} onChange={(e) => setForm({ ...form, account: e.target.value })} required>
          <option value="">Account</option>
          {accounts.map((a) => <option key={a._id} value={a._id}>{a.accountName}</option>)}
        </select>
        <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
          <option value="transfer">Transfer</option>
          <option value="investment">Investment</option>
        </select>
        <input placeholder="Category" value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })} required />
        <input type="number" placeholder="Amount" value={form.amount}
          onChange={(e) => setForm({ ...form, amount: e.target.value })} required />
        <button type="submit">Add</button>
      </form>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead><tr><th>Date</th><th>Type</th><th>Category</th><th>Amount</th></tr></thead>
        <tbody>
          {transactions.map((t) => (
            <tr key={t._id}>
              <td>{new Date(t.date).toLocaleDateString()}</td>
              <td>{t.type}</td>
              <td>{t.category}</td>
              <td>₹{t.amount.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Transactions;