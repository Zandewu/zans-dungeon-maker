// src/pages/Login.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [form, setForm] = useState({ identifier: '', password: '' }); // identifier = username atau email
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const res = await fetch('http://localhost:5000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        identifier: form.identifier,
        password: form.password
      })
    });

    const data = await res.json();
    if (res.ok) {
      alert('✅ Login berhasil!');
      console.log('User:', data.user);
      // Simpan user ke localStorage/sessionStorage jika perlu
      // localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/'); // atau ke dashboard
    } else {
      setError(data.error || 'Login gagal');
    }
  };

  return (
    <div className="w-full max-w-md bg-white p-8 rounded-lg shadow">
      <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <input
            type="text"
            name="identifier"
            placeholder="Username atau Email"
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-6">
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleChange}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Login
        </button>
      </form>
      <p className="text-center mt-4">
        Belum punya akun?{' '}
        <button
          onClick={() => navigate('/register')}
          className="text-blue-600 hover:underline"
        >
          Daftar di sini
        </button>
      </p>
    </div>
  );
}