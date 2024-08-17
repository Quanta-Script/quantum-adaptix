import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const UserAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

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

  const createToken = (user) => {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(JSON.stringify({
      ...user,
      exp: Math.floor(Date.now() / 1000) + (60 * 60), // 1 hour expiration
    }));
    const signature = btoa('dummy_signature'); // In a real app, use a proper signing method
    return `${header}.${payload}.${signature}`;
  };

  const generateVerificationCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const signup = () => {
    if (username && email && password) {
      const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
      if (existingUsers.some(u => u.username === username)) {
        setError('Username already exists');
        return;
      }
      if (existingUsers.some(u => u.email === email)) {
        setError('Email already exists');
        return;
      }
      const verificationCode = generateVerificationCode();
      const newUser = { 
        id: Date.now().toString(), 
        username, 
        email, 
        password, 
        role: 'user',
        isVerified: false,
        verificationCode
      };
      existingUsers.push(newUser);
      localStorage.setItem('users', JSON.stringify(existingUsers));
      setIsVerifying(true);
      setError('');
      // Simulate sending an email
      console.log(`Verification code for ${email}: ${verificationCode}`);
      alert(`A verification code has been sent to ${email}. Please check your email and enter the code to verify your account.`);
    } else {
      setError('Please enter username, email, and password');
    }
  };

  const verifyEmail = () => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex(u => u.email === email && u.verificationCode === verificationCode);
    if (userIndex !== -1) {
      users[userIndex].isVerified = true;
      localStorage.setItem('users', JSON.stringify(users));
      setIsVerifying(false);
      setError('');
      alert('Email verified successfully. You can now log in.');
    } else {
      setError('Invalid verification code');
    }
  };

  const login = () => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
      if (user.isVerified) {
        authenticateUser(user);
      } else {
        setError('Please verify your email before logging in');
      }
    } else {
      setError('Invalid credentials');
    }
  };

  const authenticateUser = (user) => {
    const token = createToken(user);
    localStorage.setItem('authToken', token);
    setIsAuthenticated(true);
    setUser(user);
    setError('');
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setIsAuthenticated(false);
    setUser(null);
    setError('');
  };

  const toggleSignup = () => {
    setIsSignup(!isSignup);
    setError('');
    setIsVerifying(false);
  };

  return (
    <div className="p-4 border rounded-lg shadow-sm">
      <h2 className="text-xl font-bold mb-4">User Authentication</h2>
      {!isAuthenticated ? (
        <div>
          {!isVerifying ? (
            <>
              <Input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mb-2"
              />
              {isSignup && (
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mb-2"
                />
              )}
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mb-2"
              />
              {isSignup ? (
                <Button onClick={signup} className="mr-2">Sign Up</Button>
              ) : (
                <Button onClick={login} className="mr-2">Login</Button>
              )}
              <Button onClick={toggleSignup} variant="outline">
                {isSignup ? 'Switch to Login' : 'Switch to Sign Up'}
              </Button>
            </>
          ) : (
            <>
              <Input
                type="text"
                placeholder="Verification Code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                className="mb-2"
              />
              <Button onClick={verifyEmail} className="mr-2">Verify Email</Button>
            </>
          )}
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
          <p>Welcome, {user.username}!</p>
          <p>User ID: {user.id}</p>
          <p>Email: {user.email}</p>
          <p>Role: {user.role}</p>
          <Button onClick={logout} className="mt-2">Logout</Button>
        </div>
      )}
    </div>
  );
};

export default UserAuth;