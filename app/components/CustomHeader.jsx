import {
  Text,
  View,
  SafeAreaView,
  Image,
  TouchableOpacity,
} from "react-native";
import Colors from "../../assets/colors";
import arrowIcon from "../../assets/images/backIcon.png";
import { useNavigation } from "@react-navigation/native";

const CustomHeader = ({
  showBackButton = true,
  showSignOutButton = false,
  onSignOut,
}) => {
  const navigation = useNavigation();

  const handleBackPress = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={{ backgroundColor: Colors.primary }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          padding: 10,
          backgroundColor: Colors.primary,
        }}
      >
        {/* Back Button */}
        {showBackButton ? (
          <TouchableOpacity
            onPress={handleBackPress}
            style={{ flexDirection: "row", alignItems: "center" }}
          >
            <Image
              source={arrowIcon}
              style={{
                width: 30,
                height: 30,
                tintColor: Colors.ut_burnt_orange,
              }}
            />
            <Text
              style={{
                fontSize: 18,
                color: Colors.ut_burnt_orange,
                marginLeft: 10,
              }}
            >
              Back
            </Text>
          </TouchableOpacity>
        ) : (
          <View />
        )}

        {/* Title */}
        <Text
          style={{
            fontSize: 24,
            color: Colors.ut_burnt_orange,
            position: "absolute",
            left: 0,
            right: 0,
            textAlign: "center",
            fontWeight: "bold",
          }}
        >
          {showSignOutButton ? "Dashboard" : ""}
        </Text>

        {/* Sign Out Button */}
        {showSignOutButton ? (
          <TouchableOpacity onPress={onSignOut}>
            <Text
              style={{
                fontSize: 18,
                color: Colors.ut_burnt_orange,
                fontWeight: "bold",
              }}
            >
              Sign Out
            </Text>
          </TouchableOpacity>
        ) : (
          <View />
        )}
      </View>
    </SafeAreaView>
  );
};

export default CustomHeader;
