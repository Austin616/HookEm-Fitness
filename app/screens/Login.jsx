import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../../firebaseConfig';  // Import auth correctly from firebaseConfig
import { signInWithEmailAndPassword } from 'firebase/auth';  // Firebase auth method
import Colors from '../../assets/colors';

const Login = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Please fill in both fields');
      return;
    }
  
    try {
      await signInWithEmailAndPassword(auth, email, password);
      Alert.alert('Login Successful', `Welcome back ${email}!`);
      console.log('Login successful!');
      navigation.navigate('Dashboard');
    } catch (error) {
      console.error('Error during login:', error.code, error.message);
      if (error.code === 'auth/invalid-email') {
        Alert.alert('Invalid Email', 'Please enter a valid email address.');
      } else if (error.code === 'auth/wrong-password') {
        Alert.alert('Incorrect Password', 'The password you entered is incorrect.');
      } else {
        Alert.alert('Failed to log in', error.message);
      }
    }
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back!</Text>
      <Text style={styles.subtitle}>Please sign in to continue</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity onPress={handleLogin} style={styles.signInButton}>
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Login;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: '700',
    color: Colors.ut_burnt_orange,
    marginBottom: 12,
    textAlign: 'center',
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 20,
    color: Colors.dark_gray,
    marginBottom: 50,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  input: {
    width: '100%',
    padding: 12,
    marginBottom: 20,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: Colors.dark_gray,
    backgroundColor: Colors.white,
    fontSize: 16,
  },
  signInButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: Colors.ut_burnt_orange,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
    elevation: 5, // For Android
  },
  buttonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  forgotPasswordLink: {
    marginTop: 10,
  },
  forgotPasswordText: {
    color: Colors.ut_burnt_orange,
    fontSize: 16,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});
