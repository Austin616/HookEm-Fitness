// HomeScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Colors from '../../assets/colors';
import bevoWorkout from '../../assets/images/bevoworkout.png'; // Adjust the path as necessary

const LandingScreen = () => {
  const navigation = useNavigation();
  
  // Mocking the logged-in state (replace this with actual auth state)
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Here you would normally check if the user is logged in
    // For example, using Firebase or AsyncStorage for persistent state
    // setIsLoggedIn(true);  // Uncomment this line to simulate logged in state
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Welcome</Text>
      <Text style={styles.appNameText}>to Hook 'Em Fitness</Text>
      <Text style={styles.subTitle}>Your fitness journey starts here!</Text>

      {/* Image Section */}
      <View style={styles.imageContainer}>
        <Image 
          source={bevoWorkout}
          style={styles.logo}
        />
      </View>

      {/* Login/Sign Up Buttons or Dashboard */}
      {isLoggedIn ? (
        <TouchableOpacity
          onPress={() => navigation.navigate('Dashboard')}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Go to Dashboard</Text>
        </TouchableOpacity>
      ) : (
        <>
          <TouchableOpacity
            onPress={() => navigation.navigate('Login')}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={() => navigation.navigate('SignUp')}
            style={[styles.button, styles.signUpButton]}
          >
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

export default LandingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  imageContainer: {
    width: 300,
    height: 300,
    marginBottom: 40,
    backgroundColor: Colors.landing_page_logo,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 60,
    padding: 20, 
  },
  logo: {
    width: '100%',
    height: '110%',
    resizeMode: 'contain',
  },
  welcomeText: {
    fontSize: 36,
    fontWeight: '700',  // Make it bold and prominent
    color: Colors.dark_gray, 
    marginBottom: 12,
    textAlign: 'center',
    letterSpacing: 2,
  },
  appNameText: {
    fontSize: 40,  // Slightly larger for emphasis
    fontWeight: '700',  // Bold and prominent
    color: Colors.ut_burnt_orange,
    textAlign: 'center',
    marginBottom: 10,
    letterSpacing: 1.5,
  },
  subTitle: {
    fontSize: 20,
    color: Colors.dark_gray,
    marginBottom: 50,
    textAlign: 'center',
    fontStyle: 'italic',  // Subtle contrast with the title
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: Colors.ut_burnt_orange,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  signUpButton: {
    backgroundColor: Colors.dark_gray, 
  },
});
