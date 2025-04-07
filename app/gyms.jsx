import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import Colors from "../assets/colors";

// Assuming the images are imported like this
import GreenIcon from '../assets/images/open.gif';
import RedIcon from '../assets/images/output-onlinegiftools.gif';

const GymList = () => {
  const router = useRouter();
  const [gymNames, setGymNames] = useState([]);
  const [gymData, setGymData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://recsports-scraping.onrender.com/facilities"
        );
        const data = await response.json();
        const gymNamesArray = Object.keys(data.facilities);

        setGymData(data.facilities);
        setGymNames(gymNamesArray);
      } catch (error) {
        console.error("Error fetching gym names:", error);
      }
    };

    fetchData();
  }, []);

  const getGymHours = (gymName) => {
    if (gymData && gymData[gymName]) {
      return gymData[gymName]["Today 's Hours"];
    }
    return "Unknown hours";
  };

  const convertTo24Hour = (timeStr, meridian) => {
    const [hourStr, minuteStr = "00"] = timeStr.split(":");
    let hour = parseInt(hourStr);
    const minute = parseInt(minuteStr);

    if (meridian.toLowerCase() === "p" && hour !== 12) hour += 12;
    if (meridian.toLowerCase() === "a" && hour === 12) hour = 0;

    const time = new Date();
    time.setHours(hour, minute, 0, 0);
    return time;
  };

  const getTimeRange = (str) => {
    const match = str.match(/(\d{1,2}(?::\d{2})?)(a|p)\s*-\s*(\d{1,2}(?::\d{2})?)(a|p)/i);
    if (!match) return null;

    const [_, openTime, openMeridian, closeTime, closeMeridian] = match;
    return {
      open: convertTo24Hour(openTime, openMeridian),
      close: convertTo24Hour(closeTime, closeMeridian),
    };
  };

  const getHoursMessage = (hoursStr) => {
    const timeRange = getTimeRange(hoursStr);
    if (!timeRange) return "Unknown hours";

    const now = new Date();
    const { open, close } = timeRange;

    if (now >= open && now < close) {
      const diffMs = close - now;
      const diffHrs = diffMs / (1000 * 60 * 60);
      return `Closes in ${diffHrs.toFixed(1)} hour${diffHrs >= 2 ? "s" : ""}`;
    } else if (now < open) {
      const diffMs = open - now;
      const diffHrs = diffMs / (1000 * 60 * 60);
      return `Opens in ${diffHrs.toFixed(1)} hour${diffHrs >= 2 ? "s" : ""}`;
    } else {
      return "Closed";
    }
  };

  const getGymStatus = (hoursStr) => {
    const timeRange = getTimeRange(hoursStr);
    const now = new Date();
    if (timeRange) {
      const { open, close } = timeRange;
      if (now >= open && now < close) return "open";
      if (now < open) return "closed"; // waiting for open
    }
    return "closed"; // default is closed if no time is available
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gyms on Campus</Text>
      <Text style={styles.infoText}>Tap on a gym to view its details.</Text>

      <ScrollView style={styles.infoContainer}>
        {gymNames.map((gymName, index) => {
          const status = getGymStatus(getGymHours(gymName));
          const isOpen = status === "open";

          return (
            <TouchableOpacity
              key={index}
              onPress={() => router.push(`/gyms/${gymName}`)}
              style={[
                styles.gymCard,
                {
                  borderColor: isOpen ? 'green' : 'red',
                  backgroundColor: isOpen ? Colors.white : Colors.light_gray, // Adjust background color for closed gyms
                },
              ]}
            >
              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>{gymName}</Text>
                <Text style={styles.cardText}>
                  {getHoursMessage(getGymHours(gymName))}
                </Text>
              </View>
              <Image source={isOpen ? GreenIcon : RedIcon} style={styles.statusIcon} />
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default GymList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    padding: 25,
    borderRadius: 15,
    elevation: 5,
    shadowColor: Colors.dark_gray,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: Colors.gray,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  infoContainer: {
    marginTop: 16,
  },
  gymCard: {
    marginBottom: 24,
    padding: 16,
    borderRadius: 8,
    borderWidth: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoText: {
    fontSize: 10,
    marginBottom: 8,
    fontStyle: "italic",
    textAlign: "center",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  cardText: {
    fontSize: 10,
    color: Colors.dark_gray,
    fontStyle: "italic",
    marginTop: 4,
  },
  statusIcon: {
    width: 40,
    height: 40,
  },
});
