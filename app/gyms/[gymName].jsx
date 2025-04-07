import { View, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import {useLocalSearchParams} from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import CustomHeader from "../components/CustomHeader";
import Colors from "../../assets/colors";

const GymDetail = () => {
  const router = useRouter();
  const { gymName } = useLocalSearchParams(); // Access the gymName from the route
  console.log(gymName);

  const [gymData, setGymData] = useState(null);

  useEffect(() => {
    const fetchGymData = async () => {
      try {
        const response = await fetch("https://recsports-scraping.onrender.com/facilities"); // Replace with your API endpoint
        const data = await response.json();

        setGymData(data.facilities[gymName]); 
      } catch (error) {
        console.error("Error fetching gym data:", error);
      }
    };

    fetchGymData();
  }
  , [gymName]);

  if (!gymData) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Gym Not Found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CustomHeader showBackButton />
      <Text style={styles.title}>{gymName} Details</Text>

      <View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>Gym Name:</Text>
        <Text style={styles.infoText}>{gymName}</Text>

        <Text style={styles.infoTitle}>Today's Hours:</Text>
        <Text style={styles.infoText}>{gymData["Today 's Hours"]}</Text>

        <Text style={styles.infoTitle}>Features:</Text>
        <Text style={styles.infoText}>{gymData.Features.join(", ")}</Text>
      </View>
    </View>
  );
};

export default GymDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: Colors.primary
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  infoContainer: {
    marginTop: 16,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  infoText: {
    fontSize: 16,
    marginBottom: 8,
  },
});
