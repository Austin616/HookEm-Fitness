import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LandingScreen from "./screens/LandingScreen";
import Login from "./screens/Login";
import SignUp from "./screens/SignUp";
import Dashboard from "./screens/Dashboard";
import CustomHeader from "./components/CustomHeader"; // Adjust the path as necessary
import { getAuth } from "firebase/auth";
import Tutorial from "./screens/Tutorial";
import Settings from "./screens/Settings"; // Import the Settings screen
import SignOut from "./components/SignOut"; // Import the SignOut utility

const Stack = createNativeStackNavigator();

export default function Index() {

  return (
    <Stack.Navigator
      initialRouteName="Landing"
      screenOptions={{
        headerShown: true,
        // Set default options for all screens
        header: ({ navigation }) => <CustomHeader showBackButton={true} showSettingsButton={false} />,
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
          gestureEnabled: false, // Disable swipe gesture on the Dashboard screen
        }}
      />
      <Stack.Screen
        name="Landing"
        component={LandingScreen}
        options={{ headerShown: false, gestureEnabled: false }} // Disable swipe gesture on Landing screen
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
            />
          ),
          gestureEnabled: true, // Enable swipe gesture for Settings (back arrow shown)
        })}
      >
        {(props) => {
          const auth = getAuth();
          const userId = auth.currentUser ? auth.currentUser.uid : null; // Get userId from Firebase

          return (
            <Settings
              {...props}
              userId={userId} // Pass the userId to Settings screen
              onSignOut={() => SignOut(props.navigation)} // Ensure onSignOut is called with navigation
            />
          );
        }}
      </Stack.Screen>
    </Stack.Navigator>
  );
}
