import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { AntDesign } from '@expo/vector-icons';
import { secondary } from '../../utils/theme';

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
                activeOpacity={1}
            >
                <Image
                    source={{ uri: 'https://firebasestorage.googleapis.com/v0/b/save-the-date-5d2e8.appspot.com/o/tsahi.13%40gmail.com?alt=media&token=dced2eef-5079-4655-964b-c49ba72fad5a' }}
                    style={{ width: '100%', height: '100%' }}
                />
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
        borderRadius: 20,
        overflow: 'hidden'
    }
});