import React, { useState } from 'react';
import axios from 'axios';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [token, setToken] = useState('');

    const handleLogin = async () => {
        try {
            const res = await axios.post('http://localhost:3001/api/user/auth/login', { username, password });
            setToken(res.data.token);
            setMessage('Login successful. Token: ' + res.data.token);
            localStorage.setItem('token', res.data.token);
        } catch (error) {
            setMessage(error.response.data.message);
        }
    };

    return (
        <div>    
          <h2>Login</h2>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={handleLogin}>Login</button>
    
          {message && <p>{message}</p>}
        </div>
      );   
}