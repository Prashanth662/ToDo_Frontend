import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Signup from './components/Auth/Signup';
import Login from './components/Auth/Login';
import VerifyEmail from './components/Auth/VerifyEmail';
import TaskList from './components/Tasks/TaskList';
import Navbar from './components/Navbar';
import { ToastContainer } from 'react-toastify';
import ForgotPassword from './components/Auth/ForgotPassword';

function PrivateRoute({ children }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
}

function App() {
  const [showHelp, setShowHelp] = useState(false);

  return (
    <Router>
      <Navbar setShowHelp={setShowHelp} />
      <Routes>
        <Route path="/" element={<Navigate to="/tasks" />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify-email/:token" element={<VerifyEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route 
          path="/tasks" 
          element={
            <div className="container">
              <PrivateRoute>
                <TaskList showHelp={showHelp} setShowHelp={setShowHelp} />
              </PrivateRoute>
            </div>
          } 
        />
      </Routes>
      <ToastContainer position="top-center" />
    </Router>
  );
}

export default App;
