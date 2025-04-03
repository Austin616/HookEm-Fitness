import {Text, View, StyleSheet} from 'react-native';
import {useEffect} from 'react';
import Colors from '../../assets/colors';
import {db} from '../../firebaseConfig';
import {doc, getDoc} from 'firebase/firestore';
import {useUser} from '../UserContext';

const Exercises = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Plan for the Day</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.ut_burnt_orange,
        marginBottom: 16,
    },
    subTitle: {
        fontSize: 18,
        color: Colors.dark_gray,
    },
});

export default Exercises;