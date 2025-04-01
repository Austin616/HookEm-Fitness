import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, TextInput } from 'react-native';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore'; // Firestore imports
import Colors from '../../assets/colors'; // Adjust the path as necessary
import { useNavigation } from '@react-navigation/native'; // Import useNavigation

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState(''); // New state for user's name

  const navigation = useNavigation(); // Initialize navigation

  const handleSignUp = async () => {
    if (!email || !password || !name) {
      Alert.alert('Please fill in all fields');
      return;
    }

    try {
      const auth = getAuth(); // Initialize Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update user profile with name
      await updateProfile(user, { displayName: name });

      // Save user data to Firestore
      const db = getFirestore(); // Initialize Firestore
      await setDoc(doc(db, 'users', user.uid), {
        name: name,
        email: email,
        height: '', // Add other fields that will be updated later
        weight: '',
        goal: '',
        targetWeight: '',
      });

      Alert.alert('Sign Up Successful', `Welcome ${name}!`);

      // Navigate to the Tutorial screen after sign-up
      navigation.navigate('Tutorial');
    } catch (error) {
      console.error(error);
      Alert.alert('Failed to sign up', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Join Us!</Text>
      <Text style={styles.subtitle}>Create an account to get started</Text>

      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        value={email}
        placeholder="Email"
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
    padding: 20,
    backgroundColor: Colors.primary, // Use your theme color
  },
  title: {
    fontSize: 36,
    fontWeight: '700',
    color: Colors.ut_burnt_orange,
    marginBottom: 12,
    textAlign: 'center',
    letterSpacing: 2
  },
  subtitle: {
    fontSize: 16,
    color: Colors.gray, // Use your theme color
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 12,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: Colors.lightGray, // Use your theme color
    marginBottom: 15,
  },
  signUpButton: {
    backgroundColor: Colors.ut_burnt_orange, // Use your theme color
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: Colors.white, // Use your theme color
    fontSize: 16,
    fontWeight: 'bold',
  },
});
