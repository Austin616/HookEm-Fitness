// signOut.js (or any utility file)
import { getAuth } from "firebase/auth";

const SignOut = (navigation) => {
  try {
    const auth = getAuth();
    auth
      .signOut()
      .then(() => {
        console.log("User signed out successfully");
        navigation.navigate("Landing"); // Navigate to Landing after sign-out
      })
      .catch((error) => {
        console.error("Sign out error:", error);
      });
  } catch (error) {
    console.error("Error signing out:", error);
  }
};

export default SignOut;