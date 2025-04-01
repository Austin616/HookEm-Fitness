import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, TouchableOpacity, Image, TextInput, Alert, ScrollView } from "react-native";
import * as ImagePicker from "expo-image-picker"; 
import { storage, db } from "../../firebaseConfig";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"; 
import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore"; 
import Colors from "../../assets/colors";
import profileIcon from "../../assets/images/profile-icon.png";
import { useNavigation } from "@react-navigation/native"; // Import useNavigation for navigation

function Settings({ onSignOut, userId }) {
  const [profilePicture, setProfilePicture] = useState(profileIcon);
  const [hasPermission, setHasPermission] = useState(null);
  const navigation = useNavigation(); // Import useNavigation to navigate after saving changes
  
  // State for the editable fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [goal, setGoal] = useState("");
  const [targetWeight, setTargetWeight] = useState("");

  useEffect(() => {
    const getPermission = async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      setHasPermission(status === "granted");
    };
    getPermission();
  }, []);

  // Fetch the profile data when the component loads
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const userDocRef = doc(db, "users", userId);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setName(userData.name || "");
          setEmail(userData.email || "");
          setHeight(userData.height || "");
          setWeight(userData.weight || "");
          setGoal(userData.goal || "");
          setTargetWeight(userData.targetWeight || "");
          if (userData.profilePicture) {
            setProfilePicture({ uri: userData.profilePicture });
          }
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    if (userId) {
      fetchProfileData();
    }
  }, [userId]);

  // Function to handle profile picture change
  const handleChangeProfilePicture = async () => {
    if (hasPermission === null || !hasPermission) {
      Alert.alert("Permission not granted", "You need to grant permission to access the media library.");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1], // Square crop
      quality: 1, // High quality
    });

    if (!result.canceled) {
      const selectedImage = result.assets[0].uri;
      setProfilePicture({ uri: selectedImage });

      // Upload the image to Firebase Storage
      const response = await fetch(selectedImage);
      const blob = await response.blob();
      const storageRef = ref(storage, `profilePictures/${userId}.jpg`);
      const uploadTask = uploadBytesResumable(storageRef, blob);

      uploadTask.on(
        "state_changed",
        null,
        (error) => {
          console.error("Upload error:", error);
          Alert.alert("Upload failed", "There was an error uploading your profile picture.");
        },
        async () => {
          // Get the download URL and update Firestore
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          const userDocRef = doc(db, "users", userId);
          await updateDoc(userDocRef, { profilePicture: downloadURL });
          Alert.alert("Success", "Profile picture updated successfully!");
        }
      );
    } else {
      console.log("Image selection was canceled or failed.");
    }
  };

 const handleSaveChanges = async () => {
  try {
    const userDocRef = doc(db, "users", userId);
    
    // Prepare the data, ensuring the profile picture is included
    const updatedProfileData = {
      name: name,
      email: email,
      height: height,
      weight: weight,
      goal: goal,
      targetWeight: targetWeight,
      profilePicture: profilePicture.uri || profilePicture, // Preserve existing profile picture if not updated
    };
    
    // Update the Firestore document
    await updateDoc(userDocRef, updatedProfileData);
    Alert.alert("Success", "Profile updated successfully!");
    navigation.navigate('Dashboard'); 
  } catch (error) {
    console.error("Error updating profile:", error);
    Alert.alert("Error", "There was an error updating your profile.");
  }
};


  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity onPress={handleChangeProfilePicture}>
        <Image source={profilePicture} style={styles.profileImage} />
      </TouchableOpacity>
      
      <Text style={styles.title}>Settings</Text>

      <View style={styles.settingsSection}>
        <Text style={styles.settingLabel}>Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Enter your name"
        />
      </View>

      <View style={styles.settingsSection}>
        <Text style={styles.settingLabel}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Enter your email"
        />
      </View>

      <View style={styles.settingsSection}>
        <Text style={styles.settingLabel}>Height</Text>
        <TextInput
          style={styles.input}
          value={height}
          onChangeText={setHeight}
          placeholder="Enter your height"
        />
      </View>

      <View style={styles.settingsSection}>
        <Text style={styles.settingLabel}>Weight</Text>
        <TextInput
          style={styles.input}
          value={weight}
          onChangeText={setWeight}
          placeholder="Enter your weight"
        />
      </View>

      <View style={styles.settingsSection}>
        <Text style={styles.settingLabel}>Goal</Text>
        <TextInput
          style={styles.input}
          value={goal}
          onChangeText={setGoal}
          placeholder="Enter your goal"
        />
      </View>

      <View style={styles.settingsSection}>
        <Text style={styles.settingLabel}>Target Weight</Text>
        <TextInput
          style={styles.input}
          value={targetWeight}
          onChangeText={setTargetWeight}
          placeholder="Enter your target weight"
        />
      </View>

      <TouchableOpacity onPress={handleSaveChanges}>
        <Text style={styles.saveChangesText}>Save Changes</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={onSignOut}>
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

export default Settings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
    padding: 20,
  },
  profileImage: {
    width: 140,
    height: 140,
    borderRadius: 70, 
    marginBottom: 30,
    borderWidth: 3,
    borderColor: Colors.ut_burnt_orange,
    backgroundColor: Colors.landing_page_logo,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    marginBottom: 20,
    color: Colors.dark_gray,
  },
  settingsSection: {
    width: "100%",
    paddingVertical: 10,
    marginBottom: 15,
  },
  settingLabel: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.dark_gray,
  },
  input: {
    fontSize: 16,
    color: Colors.dark_gray,
    borderWidth: 1,
    borderColor: Colors.light_gray,
    padding: 10,
    marginTop: 5,
    borderRadius: 5,
  },
  saveChangesText: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.ut_burnt_orange,
    textAlign: "center",
    
    paddingVertical: 10,
    borderRadius: 5,
    
  },

  signOutText: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.red, // Use a contrasting color for sign out
    textAlign: "center",
    marginBottom: 20,
    paddingVertical: 10,
    borderRadius: 5,
    
  },
});
