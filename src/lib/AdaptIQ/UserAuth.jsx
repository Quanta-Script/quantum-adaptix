import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import jwt from 'jsonwebtoken';

const UserAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');

  const authenticateUser = () => {
    if (username === 'admin' && password === 'password') {
      const token = jwt.sign({ id: 'user123', username }, 'secret_key', { expiresIn: '1h' });
      setToken(token);
      setIsAuthenticated(true);
      setUser({ id: 'user123', name: username, role: 'admin' });
      localStorage.setItem('authToken', token);
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setToken('');
    localStorage.removeItem('authToken');
  };

  const refreshToken = () => {
    const currentToken = localStorage.getItem('authToken');
    if (currentToken) {
      try {
        const decoded = jwt.verify(currentToken, 'secret_key');
        const newToken = jwt.sign({ id: decoded.id, username: decoded.username }, 'secret_key', { expiresIn: '1h' });
        setToken(newToken);
        localStorage.setItem('authToken', newToken);
      } catch (error) {
        console.error('Invalid token, logging out');
        logout();
      }
    }
  };

  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      try {
        const decoded = jwt.verify(storedToken, 'secret_key');
        setUser({ id: decoded.id, name: decoded.username, role: 'admin' });
        setIsAuthenticated(true);
        setToken(storedToken);
      } catch (error) {
        console.error('Invalid token');
        logout();
      }
    }

    const tokenRefreshInterval = setInterval(refreshToken, 30 * 60 * 1000); // Refresh every 30 minutes

    return () => clearInterval(tokenRefreshInterval);
  }, []);

  return (
    <div className="p-4 border rounded-lg shadow-sm">
      <h2 className="text-xl font-bold mb-4">User Authentication</h2>
      {!isAuthenticated ? (
        <div>
          <Input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mb-2"
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mb-2"
          />
          <Button onClick={authenticateUser}>Authenticate</Button>
        </div>
      ) : (
        <div>
          <p>Welcome, {user.name}!</p>
          <p>User ID: {user.id}</p>
          <p>Role: {user.role}</p>
          <Button onClick={logout} className="mt-2">Logout</Button>
        </div>
      )}
    </div>
  );
};

export default UserAuth;