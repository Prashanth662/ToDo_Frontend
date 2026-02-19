import React, { useState } from 'react';
import API from '../../api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async e => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      toast.success('Login successful');
      navigate('/tasks');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="glass-bg d-flex align-items-center justify-content-center vh-100">
      <form onSubmit={handleLogin} className="frosted-card px-4 py-5">
        <h2 className="login-title mb-4">LOGIN</h2>
        <div className="mb-4">
          <input
            type="email"
            className="input-underline"
            placeholder="Username"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            autoFocus
          />
        </div>
        <div className="mb-4" style={{ position: 'relative' }}>
          <input
            type={showPassword ? 'text' : 'password'}
            className="input-underline"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: 'absolute',
              right: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              fontSize: '1.2rem'
            }}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? '🙈' : '👁️'}
          </button>
        </div>
        <button type="submit" className="fancy-btn w-100 mt-2 mb-3">SIGN IN</button>
        <div className="forgot-link d-flex justify-content-center">
          <a href="/forgot-password" className="text-info fw-bold">Forget Password?</a>
        </div>
        <div className="d-flex justify-content-center"><span>_______________________________</span></div>
        <div className="text-center mt-3">
          <span className="me-1">Don't have an account?</span>
          <a href="/signup" className="text-info fw-semibold">Sign up here</a>
        </div>
      </form>
    </div>
  );
}
