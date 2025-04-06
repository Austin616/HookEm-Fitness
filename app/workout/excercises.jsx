import React, { useState, useEffect, useRef } from "react";
import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Image,
  Alert,
  Modal,
} from "react-native";
import Colors from "../../assets/colors";
import useFetchWorkout from "./fetchWorkout";
import {
  Swipeable,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import * as Haptics from "expo-haptics";
import closeIcon from "../../assets/images/close.png";
import { Picker } from "@react-native-picker/picker";

const Exercise = ({
  exercise,
  setsReps,
  setSetsReps,
  handleSetsRepsChange,
  handleAddSetsReps,
  handleAddRow,
  handleDeleteExercise,
  workoutName,
  workoutDate,
}) => {
  const { fetchCompletedSetsFromExercise } = useFetchWorkout();
  const swipeableRefs = useRef({});
  const [isEditing, setIsEditing] = useState(false);
  const [isPickerVisible, setIsPickerVisible] = useState(false);
  const [selectedReps, setSelectedReps] = useState(null);
  const [setIndexForPicker, setSetIndexForPicker] = useState(null);
  const [pendingUploadExerciseId, setPendingUploadExerciseId] = useState(null);
  const [pendingCompleteExerciseId, setPendingCompleteExerciseId] = useState(null);

  const handleCompleteSet = async (exerciseId, setIndex) => {
    try {
      setSetsReps((prev) => {
        const updated = {
          ...prev,
          [exerciseId]: prev[exerciseId].map((set, i) =>
            i === setIndex ? { ...set, completed: !set.completed } : set
          ),
        };
        return updated;
      });
    
      setPendingCompleteExerciseId(exerciseId);
      await fetchCompletedSetsFromExercise(
        workoutName,
        workoutDate,
        exerciseId,
        setIndex
      );
  
      if (swipeableRefs.current[`${exercise.id}-${setIndex}`]) {
        swipeableRefs.current[`${exercise.id}-${setIndex}`].close();
      }
    } catch (error) {
      console.error("Error marking set as completed:", error);
    }
  };

  const handleDeleteSet = (exerciseId, setIndex) => {
    Alert.alert(
      "Delete Set",
      "Are you sure you want to delete this set?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            setSetsReps((prev) => ({
              ...prev,
              [exerciseId]: prev[exerciseId].filter((_, i) => i !== setIndex),
            }));
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleRepsPickerChange = (itemValue) => {
    setSelectedReps(itemValue);
  };
  
  const handleDonePicker = () => {
    if (setIndexForPicker !== null) {
      handleSetsRepsChange(
        exercise.id,
        setIndexForPicker,
        "reps",
        selectedReps
      );
      setPendingUploadExerciseId(exercise.id); 
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setIsPickerVisible(false);
    }
  };

  const toggleEditing = () => {
    if (isEditing) {
      handleAddSetsReps(exercise.id);
    }
    setIsEditing((prev) => !prev); 
  };

  const deleteExercise = () => {
    handleDeleteExercise(exercise.id); 
    setIsEditing(false); 
  };

  useEffect(() => {
    if (pendingCompleteExerciseId) {
      handleAddSetsReps(pendingCompleteExerciseId);
      setPendingCompleteExerciseId(null);
    }
  }, [setsReps]);
  
  useEffect(() => {
    if (pendingUploadExerciseId) {
      handleAddSetsReps(pendingUploadExerciseId);
      setPendingUploadExerciseId(null); 
    }
  }, [setsReps]);
  

  return (
    <GestureHandlerRootView>
      <View style={styles.exerciseContainer}>
        <Text style={styles.exerciseText}>{exercise.name}</Text>
        {isEditing && (
          <TouchableOpacity
            onPress={deleteExercise}
            style={styles.deleteIconContainer}
          >
            <Image source={closeIcon} style={styles.closeIcon} />
          </TouchableOpacity>
        )}
        <Text style={styles.workoutGroup}>
          <Text style={styles.workoutGroup}>
            {[...exercise.primaryMuscles, ...exercise.secondaryMuscles]
              .map((muscle) => muscle.charAt(0).toUpperCase() + muscle.slice(1))
              .join(", ")}
          </Text>
        </Text>

        {setsReps[exercise.id]?.map((set, index) => (
          <Swipeable
            key={index}
            ref={(ref) =>
              (swipeableRefs.current[`${exercise.id}-${index}`] = ref)
            }
            renderRightActions={() => (
              <View style={styles.swipeActionRight}>
                <Text style={styles.swipeActionText}>Complete</Text>
              </View>
            )}
            renderLeftActions={() =>
              isEditing ? (
                <View style={[styles.swipeActionLeft]}>
                  <Text style={styles.swipeActionText}>Delete</Text>
                </View>
              ) : null
            }
            onSwipeableOpen={(direction) => {
              if (direction === "right") {
                handleCompleteSet(exercise.id, index);
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
              } else if (direction === "left" && isEditing) {
                // Delete set only when in edit mode
                handleDeleteSet(exercise.id, index);
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
              }
            }}
            friction={2}
            overshootLeft={false}
            overshootRight={false}
            maxSwipeDistance={20}
          >
            <View
              style={[
                styles.setRow,
                set.completed ? styles.completedRow : null,
              ]}
            >
              <Text style={styles.setText}>Set {index + 1}</Text>
              <TouchableOpacity
                onPress={() => {
                  setSetIndexForPicker(index);
                  setSelectedReps(set.reps); // Set initial value for picker
                  setIsPickerVisible(true);
                }}
                style={styles.input}
              >
                <Text style={styles.pickerText}>
                  {set.reps ? `${set.reps} reps` : "Select Reps"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  setSetIndexForPicker(index);
                  setSelectedReps(set.reps);
                  setIsPickerVisible(true);
                }}
                style={styles.input}
              >
                <Text style={styles.pickerText}>
                  {set.reps ? `${set.reps} reps` : "Select Reps"}
                </Text>
              </TouchableOpacity>

            </View>
          </Swipeable>
        ))}

        {/* Conditionally render Add Row */}
        {isEditing && (
          <>
            <TouchableOpacity onPress={() => handleAddRow(exercise.id)}>
              <Text style={styles.addRowText}>Add Row</Text>
            </TouchableOpacity>
          </>
        )}
        {/* Toggle Edit mode */}
        <TouchableOpacity onPress={toggleEditing}>
          <Text style={styles.doneEditingText}>
            {isEditing ? "Done Editing" : "Edit"}
          </Text>
        </TouchableOpacity>

        {/* Modal for the Picker */}
        <Modal
          visible={isPickerVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setIsPickerVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Picker
                selectedValue={selectedReps}
                onValueChange={handleRepsPickerChange}
              >
                {[...Array(50)].map((_, i) => (
                  <Picker.Item key={i} label={`${i + 1}`} value={`${i + 1}`} />
                ))}
              </Picker>
              <TouchableOpacity onPress={handleDonePicker}>
                <Text style={styles.doneEditingText}>Done</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: 300,
  },
  pickerText: {
    fontSize: 16,
    color: Colors.dark_gray,
    textAlign: "center",
    alignSelf: "center",
  },
  exerciseContainer: {
    backgroundColor: Colors.primary,
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
  deleteIconContainer: {
    position: "absolute",
    top: 8,
    right: 8,
    padding: 6,
    borderRadius: 15,
    elevation: 5,
  },
  deleteIcon: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.red,
  },
  exerciseText: {
    fontSize: 18,
    color: Colors.dark_gray,
    fontWeight: "600",
  },
  workoutGroup: {
    fontSize: 14,
    color: Colors.dark_gray,
    marginBottom: 20,
  },
  setRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
    backgroundColor: Colors.white,
    padding: 8,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: Colors.gray,
  },
  completedRow: {
    borderColor: Colors.ut_burnt_orange,
    borderWidth: 3,
  },
  setText: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.dark_gray,
  },
  input: {
    backgroundColor: Colors.white,
    padding: 8,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: Colors.gray,
    flex: 1,
    marginLeft: 8,

  },
  addRowText: {
    color: Colors.white,
    fontWeight: "bold",
    marginTop: 8,
    textAlign: "center",
    fontSize: 16,
    backgroundColor: Colors.ut_burnt_orange,
    padding: 8,
    borderRadius: 5,
    width: 100,
    alignSelf: "center",
  },
  doneEditingText: {
    color: Colors.ut_burnt_orange,
    fontWeight: "bold",
    marginTop: 20,
    textAlign: "center",
    fontSize: 16,
  },
  completeButton: {
    backgroundColor: Colors.ut_burnt_orange,
    padding: 8,
    borderRadius: 5,
    width: 80,
    alignItems: "center",
  },
  completeButtonText: {
    color: Colors.white,
    fontWeight: "bold",
    textAlign: "center",
  },
  swipeActionRight: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    marginBottom: 8,
    backgroundColor: Colors.ut_burnt_orange,
    padding: 8,
    borderRadius: 5,
    marginLeft: -5,
  },
  swipeActionLeft: {
    backgroundColor: Colors.red,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    marginBottom: 8,
    backgroundColor: Colors.red,
    padding: 8,
    borderRadius: 5,
    marginRight: -5,
    width: 80,
  },
  swipeActionText: {
    color: Colors.white,
    fontWeight: "bold",
  },
  closeIcon: {
    width: 20,
    height: 20,
    backgroundColor: Colors.primary,
    tintColor: Colors.ut_burnt_orange,
  },
});

export default Exercise;
