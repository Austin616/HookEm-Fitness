import React, { Component } from 'react'
import { Text, View } from 'react-native'

export class Dashboard extends Component {
  render() {
    return (
      <View>
        <Text style={{ fontSize: 18, textAlign: 'center', marginTop: 20 }}>
          Welcome to your Dashboard!
        </Text>
      </View>
    )
  }
}

export default Dashboard
