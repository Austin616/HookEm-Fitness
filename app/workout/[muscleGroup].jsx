import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
} from "react-native";
import Modal from "react-native-modal";
import { useLocalSearchParams } from "expo-router";
import CustomHeader from "../components/CustomHeader";
import Colors from "../../assets/colors";
import closeIcon from "../../assets/images/close.png";
import useFetchWorkout from "./fetchWorkout";

const MuscleGroupDetail = () => {
  const { muscleGroup, workoutName, workoutDate } = useLocalSearchParams();
  const [exercises, setExercises] = useState([]); // Ensure it's initialized as an empty array
  const [filteredExercises, setFilteredExercises] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { addExerciseToWorkout, fetchExercises } = useFetchWorkout();

  // Filter states
  const [forceFilter, setForceFilter] = useState("");
  const [levelFilter, setLevelFilter] = useState("");
  const [mechanicFilter, setMechanicFilter] = useState("");
  const [equipmentFilter, setEquipmentFilter] = useState("");
  const [isModalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    console.log("Muscle Group:", muscleGroup);
    console.log("Workout Name:", workoutName);
    console.log("Workout Date:", workoutDate);

    const getExercises = async () => {
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
          setFilteredExercises(filteredExercises); // Initially show all exercises
        } else {
          console.error("Error fetching data", response.status);
        }
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    getExercises();
  }, [muscleGroup, workoutName, workoutDate]);

  useEffect(() => {
    let filtered = exercises;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter((exercise) =>
        exercise.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply other filters
    if (forceFilter) {
      filtered = filtered.filter((exercise) => exercise.force === forceFilter);
    }
    if (levelFilter) {
      filtered = filtered.filter((exercise) => exercise.level === levelFilter);
    }
    if (mechanicFilter) {
      filtered = filtered.filter(
        (exercise) => exercise.mechanic === mechanicFilter
      );
    }
    if (equipmentFilter) {
      filtered = filtered.filter(
        (exercise) => exercise.equipment === equipmentFilter
      );
    }

    setFilteredExercises(filtered);
  }, [
    searchQuery,
    forceFilter,
    levelFilter,
    mechanicFilter,
    equipmentFilter,
    exercises,
  ]);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const applyFilters = () => {
    setModalVisible(false);
  };

  const handleAddExercise = async (exercise) => {
    try {
      const workoutId = `${workoutName}-${workoutDate}`;
      if (!workoutName || !workoutDate) {
        console.error("Workout ID is missing");
        return;
      }

      // Add exercise to workout
      await addExerciseToWorkout(workoutId, exercise);
      console.log("Exercise added:", exercise.name);
    } catch (error) {
      console.error("Error adding exercise to workout:", error);
    }
  };

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

      <View style={styles.searchFilterContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search for an exercise"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity onPress={toggleModal} style={styles.filterButton}>
          <Text style={styles.filterButtonText}>Filters</Text>
        </TouchableOpacity>
      </View>

      {/* Modal for Filter Options */}
      <Modal
        isVisible={isModalVisible}
        onBackdropPress={toggleModal}
        onBackButtonPress={toggleModal}
        style={styles.modal}
      >
        <View style={styles.modalContentContainer}>
          <TouchableOpacity onPress={toggleModal} style={styles.closeButton}>
            <Image source={closeIcon} style={styles.closeButtonIcon} />
          </TouchableOpacity>
          <ScrollView contentContainerStyle={styles.modalContent}>
            <Text style={styles.filterTitle}>Filter Options</Text>
            {/* Filter sections */}
            {/* Force, Level, Mechanic, Equipment Filters (same as before) */}
            <TouchableOpacity onPress={applyFilters} style={styles.applyButton}>
              <Text style={styles.applyButtonText}>Apply Filters</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>

      <ScrollView contentContainerStyle={styles.listContainer}>
        {filteredExercises.length > 0 ? (
          filteredExercises.map((exercise, index) => (
            <TouchableOpacity
              key={index}
              style={styles.exerciseRow}
              onPress={() => handleAddExercise(exercise)}
            >
              <Text style={styles.exerciseName}>{exercise.name}</Text>
            </TouchableOpacity>
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
  searchFilterContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 8,
    fontSize: 16,
    color: "#333",
  },
  filterButton: {
    backgroundColor: Colors.ut_burnt_orange,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginLeft: 10,
  },
  filterButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  modal: {
    justifyContent: "center",
    alignItems: "center",
  },
  modalContentContainer: {
    backgroundColor: Colors.white,
    padding: 20,
    borderRadius: 10,
    maxHeight: "80%",
    width: "90%",
  },
  modalContent: {
    paddingBottom: 20,
  },
  filterTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
  },
  filterSection: {
    marginBottom: 20,
  },
  filterCategory: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  filterButtonsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  filterOption: {
    padding: 10,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
    color: Colors.ut_burnt_orange,
  },
  filterOptionActive: {
    padding: 10,
    backgroundColor: Colors.ut_burnt_orange,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  filterOptionText: {
    fontSize: 16,
    color: "#333",
  },
  filterOptionTextActive: {
    color: Colors.white,
    fontSize: 16,
  },
  applyButton: {
    backgroundColor: Colors.ut_burnt_orange,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 20,
  },
  applyButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  listContainer: {
    paddingBottom: 20,
  },
  exerciseRow: {
    backgroundColor: Colors.ut_burnt_orange,
    padding: 20,
    marginBottom: 16,
    borderRadius: 8,
    width: "100%",
    justifyContent: "center",
    alignItems: "flex-start",
  },
  exerciseName: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: "bold",
  },
  noExercises: {
    fontSize: 18,
    color: "gray",
    textAlign: "center",
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  closeButtonIcon: {
    width: 20,
    height: 20,
    tintColor: Colors.ut_burnt_orange,
  },
});

export default MuscleGroupDetail;
