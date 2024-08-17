import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import * as jose from 'jose';

const UserAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');

  const secret = new TextEncoder().encode('your_secret_key');

  const authenticateUser = async () => {
    if (username === 'admin' && password === 'password') {
      const jwt = await new jose.SignJWT({ id: 'user123', username })
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime('1h')
        .sign(secret);
      
      setToken(jwt);
      setIsAuthenticated(true);
      setUser({ id: 'user123', name: username, role: 'admin' });
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setToken('');
  };

  useEffect(() => {
    const verifyToken = async () => {
      if (token) {
        try {
          const { payload } = await jose.jwtVerify(token, secret);
          setUser({ id: payload.id, name: payload.username, role: 'admin' });
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Invalid token');
          logout();
        }
      }
    };

    verifyToken();
  }, [token]);

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