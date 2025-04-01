import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LandingScreen from "./screens/LandingScreen";
import Login from "./screens/Login";
import SignUp from "./screens/SignUp";
import Dashboard from "./screens/Dashboard";
import CustomHeader from "./components/CustomHeader"; // Adjust the path as necessary
import { getAuth } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";

const Stack = createNativeStackNavigator();

export default function Index() {
  const handleSignOut = (navigation) => {
    try {
      const auth = getAuth();
      auth
        .signOut()
        .then(() => {
          console.log("User signed out successfully");
          navigation.navigate("Landing"); // Optional: Navigate to Landing after sign-out
        })
        .catch((error) => {
          console.error("Sign out error:", error);
        });
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <Stack.Navigator
      initialRouteName="Landing"
      screenOptions={{
        headerShown: true,
        header: ({ navigation }) => (
          <CustomHeader
          />
        ),
      }}
    >
      <Stack.Screen
        name="Landing"
        component={LandingScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="SignUp" component={SignUp} />
      <Stack.Screen
        name="Dashboard"
        component={Dashboard}
        options={{
          header: ({ navigation }) => (
            <CustomHeader
              title="Dashboard"
              showBackButton={false}
              showSignOutButton={true}
              onSignOut={() => handleSignOut(navigation)} // Correct usage
            />
          ),
        }}
      />
    </Stack.Navigator>
  );
}
