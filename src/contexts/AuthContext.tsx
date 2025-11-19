'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { onAuthChange, signOut as firebaseSignOut } from '@/lib/firebase/auth';
import { Mixpanel } from '@/lib/mixpanel';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<{ error: string | null }>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signOut: async () => ({ error: null })
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthChange((user) => {
      setUser(user);
      setLoading(false);

      // Track user in Mixpanel
      if (user) {
        // User logged in - identify them
        Mixpanel.identify(user.uid);
        Mixpanel.setUserProperties({
          $email: user.email,
          $name: user.displayName || user.email?.split('@')[0] || 'Unknown',
          signInProvider: user.providerData[0]?.providerId || 'unknown',
        });
        Mixpanel.trackEvent('User Logged In');
      } else {
        // User logged out
        Mixpanel.trackEvent('User Logged Out');
      }
    });

    return () => unsubscribe();
  }, []);

  const signOut = async () => {
    return await firebaseSignOut();
  };

  return (
    <AuthContext.Provider value={{ user, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
