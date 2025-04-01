import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import Colors from "../../assets/colors";

const UserStats = ({userData}) => {

  return (
    <View style={styles.container}>
        <Text style={styles.title}>User Stats</Text>
        {userData ? (
            <View>
            <Text>Name: {userData.name}</Text>
            <Text>Email: {userData.email}</Text>
            <Text>Height: {userData.height}</Text>
            <Text>Weight: {userData.weight}</Text>
            <Text>Goal: {userData.goal}</Text>
            <Text>Target Weight: {userData.targetWeight}</Text>
            </View>
        ) : (
            <Text>Loading user data...</Text>
        )}

    </View>
  );
};
export default UserStats;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.ut,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.dark_gray,
  },
});
