import React, { useState } from "react";
import { TouchableOpacity, Image, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import profileIcon from "../../assets/images/profile-icon.png";
import Colors from "../../assets/colors";

const ProfilePicture = ({ profilePicture, setProfilePicture, hasPermission }) => {
  const handleChangeProfilePicture = async () => {
    if (!hasPermission) {
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
      setProfilePicture(selectedImage);
    }
  };

  return (
    <TouchableOpacity onPress={handleChangeProfilePicture}>
      <Image
        source={profilePicture ? { uri: profilePicture } : profileIcon}
        style={{
          width: 120,
          height: 120,
          borderRadius: 60,
          alignSelf: "center",
          marginBottom: 20,
          borderWidth: 3,
          borderColor: Colors.ut_burnt_orange,
          backgroundColor: Colors.landing_page_logo,
        }}
      />
    </TouchableOpacity>
  );
};

export default ProfilePicture;
