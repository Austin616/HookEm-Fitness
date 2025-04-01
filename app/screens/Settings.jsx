import { Text, View, StyleSheet, Button } from 'react-native';
import Colors from '../../assets/colors'; // Import colors for styling
import { getAuth, signOut } from 'firebase/auth'; // Import Firebase Auth

function Settings({ onSignOut }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <Text style={styles.description}>
        This is the settings screen. Here you can manage your account, preferences, and more.
      </Text>

      <Button
        title="Sign Out"
        color={Colors.ut_burnt_orange} // Use the color from your theme
        onPress={() => {
          onSignOut(); // Call the sign out function passed as a prop
        }}
      />
    </View>
  );
}

export default Settings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0', // Light gray background
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  description: {
    fontSize: 18,
    color: Colors.dark_gray,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});
