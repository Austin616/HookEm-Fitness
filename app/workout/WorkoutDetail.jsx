import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  ScrollView,
  Alert,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { useLocalSearchParams } from "expo-router";
import CustomHeader from "../components/CustomHeader";
import Colors from "../../assets/colors";
import useFetchWorkout from "./fetchWorkout";
import { useFocusEffect } from "expo-router";
import MuscleGroupModal from "./muscleGroupModel";
import Exercise from "./excercises";
import { useIsFocused } from "@react-navigation/native";

const WorkoutDetail = () => {
  const router = useRouter();
  const { workoutName, workoutDate } = useLocalSearchParams();
  const [uniqueMuscleGroups, setUniqueMuscleGroups] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [setsReps, setSetsReps] = useState({});
  const isFocused = useIsFocused(); // Hook to check if the screen is focused

  const {
    handleDeleteWorkout,
    fetchExerciseFromWorkout,
    FetchMuscleGroups,
    deleteExerciseFromWorkout,
    addSetsandRepsToExercise,
    fetchSetsandRepsFromExercise,
  } = useFetchWorkout();

  const getMuscleGroups = async () => {
    const muscleGroups = await FetchMuscleGroups();
    setUniqueMuscleGroups(muscleGroups);
  };

  const fetchExercises = async () => {
    if (workoutName && workoutDate) {
      const exercisesForWorkout = await fetchExerciseFromWorkout(
        workoutName,
        workoutDate
      );
      setExercises(exercisesForWorkout);
    }
  };  

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

  useFocusEffect(
    React.useCallback(() => {
      getMuscleGroups();
      fetchExercises();
    }, [workoutName, workoutDate])  // Add the dependencies to refetch when the workoutName or workoutDate changes
  );

  useEffect(() => {
    if (isFocused) {
      fetchExercises();
    }
  }, [isFocused, workoutName, workoutDate]);  

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
            fetchExercises();
          },
        },
      ]
    );
  };

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  const handleSetsRepsChange = (exerciseId, index, field, value) => {
    console.log(
      `Changing ${field} for set ${index} of exercise ${exerciseId} to:`,
      value
    );
    setSetsReps((prev) => {
      const updatedSets = prev[exerciseId].map((set, i) => {
        if (i === index) {
          return { ...set, [field]: value }; // Ensure correct set is updated
        }
        return set;
      });
      return { ...prev, [exerciseId]: updatedSets };
    });
  };

  const handleAddSetsReps = async (exerciseId) => {
    const setsRepsData = setsReps[exerciseId];
    await addSetsandRepsToExercise(
      workoutName,
      workoutDate,
      exerciseId,
      setsRepsData
    );
  };

  const handleAddRow = (exerciseId) => {
    setSetsReps((prev) => {
      const currentExerciseSets = prev[exerciseId] || [];
      const nextSetNumber = currentExerciseSets.length + 1;

      return {
        ...prev,
        [exerciseId]: [
          ...currentExerciseSets,
          { sets: nextSetNumber, reps: "" },
        ],
      };
    });
  };

  useEffect(() => {
    exercises.forEach((exercise) => {
      fetchSetsReps(exercise.id);
    });
  }, [exercises]);

  return (
    <View style={{ flex: 1, backgroundColor: Colors.primary, padding: 16 }}>
      <CustomHeader showBackButton showSettingsButton />
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 120 }}>
        <Text style={{ fontSize: 36, fontWeight: "bold", textAlign: "center" }}>
          Workout Details
        </Text>
        <Text style={{ fontSize: 18, textAlign: "center", marginBottom: 20 }}>
          {workoutName} on {new Date(workoutDate).toLocaleDateString()}
        </Text>

        {exercises.map((exercise) => (
          <Exercise
            key={exercise.id}
            exercise={exercise}
            setsReps={setsReps}
            handleSetsRepsChange={handleSetsRepsChange}
            handleAddSetsReps={handleAddSetsReps}
            handleAddRow={handleAddRow}
            handleDeleteExercise={handleDeleteExercise}
            workoutName={workoutName}
            workoutDate={workoutDate}
            setSetsReps={setSetsReps}
          />
        ))}

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
    paddingHorizontal: 24,
    width: "50%",
    alignSelf: "center",
    alignItems: "center",
    elevation: 3,
  },
  addButtonText: {
    color: Colors.white,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default WorkoutDetail;
