import { useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Colors from "../../assets/colors"; // Adjust the path as necessary

const WorkoutCard = ({ muscleGroup, onPress }) => {

    fetchWorkoutsInMuscleGroup = async () => {
        try {
            const response = await fetch('https://raw.githubusercontent.com/Austin616/free-exercise-db/main/dist/exercises.json');
            if (response.ok) {
                const data = await response.json();
                const workoutsInMuscleGroup = data.filter(exercise => exercise.primaryMuscles.includes(muscleGroup));
                console.log(workoutsInMuscleGroup); // Log the workouts in the muscle group
            } else {
                console.error('Error fetching data', response.status);
            }
        } catch (error) {
            console.error('Error fetching data', error);
        }
    };

    return (
        <TouchableOpacity onPress={onPress} style={styles.card}>
            <Text style={{ color: Colors.white, fontSize: 16, fontWeight: 'bold' }}>
                {muscleGroup}
            </Text>
        </TouchableOpacity>
    );
    };

const styles = StyleSheet.create({
    card: {
        backgroundColor: Colors.ut_burnt_orange,
        padding: 16,
        borderRadius: 8,
        marginBottom: 16,
        aspectRatio: 1,
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        
    },
   
});

export default WorkoutCard;