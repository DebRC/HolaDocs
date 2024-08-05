import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post('http://localhost:3001/api/user/auth/login', { username, password });
      localStorage.setItem('token', res.data.token);
      navigate('/');
    } catch (error) {
      if (error.response) {
        setErrorMessage(error.response.data.error);
      } else {
        setErrorMessage("Server Error. Please try again later.");
      }
    }
  };
  const handleSignup = async () => {
    navigate('/signup');
  };

  const handleGoToRoot = () => {
    navigate('/');
    window.location.reload();
  }

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', backgroundColor: '#808080' }}>
        <h1 style={{ fontFamily: '"Roboto", sans-serif', fontSize: '24px', cursor: 'pointer' }} onClick={handleGoToRoot}>HolaDocs</h1>
      </div>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        background: '#f5f5f5'
      }}>
        <div style={{
          padding: '20px',
          borderRadius: '5px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          background: '#fff',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          width: '300px'
        }}>
          <h2 style={{ textAlign: 'center' }}>Login</h2>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{
              padding: '10px',
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              padding: '10px',
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}
          />
          {errorMessage && <div style={{ color: 'red', textAlign: 'center' }}>{errorMessage}</div>}
          <button onClick={handleLogin} style={{
            padding: '10px',
            border: 'none',
            borderRadius: '4px',
            background: '#007bff',
            color: '#ffffff',
            cursor: 'pointer',
            marginTop: '10px'
          }}>Login</button>
          <button onClick={handleSignup} style={{
            padding: '10px',
            border: 'none',
            borderRadius: '4px',
            background: '#4CAF50',
            color: '#ffffff',
            cursor: 'pointer',
            marginTop: '0px'
          }}>Sign Up</button>
        </div>
      </div>
    </>
  );
}