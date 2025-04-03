import React from 'react';
import {View, Text, ScrollView, StyleSheet} from 'react-native';
import CustomHeader from './components/CustomHeader';
import Colors from '../assets/colors'; 

export default function Profile() {
    return (
        <View style={styles.container}>
            <CustomHeader showLogo showSettingsButton />
            <ScrollView style={styles.scrollView}>
                <Text style={styles.title}>Profile</Text>
                <Text style={styles.text}>This is the profile page.</Text>
                <Text style={styles.text}>You can add your profile details here.</Text>
                <Text style={styles.text}>This is a placeholder for your profile content.</Text>
            </ScrollView>
        </View>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.primary,
        padding: 16,
    },
    scrollView: {
        flex: 1,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    text: {
        fontSize: 16,
        marginBottom: 10,
    },
});
