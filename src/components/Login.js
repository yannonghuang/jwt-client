// src/components/Login.js

import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    TextInput,
    Button,
    Alert,
  } from 'react-native';
  import React, {useContext, useState} from 'react';
  import {AuthContext} from '../context/AuthContext';
  //import * as Keychain from 'react-native-keychain';
  import {AxiosContext} from '../context/AxiosContext';

  const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    const authContext = useContext(AuthContext);
    const {publicAxios} = useContext(AxiosContext);
  
    /*
    const onLogin = () => {
      if (!email || !password) return;

      publicAxios.post('/login', {
        email,
        password,
      })
      .then(response => {
          const {accessToken, refreshToken} = response.data;
          authContext.setAuthState({
            accessToken,
            refreshToken,
            authenticated: true,
          });

          authContext.saveToken(accessToken, refreshToken);
      })
      .catch(e => { console.log(e) });
  
    };
  */

    
    const onLogin = async () => {
        if (!email || !password) return;
  
        try {
          const response = await publicAxios.post('/login', {
            email,
            password,
          });
    
          const {accessToken, refreshToken} = response.data;
          authContext.setAuthState({
            accessToken,
            refreshToken,
            authenticated: true,
          });

          authContext.saveToken(accessToken, refreshToken);

        } catch (error) {
          Alert.alert('Login Failed', error.response.data.message);
        }
      };


    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.logo}>ChatGPT</Text>
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#fefefe"
            keyboardType="email-address"
            autoCapitalize="none"
            onChangeText={text => setEmail(text)}
            value={email}
          />
  
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#fefefe"
            secureTextEntry
            onChangeText={text => setPassword(text)}
            value={password}
          />
        </View>
        <Button title="Login" style={styles.button} onPress={() => onLogin()} />
      </SafeAreaView>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#000',
      alignItems: 'center',
      justifyContent: 'flex-start',
      width: '100%',
    },
    logo: {
      fontSize: 50,
      color: '#fff',
      margin: '20%',
    },
    form: {
      width: '80%',
      margin: '10%',
    },
    input: {
      fontSize: 20,
      color: '#fff',
      paddingBottom: 10,
      borderBottomColor: '#fff',
      borderBottomWidth: 1,
      marginVertical: 20,
    },
    button: {},
  });
  
  export default Login;