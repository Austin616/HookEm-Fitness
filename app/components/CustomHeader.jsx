import { Text, View, SafeAreaView, Image, TouchableOpacity } from "react-native";
import Colors from "../../assets/colors";
import arrowIcon from "../../assets/images/backIcon.png";
import { useNavigation } from "@react-navigation/native"; 

const CustomHeader = () => {
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
        <TouchableOpacity onPress={handleBackPress} style={{ flexDirection: "row", alignItems: "center" }}>
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
      </View>
    </SafeAreaView>
  );
};

export default CustomHeader;
