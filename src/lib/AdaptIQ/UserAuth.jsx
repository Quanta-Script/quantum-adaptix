import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const UserAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const { exp, user } = JSON.parse(atob(token.split('.')[1]));
        if (Date.now() >= exp * 1000) {
          logout();
        } else {
          setIsAuthenticated(true);
          setUser(user);
        }
      } catch (error) {
        console.error('Error parsing token:', error);
        logout();
      }
    }
  };

  const authenticateUser = () => {
    if (username === 'admin' && password === 'password') {
      const user = { id: 'user123', name: username, role: 'admin' };
      const token = createToken(user);
      localStorage.setItem('authToken', token);
      setIsAuthenticated(true);
      setUser(user);
      setError('');
    } else {
      setError('Invalid credentials');
    }
  };

  const createToken = (user) => {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(JSON.stringify({
      ...user,
      exp: Math.floor(Date.now() / 1000) + (60 * 60), // 1 hour expiration
    }));
    const signature = btoa('dummy_signature'); // In a real app, use a proper signing method
    return `${header}.${payload}.${signature}`;
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setIsAuthenticated(false);
    setUser(null);
    setError('');
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
          {error && (
            <Alert variant="destructive" className="mt-2">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
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