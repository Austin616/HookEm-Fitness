import { useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Colors from "../../assets/colors"; // Adjust the path as necessary

const WorkoutCard = ({ muscleGroup, onPress }) => {
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