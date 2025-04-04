import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { useLocalSearchParams } from "expo-router";
import CustomHeader from "../components/CustomHeader";
import Colors from "../../assets/colors";
import useFetchWorkout from "./fetchWorkout";
import { useFocusEffect } from "expo-router";
import MuscleGroupModal from "./muscleGroupModel";
import Exercise from "./excercises"; // The Exercise component remains unchanged

const WorkoutDetail = () => {
  const router = useRouter();
  const { workoutName, workoutDate } = useLocalSearchParams();
  const [uniqueMuscleGroups, setUniqueMuscleGroups] = useState([]);
  const [exercises, setExercises] = useState([]); // Always show exercises
  const [modalVisible, setModalVisible] = useState(false); // Control modal visibility
  const [setsReps, setSetsReps] = useState({}); // State to track sets and reps for each exercise

  const {
    fetchExerciseFromWorkout,
    handleDeleteWorkout,
    FetchMuscleGroups,
    deleteExerciseFromWorkout,
    addSetsandRepsToExercise,
    fetchSetsandRepsFromExercise,
    deleteOneSetFromExercise,
    handleCompletedSet,
    fetchCompletedSetsFromExercise
  } = useFetchWorkout();

  // Fetch muscle groups for the modal
  const getMuscleGroups = async () => {
    const muscleGroups = await FetchMuscleGroups();
    setUniqueMuscleGroups(muscleGroups);
  };

  // Fetch exercises for the workout
  const fetchExercises = async () => {
    if (workoutName && workoutDate) {
      const exercisesForWorkout = await fetchExerciseFromWorkout(
        workoutName,
        workoutDate
      );
      setExercises(exercisesForWorkout);
    }
  };

  // Fetch sets and reps for a given exercise
  const fetchSetsReps = async (exerciseId) => {
    const setsRepsData = await fetchSetsandRepsFromExercise(
      workoutName,
      workoutDate,
      exerciseId
    );
    setSetsReps((prev) => ({
      ...prev,
      [exerciseId]: setsRepsData,
    }));
  };

  // Initial fetching of muscle groups and exercises on focus
  useFocusEffect(
    React.useCallback(() => {
      getMuscleGroups();
      fetchExercises();
    }, [])
  );

  const handleNavigateToMuscleGroup = (muscleGroup) => {
    router.push(
      `/workout/${muscleGroup}?workoutName=${workoutName}&workoutDate=${workoutDate}`
    );
    toggleModal(); // Close the modal after navigating
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete Workout",
      "Are you sure you want to delete this workout?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const workoutId = `${workoutName}-${workoutDate}`;
            await handleDeleteWorkout(workoutId);
            router.push("/workout");
          },
        },
      ]
    );
  };

  const handleDeleteExercise = async (exerciseId) => {
    Alert.alert(
      "Delete Exercise",
      "Are you sure you want to delete this exercise?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await deleteExerciseFromWorkout(
              workoutName,
              workoutDate,
              exerciseId
            );
            fetchExercises(); // Refresh exercises after deletion
          },
        },
      ]
    );
  };

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  const handleSetsRepsChange = (exerciseId, field, value, index) => {
    setSetsReps((prev) => ({
      ...prev,
      [exerciseId]: prev[exerciseId].map((set, i) => {
        if (i === index) {
          return { ...set, [field]: value };
        }
        return set;
      }),
    }));
  };

  const handleAddSetsReps = async (exerciseId) => {
    const setsRepsData = setsReps[exerciseId];
    if (!setsRepsData || setsRepsData.length === 0) {
      Alert.alert("Error", "Please enter sets and reps for each row.");
      return;
    }
    console.log("Adding sets and reps:", setsRepsData); // Debug: Log the sets and reps data
    await addSetsandRepsToExercise(
      workoutName,
      workoutDate,
      exerciseId,
      setsRepsData
    );
  };

  useEffect(() => {
    exercises.forEach((exercise) => {
      fetchSetsReps(exercise.id); // Fetch sets and reps for each exercise
    });
  }, [exercises]); // Fetch sets and reps after exercises are fetched

  const handleAddRow = (exerciseId) => {
    setSetsReps((prev) => {
      const currentExerciseSets = prev[exerciseId] || [];
      const nextSetNumber = currentExerciseSets.length + 1; // Next set number based on row count

      return {
        ...prev,
        [exerciseId]: [
          ...currentExerciseSets,
          { sets: nextSetNumber, reps: "" }, // Add a new row with appropriate number of sets
        ],
      };
    });
  };

  const handleDeleteRow = async (exerciseId, setIndex) => {
    console.log("Deleting set at index:", setIndex); // Debug: Log the index of the set being deleted
    await deleteOneSetFromExercise(
      workoutName,
      workoutDate,
      exerciseId,
      setIndex
    );

    const updatedSetsReps = setsReps[exerciseId].filter(
      (_, index) => index !== setIndex
    );
    setSetsReps((prev) => ({
      ...prev,
      [exerciseId]: updatedSetsReps,
    }));
  };

  const handleCompleteSet = async (exerciseId, setIndex) => {
    await handleCompletedSet(workoutName, workoutDate, exerciseId, setIndex);
    fetchSetsReps(exerciseId);
  };

  const getCompletedSets = async (exerciseId) => {
    const completedSets = await fetchCompletedSetsFromExercise(workoutName, workoutDate, exerciseId);
    return completedSets;
  }

  return (
    <View style={styles.container}>
      <CustomHeader showBackButton showSettingsButton />
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Workout Details</Text>
          <Text style={styles.workoutName}>
            {workoutName.charAt(0).toUpperCase() + workoutName.slice(1)} on{" "}
            {new Date(
              new Date(workoutDate).setDate(new Date(workoutDate).getDate() + 1)
            ).toLocaleDateString()}
          </Text>

          {/* Display exercises fetched */}
          <Text style={styles.workoutName}>
            {exercises.length > 0 ? "Exercises:" : "No exercises found."}
          </Text>

          {exercises.map((exercise) => (
            <Exercise
              key={exercise.id}
              exercise={exercise}
              setsReps={setsReps}
              handleSetsRepsChange={handleSetsRepsChange}
              handleAddRow={handleAddRow}
              handleAddSetsReps={handleAddSetsReps}
              handleDeleteExercise={handleDeleteExercise}
              handleDeleteSet={handleDeleteRow}
              handleCompletedSet={handleCompleteSet}
              workoutName={workoutName}
              workoutDate={workoutDate}
              getCompletedSets={getCompletedSets}
            />
          ))}
        </View>

        {/* Buttons to show modal and delete workout */}
        <TouchableOpacity onPress={toggleModal} style={styles.addButton}>
          <Text style={styles.addButtonText}>Add Workout</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
          <Text style={styles.deleteButtonText}>Delete Workout</Text>
        </TouchableOpacity>
      </ScrollView>

      <MuscleGroupModal
        uniqueMuscleGroups={uniqueMuscleGroups}
        modalVisible={modalVisible}
        toggleModal={toggleModal}
        handleNavigateToMuscleGroup={handleNavigateToMuscleGroup}
      />
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

  headerContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  deleteButton: {
    marginTop: 24,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24, // Add horizontal padding for better button width
    width: "50%", // Ensuring buttons are of consistent width
    alignSelf: "center",
    alignItems: "center",
    backgroundColor: Colors.red, // Destructive red color
    elevation: 3, // Subtle shadow effect
  },
  deleteButtonText: {
    color: Colors.white,
    textAlign: "center",
    fontSize: 14,
    fontWeight: "bold",
  },
  addButton: {
    marginTop: 16,
    backgroundColor: Colors.ut_burnt_orange,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24, // Add horizontal padding for better button width
    width: "50%",
    alignSelf: "center",
    alignItems: "center",
    elevation: 3, // Add subtle shadow effect
  },
  addButtonText: {
    color: Colors.white,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default WorkoutDetail;
