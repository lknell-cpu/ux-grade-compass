import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      
      // Check if user email ends with @salesforce.com
      if (user && user.email) {
        const authorized = user.email.toLowerCase().endsWith('@salesforce.com');
        setIsAuthorized(authorized);
        
        if (!authorized) {
          console.warn('Unauthorized email domain:', user.email);
          // You could sign them out here if desired
          // await signOut(auth);
        }
      } else {
        setIsAuthorized(false);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return { user, loading, isAuthorized };
}

