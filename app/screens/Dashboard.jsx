import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { getAuth } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig'; // Import Firestore DB
import Colors from '../../assets/colors'; // Import colors for styling

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
      <Text style={styles.title}>Welcome to your Dashboard, {userData.name}!</Text>
      <View style={styles.infoContainer}>
        <Text style={styles.info}>Height: {userData.height} cm</Text>
        <Text style={styles.info}>Weight: {userData.weight} kg</Text>
        <Text style={styles.info}>Goal: {userData.goal}</Text>
        <Text style={styles.info}>
          Target Weight: {userData.targetWeight || 'Not specified'} kg
        </Text>
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
  info: {
    fontSize: 18,
    marginBottom: 10,
  },
});
