import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native'
import { getAuth } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../firebaseConfig'
import Colors from '../../assets/colors'
import { useState, useEffect } from 'react'


const WorkoutTracker = () => {
    const [userData, setUserData] = useState(null)
    const auth = getAuth()
    const user = auth.currentUser

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                if (user) {
                    const docRef = doc(db, 'users', user.uid)
                    const docSnap = await getDoc(docRef)

                    if (docSnap.exists()) {
                        setUserData(docSnap.data())
                    } else {
                        console.log('No data found')
                    }
                }
            } catch (error) {
                console.error('Error fetching user data:', error)
            }
        }

        fetchUserData()
    }, [user])

    return (
        <View style={styles.container}>
            <ScrollView
                style={styles.scrollView}
                refreshControl={<RefreshControl refreshing={false} onRefresh={() => {}} />}
            >
                <Text style={styles.title}>Workout Tracker</Text>
                {userData ? (
                    <Text style={styles.userInfo}>Welcome, {userData.name}</Text>
                ) : (
                    <Text style={styles.userInfo}>Loading user data...</Text>
                )}
            </ScrollView>
        </View>
    )
  
}

export default WorkoutTracker

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white,
        padding: 20,
    },
    scrollView: {
        marginHorizontal: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.ut_burnt_orange,
        marginBottom: 20,
    },
    userInfo: {
        fontSize: 18,
        color: Colors.dark_gray,
    },
})
