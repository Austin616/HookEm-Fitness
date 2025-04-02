import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { doc, getDoc, setDoc, collection, getDocs, deleteDoc } from "firebase/firestore";
import { db } from "../../../firebaseConfig"; // Adjust the import path as necessary

const useFetchWorkout = () => {
    const [userData, setUserData] = useState(null);
    const [existingWorkouts, setExistingWorkouts] = useState([]);
    const [workoutDates, setWorkoutDates] = useState({}); // Store marked dates for the calendar
    const auth = getAuth();
    const user = auth.currentUser;
  
    // Fetch user data
    const fetchUserData = async () => {
      try {
        if (user) {
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);
  
          if (docSnap.exists()) {
            setUserData(docSnap.data());
          } else {
            console.log("No user data found");
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
  
    const fetchExistingWorkouts = async () => {
        try {
          if (user) {
            const workoutsRef = collection(db, "users", user.uid, "workouts");
            const querySnapshot = await getDocs(workoutsRef);
            const workouts = [];
            const markedDates = {}; // Object to store dates for the calendar
            
            querySnapshot.forEach((doc) => {
              const data = doc.data();
              workouts.push({ id: doc.id, name: data.name, date: data.date });
              markedDates[data.date] = { marked: true }; // Add the date to markedDates
            });
            
            setExistingWorkouts(workouts);
            setWorkoutDates(markedDates); // Update marked dates for the calendar
          }
        } catch (error) {
          console.error("Error fetching existing workouts:", error);
        }
      };
      
      
  
      const handleCreateWorkout = async (workoutName, date, navigation) => {
        const workoutId = `${workoutName}-${date}`; // Unique workout ID
        
        if (existingWorkouts.some((workout) => workout.name === workoutName && workout.date === date)) {
          alert("Workout already exists on this date");
          return;
        }
      
        try {
          if (user) {
            const workoutRef = doc(db, "users", user.uid, "workouts", workoutId); // Use unique ID
            await setDoc(workoutRef, { name: workoutName, date });
            console.log("Workout created:", workoutName);
            
            // After creating the workout, refetch workouts
            fetchExistingWorkouts();
      
            navigation.navigate("WorkoutDetail", { workoutName: workoutName, workoutDate: date });
          }
        } catch (error) {
          console.error("Error creating workout:", error);
        }
      };
      
      
  
    // Handle workout deletion from Firestore and local state
    const handleDeleteWorkout = async (workoutId) => {
      try {
        if (user) {
          // Delete workout from Firestore
          const workoutRef = doc(db, "users", user.uid, "workouts", workoutId);
          await deleteDoc(workoutRef);
          console.log("Workout deleted from Firestore:", workoutId);
  
          // Refetch workouts after deletion
          fetchExistingWorkouts();
        }
      } catch (error) {
        console.error("Error deleting workout:", error);
      }
    };
  
    // Call the functions when user changes
    useEffect(() => {
      if (user) {
        fetchUserData();
        fetchExistingWorkouts();
      }
    }, [user]);
  
    return { userData, existingWorkouts, workoutDates, handleCreateWorkout, handleDeleteWorkout };
  };
  
  export default useFetchWorkout;
  