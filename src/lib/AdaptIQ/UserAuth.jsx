import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { supabase } from '../supabase';

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
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        setIsAuthenticated(true);
        setUser(session.user);
      } else if (event === 'SIGNED_OUT') {
        setIsAuthenticated(false);
        setUser(null);
      }
    });

    checkAuthStatus();

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const checkAuthStatus = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setIsAuthenticated(true);
      setUser(user);
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

  const signup = async () => {
    if (username && email && password) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email: email,
          password: password,
          options: {
            data: {
              username: username,
              role: 'user'
            }
          }
        });
        if (error) throw error;
        setError('');
        alert('Signup successful! Please check your email to verify your account.');
      } catch (error) {
        setError(error.message);
      }
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

  const login = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });
      if (error) throw error;
      setIsAuthenticated(true);
      setUser(data.user);
      setError('');
    } catch (error) {
      setError(error.message);
    }
  };

  const authenticateUser = (user) => {
    const token = createToken(user);
    localStorage.setItem('authToken', token);
    setIsAuthenticated(true);
    setUser(user);
    setError('');
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setIsAuthenticated(false);
      setUser(null);
      setError('');
    } catch (error) {
      setError(error.message);
    }
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