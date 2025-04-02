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
import Settings from "../../assets/images/setting.png";
import logo from "../../assets/images/app_logo.png"; // Assuming you have a logo image

const CustomHeader = ({ showBackButton, showSettingsButton }) => {
  const navigation = useNavigation();
  const route = useRoute(); 

  const title = route.name === "Dashboard" ? "Hook'Em Fitness" : "";

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
              style={{ width: 24, height: 24, tintColor: Colors.ut_burnt_orange }} 
            />
          </TouchableOpacity>
        )}

        {/* Title */}
          <Image
          source={logo}
          style={{
            width: 40, // Adjusted logo width
            height: 30, // Adjusted logo height
            marginLeft: 8,
            marginRight: 8,
            tintColor: Colors.white,
            backgroundColor: Colors.ut_burnt_orange,
            borderRadius: 8, // Slight rounding for the background
            padding: 4, // Padding inside the logo background
          }}
        />

        {/* Settings Button (Conditionally render based on showSettingsButton prop) */}
        {showSettingsButton && (
          <TouchableOpacity onPress={() => navigation.navigate("Settings")}>
            <Image
              source={Settings}
              style={{ width: 24, height: 24, tintColor: Colors.ut_burnt_orange }}
            />
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

export default CustomHeader;
