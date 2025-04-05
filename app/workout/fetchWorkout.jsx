import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../../firebaseConfig"; // Adjust the import path as necessary

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

  const handleCreateWorkout = async (workoutName, date, router) => {
    const workoutId = `${workoutName}-${date}`; // Unique workout ID

    if (
      existingWorkouts.some(
        (workout) => workout.name === workoutName && workout.date === date
      )
    ) {
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

        // Navigate to the workout detail page
        router.push(
          `/workout/WorkoutDetail?workoutName=${workoutName}&workoutDate=${date}`
        );
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

  const addExerciseToWorkout = async (workoutId, exercise) => {
    try {
      if (user) {
        const workoutRef = doc(db, "users", user.uid, "workouts", workoutId);
        const workoutSnap = await getDoc(workoutRef);

        if (workoutSnap.exists()) {
          const workoutData = workoutSnap.data();
          const updatedExercises = [...(workoutData.exercises || []), exercise];
          await setDoc(
            workoutRef,
            { ...workoutData, exercises: updatedExercises },
            { merge: true }
          );
          console.log("Exercise added to workout:", workoutId);
        } else {
          console.log("Workout not found:", workoutId);
        }
      }
    } catch (error) {
      console.error("Error adding exercise to workout:", error);
    }
  };

  const addSetsandRepsToExercise = async (
    workoutName,
    workoutDate,
    exerciseId,
    setsData // Expecting an array of objects [{sets: number, reps: number}, ...]
  ) => {
    try {
      if (user) {
        const workoutId = `${workoutName}-${workoutDate}`; // Unique workout ID
        const workoutRef = doc(db, "users", user.uid, "workouts", workoutId);
        const workoutSnap = await getDoc(workoutRef);

        if (workoutSnap.exists()) {
          const workoutData = workoutSnap.data();
          const updatedExercises = workoutData.exercises.map((exercise) => {
            if (exercise.id === exerciseId) {
              return { ...exercise, setsData }; // Update setsData for the specific exercise
            }
            return exercise;
          });

          await setDoc(workoutRef, { exercises: updatedExercises }, { merge: true });
          console.log("Sets and reps added to exercise:", workoutId);
        } else {
          console.log("Workout not found:", workoutId);
        }
      }
    } catch (error) {
      console.error("Error adding sets and reps to exercise:", error);
    }
  };
  
  
  const fetchSetsandRepsFromExercise = async (
    workoutName,
    workoutDate,
    exerciseId
  ) => {
    try {
      if (user) {
        const workoutId = `${workoutName}-${workoutDate}`; // Unique workout ID
        const workoutRef = doc(db, "users", user.uid, "workouts", workoutId);
        const workoutSnap = await getDoc(workoutRef);
  
        if (workoutSnap.exists()) {
          const workoutData = workoutSnap.data();
          const exercise = workoutData.exercises.find(
            (exercise) => exercise.id === exerciseId
          );
          return exercise ? exercise.setsData : []; // Return all setsData if found
        } else {
          console.log("Workout not found:", workoutId);
          return [];
        }
      }
    } catch (error) {
      console.error("Error fetching sets and reps from exercise:", error);
      return [];
    }
  };

  const deleteOneSetFromExercise = async (workoutName, workoutDate, exerciseId, setIndex) => {
    try {
      if (user) {
        const workoutId = `${workoutName}-${workoutDate}`;
        const workoutRef = doc(db, "users", user.uid, "workouts", workoutId);
        const workoutSnap = await getDoc(workoutRef);
  
        if (workoutSnap.exists()) {
          const workoutData = workoutSnap.data();
          const updatedExercises = workoutData.exercises.map((exercise) => {
            if (exercise.id === exerciseId && exercise.setsData) {
              const updatedSetsData = exercise.setsData.filter((_, index) => index !== setIndex);
              return { ...exercise, setsData: updatedSetsData };
            }
            return exercise;
          });
  
          await setDoc(workoutRef, { exercises: updatedExercises }, { merge: true });
          console.log(`Set ${setIndex + 1} deleted from exercise:`, workoutId);
        } else {
          console.log("Workout not found:", workoutId);
        }
      }
    } catch (error) {
      console.error("Error deleting set from exercise:", error);
    }
  };
  
  const handleCompletedSet = async (workoutName, workoutDate, exerciseId, setIndex) => {
    try {
      if (user) {
        const workoutId = `${workoutName}-${workoutDate}`;
        const workoutRef = doc(db, "users", user.uid, "workouts", workoutId);
        const workoutSnap = await getDoc(workoutRef);
  
        if (workoutSnap.exists()) {
          const workoutData = workoutSnap.data();
          const updatedExercises = workoutData.exercises.map((exercise) => {
            if (exercise.id === exerciseId && exercise.setsData) {
              const updatedSetsData = exercise.setsData.map((set, index) => {
                if (index === setIndex) {
                  return { ...set, completed: true }; // Mark the set as completed
                }
                return set;
              });
              return { ...exercise, setsData: updatedSetsData };
            }
            return exercise;
          });
  
          await setDoc(workoutRef, { exercises: updatedExercises }, { merge: true });
          console.log(`Set ${setIndex + 1} marked as completed in exercise:`, workoutId);
        } else {
          console.log("Workout not found:", workoutId);
        }
    }
    } catch (error) {
      console.error("Error marking set as completed:", error);
    }
    };

    const fetchCompletedSetsFromExercise = async (workoutName, workoutDate, exerciseId) => {
        try {
          if (user) {
            const workoutId = `${workoutName}-${workoutDate}`;
            const workoutRef = doc(db, "users", user.uid, "workouts", workoutId);
            const workoutSnap = await getDoc(workoutRef);
      
            if (workoutSnap.exists()) {
              const workoutData = workoutSnap.data();
              const exercise = workoutData.exercises.find(
                (exercise) => exercise.id === exerciseId
              );
      
              // Ensure setsData is always initialized as an empty array if it's missing
              const setsData = exercise?.setsData || [];
      
              // Return completed sets if found, or an empty array if no sets are available
              return setsData.filter(set => set.completed);
            } else {
              console.log("Workout not found:", workoutId);
              return [];
            }
          }
        } catch (error) {
          console.error("Error fetching completed sets from exercise:", error);
          return [];
        }
      };
      
      
  

  const fetchExerciseFromWorkout = async (workoutName, workoutDate) => {
    try {
      if (user) {
        const workoutId = `${workoutName}-${workoutDate}`; // Unique workout ID
        const workoutRef = doc(db, "users", user.uid, "workouts", workoutId);
        const workoutSnap = await getDoc(workoutRef);

        if (workoutSnap.exists()) {
          const workoutData = workoutSnap.data();
          return workoutData.exercises || [];
        } else {
          console.log("Workout not found:", workoutId);
          return [];
        }
      }
    } catch (error) {
      console.error("Error fetching exercises from workout:", error);
      return [];
    }
  };

  const FetchMuscleGroups = async () => {
    try {
      const response = await fetch(
        "https://raw.githubusercontent.com/Austin616/free-exercise-db/main/dist/exercises.json"
      );
      if (response.ok) {
        const data = await response.json();
        const primaryMuscleGroups = data
          .map((exercise) => exercise.primaryMuscles)
          .flat();
        const uniqueMuscleGroups = [...new Set(primaryMuscleGroups)];
        return uniqueMuscleGroups;
      } else {
        console.error("Error fetching data", response.status);
      }
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  const fetchWorkoutsInMuscleGroup = async () => {
    try {
      const response = await fetch(
        "https://raw.githubusercontent.com/Austin616/free-exercise-db/main/dist/exercises.json"
      );
      if (response.ok) {
        const data = await response.json();
        const primaryMuscleGroups = data
          .map((exercise) => exercise.primaryMuscles)
          .flat();
        const uniqueMuscleGroups = [...new Set(primaryMuscleGroups)];
        return uniqueMuscleGroups;
      } else {
        console.error("Error fetching data", response.status);
      }
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  const fetchExercises = async () => {
    try {
      const response = await fetch(
        "https://raw.githubusercontent.com/Austin616/free-exercise-db/main/dist/exercises.json"
      );
      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        console.error("Error fetching data", response.status);
      }
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  const deleteExerciseFromWorkout = async (
    workoutName,
    workoutDate,
    exerciseId
  ) => {
    try {
      if (user) {
        const workoutId = `${workoutName}-${workoutDate}`; // Unique workout ID
        const workoutRef = doc(db, "users", user.uid, "workouts", workoutId);
        const workoutSnap = await getDoc(workoutRef);

        if (workoutSnap.exists()) {
          const workoutData = workoutSnap.data();
          const updatedExercises = workoutData.exercises.filter(
            (exercise) => exercise.id !== exerciseId
          );
          await setDoc(
            workoutRef,
            { ...workoutData, exercises: updatedExercises },
            { merge: true }
          );
          console.log("Exercise deleted from workout:", workoutId);
        } else {
          console.log("Workout not found:", workoutId);
        }
      }
    } catch (error) {
      console.error("Error deleting exercise from workout:", error);
    }
  };

  // Call the functions when user changes
  useEffect(() => {
    if (user) {
      fetchUserData();
      fetchExistingWorkouts();
    }
  }, [user]);

  return {
    userData,
    existingWorkouts,
    workoutDates,
    handleCreateWorkout,
    handleDeleteWorkout,
    addExerciseToWorkout,
    fetchExerciseFromWorkout,
    fetchWorkoutsInMuscleGroup,
    FetchMuscleGroups,
    fetchExercises,
    deleteExerciseFromWorkout,
    addSetsandRepsToExercise,
    fetchSetsandRepsFromExercise,
    deleteOneSetFromExercise,
    handleCompletedSet,
    fetchCompletedSetsFromExercise,
  };
};

export default useFetchWorkout;
