import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import client from '../api/client';

const COLORS = ['#2563eb', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6', '#06b6d4'];

const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [spending, setSpending] = useState([]);

  useEffect(() => {
    client.get('/dashboard/summary').then((res) => setSummary(res.data));
    client.get('/dashboard/spending-by-category').then((res) => setSpending(res.data));
  }, []);

  if (!summary) return <p>Loading dashboard…</p>;

  return (
    <div style={{ padding: '1.5rem' }}>
      <h2>Overview</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
        <div className="card"><div>Total Balance</div><h3>₹{summary.totalBalance.toLocaleString()}</h3></div>
        <div className="card"><div>Monthly Income</div><h3>₹{summary.monthlyIncome.toLocaleString()}</h3></div>
        <div className="card"><div>Monthly Expenses</div><h3>₹{summary.monthlyExpenses.toLocaleString()}</h3></div>
        <div className="card"><div>Savings Rate</div><h3>{summary.savingsRate}%</h3></div>
        <div className="card"><div>Investment Value</div><h3>₹{summary.investmentValue.toLocaleString()}</h3></div>
        <div className="card"><div>Net Worth</div><h3>₹{summary.netWorth.toLocaleString()}</h3></div>
      </div>

      <h3 style={{ marginTop: 32 }}>Spending by category (this month)</h3>
      <div style={{ height: 300 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie data={spending} dataKey="total" nameKey="category" outerRadius={100} label>
              {spending.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;