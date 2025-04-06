// MuscleGroupModal.js
import React from 'react';
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View, Keyboard, Image} from 'react-native';
import WorkoutCard from './workoutCard';
import Colors from '../../assets/colors';
import closeIcon from '../../assets/images/close.png';

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
            <View style={styles.header}>
              <Text style={styles.modalTitle}>Select a Muscle Group</Text>
              <TouchableOpacity onPress={toggleModal} style={styles.closeContainer}>
                <Image source={closeIcon} style={styles.closeIcon} />
              </TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={styles.cardContainer}>
              {uniqueMuscleGroups.map((muscleGroup, index) => (
                <View key={index} style={styles.cardWrapper}>
                  <WorkoutCard
                    muscleGroup={muscleGroup}
                    onPress={() => handleNavigateToMuscleGroup(muscleGroup)}
                  />
                </View>
              ))}
            </ScrollView>
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
    width: '90%',
    backgroundColor: Colors.white,
    borderRadius: 8,
    padding: 16,
    maxHeight: '85%',
  },
  header: {
    width: '100%',  // Ensure the header spans the full width
    height: 40,     // Adjust the height if needed
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    position: 'absolute',  // Keep the title centered no matter the close icon
  },
  cardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingBottom: 120,
  },
  cardWrapper: {
    width: '48%',
    aspectRatio: 1,
    marginBottom: 16,
  },
  closeIcon: {
    width: 24,
    height: 24,
    tintColor: Colors.ut_burnt_orange,
  },
  closeContainer: {
    position: 'absolute',
    right: 0,},
});

export default MuscleGroupModal;
