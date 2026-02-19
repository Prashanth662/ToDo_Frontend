import React, { useState, useRef, useEffect } from 'react';
import API from '../../api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const OTP_RESEND_TIME = 10; // seconds

export default function Signup() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '']);
  const [otpSent, setOtpSent] = useState(false);
  const [timeLeft, setTimeLeft] = useState(OTP_RESEND_TIME);
  const navigate = useNavigate();

  const inputRefs = [useRef(), useRef(), useRef(), useRef()];

  useEffect(() => {
    let timer;
    if (otpSent && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [otpSent, timeLeft]);

  const sendOtp = async () => {
    setLoading(true);
    try {
      await API.post('/auth/signup', { email, password });
      toast.success('OTP sent to your email');
      setOtpSent(true);
      setTimeLeft(OTP_RESEND_TIME);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = (e) => {
    e.preventDefault();
    sendOtp();
  };

  const handleChange = (e, idx) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 1);
    const newOtp = otp.map((v, i) => (i === idx ? val : v));
    setOtp(newOtp);
    if (val && idx < inputRefs.length - 1) inputRefs[idx + 1].current.focus();
    if (!val && idx > 0 && e.nativeEvent.inputType === 'deleteContentBackward')
      inputRefs[idx - 1].current.focus();
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const enteredOtp = otp.join('');
    if (enteredOtp.length !== 4) {
      toast.error('Enter a 4-digit OTP');
      return;
    }
    try {
      await API.post('/auth/verify-otp', { email, otp: enteredOtp });
      toast.success('Verification successful! Logging in...');
      const res = await API.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      navigate('/tasks');
    } catch (error) {
      toast.error(error.response?.data?.message || 'OTP verification failed');
    }
  };

  return (
    <div className="auth-page">
      {!otpSent ? (
        <form onSubmit={handleSignup} className="frosted-card col-10 col-md-5 col-lg-4 mx-auto p-4">
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}></div>
          <h3 className="login-title mb-4">Sign Up</h3>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="input-underline"
          />
          <div style={{ position: 'relative' }}>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Create Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={6}
              required
              className="input-underline"
              style={{ paddingRight: '40px' }}
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
                fontSize: '1.2rem',
              }}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? '🙈' : '👁️' }
            </button>
          </div>

          <button type="submit" className="fancy-btn w-100 mt-4" disabled={loading}>
            {loading ? 'Sending OTP...' : 'Sign Up'}
          </button>

          <p className="text-center mt-3">
            Already have an account?{' '}
            <button type="button" className="btn btn-link p-0" onClick={() => navigate('/login')}>
              Login here
            </button>
          </p>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp} className="frosted-card col-10 col-md-5 col-lg-4 mx-auto p-4">
          <button
    type="button"
    onClick={() => setOtpSent(false)}
    style={{
      position: 'absolute',
      top: '10px',
      right: '10px',
      background: 'transparent',
      border: 'none',
      fontSize: '1.5rem',
      cursor: 'pointer',
      color: 'white',
    }}
    aria-label="Cancel"
  >
    &times;
  </button>
          <h3 className="login-title mb-3">Enter Verification Code</h3>
          <p>
            Code sent to <b>{email}</b>
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '15px' }}>
            {otp.map((value, index) => (
              <input
                key={index}
                ref={inputRefs[index]}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={value}
                onChange={(e) => handleChange(e, index)}
                className="otp-circle-input"
                style={{ width: '52px', height: '52px', borderRadius: '50%', fontSize: '2rem', textAlign: 'center' }}
              />
            ))}
          </div>
          <button type="submit" className="fancy-btn w-100 mt-2 mb-2">
            Verify OTP
          </button>
          <p className="text-center mt-3">
            Already have an account?{' '}
            <button type="button" className="btn btn-link p-0" onClick={() => navigate('/login')}>
              Login here
            </button>
          </p>
          {timeLeft > 0 ? (
            <p className="text-center text-muted">
              Resend code in 0:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}
            </p>
          ) : (
            <p className="text-center">
              Didn't receive?{' '}
              <button type="button" className="btn btn-link p-0" onClick={sendOtp}>
                Resend Code
              </button>
            </p>
          )}
        </form>
      )}
    </div>
  );
}
