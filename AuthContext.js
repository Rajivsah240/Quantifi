import React, {createContext, useState, useEffect, useContext} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
  const [user, setUser] = useState(null);
  const [signInMethod, setSignInMethod] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await AsyncStorage.getItem('userData');
        const method = await AsyncStorage.getItem('signInMethod');
        if (userData) {
          setUser(JSON.parse(userData));
          setSignInMethod(method);
        }
      } catch (error) {
        console.error('Failed to load user data', error);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (userData, method) => {
    setUser(userData);
    setSignInMethod(method); 
    await AsyncStorage.setItem('userData', JSON.stringify(userData));
    await AsyncStorage.setItem('signInMethod', method); 
  };

  const logout = async () => {
    setUser(null);
    setSignInMethod(null);
    await AsyncStorage.removeItem('userData');
    await AsyncStorage.removeItem('signInMethod');
  };

  return (
    <AuthContext.Provider value={{user, signInMethod, loading, login, logout}}>
      {children}
    </AuthContext.Provider>
  );
};

export const userContext = () => {
  return useContext(AuthContext);
};
