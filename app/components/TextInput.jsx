// TextInputField.js
import React from "react";
import { TextInput, Text, View } from "react-native";
import Colors from "../../assets/colors";

const TextInputField = ({ label, value, setter, placeholder }) => (
  <View style={{ width: "100%", marginBottom: 15 }}>
    <Text style={{ fontSize: 16, fontWeight: "600", color: Colors.dark_gray }}>{label}</Text>
    <TextInput
      style={{
        fontSize: 16,
        color: Colors.dark_gray,
        borderWidth: 1,
        borderColor: Colors.light_gray,
        padding: 12,
        marginTop: 5,
        borderRadius: 8,
        backgroundColor: Colors.white,
      }}
      value={value}
      onChangeText={setter}
      placeholder={placeholder}
    />
  </View>
);

export default TextInputField;
