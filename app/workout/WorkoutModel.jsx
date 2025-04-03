import React, { useState } from 'react';
import { View, Text, Modal, TextInput, Button, StyleSheet } from 'react-native';
import Colors from '../../assets/colors'; // Adjust according to your color setup

const WorkoutModal = ({ isVisible, onClose, onCreateWorkout }) => {
    const [workoutName, setWorkoutName] = useState('');

    const handleCreateWorkout = () => {
        if (workoutName.trim() !== '') {
            onCreateWorkout(workoutName);
            setWorkoutName(''); // Clear input field after submission
        } else {
            alert('Please enter a workout name');
        }
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isVisible}
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Enter Workout Name</Text>
                    <TextInput
                        style={styles.input}
                        value={workoutName}
                        onChangeText={setWorkoutName}
                        placeholder="Workout Name"
                    />
                    <Button title="Create Workout" onPress={handleCreateWorkout} />
                    <Button title="Cancel" onPress={onClose} />
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: 300,
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        width: '100%',
        padding: 10,
        borderWidth: 1,
        borderColor: Colors.dark_gray,
        marginBottom: 20,
    },
});

export default WorkoutModal;
