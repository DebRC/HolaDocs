import React, { useState } from 'react';
import axios from 'axios';

export default function Signup() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleSignup = async () => {
        try {
            const res = await axios.post('http://localhost:3001/api/user/auth/signup', { username, password });
            setMessage(res.data.message);
        } catch (error) {
            setMessage(error.response.data.message);
        }
    };

    return (
        <div>
          <h2>Signup</h2>
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
          <button onClick={handleSignup}>Signup</button>
    
          {message && <p>{message}</p>}
        </div>
      );   
}