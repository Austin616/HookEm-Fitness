import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Picker } from "@react-native-picker/picker";
import { storage, db } from "../../firebaseConfig";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import Colors from "../../assets/colors";
import profileIcon from "../../assets/images/profile-icon.png";
import { useNavigation } from "@react-navigation/native";

function Settings({ onSignOut, userId }) {
  const [profilePicture, setProfilePicture] = useState(profileIcon);
  const [newProfilePicture, setNewProfilePicture] = useState(null);
  const [hasPermission, setHasPermission] = useState(null);
  const navigation = useNavigation();

  // Editable fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [heightFeet, setHeightFeet] = useState("5");
  const [heightInches, setHeightInches] = useState("0");
  const [weight, setWeight] = useState("");
  const [goal, setGoal] = useState("");
  const [targetWeight, setTargetWeight] = useState("");
  const [isHeightPickerVisible, setIsHeightPickerVisible] = useState(false);
  const [isWeightPickerVisible, setIsWeightPickerVisible] = useState(false);
  const [isGoalPickerVisible, setIsGoalPickerVisible] = useState(false);
  const [isTargetWeightPickerVisible, setIsTargetWeightPickerVisible] =
    useState(false);

  useEffect(() => {
    const getPermission = async () => {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      setHasPermission(status === "granted");
    };
    getPermission();
  }, []);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const userDocRef = doc(db, "users", userId);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setName(userData.name || "");
          setEmail(userData.email || "");
          setHeightFeet(userData.height?.split("'")[0] || "5");
          setHeightInches(
            userData.height?.split("'")[1]?.replace("in", "").trim() || "0"
          );
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

  const handleChangeProfilePicture = async () => {
    if (!hasPermission) {
      Alert.alert(
        "Permission not granted",
        "You need to grant permission to access the media library."
      );
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
      setNewProfilePicture(selectedImage);
    }
  };

  const uploadProfilePicture = async () => {
    if (!newProfilePicture) return null;

    try {
      const response = await fetch(newProfilePicture);
      const blob = await response.blob();
      const storageRef = ref(storage, `profilePictures/${userId}.jpg`);
      const uploadTask = uploadBytesResumable(storageRef, blob);

      return new Promise((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          null,
          (error) => {
            console.error("Upload error:", error);
            Alert.alert(
              "Upload failed",
              "There was an error uploading your profile picture."
            );
            reject(error);
          },
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(downloadURL);
          }
        );
      });
    } catch (error) {
      console.error("Error uploading image:", error);
      return null;
    }
  };

  const handleSaveChanges = async () => {
    try {
      const userDocRef = doc(db, "users", userId);
      let profileImageUrl = profilePicture.uri;

      if (newProfilePicture) {
        profileImageUrl = await uploadProfilePicture();
        setProfilePicture({ uri: profileImageUrl });
      }

      const updatedProfileData = {
        name,
        email,
        height: `${heightFeet}' ${heightInches}in`,
        weight,
        goal,
        targetWeight,
        profilePicture: profileImageUrl,
      };

      await updateDoc(userDocRef, updatedProfileData);
      setNewProfilePicture(null);
      Alert.alert("Success", "Profile updated successfully!");
      navigation.navigate("Dashboard");
    } catch (error) {
      console.error("Error updating profile:", error);
      Alert.alert("Error", "There was an error updating your profile.");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity onPress={handleChangeProfilePicture}>
        <Image
          source={
            newProfilePicture ? { uri: newProfilePicture } : profilePicture
          }
          style={styles.profileImage}
        />
      </TouchableOpacity>

      <Text style={styles.title}>Settings</Text>

      {[
        { label: "Name", value: name, setter: setName },
        { label: "Email", value: email, setter: setEmail },
      ].map((field, index) => (
        <View key={index} style={styles.settingsSection}>
          <Text style={styles.settingLabel}>{field.label}</Text>
          <TextInput
            style={styles.input}
            value={field.value}
            onChangeText={field.setter}
            placeholder={`Enter ${field.label}`}
          />
        </View>
      ))}

      {/* Height */}
      <View style={styles.settingsSection}>
        <Text style={styles.settingLabel}>Height</Text>
        {!isHeightPickerVisible ? (
          <TouchableOpacity onPress={() => setIsHeightPickerVisible(true)}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputText}>
                {heightFeet} ft {heightInches} in
              </Text>
            </View>
          </TouchableOpacity>
        ) : (
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={heightFeet}
              onValueChange={(itemValue) => setHeightFeet(itemValue)}
              style={styles.picker}
            >
              {[...Array(5).keys()].map((i) => (
                <Picker.Item key={i} label={`${i + 3} ft`} value={`${i + 3}`} />
              ))}
            </Picker>

            <Picker
              selectedValue={heightInches}
              onValueChange={(itemValue) => setHeightInches(itemValue)}
              style={styles.picker}
            >
              {[...Array(12).keys()].map((i) => (
                <Picker.Item key={i} label={`${i} in`} value={`${i}`} />
              ))}
            </Picker>
          </View>
        )}

        {isHeightPickerVisible && (
          <TouchableOpacity
            style={styles.doneButton}
            onPress={() => setIsHeightPickerVisible(false)}
          >
            <Text style={styles.doneButtonText}>Done</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Weight */}
      <View style={styles.settingsSection}>
        <Text style={styles.settingLabel}>Weight</Text>
        {!isWeightPickerVisible ? (
          <TouchableOpacity onPress={() => setIsWeightPickerVisible(true)}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputText}>
                {weight ? `${weight} lbs` : "Select your weight"}
              </Text>
            </View>
          </TouchableOpacity>
        ) : (
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={weight}
              onValueChange={(itemValue) => setWeight(itemValue)}
              style={styles.picker}
            >
              {[...Array(300).keys()].map((i) => (
                <Picker.Item
                  key={i}
                  label={`${i + 1} lbs`}
                  value={`${i + 1}`}
                />
              ))}
            </Picker>
          </View>
        )}

        {isWeightPickerVisible && (
          <TouchableOpacity
            style={styles.doneButton}
            onPress={() => setIsWeightPickerVisible(false)}
          >
            <Text style={styles.doneButtonText}>Done</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Goal */}
      <View style={styles.settingsSection}>
        <Text style={styles.settingLabel}>Goal</Text>
        {!isGoalPickerVisible ? (
          <TouchableOpacity onPress={() => setIsGoalPickerVisible(true)}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputText}>
                {goal ? goal : "Select your goal"}
              </Text>
            </View>
          </TouchableOpacity>
        ) : (
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={goal}
              onValueChange={(itemValue) => setGoal(itemValue)}
              style={styles.picker}
            >
              {["Lose Weight", "Build Muscle", "Maintain"].map((g) => (
                <Picker.Item key={g} label={g} value={g} />
              ))}
            </Picker>
          </View>
        )}

        {isGoalPickerVisible && (
          <TouchableOpacity
            style={styles.doneButton}
            onPress={() => setIsGoalPickerVisible(false)}
          >
            <Text style={styles.doneButtonText}>Done</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Target Weight */}
      <View style={styles.settingsSection}>
        <Text style={styles.settingLabel}>Target Weight</Text>
        {!isTargetWeightPickerVisible ? (
          <TouchableOpacity
            onPress={() => setIsTargetWeightPickerVisible(true)}
          >
            <View style={styles.inputContainer}>
              <Text style={styles.inputText}>
                {targetWeight ? `${targetWeight} lbs` : "Select target weight"}
              </Text>
            </View>
          </TouchableOpacity>
        ) : (
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={targetWeight}
              onValueChange={(itemValue) => setTargetWeight(itemValue)}
              style={styles.picker}
            >
              {[...Array(300).keys()].map((i) => (
                <Picker.Item
                  key={i}
                  label={`${i + 1} lbs`}
                  value={`${i + 1}`}
                />
              ))}
            </Picker>
          </View>
        )}
        {isTargetWeightPickerVisible && (
          <TouchableOpacity
            style={styles.doneButton}
            onPress={() => setIsTargetWeightPickerVisible(false)}
          >
            <Text style={styles.doneButtonText}>Done</Text>
          </TouchableOpacity>
        )}
      </View>

      <TouchableOpacity
        style={styles.saveChangesButton}
        onPress={handleSaveChanges}
      >
        <Text style={styles.saveChangesText}>Save Changes</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.signOutButton} onPress={onSignOut}>
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
    width: 120,
    height: 120,
    borderRadius: 60,
    alignSelf: "center",
    marginBottom: 20,
    borderWidth: 3,
    borderColor: Colors.ut_burnt_orange,
    backgroundColor: Colors.landing_page_logo,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    color: Colors.dark_gray,
    marginBottom: 20,
  },
  settingsSection: {
    width: "100%",
    marginBottom: 15,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.dark_gray,
  },
  input: {
    fontSize: 16,
    color: Colors.dark_gray,
    borderWidth: 1,
    borderColor: Colors.light_gray,
    padding: 12,
    marginTop: 5,
    borderRadius: 8,
    backgroundColor: Colors.white,
  },
  saveChangesButton: {
    backgroundColor: Colors.ut_burnt_orange,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 20,
  },
  saveChangesText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
  signOutButton: {
    backgroundColor: Colors.dark_gray,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 20,
  },
  signOutText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: Colors.light_gray,
    padding: 12,
    borderRadius: 8,
    backgroundColor: Colors.white,
  },
  inputText: {
    fontSize: 16,
    color: Colors.dark_gray,
  },
  pickerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  picker: {
    flex: 1,
    height: 200,
  },
  doneButton: {
    backgroundColor: Colors.ut_burnt_orange,
    borderRadius: 8,
    marginTop: 15,
    width: "25%",
    alignSelf: "center",
    padding: 5,
  },
  doneButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
});
