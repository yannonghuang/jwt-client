//AuthContext.js
import React, {createContext, useState} from 'react';
import * as Keychain from 'react-native-keychain';
import * as SecureStore from 'expo-secure-store';

const _saveToken = async (accessToken, refreshToken) => {
    await Keychain.setGenericPassword("token", 
    JSON.stringify({
      accessToken,
      refreshToken,
    })
  );
}

const _getToken = async (accessToken = true) => {
  let token = await Keychain.getGenericPassword("token");
  if (!token) return null;

  if (accessToken) return JSON.parse(token).accessToken;

  return JSON.parse(token).refreshToken;
}

const saveToken = async (accessToken, refreshToken) => {
  await SecureStore.setItemAsync("token", 
    JSON.stringify({
      accessToken,
      refreshToken,
    })
  );
}

const deleteToken = async () => {
  await SecureStore.deleteItemAsync("token");
}

const getToken = async (accessToken = true) => {
  let token = await SecureStore.getItemAsync("token");
  if (!token) return null;

  if (accessToken) return JSON.parse(token).accessToken;

  return JSON.parse(token).refreshToken;
}

const AuthContext = createContext(null);
const {Provider} = AuthContext;

const AuthProvider = ({children}) => {
  const [authState, setAuthState] = useState({
    accessToken: null,
    refreshToken: null,
    authenticated: null,
  });

  const logout = async () => {
    //await Keychain.resetGenericPassword("token");
    await deleteToken();
    setAuthState({
      accessToken: null,
      refreshToken: null,
      authenticated: false,
    });
  };

  const getAccessToken = () => {
    return authState.accessToken;
  };

  return (
    <Provider
      value={{
        authState,
        getAccessToken,
        setAuthState,
        logout,
        saveToken,
        getToken
      }}>
      {children}
    </Provider>
  );
};

export {AuthContext, AuthProvider};