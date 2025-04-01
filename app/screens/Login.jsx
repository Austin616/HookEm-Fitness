import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import Colors from '../../assets/colors'; // Adjust the path as necessary
import googleIcon from '../../assets/images/googleIcon.webp'; // Adjust the path as necessary

const Login = () => {
  useEffect(() => {
    
  }, []);

  const signInWithGoogle = async () => {
    try {
      Alert.alert('Google Sign-In Button Pressed');
    } catch (error) {
      console.error(error);
      Alert.alert('Failed to sign in with Google', error.message);
    }
  };

  return (
    <View style={styles.container}>
        <Text style={styles.title}>Welcome Back!</Text>
        <Text style={styles.subtitle}>Please sign in to continue</Text>
      
      <TouchableOpacity onPress={signInWithGoogle} style={styles.googleButton}>
        <View style={styles.buttonContent}>
          <Image source={googleIcon} style={styles.googleIcon} />
          <Text style={styles.buttonText}>Sign In with Google</Text>
        </View>
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
  googleButton: {
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
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  googleIcon: {
    width: 24,
    height: 24,
    marginRight: 8,
    backgroundColor: Colors.white,
    borderRadius: 12,
  },
  buttonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});
