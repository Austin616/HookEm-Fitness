import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, TextInput } from 'react-native';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'; // Firebase Auth imports
import Colors from '../../assets/colors'; // Adjust the path as necessary

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = async () => {
    if (!email || !password) {
      Alert.alert('Please fill in both fields');
      return;
    }

    try {
      const auth = getAuth(); // Initialize Firebase Auth
      await createUserWithEmailAndPassword(auth, email, password); // Sign up user with email and password
      Alert.alert('Sign Up Successful', `Welcome ${email}!`);
      // Optionally, navigate to the login page or dashboard after sign-up
      // navigation.navigate('Login'); // Uncomment if you are using react-navigation
    } catch (error) {
      console.error(error);
      Alert.alert('Failed to sign up', error.message); // Show the error message if signup fails
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Join Us!</Text>
      <Text style={styles.subtitle}>Create an account to get started</Text>

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

      <TouchableOpacity onPress={handleSignUp} style={styles.signUpButton}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SignUp;

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
  signUpButton: {
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
});
