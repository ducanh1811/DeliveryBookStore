import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import tw from 'twrnc'

const NotificationMessage = () => {
    return (
        <View style={[styles.box_notification]}>
            <Text>NotificationMessage</Text>
        </View>
    )
}

const styles = StyleSheet.create({

    box_notification: {
        zIndex: 10000000000000,
        top: 0,
        left: 0,
        right: 0,
        flex: 1,
        backgroundColor: '#0000',
        position: 'absolute',
        height: 200
    }
})

export default NotificationMessage