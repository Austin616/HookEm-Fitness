import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, TouchableOpacity, Image, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker"; 
import { storage, db } from "../../firebaseConfig";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"; 
import { doc, getDoc, updateDoc } from "firebase/firestore"; 
import Colors from "../../assets/colors";
import profileIcon from "../../assets/images/profile-icon.png";

function Settings({ onSignOut, userId }) {
  const [profilePicture, setProfilePicture] = useState(profileIcon);
  const [hasPermission, setHasPermission] = useState(null);
  
  useEffect(() => {
    const getPermission = async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      setHasPermission(status === "granted");
    };
    getPermission();
  }, []);

  // Fetch the profile picture URL when the component loads
  useEffect(() => {
    const fetchProfilePicture = async () => {
      try {
        const userDocRef = doc(db, "users", userId);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          if (userData.profilePicture) {
            setProfilePicture({ uri: userData.profilePicture });
          }
        }
      } catch (error) {
        console.error("Error fetching profile picture:", error);
      }
    };

    if (userId) {
      fetchProfilePicture();
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
      aspect: [1, 1],
      quality: 1,
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

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleChangeProfilePicture}>
        <Image source={profilePicture} style={styles.profileImage} />
      </TouchableOpacity>
      <Text style={styles.title}>Settings</Text>
      <Text style={styles.description}>
        This is the settings screen. Here you can manage your account,
        preferences, and more.
      </Text>
      <TouchableOpacity style={styles.button} onPress={onSignOut}>
        <Text style={styles.buttonText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}

export default Settings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.primary,
    padding: 20,
  },
  profileImage: {
    width: 160,
    height: 160,
    borderRadius: 80,
    marginBottom: 30, 
    borderWidth: 2,
    borderColor: Colors.ut_burnt_orange,
    backgroundColor: Colors.landing_page_logo,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    marginBottom: 20,
    color: Colors.dark_gray,
  },
  description: {
    fontSize: 18,
    color: Colors.dark_gray,
    textAlign: "center",
    paddingHorizontal: 30,
    marginBottom: 30, 
  },
  button: {
    marginTop: 20, 
    paddingVertical: 14, 
    paddingHorizontal: 35, 
    backgroundColor: Colors.ut_burnt_orange,
    borderRadius: 8, 
    elevation: 4, 
  },
  buttonText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center", 
  },
});
