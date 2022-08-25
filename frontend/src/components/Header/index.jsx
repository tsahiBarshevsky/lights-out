import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Entypo } from '@expo/vector-icons';

const Hedaer = ({ caption, backFunction }) => {
    return (
        <View style={styles.container}>
            <TouchableOpacity
                onPress={backFunction}
                activeOpacity={1}
                style={styles.button}
            >
                <Entypo name="chevron-small-left" size={30} color="white" />
            </TouchableOpacity>
            <View style={styles.caption}>
                <Text style={styles.text}>{caption}</Text>
            </View>
        </View>
    )
}

export default Hedaer;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        position: 'relative',
        paddingHorizontal: 15,
        paddingVertical: 5
    },
    button: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
        left: 15,
        height: 30,
        width: 30
    },
    caption: {
        flex: 1,
        height: 30,
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    text: {
        color: 'white',
        fontFamily: 'Poppins',
        fontSize: 15
    }
});