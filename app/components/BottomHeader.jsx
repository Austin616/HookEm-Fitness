import { View, Image, StyleSheet } from "react-native";
import { Link, usePathname } from "expo-router"; // Import usePathname to get the current route
import foodIcon from "../../assets/images/user.png";
import homeIcon from "../../assets/images/home.png";
import dumbellIcon from "../../assets/images/more.png";
import Colors from "../../assets/colors";

const BottomHeader = () => {
  const pathname = usePathname(); // Get the current route path

  // Function to determine if the link is active
  const isActive = (path) => pathname === path;

  return (
    <View style={styles.container}>
      <Link href="/dashboard" style={[styles.button, isActive("/dashboard") && styles.activeButton]}>
        <Image
          source={homeIcon}
          style={[styles.icon, isActive("/dashboard") && styles.activeIcon]} // Active style for icon
        />
      </Link>
      <Link href="/workout" style={[styles.button, isActive("/workout") && styles.activeButton]}>
        <Image
          source={dumbellIcon}
          style={[styles.icon, isActive("/workout") && styles.activeIcon]} // Active style for icon
        />
      </Link>
      <Link href="/profile" style={[styles.button, isActive("/profile") && styles.activeButton]}>
        <Image
          source={foodIcon}
          style={[styles.icon, isActive("/profile") && styles.activeIcon]} // Active style for icon
        />
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
    paddingBottom: 10,  // Adds padding at the bottom to avoid the swipe gesture area overlap
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    padding: 5,  // Adds padding around the icons to increase tap area
  },
  icon: {
    width: 24,
    height: 24,
    tintColor: Colors.dark_gray,
  },
  activeButton: {
    borderBottomWidth: 2,
    borderBottomColor: Colors.ut_burnt_orange, // Underline active button
  },
  activeIcon: {
    tintColor: Colors.ut_burnt_orange, // Change color for active icon
  },
});
