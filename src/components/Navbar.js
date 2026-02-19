import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

export default function Navbar({ setShowHelp }) {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light pt-3 mb-0 shadow-sm">
      <div className="container d-flex justify-content-between align-items-center">
        <h2 style={{ color: 'black', userSelect: 'none' }}>
          <span role="img" aria-label="task" style={{ border: "0.5px solid black", padding: '2px 6px', borderRadius:'4px', marginRight:'7px' }}>📝</span>
          Task Manager
        </h2>
        <div>
          {token ? (
            <>
              <button className="btn btn-info me-2" onClick={() => setShowHelp(true)}>Help</button>
              <button className="btn btn-outline-primary me-2" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className={"btn btn-outline-primary me-2" + (isActive('/login') ? ' active' : '')}>Login</Link>
              <Link to="/signup" className={"btn btn-outline-primary me-2" + (isActive('/signup') ? ' active' : '')}>Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
