import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import CustomHeader from "./components/CustomHeader";
import { Slot } from "expo-router";
import { UserProvider } from "./UserContext"; // Import the UserProvider
import BottomHeader from "./components/BottomHeader";

export default function Layout() {
  return (
    <UserProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        />
        <BottomHeader />
      </GestureHandlerRootView>
    </UserProvider>
  );
}
