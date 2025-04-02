import { View, TouchableOpacity, Image, Text, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Dashboard from "../screens/Dashboard";
import WorkoutTracker from "../screens/WorkoutTracker";
import FoodTracker from "../screens/FoodTracker"; 
import foodIcon from "../../assets/images/food.png";
import homeIcon from "../../assets/images/home.png";
import profileIcon from "../../assets/images/user.png";
import Colors from "../../assets/colors";

const BottomHeader = () => {
  const navigation = useNavigation();
  const Tab = createBottomTabNavigator();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => {
          let iconName;

          if (route.name === "Home") {
            iconName = homeIcon;
          } else if (route.name === "Workout") {
            iconName = profileIcon;
          }
          else if (route.name === "Food") {
            iconName = foodIcon;
          }

          return (
            <Image
              source={iconName}
              style={[styles.icon, { tintColor: focused ? Colors.ut_burnt_orange : Colors.dark_gray }]}
            />
          );
        },
        tabBarStyle: styles.container,
      })}
    >
      <Tab.Screen
        name="Home"
        component={Dashboard}
        options={{
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Workout"
        component={WorkoutTracker}
        options={{
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Food"
        component={FoodTracker}
        options={{
          headerShown: false,
        }}
      />
    </Tab.Navigator>
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
  },
  button: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    width: 24,
    height: 24,
    tintColor: Colors.ut_burnt_orange,
  },
});
