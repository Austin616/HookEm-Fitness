import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Picker } from "@react-native-picker/picker";
import Colors from "../../assets/colors";

function PickerComponent({
  label,
  selectedValue,
  onValueChange,
  items,
  isVisible,
  toggleVisibility,
  doneButtonText = "Done",
}) {
  return (
    <View style={{ width: "100%", marginBottom: 15 }}>
      <Text style={{ fontSize: 16, fontWeight: "600", color: Colors.dark_gray }}>
        {label}
      </Text>
      {!isVisible ? (
        <TouchableOpacity onPress={() => toggleVisibility(true)}>
          <View style={styles.inputContainer}>
            <Text style={styles.inputText}>{selectedValue}</Text>
          </View>
        </TouchableOpacity>
      ) : (
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedValue}
            onValueChange={onValueChange}
            style={styles.picker}
          >
            {items.map((item, index) => (
              <Picker.Item key={index} label={item.label} value={item.value} />
            ))}
          </Picker>
        </View>
      )}

      {isVisible && (
        <TouchableOpacity
          style={styles.doneButton}
          onPress={() => toggleVisibility(false)}
        >
          <Text style={styles.doneButtonText}>{doneButtonText}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = {
  inputContainer: {
    borderWidth: 1,
    borderColor: Colors.light_gray,
    padding: 12,
    borderRadius: 8,
    backgroundColor: Colors.white,
  },
  inputText: {
    fontSize: 16,
    color: Colors.dark_gray,
  },
  pickerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  picker: {
    flex: 1,
    height: 200,
  },
  doneButton: {
    backgroundColor: Colors.ut_burnt_orange,
    padding: 10,
    borderRadius: 8,
    marginTop: 15,
  },
  doneButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
};

export default PickerComponent;
