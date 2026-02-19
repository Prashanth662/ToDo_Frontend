// frontend/src/components/auth/VerifyEmail.js
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../../api';
import { toast } from 'react-toastify';

export default function VerifyEmail() {
  const { token } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function verify() {
      try {
        const res = await API.get(`/auth/verify-email/${token}`);
        toast.success(res.data.message);
        navigate('/login');
      } catch (err) {
        toast.error(err.response?.data?.message || 'Verification failed');
        navigate('/signup');
      }
    }
    verify();
  }, [token, navigate]);

  return (
    <div className="glass-bg d-flex align-items-center justify-content-center vh-100">
      <div className="frosted-card px-4 py-5">
        <h3>Verifying your email...</h3>
      </div>
    </div>
  );
}
