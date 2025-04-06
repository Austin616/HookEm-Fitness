// signOut.js (or any utility file)
import { getAuth } from "firebase/auth";
import {useRouter} from "expo-router";

const SignOut = () => {
  const router = useRouter();
  try {
    const auth = getAuth();
    auth
      .signOut()
      .then(() => {
        console.log("User signed out successfully");
        router.push("/index"); // Redirect to the login screen after sign out
        })
      .catch((error) => {
        console.error("Sign out error:", error);
      });
  } catch (error) {
    console.error("Error signing out:", error);
  }
};

export default SignOut;