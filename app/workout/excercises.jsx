import React, { useEffect, useState, useRef } from "react";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import Colors from "../../assets/colors";
import { Swipeable } from "react-native-gesture-handler";
import Animated from "react-native-reanimated";

const Exercise = ({
  exercise,
  setsReps,
  handleSetsRepsChange,
  handleAddRow,
  handleAddSetsReps,
  handleDeleteExercise,
  handleDeleteSet,
  handleCompletedSet, // Function to mark the set as completed in Firestore
  workoutName,
  workoutDate,
  getCompletedSets, // The prop function to get completed sets
}) => {
  const swipeableRefs = useRef([]);
  const [completedSets, setCompletedSets] = useState({}); // Track completed sets locally

  useEffect(() => {
    // Fetch completed sets when the component mounts or updates
    const fetchCompletedSets = async () => {
      const sets = await getCompletedSets(workoutName, workoutDate, exercise.id);
      setCompletedSets(sets); // Update state with the completed sets
    };

    fetchCompletedSets();
  }, [getCompletedSets, workoutName, workoutDate, exercise.id]);

  const renderDeleteAction = (setId, index) => {
    return (
      <Animated.View style={styles.deleteButtonContainer}>
        <Text style={styles.deleteText}>Delete</Text>
      </Animated.View>
    );
  };

  const handleSwipeClose = (index) => {
    if (swipeableRefs.current[index]) {
      swipeableRefs.current[index].close();
    }
  };

  const handleSwipeLeft = (index) => {
    handleSwipeClose(index);
    console.log("Left swipe detected for set index:", index);

    // Mark the set as complete locally
    setCompletedSets((prev) => ({
      ...prev,
      [index]: true, // Mark this set as completed
    }));

    handleCompletedSet(workoutName, workoutDate, exercise.id, index); // Call the function to mark the set as completed in Firestore
  };

  const handleDelete = (exerciseId, index) => {
    handleDeleteSet(exerciseId, index);
    handleSwipeClose(index);
  };

  return (
    <View style={styles.exerciseContainer}>
      <Text style={styles.exerciseText}>{exercise.name}</Text>
      <Text style={styles.workoutGroup}>
        {exercise.primaryMuscles
          .map((muscle) => muscle.charAt(0).toUpperCase() + muscle.slice(1))
          .join(", ")}
      </Text>

      <ScrollView showsVerticalScrollIndicator={false}>
        {setsReps[exercise.id]?.map((set, index) => (
          <Swipeable
            key={index}
            ref={(ref) => (swipeableRefs.current[index] = ref)}
            renderRightActions={() => renderDeleteAction(set.id, index)}
            renderLeftActions={() => (
              <Animated.View style={styles.leftSwipeAction}>
                <Text style={styles.leftSwipeText}>Marked as Green</Text>
              </Animated.View>
            )}
            onSwipeableRightOpen={() => handleDelete(exercise.id, index)}
            onSwipeableClose={() => handleSwipeClose(index)}
            onSwipeableLeftOpen={() => handleSwipeLeft(index)} // Handle left swipe
            overshootRight={false}
            overshootLeft={false}
            rightThreshold={50}
            leftThreshold={50}
          >
            <View
              style={[
                styles.setRow,
                completedSets[index] && styles.completedSet, // Apply completed style if set is marked as completed
              ]}
            >
              <Text style={styles.setText}>Set {index + 1}</Text>

              <TextInput
                style={styles.input}
                placeholder="Reps"
                keyboardType="numeric"
                value={set.reps}
                onChangeText={(text) => {
                  handleSetsRepsChange(exercise.id, "reps", text, index);
                  handleAddSetsReps(exercise.id, index, "reps", text);
                }}
              />
            </View>
          </Swipeable>
        ))}
      </ScrollView>

      <TouchableOpacity onPress={() => handleAddRow(exercise.id)}>
        <Text style={styles.addRowText}>Add Row</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => handleDeleteExercise(exercise.id)}
        style={styles.deleteButton}
      >
        <Text style={styles.deleteButtonText}>Delete Exercise</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  exerciseContainer: {
    backgroundColor: Colors.lightGray,
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
    borderWidth: 1,
    width: "100%",
    maxWidth: 380,
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
  setRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
    alignItems: "center",
    backgroundColor: Colors.white,
    borderRadius: 5,
    padding: 8,
  },
  completedSet: {
    backgroundColor: Colors.green, // Mark completed sets with a green background
  },
  setText: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.dark_gray,
    width: "30%",
  },
  input: {
    height: 40,
    borderColor: Colors.gray,
    borderWidth: 1,
    borderRadius: 5,
    width: "60%",
    paddingLeft: 8,
    fontSize: 16,
  },
  addRowText: {
    color: Colors.ut_burnt_orange,
    fontWeight: "bold",
    marginTop: 8,
    textAlign: "center",
    fontSize: 16,
  },
  deleteButton: {
    marginTop: 24,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    width: "50%",
    alignSelf: "center",
    alignItems: "center",
    backgroundColor: Colors.red,
    elevation: 3,
  },
  deleteButtonText: {
    color: Colors.white,
    textAlign: "center",
    fontSize: 14,
    fontWeight: "bold",
  },
  workoutGroup: {
    fontSize: 12,
    color: Colors.gray,
    fontStyle: "italic",
    paddingBottom: 8,
    textDecorationLine: "underline",
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
  leftSwipeAction: {
    backgroundColor: Colors.light_green,
    justifyContent: "center",
    alignItems: "center",
    width: 100,
    height: 60,
    borderRadius: 5,
  },
  leftSwipeText: {
    color: Colors.white,
    fontWeight: "bold",
  },
});

export default Exercise;
