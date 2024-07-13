import { StyleSheet, View } from 'react-native'
import React from 'react'
import LottieView from 'lottie-react-native'
import tw from 'twrnc'

export default function Loading() {
    return (
        <View style={[StyleSheet.absoluteFillObject, styles.container]}>
            <View style={tw`w-full h-[40%] items-center`}>
                <Loader />
            </View>

        </View>
    )
}

export const Loader = () => {

    return (
        <LottieView
            source={require('../../assets/jsons/Loading.json')}
            autoPlay={true}
            loop
            style={{ flexGrow: 1, width: '20%' }}
        />
    )
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        zIndex: 100000000000000
    }
})