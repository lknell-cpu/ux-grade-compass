import React, { createContext, useContext, useEffect, useState } from 'react';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { auth, googleProvider } from './firebase';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      // Check if user email ends with @salesforce.com
      if (currentUser && currentUser.email) {
        if (currentUser.email.toLowerCase().endsWith('@salesforce.com')) {
          setUser(currentUser);
          setError(null);
        } else {
          // Sign out users with non-Salesforce emails
          signOut(auth);
          setUser(null);
          setError('Access restricted to @salesforce.com email addresses only.');
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const loginWithGoogle = async () => {
    try {
      setError(null);
      const result = await signInWithPopup(auth, googleProvider);
      
      // Double-check the email domain
      if (!result.user.email.toLowerCase().endsWith('@salesforce.com')) {
        await signOut(auth);
        setError('Access restricted to @salesforce.com email addresses only.');
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message);
      return false;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setError(null);
    } catch (error) {
      console.error('Logout error:', error);
      setError(error.message);
    }
  };

  const value = {
    user,
    loading,
    error,
    loginWithGoogle,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

