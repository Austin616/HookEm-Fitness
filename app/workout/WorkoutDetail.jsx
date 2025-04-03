import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { useEffect } from 'react';

const WorkoutDetail = ({ route }) => {
  // Retrieve the workoutName from the route parameters
  const { workoutName } = route.params;

  useEffect(() => {
    // Perform any side effects or data fetching here if needed
    console.log('Workout Name:', workoutName);
    console.log('Workout Date:', route.params.workoutDate);

    console.log('Workout Details Loaded');

    console.log('route.params:', route.params); // Log the entire params object
  }, [workoutName]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Workout Details</Text>
      <Text style={styles.workoutName}>Workout Name: {workoutName}</Text>
      <Text style={styles.workoutName}>Workout Date: {route.params.workoutDate}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  workoutName: {
    fontSize: 18,
    color: '#333',
  },
});

export default WorkoutDetail;
