import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import { useRouter } from 'expo-router'; // Import useRouter from expo-router
import Colors from '../../assets/colors';

const WorkoutList = ({ workouts, onDeleteWorkout }) => {
  
  const router = useRouter(); // Use useRouter hook for routing

  const currentDate = new Date();
  const startOfWeek = new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay()));
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);

  // Function to filter workouts within this week
  const filterWorkoutsThisWeek = () => {
    return workouts.filter((workout) => {
      const workoutDate = new Date(workout.date);
      return workoutDate >= startOfWeek && workoutDate <= endOfWeek;
    });
  };

  const handleDelete = (workoutId) => {
    onDeleteWorkout(workoutId);
  };

  const renderWorkoutItem = ({ item }) => {
    const handleNavigation = () => {
      // Use file-based routing to pass the parameters in the URL
      router.push(`/workout/WorkoutDetail?workoutName=${item.name}&workoutDate=${item.date}`);

    };

    const renderRightActions = () => {
      return (
        <Animated.View style={styles.deleteButtonContainer}>
          <Text style={styles.deleteText}>Delete</Text>
        </Animated.View>
      );
    };

    return (
      <Swipeable
        renderRightActions={renderRightActions}
        onSwipeableRightOpen={() => handleDelete(item.id)}
        overshootRight={false}
        rightThreshold={50}
      >
        <TouchableOpacity onPress={handleNavigation} activeOpacity={1}>
          <View style={styles.workoutItem}>
            <Text style={styles.workoutText}>
              {item.name} - {item.date}
            </Text>
          </View>
        </TouchableOpacity>
      </Swipeable>
    );
  };

  // Get filtered workouts for the current week
  const workoutsThisWeek = filterWorkoutsThisWeek();

  return (
    <View style={styles.existingWorkoutsContainer}>
      <Text style={styles.subtitle}>Workouts This Week</Text>
      {workoutsThisWeek.length > 0 ? (
        <ScrollView showsVerticalScrollIndicator={false}>
          {workoutsThisWeek.map((workout) => (
            <View key={workout.id}>
              {renderWorkoutItem({ item: workout })}
            </View>
          ))}
        </ScrollView>
      ) : (
        <Text style={styles.noWorkoutsText}>
          Log your workouts to see them here!
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  existingWorkoutsContainer: {
    marginTop: 20,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: Colors.ut_burnt_orange,
  },
  workoutItem: {
    backgroundColor: Colors.white,
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    height: 60,
    borderColor: Colors.ut_burnt_orange,
  },
  deleteButtonContainer: {
    backgroundColor: Colors.red,
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: 60,
    borderRadius: 5,
    marginLeft: -10,
  },
  workoutText: {
    fontSize: 18,
    color: Colors.dark_gray,
    flex: 1,
  },
  deleteText: {
    color: Colors.white,
    fontWeight: 'bold',
  },
  noWorkoutsText: {
    fontSize: 16,
    color: Colors.dark_gray,
    textAlign: 'center',
  },
});

export default WorkoutList;
