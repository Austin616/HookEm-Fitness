import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Calendar } from "react-native-calendars";
import useFetchWorkout from "./components/Workout/fetchWorkout"; // Adjust the import path
import WorkoutModal from "./components/Workout/WorkoutModel"; // Adjust the import path
import WorkoutList from "./components/Workout/WorkoutList"; // Adjust the import path
import Colors from "../assets/colors"; // Adjust the import path
import { useRouter } from "expo-router"; // Import useRouter

const WorkoutTracker = () => {
  const { userData, existingWorkouts, workoutDates, handleCreateWorkout, handleDeleteWorkout } = useFetchWorkout();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const router = useRouter(); // Initialize the router

  const handleWorkoutCreation = (workoutName) => {
    if (!selectedDate) {
      alert("Please select a date first");
      return;
    }

    // Check if the selected date already has a workout
    const existingWorkout = existingWorkouts.find(workout => workout.date === selectedDate);

    if (existingWorkout) {
      console.log('Existing Workout Found:', existingWorkout); // Debug: Log the found workout
      // If a workout already exists, navigate to the workout detail page
      router.push({
        pathname: "/workoutDetail", // Use file-based routing
        query: { workoutName: existingWorkout.name, workoutDate: selectedDate }
      });
    } else {
      console.log('No existing workout found. Creating new one.');
      // If no workout exists, create a new one
      handleCreateWorkout(workoutName, selectedDate, router);
      setModalVisible(false); // Close the modal after creation
    }
  };

  const onDayPress = (day) => {
    console.log('Day pressed:', day); // Debug: Check the pressed day
    if (workoutDates[day.dateString]) {
      // If the date is already marked, navigate to the workout detail page
      const existingWorkout = existingWorkouts.find(workout => workout.date === day.dateString);
      if (existingWorkout) {
        router.push({
          pathname: "/workoutDetail", // Navigate to the Workout Detail page
          query: { workoutName: existingWorkout.name, workoutDate: day.dateString }
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
        <Text style={styles.title}>Workout Tracker</Text>
        {userData && (
          <Text style={styles.userInfo}>
            Welcome, {userData.name}! Your email is {userData.email}.
          </Text>
        )}
        <Calendar
          onDayPress={onDayPress}
          markedDates={workoutDates} // Pass the marked dates to the calendar
          theme={{
            todayTextColor: Colors.primary,
            selectedDayBackgroundColor: Colors.secondary,
            arrowColor: Colors.primary,
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
    padding: 20,
    backgroundColor: Colors.primary,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  userInfo: {
    fontSize: 18,
    color: "#555",
    marginBottom: 10,
    textAlign: "center",
  },
});

export default WorkoutTracker;
