import { View, Text, StyleSheet, Linking } from "react-native";
import { useRouter } from "expo-router";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import CustomHeader from "../components/CustomHeader";
import Colors from "../../assets/colors";

const GymDetail = () => {
  const router = useRouter();
  const { gymName } = useLocalSearchParams(); // Access the gymName from the route
  console.log(gymName);

  const [gymData, setGymData] = useState(null);

  useEffect(() => {
    const fetchGymData = async () => {
      try {
        const response = await fetch(
          "https://recsports-scraping.onrender.com/facilities"
        );
        const data = await response.json();

        setGymData(data.facilities[gymName]);
      } catch (error) {
        console.error("Error fetching gym data:", error);
      }
    };

    fetchGymData();
  }, [gymName]);

  if (!gymData) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Gym Not Found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CustomHeader showBackButton />
      <Text style={styles.title}>{gymName}</Text>
      <ScrollView style={styles.infoContainer}>
        <Text style={styles.infoTitle}>Today's Hours</Text>
        <Text style={styles.infoText}>{gymData["Today 's Hours"]}</Text>

        <Text style={styles.infoTitle}>Operating Hours</Text>
        {["Mon-Thu", "Fri", "Sat", "Sun"].map((day, index) => (
          <View key={index} style={styles.hoursRow}>
            <Text style={styles.day}>{day}:</Text>
            <Text style={styles.hours}>{gymData[day]}</Text>
          </View>
        ))}
        
        <Text style={styles.infoTitle}>Activities</Text>
        {gymData["Activities"].map((activity, index) => (
          <TouchableOpacity key={index} style={styles.card}>
            <Text style={styles.cardText}>{activity}</Text>
          </TouchableOpacity>
        ))}

        <Text style={styles.infoTitle}>Features</Text>
        {gymData["Features"].map((feature, index) => (
          <TouchableOpacity key={index} style={styles.card}>
            <Text style={styles.cardText}>{feature}</Text>
          </TouchableOpacity>
        ))}

        <Text style={styles.infoTitle}>General Info</Text>
        <View style={styles.generalInfoContainer}>
          {gymData["General Info"].map((info, index) => (
            <Text key={index} style={styles.infoText}>
              {info.split("\n").map((paragraph, idx) => (
                <View key={idx} style={styles.paragraphContainer}>
                  <Text>{paragraph}</Text>
                </View>
              ))}
            </Text>
          ))}
        </View>

        <TouchableOpacity
          onPress={() =>
            Linking.openURL(
              "https://www.utrecsports.org/memberships/day-passes"
            )
          }
          style={styles.button}
        >
          <Text style={styles.buttonText}>View Day Passes</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            Linking.openURL("https://maps.app.goo.gl/apyEHnBp1wshQBRC8")
          }
          style={styles.button}
        >
          <Text style={styles.buttonText}>View Map</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            Linking.openURL("https://www.utrecsports.org/facilities/parking")
          }
          style={styles.button}
        >
          <Text style={styles.buttonText}>Parking Info</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => Linking.openURL("https://www.utrecsports.org/hours")}
          style={styles.button}
        >
          <Text style={styles.buttonText}>View Facility Hours</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => Linking.openURL(gymData.link)}
          style={styles.button}
        >
          <Text style={styles.linkText}>View Facility on Website</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default GymDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: Colors.primary,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: Colors.dark_gray,
    textAlign: "center",
  },
  infoContainer: {
    marginTop: 16,
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginTop: 24,
    color: Colors.secondary,
  },
  infoText: {
    fontSize: 16,
    color: Colors.dark_gray,
    marginBottom: 16,
    lineHeight: 24,
  },
  generalInfoContainer: {
    marginBottom: 16,
  },
  paragraphContainer: {
    marginBottom: 12,
  },
  button: {
    marginTop: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: Colors.ut_burnt_orange,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    color: Colors.white,
    textAlign: "center",
  },
  hoursRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray,
    paddingBottom: 8,
  },
  day: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.dark_gray,
  },
  hours: {
    fontSize: 16,
    color: Colors.dark_gray,
  },
  linkButton: {
    marginTop: 24,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: Colors.ut_burnt_orange,
    borderRadius: 8,
    alignItems: "center",
  },
  linkText: {
    fontSize: 16,
    color: Colors.white,
    textAlign: "center",
  },
  card: {
    backgroundColor: Colors.white,
    padding: 16,
    borderRadius: 8,
    marginVertical: 8,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  cardText: {
    fontSize: 16,
    color: Colors.dark_gray,
  },
});
