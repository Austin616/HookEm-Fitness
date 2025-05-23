import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Calendar } from "react-native-calendars";
import useFetchWorkout from "./workout/fetchWorkout"; // Adjust the import path
import WorkoutModal from "./workout/WorkoutModel"; // Adjust the import path
import WorkoutList from "./workout/WorkoutList"; // Adjust the import path
import Colors from "../assets/colors"; // Adjust the import path
import { useRouter } from "expo-router"; // Import useRouter
import CustomHeader from "./components/CustomHeader";

const WorkoutTracker = () => {
  const {
    userData,
    existingWorkouts,
    workoutDates,
    handleCreateWorkout,
    handleDeleteWorkout,
  } = useFetchWorkout();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const router = useRouter(); // Initialize the router

  const handleWorkoutCreation = (workoutName) => {
    if (!selectedDate) {
      alert("Please select a date first");
      return;
    }

    // Check if the selected date already has a workout
    const existingWorkout = existingWorkouts.find(
      (workout) => workout.date === selectedDate
    );

    if (existingWorkout) {
      console.log("Existing Workout Found:", existingWorkout); // Debug: Log the found workout
      // If a workout already exists, navigate to the workout detail page
      router.push({
        pathname: `/workout/WorkoutDetail?workoutName=${existingWorkout.name}&workoutDate=${selectedDate}`, // Navigate to the Workout Detail page
        query: { workoutName: existingWorkout.name, workoutDate: selectedDate },
      });
    } else {
      console.log("No existing workout found. Creating new one.");
      // If no workout exists, create a new one
      handleCreateWorkout(workoutName, selectedDate, router);
      setModalVisible(false); // Close the modal after creation
    }
  };

  const onDayPress = (day) => {
    console.log("Day pressed:", day); // Debug: Check the pressed day
    if (workoutDates[day.dateString]) {
      // If the date is already marked, navigate to the workout detail page
      const existingWorkout = existingWorkouts.find(
        (workout) => workout.date === day.dateString
      );
      if (existingWorkout) {
        router.push({
          pathname: `/workout/WorkoutDetail?workoutName=${existingWorkout.name}&workoutDate=${day.dateString}`, // Navigate to the Workout Detail page
          query: {
            workoutName: existingWorkout.name,
            workoutDate: day.dateString,
          },
        });
      }
      return;
    }
    setSelectedDate(day.dateString); // Store the selected date
    setModalVisible(true); // Open the modal to add workout
  };

  return (
    <ScrollView style={{ flex: 1 }}>
      <View style={styles.container}>
        <CustomHeader showLogo showSettingsButton />
        <Text style={styles.title}>Workout Tracker</Text>
        {userData && (
          <Text style={styles.userInfo}>
            Welcome, {userData.name}! Your email is {userData.email}.
          </Text>
        )}
        <Calendar
          onDayPress={onDayPress}
          markedDates={{
            ...workoutDates, // Keep existing marked dates
            [selectedDate]: { // Ensure selected day styling
              selected: true,
              selectedColor: Colors.ut_burnt_orange, // Selected day color
              marked: true,

              fontWeight: "bold",
            },
          }}
          theme={{
            todayTextColor: Colors.ut_burnt_orange,
            selectedDayColor: Colors.ut_burnt_orange,
            arrowColor: Colors.ut_burnt_orange,
          }}
        />
        <WorkoutModal
          isVisible={modalVisible}
          onClose={() => setModalVisible(false)}
          onCreateWorkout={handleWorkoutCreation}
        />
        <WorkoutList
          workouts={existingWorkouts}
          onDeleteWorkout={handleDeleteWorkout}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  userInfo: {
    fontSize: 18,
    color: Colors.dark_gray,
    marginBottom: 10,
    textAlign: "center",
  },
});

export default WorkoutTracker;
