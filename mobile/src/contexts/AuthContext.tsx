import AsyncStorage from '@react-native-async-storage/async-storage';
import type { PropsWithChildren } from 'react';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api, setAuthToken } from '../services/api';
import type { AuthResponse, User } from '../types/api';

const storageKeys = {
  token: '@StockFlow:token',
  user: '@StockFlow:user'
};

type SignInCredentials = {
  email: string;
  password: string;
};

type AuthContextData = {
  user: User | null;
  token: string | null;
  loading: boolean;
  signIn: (credentials: SignInCredentials) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextData | undefined>(undefined);

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const hydrateSession = useCallback(async () => {
    try {
      const [storedToken, storedUser] = await Promise.all([
        AsyncStorage.getItem(storageKeys.token),
        AsyncStorage.getItem(storageKeys.user)
      ]);

      if (storedToken && storedUser) {
        setAuthToken(storedToken);
        setToken(storedToken);
        setUser(JSON.parse(storedUser) as User);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void hydrateSession();
  }, [hydrateSession]);

  const signIn = useCallback(async (credentials: SignInCredentials) => {
    const { data } = await api.post<AuthResponse>('/auth/login', credentials);

    await Promise.all([
      AsyncStorage.setItem(storageKeys.token, data.token),
      AsyncStorage.setItem(storageKeys.user, JSON.stringify(data.user))
    ]);

    setAuthToken(data.token);
    setToken(data.token);
    setUser(data.user);
  }, []);

  const signOut = useCallback(async () => {
    await Promise.all([
      AsyncStorage.removeItem(storageKeys.token),
      AsyncStorage.removeItem(storageKeys.user)
    ]);

    setAuthToken(undefined);
    setToken(null);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, token, loading, signIn, signOut }),
    [user, token, loading, signIn, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider.');
  }

  return context;
}

