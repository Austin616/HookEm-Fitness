import { useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Colors from "../../assets/colors"; // Adjust the path as necessary
import {db} from '../../firebaseConfig';
import {doc, getDoc} from 'firebase/firestore';
import {useUser} from '../UserContext';

const LogWorkout = () => {
    const {userId} = useUser(); // Access userId from context

    const fetchWorkoutHistory = async () => {
        try {
            const docRef = doc(db, "workoutHistory", userId);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                console.log("Workout History:", docSnap.data());
            } else {
                console.log("No workout history found");
            }
        } catch (error) {
            console.error("Error fetching workout history:", error);
        }
    };

    useEffect(() => {
        fetchWorkoutHistory();
    }, []);

    const handleLogWorkout = () => {
        // Logic to log a workout
    }

}

export default LogWorkout;