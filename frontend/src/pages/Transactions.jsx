import { useEffect, useState } from 'react';
import client from '../api/client';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ account: '', type: 'expense', category: '', amount: '' });

  const loadTransactions = () =>
    client.get('/transactions')
      .then((res) => setTransactions(res.data.transactions))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load transactions'));

  const loadAccounts = () =>
    client.get('/accounts')
      .then((res) => setAccounts(res.data))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load accounts'));

  useEffect(() => {
    Promise.all([loadTransactions(), loadAccounts()]).finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await client.post('/transactions', { ...form, amount: Number(form.amount) });
      setForm({ account: form.account, type: 'expense', category: '', amount: '' });
      loadTransactions();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add transaction');
    }
  };

  if (loading) return <div style={{ padding: '1.5rem' }}>Loading transactions…</div>;

  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <h2 style={{ marginBottom: 4 }}>Transactions</h2>
      <p style={{ color: 'var(--text-muted)', marginTop: 0, marginBottom: 24 }}>
        Record income, expenses, transfers and investments.
      </p>

      {error && (
        <div style={{
          background: 'var(--danger-bg)', color: 'var(--danger)',
          padding: '10px 14px', borderRadius: 6, marginBottom: 16, fontSize: '0.9rem',
        }}>
          {error}
        </div>
      )}

      {accounts.length === 0 ? (
        <div className="card" style={{ marginBottom: 24 }}>
          <strong>No accounts yet</strong>
          <p style={{ color: 'var(--text-muted)', margin: '4px 0 0' }}>
            You need at least one account before you can add a transaction.{' '}
            <a href="/accounts">Create one on the Accounts page</a>.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="card"
          style={{ display: 'flex', gap: 10, marginBottom: 24, flexWrap: 'wrap', alignItems: 'center' }}>
          <select value={form.account} onChange={(e) => setForm({ ...form, account: e.target.value })} required>
            <option value="">Select account</option>
            {accounts.map((a) => (
              <option key={a._id} value={a._id}>
                {a.accountName} — ?{a.balance.toLocaleString()}
              </option>
            ))}
          </select>
          <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
            <option value="transfer">Transfer</option>
            <option value="investment">Investment</option>
          </select>
          <input placeholder="Category (e.g. Groceries)" value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })} required />
          <input type="number" placeholder="Amount" min="0" step="0.01" value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })} required style={{ width: 120 }} />
          <button type="submit">Add transaction</button>
        </form>
      )}

      {transactions.length === 0 ? (
        <div className="card">
          <p style={{ margin: 0, color: 'var(--text-muted)' }}>No transactions yet. Add your first one above.</p>
        </div>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Category</th>
              <th style={{ textAlign: 'right' }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t) => (
              <tr key={t._id}>
                <td>{new Date(t.date).toLocaleDateString()}</td>
                <td style={{ textTransform: 'capitalize' }}>{t.type}</td>
                <td>{t.category}</td>
                <td
                  style={{ textAlign: 'right' }}
                  className={t.type === 'income' ? 'gain' : t.type === 'expense' ? 'loss' : ''}
                >
                  {t.type === 'income' ? '+' : t.type === 'expense' ? '-' : ''}?{t.amount.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Transactions;
