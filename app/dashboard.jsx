import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, ScrollView, RefreshControl } from "react-native";
import { getAuth } from "firebase/auth";
import { db } from "../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import Colors from "../assets/colors";
import CustomHeader from "./components/CustomHeader";
import UserStats from "./components/UserStats";
import WorkoutSummary from "./components/workout";
import ProgressChart from "./components/ProgressChart";
import ChallengesLB from "./components/ChallengesLB";
import Notifications from "./components/Notifications";
import Gyms from "./gyms";
import { useUser } from "./UserContext";

export default function Dashboard() {
  const { userId, setUserId } = useUser(); // Access userId from context
  const [userData, setUserData] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const auth = getAuth();
  const user = auth.currentUser;

  // Fetch user data from Firestore
  const fetchUserData = async () => {
    try {
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserData(docSnap.data());
          setUserId(user.uid);
        } else {
          console.log("No data found");
        }
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [user]);

  const onSignOut = () => {
    auth.signOut().then(() => {
      console.log("Signed out successfully");
    }).catch((error) => {
      console.error("Error signing out:", error);
    });
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchUserData().finally(() => setRefreshing(false));
  };

  if (!userData) {
    return (
      <View style={styles.container}>
        <CustomHeader showSettingsButton />
        <Text style={styles.title}>Loading user data...</Text>
      </View>
    );
  }

  const currentHour = new Date().getHours();
  let greetingMessage = "";
  let emoji = "";
  if (currentHour >= 5 && currentHour < 12) {
    greetingMessage = "Good Morning!";
    emoji = "🌞";
  } else if (currentHour >= 18) {
    greetingMessage = "Good Night!";
    emoji = "🌙";
  } else {
    greetingMessage = "Keep up the good work, legend!";
    emoji = "💪";
  }

  return (
    <View style={styles.container}>
      <CustomHeader showSettingsButton showLogo />
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Text style={styles.title}>
          {greetingMessage} {emoji}
        </Text>
        <Text style={styles.subtitle}>You're doing great today! Keep Strong 💪</Text>
        <View style={styles.infoContainer}>
          <UserStats userData={userData} />
          <WorkoutSummary />
          <Gyms />
          <ProgressChart />
          <ChallengesLB />
          <Notifications />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
    padding: 16,
  },
  scrollView: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.dark_gray,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 10,
    color: "#000",
    marginBottom: 16,
    fontWeight: "400",
    fontStyle: "italic",
  },
});
