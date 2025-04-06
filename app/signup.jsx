import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  TextInput,
} from "react-native";
import { useRouter } from "expo-router"; // Use Expo Router
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import Colors from "../assets/colors"; // Adjust path based on your project
import CustomHeader from "./components/CustomHeader";

export default function SignUp() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleSignUp = async () => {
    if (!email || !password || !name) {
      Alert.alert("Please fill in all fields");
      return;
    }

    try {
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Update user profile with name
      await updateProfile(user, { displayName: name });

      // Save user data to Firestore
      const db = getFirestore();
      await setDoc(doc(db, "users", user.uid), {
        name: name,
        email: email,
        height: "",
        weight: "",
        goal: "",
        targetWeight: "",
      });

      Alert.alert("Sign Up Successful", `Welcome ${name}!`);

      // Navigate to the Tutorial screen using Expo Router
      router.replace("/tutorial");
    } catch (error) {
      console.error(error);
      Alert.alert("Failed to sign up", error.message);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.primary, padding: 16 }}>
      <CustomHeader showBackButton />
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: Colors.primary,
  },
  title: {
    fontSize: 36,
    fontWeight: "700",
    color: Colors.ut_burnt_orange,
    marginBottom: 12,
    textAlign: "center",
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.gray,
    marginBottom: 20,
  },
  input: {
    width: "100%",
    padding: 12,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    marginBottom: 15,
  },
  signUpButton: {
    backgroundColor: Colors.ut_burnt_orange,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "bold",
  },
});
