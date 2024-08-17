import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";

const UserAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  const authenticateUser = () => {
    // Simulating authentication process
    setTimeout(() => {
      setIsAuthenticated(true);
      setUser({ id: 'user123', name: 'John Doe' });
    }, 1000);
  };

  return (
    <div className="p-4 border rounded-lg shadow-sm">
      <h2 className="text-xl font-bold mb-4">User Authentication</h2>
      {!isAuthenticated ? (
        <Button onClick={authenticateUser}>Authenticate</Button>
      ) : (
        <div>
          <p>Welcome, {user.name}!</p>
          <p>User ID: {user.id}</p>
        </div>
      )}
    </div>
  );
};

export default UserAuth;