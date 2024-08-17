import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const UserAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      setIsAuthenticated(true);
      setUser(storedUser);
    }
  }, []);

  const authenticateUser = () => {
    if (username === 'admin' && password === 'password') {
      const user = { id: 'user123', name: username, role: 'admin' };
      const token = btoa(JSON.stringify(user)); // Simple encoding, not secure for production
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(user));
      setIsAuthenticated(true);
      setUser(user);
    } else {
      alert('Invalid credentials');
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
  };

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
          <Button onClick={logout}>Logout</Button>
        </div>
      )}
    </div>
  );
};

export default UserAuth;