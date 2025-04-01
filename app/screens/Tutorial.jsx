import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { doc, setDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../../firebaseConfig'; // Ensure correct path to firebaseConfig
import Colors from '../../assets/colors'; // Import colors for styling

const Tutorial = ({ navigation }) => {
  const [step, setStep] = useState(1);
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [goal, setGoal] = useState('buildMuscle');  // Set default goal
  const [targetWeight, setTargetWeight] = useState('');

  const handleNextStep = () => {
    if (step === 1 && !height) {
      alert('Please enter your height');
      return;
    } else if (step === 2 && !weight) {
      alert('Please enter your weight');
      return;
    } else if (step === 3 && !goal) {
      alert('Please select a fitness goal');
      return;
    }

    setStep(step + 1);
  };

  const handleFinish = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
  
    if (user) {
      try {
        await setDoc(
          doc(db, 'users', user.uid),
          {
            height,
            weight,
            goal,
            targetWeight,
          },
          { merge: true } // ✅ This merges data instead of replacing it
        );
        navigation.navigate('Dashboard');
      } catch (error) {
        console.error('Error saving data:', error);
      }
    }
  };

  return (
    <View style={styles.container}>
      {step === 1 && (
        <View style={styles.section}>
          <Text style={styles.title}>Enter Your Height</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your height in cm"
            value={height}
            onChangeText={setHeight}
            keyboardType="numeric"
          />
        </View>
      )}

      {step === 2 && (
        <View style={styles.section}>
          <Text style={styles.title}>Enter Your Weight</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your weight in kg"
            value={weight}
            onChangeText={setWeight}
            keyboardType="numeric"
          />
        </View>
      )}

      {step === 3 && (
        <View style={styles.section}>
          <Text style={styles.title}>Choose Your Fitness Goal</Text>
            <Picker
              selectedValue={goal}
              onValueChange={(itemValue) => setGoal(itemValue)}
            >
              <Picker.Item label="Build Muscle" value="buildMuscle" />
              <Picker.Item label="Lose Weight" value="loseWeight" />
              <Picker.Item label="Maintain Weight" value="maintainWeight" />
            </Picker>
        </View>
      )}

      {step === 4 && (
        <View style={styles.section}>
          <Text style={styles.title}>Enter Your Target Weight (Optional)</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter target weight in kg (optional)"
            value={targetWeight}
            onChangeText={setTargetWeight}
            keyboardType="numeric"
          />
        </View>
      )}

      <View style={styles.buttonContainer}>
        {step < 4 ? (
          <Button title="Next" onPress={handleNextStep} color={Colors.ut_burnt_orange} />
        ) : (
          <Button title="Finish" onPress={handleFinish} color={Colors.ut_burnt_orange} />
        )}
      </View>
    </View>
  );
};

export default Tutorial;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: Colors.primary, // Using primary background color
  },

  section: {
    width: '100%',
    marginBottom: 20,
  },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: Colors.dark_gray, // Dark gray for title text
  },

  input: {
    width: '100%',
    padding: 12,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: Colors.ut_burnt_orange, // Border color with UT burnt orange
    backgroundColor: Colors.white, // White background for input
    marginBottom: 15,
  },

  buttonContainer: {
    width: '100%',
    marginTop: 20,
  },
});
