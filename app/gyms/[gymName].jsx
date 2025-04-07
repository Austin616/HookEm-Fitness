import { View, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import hoursData from "../../scraping/facilities_data.json";
import {useLocalSearchParams} from "expo-router";

const GymDetail = () => {
  const router = useRouter();
  const { gymName } = useLocalSearchParams(); // Access the gymName from the route
  console.log(gymName);

  const gymData = hoursData[gymName]; // Get the data for the specific gym

  if (!gymData) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Gym Not Found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
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
    backgroundColor: "#fff",
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
