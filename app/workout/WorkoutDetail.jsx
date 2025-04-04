import React, { useState, useEffect } from 'react';
import { Text, View, ScrollView, Alert, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useLocalSearchParams } from 'expo-router';
import CustomHeader from '../components/CustomHeader';
import Colors from '../../assets/colors';
import useFetchWorkout from './fetchWorkout';
import { useFocusEffect } from 'expo-router';
import MuscleGroupModal from './muscleGroupModel';
import Exercise from './excercises';

const WorkoutDetail = () => {
  const router = useRouter();
  const { workoutName, workoutDate } = useLocalSearchParams();
  const [uniqueMuscleGroups, setUniqueMuscleGroups] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [setsReps, setSetsReps] = useState({});
  const [completedSets, setCompletedSets] = useState({});

  const {
    handleCreateWorkout,
    handleDeleteWorkout,
    addExerciseToWorkout,
    fetchExerciseFromWorkout,
    fetchWorkoutsInMuscleGroup,
    FetchMuscleGroups,
    deleteExerciseFromWorkout,
    addSetsandRepsToExercise,
    fetchSetsandRepsFromExercise,
    deleteOneSetFromExercise,
    handleCompletedSet,
    fetchCompletedSetsFromExercise,
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

  const fetchCompletedSets = async (exerciseId) => {
    try {
      const completedSets = await fetchCompletedSetsFromExercise(workoutName, workoutDate, exerciseId);
      setCompletedSets((prev) => ({
        ...prev,
        [exerciseId]: completedSets,
      }));
    } catch (error) {
      console.error('Error fetching completed sets from exercise:', error);
    }
  };

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
      'Delete Workout',
      'Are you sure you want to delete this workout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const workoutId = `${workoutName}-${workoutDate}`;
            await handleDeleteWorkout(workoutId);
            router.push('/workout');
          },
        },
      ]
    );
  };

  const handleDeleteExercise = async (exerciseId) => {
    Alert.alert(
      'Delete Exercise',
      'Are you sure you want to delete this exercise?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteExerciseFromWorkout(
              workoutName,
              workoutDate,
              exerciseId
            );
          },
        },
      ]
    );
  };

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  const handleSetsRepsChange = (exerciseId, index, field, value) => {
    console.log(`Changing ${field} for set ${index} of exercise ${exerciseId} to:`, value);
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
    if (!setsRepsData || setsRepsData.length === 0) {
      Alert.alert('Error', 'Please enter sets and reps for each row.');
      return;
    }

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
          { sets: nextSetNumber, reps: '' },
        ],
      };
    });
  };

  const completedSet = async (exerciseId, setIndex) => {
    await handleCompletedSet(workoutName, workoutDate, exerciseId, setIndex);
    fetchCompletedSets(exerciseId);
  };

  useEffect(() => {
    exercises.forEach((exercise) => {
      fetchSetsReps(exercise.id);
      fetchCompletedSets(exercise.id);
    });
  }, [exercises]);

  return (
    <View style={{ flex: 1, backgroundColor: Colors.primary, padding: 16 }}>
      <CustomHeader showBackButton showSettingsButton />
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 120 }}>
        <Text style={{ fontSize: 36, fontWeight: 'bold', textAlign: 'center' }}>
          Workout Details
        </Text>
        <Text style={{ fontSize: 18, textAlign: 'center' }}>
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
            completedSets={completedSet}
            handleDeleteExercise={handleDeleteExercise}
            workoutName={workoutName}
            workoutDate={workoutDate}
            setCompletedSets={setCompletedSets}
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
  exerciseContainer: {
    backgroundColor: Colors.lightGray,
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
    borderWidth: 1,
    width: "100%", // Ensure it takes up full width of the screen
    maxWidth: 380, // Max width for larger screens, prevents stretching
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  exerciseText: {
    fontSize: 18,
    color: Colors.dark_gray,
    fontWeight: "600",
  },
  inputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    flexWrap: "wrap", // Allow wrapping of input fields on smaller screens
  },
  input: {
    height: 40,
    borderColor: Colors.gray,
    borderWidth: 1,
    borderRadius: 5,
    width: "45%", // Adjust width of inputs for better fit
    paddingLeft: 8,
    fontSize: 16,
    marginBottom: 8, // Add space between inputs on smaller screens
  },
  deleteButtonContainer: {
    backgroundColor: Colors.red,
    justifyContent: "center",
    alignItems: "center",
    width: 80,
    height: 60,
    borderRadius: 5,
    marginLeft: -10,
  },
  deleteText: {
    color: Colors.white,
    fontWeight: "bold",
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
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    backgroundColor: Colors.primarym,
    borderRadius: 8,
    padding: 16,
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
  },
  closeModalButton: {
    marginTop: 16,
    backgroundColor: Colors.red,
    borderRadius: 8,
    paddingVertical: 12,
  },
  closeModalText: {
    color: Colors.white,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },

  setRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  addRowText: {
    color: Colors.ut_burnt_orange,
    fontWeight: "bold",
    marginTop: 8,
    textAlign: "center",
    fontSize: 16, // Slightly larger text
  },
  setText: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.dark_gray,
  },
  workoutGroup: {
    fontSize: 12,
    color: Colors.gray,
    fontStyle: "italic",
    paddingBottom: 8,
    textDecorationLine: "underline",
  },
  saveSets: {
    color: Colors.ut_burnt_orange,
    fontWeight: "bold",
    marginTop: 8,
    textAlign: "center",
    fontSize: 16,
  },
  completeButton: {
    backgroundColor: Colors.light_green,
    padding: 8,
    borderRadius: 5,
  },
  completeButtonText: {
    color: Colors.white,
    fontWeight: "bold",
  },
});

export default WorkoutDetail;