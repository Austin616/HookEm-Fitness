import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LandingScreen from "./screens/LandingScreen";
import Login from "./screens/Login";
import SignUp from "./screens/SignUp";
import Dashboard from "./screens/Dashboard";
import CustomHeader from "./components/CustomHeader"; // Adjust the path as necessary
import { getAuth } from "firebase/auth";
import Tutorial from "./screens/Tutorial";
import Settings from "./screens/Settings"; // Import the Settings screen

const Stack = createNativeStackNavigator();

export default function Index() {
  const handleSignOut = (navigation) => {
    try {
      const auth = getAuth();
      auth
        .signOut()
        .then(() => {
          console.log("User signed out successfully");
          navigation.navigate("Landing"); // Navigate to Landing after sign-out
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
        header: ({ navigation }) => <CustomHeader navigation={navigation} />, // Pass navigation here
      }}
    >
      <Stack.Screen
        name="Dashboard"
        component={Dashboard}
        options={{
          header: ({ navigation }) => (
            <CustomHeader
              title="Dashboard"
              showBackButton={false}
              showSettingsButton={true}
              onSignOut={() => handleSignOut(navigation)} // Pass handleSignOut to CustomHeader
            />
          ),
        }}
      />
      <Stack.Screen
        name="Landing"
        component={LandingScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="SignUp" component={SignUp} />
      <Stack.Screen name="Tutorial" component={Tutorial} />
      <Stack.Screen
        name="Settings"
        options={({ navigation }) => ({
          header: ({ navigation }) => (
            <CustomHeader
              title="Settings"
              showBackButton={true}
              showSettingsButton={false}
              onSignOut={() => handleSignOut(navigation)} // Pass handleSignOut to CustomHeader
            />
          ),
        })}
      >
        {(props) => (
          <Settings
            {...props}
            onSignOut={() => handleSignOut(props.navigation)}
          />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
}
