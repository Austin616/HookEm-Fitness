import {
  Text,
  View,
  SafeAreaView,
  Image,
  TouchableOpacity,
} from "react-native";
import Colors from "../../assets/colors";
import arrowIcon from "../../assets/images/backIcon.png";
import { useNavigation, useRoute } from "@react-navigation/native";
import Settings from "../../assets/images/setting.png"; // Import settings icon if needed

const CustomHeader = ({ showBackButton, showSettingsButton }) => {
  const navigation = useNavigation();
  const route = useRoute(); // Get the current route

  // Determine the title based on the current route
  const title = route.name === "Dashboard" ? "Welcome Back!" : "";

  return (
    <SafeAreaView style={{ backgroundColor: Colors.primary }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 16,
          height: 60,
        }}
      >
        {/* Back Button (Conditionally render based on showBackButton prop) */}
        {showBackButton && (
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image
              source={arrowIcon}
              style={{ width: 24, height: 24, tintColor: Colors.ut_burnt_orange }} // Use your theme color
            />
          </TouchableOpacity>
        )}

        {/* Title */}
        <Text style={{ color: Colors.ut_burnt_orange, fontSize: 18, fontWeight: "bold" }}>
          {title}
        </Text>

        {/* Settings Button (Conditionally render based on showSettingsButton prop) */}
        {showSettingsButton && (
          <TouchableOpacity onPress={() => navigation.navigate("Settings")}>
            <Image
              source={Settings}
              style={{ width: 24, height: 24, tintColor: Colors.ut_burnt_orange }} // Use your theme color
            />
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

export default CustomHeader;
