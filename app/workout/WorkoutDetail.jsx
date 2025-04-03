import React, { useState } from "react";
import { Text, View, StyleSheet, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { useLocalSearchParams } from "expo-router";
import CustomHeader from "../components/CustomHeader";
import Colors from "../../assets/colors";
import WorkoutCard from "./workoutCard";
import useFetchWorkout from "./fetchWorkout";
import { useFocusEffect } from "expo-router";

const WorkoutDetail = () => {
  const router = useRouter();
  const { workoutName, workoutDate } = useLocalSearchParams();
  const [uniqueMuscleGroups, setUniqueMuscleGroups] = useState([]);
  const [exercises, setExercises] = useState([]); // State to store exercises
  const { fetchExerciseFromWorkout } = useFetchWorkout();

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

  // Fetch exercises for a specific workout based on workoutName
  const fetchExercises = async () => {
    if (workoutName && workoutDate) {
      const exercisesForWorkout = await fetchExerciseFromWorkout(
        workoutName,
        workoutDate
      ); 
      setExercises(exercisesForWorkout);
    }
  };

  // Fetch muscle groups and exercises when the component is focused
  useFocusEffect(
    React.useCallback(() => {
      FetchMuscleGroups();
      fetchExercises();
    }, [])
  );

  const handleNavigateToMuscleGroup = (muscleGroup) => {
    router.push(
      `/workout/${muscleGroup}?workoutName=${workoutName}&workoutDate=${workoutDate}`
    );
  };

  return (
    <View style={styles.container}>
      <CustomHeader showBackButton showSettingsButton />

      <View style={styles.headerContainer}>
        <Text style={styles.title}>Workout Details</Text>
        <Text style={styles.workoutName}>
          {workoutName.charAt(0).toUpperCase() + workoutName.slice(1)} on{" "}
          {new Date(workoutDate).toLocaleDateString()}{" "}
        </Text>

        {/* display exercises fetched */}
        <Text style={styles.workoutName}>
          {exercises.length > 0 ? "Exercises:" : "No exercises found."}
        </Text>

        {exercises.map((exercise, index) => (
          <Text key={index} style={styles.workoutName}>
            {exercise.name}
          </Text>
        ))}

        <View style={{ height: 16 }}></View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <View style={styles.cardContainer}>
          {uniqueMuscleGroups.map((muscleGroup, index) => (
            <View key={index} style={styles.cardWrapper}>
              <WorkoutCard
                muscleGroup={muscleGroup}
                onPress={() => handleNavigateToMuscleGroup(muscleGroup)}
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
    fontSize: 36,
    fontWeight: "bold",
    color: Colors.dark_gray,
    marginBottom: 8,
    textAlign: "center",
  },
  workoutName: {
    fontSize: 18,
    color: Colors.gray,
    textAlign: "center",
    fontStyle: "italic",
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
    alignItems: "center",
    marginBottom: 24,
  },
});

export default WorkoutDetail;
