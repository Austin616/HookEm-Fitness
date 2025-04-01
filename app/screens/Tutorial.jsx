import React, { useState } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { doc, setDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../../firebaseConfig";
import Colors from "../../assets/colors";

const Tutorial = ({ navigation }) => {
  const [step, setStep] = useState(1);
  const [heightFeet, setHeightFeet] = useState("5");
  const [heightInches, setHeightInches] = useState("0"); 
  const [weight, setWeight] = useState("");
  const [goal, setGoal] = useState("buildMuscle");
  const [targetWeight, setTargetWeight] = useState("");

  const handleNextStep = () => {
    if (step === 1 && (!heightFeet || !heightInches)) {
      alert("Please enter your height");
      return;
    } else if (step === 2 && !weight) {
      alert("Please enter your weight");
      return;
    } else if (step === 3 && !goal) {
      alert("Please select a fitness goal");
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
          doc(db, "users", user.uid),
          {
            height: `${heightFeet}ft ${heightInches}in`,
            weight,
            goal,
            targetWeight,
          },
          { merge: true } // ✅ This merges data instead of replacing it
        );
        navigation.navigate("Dashboard");
      } catch (error) {
        console.error("Error saving data:", error);
      }
    }
  };

  return (
    <View style={styles.container}>
      {step === 1 && (
        <View style={styles.section}>
          <Text style={styles.title}>Enter Your Height</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={heightFeet}
              onValueChange={(itemValue) => setHeightFeet(itemValue)}
              style={styles.picker}
            >
              {[...Array(10).keys()].map((i) => (
                <Picker.Item key={i} label={`${i + 4} ft`} value={`${i + 4}`} />
              ))}
            </Picker>

            <Picker
              selectedValue={heightInches}
              onValueChange={(itemValue) => setHeightInches(itemValue)}
              style={styles.picker}
            >
              {[...Array(12).keys()].map((i) => (
                <Picker.Item key={i} label={`${i} in`} value={`${i}`} />
              ))}
            </Picker>
          </View>
        </View>
      )}

      {step === 2 && (
        <View style={styles.section}>
          <Text style={styles.title}>Enter Your Weight</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your weight in lbs"
            value={weight}
            onChangeText={setWeight}
            keyboardType="numeric"
          />
        </View>
      )}

      {step === 3 && (
        <View style={styles.section}>
          <Text style={styles.title}>Choose Your Fitness Goal</Text>
          <ScrollView
            contentContainerStyle={styles.cardContainer}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
          >
            <TouchableOpacity
              style={[
                styles.card,
                goal === "buildMuscle" && styles.selectedCard,
              ]}
              onPress={() => setGoal("buildMuscle")}
            >
              <Text
                style={[
                  styles.cardText,
                  goal === "buildMuscle" && styles.selectedCardText,
                ]}
              >Build Muscle</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.card,
                goal === "loseWeight" && styles.selectedCard,
              ]}
              onPress={() => setGoal("loseWeight")}
            >
             <Text
                style={[
                  styles.cardText,
                  goal === "loseWeight" && styles.selectedCardText,
                ]}
              >Lose Weight</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.card,
                goal === "maintainWeight" && styles.selectedCard,
              ]}
              onPress={() => setGoal("maintainWeight")}
            >
              <Text
                style={[
                  styles.cardText,
                  goal === "maintainWeight" && styles.selectedCardText,
                ]}
              >
                Maintain Weight
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      )}

      {step === 4 && (
        <View style={styles.section}>
          <Text style={styles.title}>Enter Your Target Weight (Optional)</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter target weight in lbx (optional)"
            value={targetWeight}
            onChangeText={setTargetWeight}
            keyboardType="numeric"
          />
        </View>
      )}

      <View style={styles.buttonContainer}>
        {step < 4 ? (
          <Button
            title="Next"
            onPress={handleNextStep}
            color={Colors.ut_burnt_orange}
          />
        ) : (
          <Button
            title="Finish"
            onPress={handleFinish}
            color={Colors.ut_burnt_orange}
          />
        )}
      </View>
    </View>
  );
};

export default Tutorial;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: Colors.primary,
  },

  section: {
    width: "100%",
    marginBottom: 20,
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    color: Colors.dark_gray,
  },

  pickerContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },

  picker: {
    width: 120,
    height: 180,
  },

  input: {
    width: "100%",
    padding: 12,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: Colors.ut_burnt_orange,
    backgroundColor: Colors.white,
    marginBottom: 15,
  },

  cardContainer: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    width: "100%",
  },

  card: {
    width: 100,
    height: 100,
    backgroundColor: Colors.white,
    borderRadius: 10,
    marginHorizontal: 10,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: Colors.dark_gray,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  selectedCard: {
    backgroundColor: Colors.ut_burnt_orange,
  },

  selectedCardText: {
    color: Colors.white,
    fontWeight: "bold",
  },

  cardText: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.dark_gray,
  },

  buttonContainer: {
    width: "100%",
    marginTop: 20,
  },
});
