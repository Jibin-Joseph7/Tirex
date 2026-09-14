import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'customer' });
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await register(form.name, form.email, form.password, form.role);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="card" style={{ maxWidth: 360, margin: '4rem auto' }}>
      <h2>Create your Tirex account</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Full name" onChange={handleChange} required style={{ width: '100%', marginBottom: 8, padding: 8 }} />
        <input name="email" placeholder="Email" onChange={handleChange} required style={{ width: '100%', marginBottom: 8, padding: 8 }} />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} required style={{ width: '100%', marginBottom: 8, padding: 8 }} />
        <select name="role" onChange={handleChange} style={{ width: '100%', marginBottom: 8, padding: 8 }}>
          <option value="customer">Customer</option>
          <option value="advisor">Financial Advisor</option>
        </select>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" style={{ width: '100%', padding: 8 }}>Create account</button>
      </form>
      <p>Already have an account? <Link to="/login">Sign in</Link></p>
    </div>
  );
};

export default Register;
