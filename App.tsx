// App.js

import React, {useCallback, useContext, useEffect, useState} from 'react';
import Login from './src/components/Login';
import {AuthContext} from './src/context/AuthContext';
import * as Keychain from 'react-native-keychain';
import Dashboard from './src/components/Dashboard';
import Spinner from './src/components/Spinner';

import AppContainer from './src/navigations/AppNavigation';

const App = () => {
  const authContext = useContext(AuthContext);
  const [status, setStatus] = useState('loading');

  const loadJWT = useCallback(async () => {
    try {

      const accessToken = await authContext.getToken();
      const refreshToken = await authContext.getToken(false);

      authContext.setAuthState({
        accessToken: accessToken || null,
        refreshToken: refreshToken || null,
        authenticated: accessToken !== null,
      });
      setStatus('success');
    } catch (error) {
      setStatus('error');
      console.log(`Keychain Error: ${error.message}`);
      authContext.setAuthState({
        accessToken: null,
        refreshToken: null,
        authenticated: false,
      });
    }
  }, []);

  useEffect(() => {
    loadJWT();
  }, [loadJWT]);

  if (status === 'loading') {
    return <Spinner />;
  }

  if (authContext?.authState?.authenticated === true ) {
    return <AppContainer />;
  } else {
    return <Login />;
  }
/*
  if (authContext?.authState?.authenticated === false || authContext?.authState?.authenticated === null) {
    return <Login />;
  } else {
    return <AppContainer />;
  }
*/

};

export default App;