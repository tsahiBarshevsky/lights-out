import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { AntDesign } from '@expo/vector-icons';

const UserBar = () => {
    const user = useSelector(state => state.user);
    const navigation = useNavigation();

    return (
        <View style={styles.userBar}>
            <View>
                {Object.keys(user).length === 0 ?
                    <Text style={styles.welcome}>Welcome, guest!</Text>
                    :
                    <Text style={styles.welcome}>Welcome, {user.firstName}!</Text>
                }
                <Text style={styles.bold}>Which movie do you want to watch?</Text>
            </View>
            <TouchableOpacity
                onPress={() => navigation.navigate('Personal area')}
                style={styles.avatar}
            >
                <AntDesign name="user" size={24} color="black" />
            </TouchableOpacity>
        </View>
    )
}

export default UserBar;

const styles = StyleSheet.create({
    userBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 5
    },
    welcome: {
        fontFamily: 'Poppins',
        color: '#c0c0c3'
    },
    bold: {
        fontFamily: 'PoppinsBold',
        color: 'white',
        fontSize: 13,
        marginTop: -5
    },
    avatar: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 40,
        height: 40,
        borderRadius: 15,
        backgroundColor: 'green'
    }
});