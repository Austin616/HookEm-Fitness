import React from "react";
import { Text, View, StyleSheet, Image } from "react-native";
import Colors from "../../assets/colors";
import profileIcon from "../../assets/images/profile-icon.png";

const UserStats = ({ userData }) => {
  if (!userData) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading user data...</Text>
      </View>
    );
  }

  const { name, email, height, weight, goal, targetWeight, profilePicture } =
    userData;

  let progress = 0;

  if (goal === "Lose Weight") {
    if (weight > targetWeight) {
      progress = targetWeight / weight;
    }
  } else if (goal === "Build Muscle") {
    if (weight < targetWeight) {
      progress = weight / targetWeight; 
    } else {
      progress = 1;
    }
  }

  // Determine the message based on progress
  let progressMessage = "";

  if (progress >= 1) {
    progressMessage = "Congratulations! You've reached your target weight!";
  } else if (progress >= 0.75) {
    progressMessage = "Almost there! Just a little more to go!";
  } else if (progress >= 0.5) {
    progressMessage = "You're halfway to your goal! Keep it up!";
  } else if (progress >= 0.25) {
    progressMessage = "You're making progress! Stay motivated!";
  } else {
    progressMessage = "Every step counts! Keep pushing forward!";
  }

  return (
    <View style={styles.container}>
      <Image
        source={profilePicture ? { uri: profilePicture } : profileIcon}
        style={styles.profileImage}
      />
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.email}>{email}</Text>
      <Text style={styles.stat}>
        Height: {height}
      </Text>
      <Text style={styles.stat}>Weight: {weight} lbs</Text>
      <Text style={styles.stat}>Goal: {goal}</Text>
      <Text style={styles.stat}>Target Weight: {targetWeight} lbs</Text>

      <Text style={styles.progressLabel}>Progress to Target Weight:</Text>

      {/* Custom Progress Bar */}
      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBar, { width: `${progress * 100}%` }]} />
      </View>

      {/* Displaying the progress percentage */}
      <Text style={styles.progressText}>{(progress * 100).toFixed(2)}%</Text>

      {/* Display the progress message */}
      <Text style={styles.progressMessage}>{progressMessage}</Text>
    </View>
  );
};

export default UserStats;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: Colors.white,
    padding: 25,
    borderRadius: 15,
    elevation: 5,
    shadowColor: Colors.dark_gray,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: Colors.gray,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
    borderWidth: 3,
    borderColor: Colors.ut_burnt_orange,
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    color: Colors.dark_gray,
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    color: Colors.dark_gray,
    marginBottom: 15,
  },
  stat: {
    fontSize: 18,
    color: Colors.dark_gray,
    marginBottom: 8,
  },
  progressLabel: {
    marginTop: 15,
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.ut_burnt_orange,
  },
  loadingText: {
    fontSize: 18,
    color: Colors.dark_gray,
  },
  progressBarContainer: {
    width: "100%",
    height: 12,
    backgroundColor: Colors.light_gray,
    borderRadius: 6,
    marginTop: 12,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: Colors.ut_burnt_orange,
    borderRadius: 6,
  },
  progressText: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.ut_burnt_orange,
  },
  progressMessage: {
    marginTop: 5,
    fontSize: 12,
    color: Colors.dark_gray,
    textAlign: "center",
    fontStyle: "italic",
  },
});
