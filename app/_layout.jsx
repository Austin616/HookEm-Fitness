import { SafeAreaProvider } from "react-native-safe-area-context";
import Index from "./index";
import {Slot} from "expo-router";

export default function Layout() {
  return (
    <SafeAreaProvider>
      <Index />
      {/* <Slot /> */}
    </SafeAreaProvider>
  );
}

