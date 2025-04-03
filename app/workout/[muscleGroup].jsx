import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router"; 
import CustomHeader from "../components/CustomHeader";
import Colors from "../../assets/colors"; 
const MuscleGroupDetail = () => {
  const { muscleGroup } = useLocalSearchParams();
  const [exercises, setExercises] = useState([]);

  useEffect(() => {
    console.log("Muscle Group:", muscleGroup);

    // Fetch exercises from the API
    const fetchExercises = async () => {
      try {
        const response = await fetch(
          "https://raw.githubusercontent.com/Austin616/free-exercise-db/main/dist/exercises.json"
        );
        if (response.ok) {
          const data = await response.json();
          const filteredExercises = data.filter((exercise) =>
            exercise.primaryMuscles.includes(muscleGroup)
          );
          setExercises(filteredExercises); 
        } else {
          console.error("Error fetching data", response.status);
        }
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchExercises();
  }, [muscleGroup]);

  return (
    <View style={styles.container}>
      <CustomHeader showBackButton showSettingsButton />
      <Text style={styles.title}>
        Exercises for {""}
        {muscleGroup
          .split(" ")
          .map(
            (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
          )
          .join(" ")}
      </Text>
      <ScrollView>
        {exercises.length > 0 ? (
          exercises.map((exercise, index) => (
            <Text key={index} style={styles.exercise}>
              {exercise.name}
            </Text>
          ))
        ) : (
          <Text style={styles.noExercises}>
            No exercises found for this muscle group.
          </Text>
        )}
      </ScrollView>
    </View>
  );
};

export default MuscleGroupDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: Colors.primary,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  exercise: {
    fontSize: 18,
    marginVertical: 8,
  },
  noExercises: {
    fontSize: 18,
    color: "gray",
  },
});
