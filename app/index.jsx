import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { useRouter } from "expo-router";
import Colors from "../assets/colors";
import bevoWorkout from "../assets/images/bevoworkout.png";
import { auth } from "../firebaseConfig"; // Adjust the path as necessary
import { useUser } from "./UserContext"; // Import the user context

export default function LandingScreen() {
  const router = useRouter();
  const { userId, setUserId, handleSignOut } = useUser(); // Access user context
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setIsLoggedIn(true);
        setUserId(user.uid); // Set user ID in context
        router.replace("/dashboard"); // Redirect to dashboard if logged in
      } else {
        setIsLoggedIn(false);
        setUserId(null); // Reset user ID if logged out
      }
    });

    return () => unsubscribe();
  }, [router, setUserId]);

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Welcome</Text>
      <Text style={styles.appNameText}>to Hook 'Em Fitness</Text>
      <Text style={styles.subTitle}>Your fitness journey starts here!</Text>

      {/* Image Section */}
      <View style={styles.imageContainer}>
        <Image source={bevoWorkout} style={styles.logo} />
      </View>

      {/* Login/Sign Up Buttons */}
      {isLoggedIn ? (
        <TouchableOpacity onPress={() => router.push("/dashboard")} style={styles.button}>
          <Text style={styles.buttonText}>Go to Dashboard</Text>
        </TouchableOpacity>
      ) : (
        <>
          <TouchableOpacity onPress={() => router.push("/login")} style={styles.button}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push("/signup")} style={[styles.button, styles.signUpButton]}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  imageContainer: {
    width: 300,
    height: 300,
    marginBottom: 40,
    backgroundColor: Colors.landing_page_logo,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 60,
    padding: 20,
  },
  logo: {
    width: "100%",
    height: "110%",
    resizeMode: "contain",
  },
  welcomeText: {
    fontSize: 36,
    fontWeight: "700",
    color: Colors.dark_gray,
    marginBottom: 12,
    textAlign: "center",
    letterSpacing: 2,
  },
  appNameText: {
    fontSize: 40,
    fontWeight: "700",
    color: Colors.ut_burnt_orange,
    textAlign: "center",
    marginBottom: 10,
    letterSpacing: 1.5,
  },
  subTitle: {
    fontSize: 20,
    color: Colors.dark_gray,
    marginBottom: 50,
    textAlign: "center",
    fontStyle: "italic",
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: Colors.ut_burnt_orange,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 15,
  },
  buttonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
  signUpButton: {
    backgroundColor: Colors.dark_gray,
  },
});
