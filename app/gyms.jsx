import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import hoursData from "../scraping/facilities_data.json"; // Import the JSON data

const GymList = () => {
  const router = useRouter();

  const handleGymPress = (gymName) => {
    // Navigate to the GymDetail screen with the gymName as a parameter
    router.push(`/gyms/${gymName}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gym List</Text>

      <ScrollView style={styles.infoContainer}>
        {Object.keys(hoursData).map((gymName) => (
          <TouchableOpacity
            key={gymName}
            style={styles.gymCard}
            onPress={() => handleGymPress(gymName)} // Handle gym click
          >
            <Text style={styles.infoTitle}>Gym Name:</Text>
            <Text style={styles.infoText}>{gymName}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default GymList;

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
  gymCard: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
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
