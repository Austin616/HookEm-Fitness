import React, { useEffect } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router'; // Import useRouter from expo-router
import {useLocalSearchParams} from 'expo-router'; // Import useLocalSearchParams from expo-router
import CustomHeader from '../components/CustomHeader'; // Import your custom header component
import Colors from '../../assets/colors'; // Adjust the path as necessary

const WorkoutDetail = () => {
  const router = useRouter(); // Initialize the router
  const { workoutName, workoutDate } = useLocalSearchParams(); // Get the workoutName and workoutDate from the URL parameters


  useEffect(() => {
    // Perform any side effects or data fetching here if needed
    console.log('Workout Name:', workoutName);
    console.log('Workout Date:', workoutDate);

    console.log('Workout Details Loaded');
  }, [workoutName, workoutDate]);

  return (
    <View style={styles.container}>
      <CustomHeader showBackButton showSettingsButton />
      <Text style={styles.title}>Workout Details</Text>
      <Text style={styles.workoutName}>Workout Name: {workoutName}</Text>
      <Text style={styles.workoutName}>Workout Date: {workoutDate}</Text>
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
