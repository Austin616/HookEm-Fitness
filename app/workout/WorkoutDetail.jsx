import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { useLocalSearchParams } from "expo-router";
import CustomHeader from "../components/CustomHeader";
import Colors from "../../assets/colors";
import WorkoutCard from "./workoutCard";

const WorkoutDetail = () => {
  const router = useRouter();
  const { workoutName, workoutDate } = useLocalSearchParams();
  const [uniqueMuscleGroups, setUniqueMuscleGroups] = useState([]);

  const FetchMuscleGroups = async () => {
    try {
      const response = await fetch(
        "https://raw.githubusercontent.com/Austin616/free-exercise-db/main/dist/exercises.json"
      );
      if (response.ok) {
        const data = await response.json();
        const primaryMuscleGroups = data
          .map((exercise) => exercise.primaryMuscles)
          .flat();
        const uniqueMuscleGroups = [...new Set(primaryMuscleGroups)];
        setUniqueMuscleGroups(uniqueMuscleGroups);
      } else {
        console.error("Error fetching data", response.status);
      }
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  useEffect(() => {
    FetchMuscleGroups();
  }, []);

  useEffect(() => {
    console.log("Workout Name:", workoutName);
    console.log("Workout Date:", workoutDate);
    console.log("Workout Details Loaded");
  }, [workoutName, workoutDate]);

  return (
    <View style={styles.container}>
      <CustomHeader showBackButton showSettingsButton />

      <View style={styles.headerContainer}>
        <Text style={styles.title}>Workout Details</Text>
        <Text style={styles.workoutName}>
          {workoutName.charAt(0).toUpperCase() + workoutName.slice(1)} on{" "}
          {new Date(workoutDate).toLocaleDateString()}{" "}
          {/* This will format the date in a more readable way */}
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <View style={styles.cardContainer}>
          {uniqueMuscleGroups.map((muscleGroup, index) => (
            <View key={index} style={styles.cardWrapper}>
              <WorkoutCard
                muscleGroup={muscleGroup}
                onPress={() => router.push(`/workout/${muscleGroup}`)}
              />
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
    padding: 16,
  },
  title: {
    fontSize: 36, // Slightly larger title
    fontWeight: "bold", // Make it bold to stand out
    color: Colors.dark_gray, // Adjust based on your theme
    marginBottom: 8, // Space below the title
    textAlign: "center", // Center the title horizontally
  },
  workoutName: {
    fontSize: 18, // Subtle but readable size
    color: Colors.gray, // Adjust based on your theme
    textAlign: "center", // Center the workout details horizontally
    fontStyle: "italic", // Adding some variety to the font style
  },
  scrollViewContainer: {
    flexGrow: 1,
    paddingBottom: 120,
  },
  cardContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  cardWrapper: {
    width: "48%",
    aspectRatio: 1,
    marginBottom: 16,
  },
  headerContainer: {
    alignItems: "center", // Center the text horizontally
    marginBottom: 24, // Space between the header and the rest of the content
  },
});

export default WorkoutDetail;
