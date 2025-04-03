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

const MuscleGroupDetail = () => {
  const { muscleGroup } = useLocalSearchParams();
  const [exercises, setExercises] = useState([]);
  const [filteredExercises, setFilteredExercises] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter states
  const [forceFilter, setForceFilter] = useState("");
  const [levelFilter, setLevelFilter] = useState("");
  const [mechanicFilter, setMechanicFilter] = useState("");
  const [equipmentFilter, setEquipmentFilter] = useState("");

  const [isModalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    console.log("Muscle Group:", muscleGroup);

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
          setFilteredExercises(filteredExercises); // Initially show all exercises
        } else {
          console.error("Error fetching data", response.status);
        }
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchExercises();
  }, [muscleGroup]);

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

            {/* Force Filters */}
            <View style={styles.filterSection}>
              <Text style={styles.filterCategory}>Force</Text>
              <View style={styles.filterButtonsRow}>
                <TouchableOpacity
                  style={
                    forceFilter === "push"
                      ? styles.filterOptionActive
                      : styles.filterOption
                  }
                  onPress={() =>
                    setForceFilter(forceFilter === "push" ? "" : "push")
                  }
                >
                  <Text
                    style={
                      forceFilter === "push"
                        ? styles.filterOptionTextActive
                        : styles.filterOptionText
                    }
                  >
                    Push
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={
                    forceFilter === "pull"
                      ? styles.filterOptionActive
                      : styles.filterOption
                  }
                  onPress={() =>
                    setForceFilter(forceFilter === "pull" ? "" : "pull")
                  }
                >
                  <Text
                    style={
                      forceFilter === "pull"
                        ? styles.filterOptionTextActive
                        : styles.filterOptionText
                    }
                  >
                    Pull
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Level Filters */}
            <View style={styles.filterSection}>
              <Text style={styles.filterCategory}>Level</Text>
              <View style={styles.filterButtonsRow}>
                <TouchableOpacity
                  style={
                    levelFilter === "beginner"
                      ? styles.filterOptionActive
                      : styles.filterOption
                  }
                  onPress={() =>
                    setLevelFilter(levelFilter === "beginner" ? "" : "beginner")
                  }
                >
                  <Text
                    style={
                      levelFilter === "beginner"
                        ? styles.filterOptionTextActive
                        : styles.filterOptionText
                    }
                  >
                    Beginner
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={
                    levelFilter === "intermediate"
                      ? styles.filterOptionActive
                      : styles.filterOption
                  }
                  onPress={() =>
                    setLevelFilter(
                      levelFilter === "intermediate" ? "" : "intermediate"
                    )
                  }
                >
                  <Text
                    style={
                      levelFilter === "intermediate"
                        ? styles.filterOptionTextActive
                        : styles.filterOptionText
                    }
                  >
                    Intermediate
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={
                    levelFilter === "advanced"
                      ? styles.filterOptionActive
                      : styles.filterOption
                  }
                  onPress={() =>
                    setLevelFilter(levelFilter === "advanced" ? "" : "advanced")
                  }
                >
                  <Text
                    style={
                      levelFilter === "advanced"
                        ? styles.filterOptionTextActive
                        : styles.filterOptionText
                    }
                  >
                    Advanced
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Mechanic Filters */}
            <View style={styles.filterSection}>
              <Text style={styles.filterCategory}>Mechanic</Text>
              <View style={styles.filterButtonsRow}>
                <TouchableOpacity
                  style={
                    mechanicFilter === "isolation"
                      ? styles.filterOptionActive
                      : styles.filterOption
                  }
                  onPress={() =>
                    setMechanicFilter(
                      mechanicFilter === "isolation" ? "" : "isolation"
                    )
                  }
                >
                  <Text
                    style={
                      mechanicFilter === "isolation"
                        ? styles.filterOptionTextActive
                        : styles.filterOptionText
                    }
                  >
                    Isolation
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={
                    mechanicFilter === "compound"
                      ? styles.filterOptionActive
                      : styles.filterOption
                  }
                  onPress={() =>
                    setMechanicFilter(
                      mechanicFilter === "compound" ? "" : "compound"
                    )
                  }
                >
                  <Text
                    style={
                      mechanicFilter === "compound"
                        ? styles.filterOptionTextActive
                        : styles.filterOptionText
                    }
                  >
                    Compound
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Equipment Filters */}
            <View style={styles.filterSection}>
              <Text style={styles.filterCategory}>Equipment</Text>
              <View style={styles.filterButtonsRow}>
                <TouchableOpacity
                  style={
                    equipmentFilter === "barbell"
                      ? styles.filterOptionActive
                      : styles.filterOption
                  }
                  onPress={() =>
                    setEquipmentFilter(
                      equipmentFilter === "barbell" ? "" : "barbell"
                    )
                  }
                >
                  <Text
                    style={
                      equipmentFilter === "barbell"
                        ? styles.filterOptionTextActive
                        : styles.filterOptionText
                    }
                  >
                    Barbell
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={
                    equipmentFilter === "dumbbell"
                      ? styles.filterOptionActive
                      : styles.filterOption
                  }
                  onPress={() =>
                    setEquipmentFilter(
                      equipmentFilter === "dumbbell" ? "" : "dumbbell"
                    )
                  }
                >
                  <Text
                    style={
                      equipmentFilter === "dumbbell"
                        ? styles.filterOptionTextActive
                        : styles.filterOptionText
                    }
                  >
                    Dumbbell
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={
                    equipmentFilter === "cable"
                      ? styles.filterOptionActive
                      : styles.filterOption
                  }
                  onPress={() =>
                    setEquipmentFilter(
                      equipmentFilter === "cable" ? "" : "cable"
                    )
                  }
                >
                  <Text
                    style={
                      equipmentFilter === "cable"
                        ? styles.filterOptionTextActive
                        : styles.filterOptionText
                    }
                  >
                    Cable
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

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
              onPress={() => console.log(`Clicked on ${exercise.name}`)}
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
    justifyContent: "center", // Centers the modal vertically
    alignItems: "center", // Centers horizontally
  },
  modalContentContainer: {
    backgroundColor: Colors.white,
    padding: 20,
    borderRadius: 10,
    maxHeight: "80%", // Ensures the modal doesn't exceed screen height
    width: "90%", // You can adjust the width to make it look better
  },
  modalContent: {
    paddingBottom: 20, // Optional: Add some padding to the bottom
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
