import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { error, secondary } from '../../utils/theme';

const ErrorToast = ({ props }) => {
    const { text } = props;

    return (
        <View style={styles.container}>
            <View style={styles.error} />
            <Text style={styles.text}>{text}</Text>
        </View>
    )
}

export default ErrorToast;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: '90%',
        height: 40,
        backgroundColor: secondary,
        borderRadius: 10,
        overflow: 'hidden'
    },
    error: {
        height: 40,
        width: 7,
        backgroundColor: error,
        marginRight: 10
    },
    text: {
        fontFamily: 'Poppins',
        color: 'white'
    }
});