import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, ScrollView, RefreshControl, ProgressBarAndroid } from 'react-native';
import { getAuth } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import Colors from '../../assets/colors';
import UserStats from '../components/UserStats';
import WorkoutSummary from '../components/WorkoutSummary';
import ProgressChart from '../components/ProgressChart';
import ChallengesLB from '../components/ChallengesLB';
import Notifications from '../components/Notifications';

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const auth = getAuth();
  const user = auth.currentUser;

  // Function to fetch user data from Firestore
  const fetchUserData = async () => {
    try {
      if (user) {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setUserData(docSnap.data());
        } else {
          console.log('No data found');
        }
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [user]);

  // Refresh handler when the user pulls to refresh
  const onRefresh = () => {
    setRefreshing(true);
    fetchUserData().finally(() => setRefreshing(false));
  };

  if (!userData) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Loading user data...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.infoContainer}>
        <UserStats userData={userData} />
        <WorkoutSummary/>
        <ProgressChart/>
        <ChallengesLB/>
        <Notifications/>
      </View>
    </ScrollView>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  infoContainer: {
    marginTop: 20,
  },
});
