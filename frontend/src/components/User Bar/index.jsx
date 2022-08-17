import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { AntDesign } from '@expo/vector-icons';
import { primary, secondary } from '../../utils/theme';

const UserBar = () => {
    const user = useSelector(state => state.user);
    const navigation = useNavigation();

    const renderImage = () => {
        if (Object.keys(user).length > 0) {
            if (Object.keys(user.image).length > 0)
                return (
                    <Image
                        source={{ uri: user.image.url }}
                        style={{ width: '100%', height: '100%' }}
                    />
                );
            else
                return <AntDesign name='user' size={33} color='white' />;
        }
        return <AntDesign name='user' size={33} color='white' />;
    }

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
                {renderImage()}
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
        justifyContent: 'flex-end',
        alignItems: 'center',
        width: 40,
        height: 40,
        borderRadius: 20,
        overflow: 'hidden',
        backgroundColor: '#444549'
    }
});