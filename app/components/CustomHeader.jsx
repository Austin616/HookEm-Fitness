import { Text, View, SafeAreaView, Image, TouchableOpacity } from "react-native";
import { useRouter, usePathname } from "expo-router";
import Colors from "../../assets/colors"; 
import arrowIcon from "../../assets/images/backIcon.png";
import Settings from "../../assets/images/setting.png";
import logo from "../../assets/images/app_logo.png";
import { useUser } from "../UserContext";

const CustomHeader = ({ showBackButton = false, showSettingsButton = false, showLogo = false}) => {
  const router = useRouter();
  const pathname = usePathname();
  const { userId } = useUser();

  const title = pathname === "/dashboard" ? "Hook'Em Fitness" : "";

  // Handle navigation to settings with userId and onSignOut as query params
  const navigateToSettings = () => {
    if (!userId) {
      console.error("User ID is not available!");
      return;
    }

    // console.log("Navigating to settings with userId:", userId);
    router.push("/settings");
  };

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
        {/* Back Button (Only show when needed) */}
        {showBackButton && (
          <TouchableOpacity onPress={() => router.back()}>
            <Image
              source={arrowIcon}
              style={{ width: 24, height: 24, tintColor: Colors.ut_burnt_orange }}
            />
          </TouchableOpacity>
        )}

        {/* Logo (Only show when `showLogo` is true) */}
        {showLogo && (
          <Image
          source={logo}
          style={{
            width: 40,
            height: 30,
            tintColor: Colors.white,
            backgroundColor: Colors.ut_burnt_orange,
            borderRadius: 8,
            padding: 4,
          }}
        />
        )}

        {/* Settings Button (Only show when `showSettingsButton` is true or on Dashboard) */}
        {(showSettingsButton || pathname === "/dashboard") && userId && (
          <TouchableOpacity onPress={navigateToSettings}>
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
