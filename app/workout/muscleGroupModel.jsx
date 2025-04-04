// MuscleGroupModal.js
import React from 'react';
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View, Keyboard } from 'react-native';
import WorkoutCard from './workoutCard';
import Colors from '../../assets/colors';

const MuscleGroupModal = ({ uniqueMuscleGroups, modalVisible, toggleModal, handleNavigateToMuscleGroup }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={toggleModal}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select a Muscle Group</Text>
            <ScrollView contentContainerStyle={styles.cardContainer}>
              {uniqueMuscleGroups.map((muscleGroup, index) => (
                <View key={index} style={styles.cardWrapper}>
                  <WorkoutCard
                    muscleGroup={muscleGroup}
                    onPress={() => handleNavigateToMuscleGroup(muscleGroup)} // Close modal after selecting
                  />
                </View>
              ))}
            </ScrollView>
            <TouchableOpacity
              onPress={toggleModal}
              style={styles.closeModalButton}
            >
              <Text style={styles.closeModalText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    maxHeight: '80%', // Ensure modal doesn't take the full screen height
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  cardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingBottom: 120
  },
  cardWrapper: {
    width: '48%',
    aspectRatio: 1,
    marginBottom: 16,
  },
  closeModalButton: {
    marginTop: 16,
    backgroundColor: Colors.red,
    borderRadius: 8,
    paddingVertical: 12,
  },
  closeModalText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default MuscleGroupModal;
