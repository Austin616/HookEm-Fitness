import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { getAuth } from "firebase/auth";
import LandingScreen from "./screens/LandingScreen";
import Login from "./screens/Login";
import SignUp from "./screens/SignUp";
import CustomHeader from "./components/CustomHeader";
import Tutorial from "./screens/Tutorial";
import Settings from "./screens/Settings";
import SignOut from "./components/SignOut";
import Workout from "./screens/WorkoutTracker";
import BottomHeader from "./components/BottomHeader";
import FoodTracker from "./screens/FoodTracker";

const Stack = createNativeStackNavigator();

export default function Index() {
  return (
    <Stack.Navigator
      initialRouteName="Landing"
      screenOptions={{
        headerShown: true,
        header: ({ navigation }) => (
          <CustomHeader showBackButton={true} showSettingsButton={false} />
        ),
      }}
    >
      <Stack.Screen
        name="Dashboard"
        component={BottomHeader} 
        options={{
          header: ({ navigation }) => (
            <CustomHeader
              title="Dashboard"
              showBackButton={false}
              showSettingsButton={true}
              onSignOut={() => handleSignOut(navigation)}
            />
          ),
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="Landing"
        component={LandingScreen}
        options={{ headerShown: false, gestureEnabled: false }}
      />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="SignUp" component={SignUp} />
      <Stack.Screen name="Tutorial" component={Tutorial} />
      <Stack.Screen name="Workout" component={Workout} />
      <Stack.Screen name="FoodTracker" component={FoodTracker} />
      
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
          gestureEnabled: true,
        })}
      >
        {(props) => {
          const auth = getAuth();
          const userId = auth.currentUser ? auth.currentUser.uid : null;

          return (
            <Settings
              {...props}
              userId={userId}
              onSignOut={() => SignOut(props.navigation)}
            />
          );
        }}
      </Stack.Screen>
    </Stack.Navigator>
  );
}
