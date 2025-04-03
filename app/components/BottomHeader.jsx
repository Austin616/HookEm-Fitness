import { View, Image, StyleSheet } from "react-native";
import { Link } from "expo-router";
import foodIcon from "../../assets/images/food.png";
import homeIcon from "../../assets/images/home.png";
import profileIcon from "../../assets/images/user.png";
import Colors from "../../assets/colors";

const BottomHeader = () => {
  return (
    <View style={styles.container}>
      <Link href="/dashboard" style={styles.button}>
        <Image source={homeIcon} style={styles.icon} />
      </Link>
      <Link href="/workout" style={styles.button}>
        <Image source={profileIcon} style={styles.icon} />
      </Link>
      <Link href="/profile" style={styles.button}>
        <Image source={foodIcon} style={styles.icon} />
      </Link>
    </View>
  );
};

export default BottomHeader;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    height: 60,
    backgroundColor: Colors.primary,
    borderTopWidth: 1,
    borderTopColor: Colors.ut_burnt_orange,
    paddingHorizontal: 10,  // Adds horizontal padding for better spacing
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    padding: 5,  // Adds padding around the icons to increase tap area
  },
  icon: {
    width: 24,
    height: 24,
    tintColor: Colors.ut_burnt_orange,
  },
});
