import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { AntDesign } from '@expo/vector-icons';

const Header = () => {
    const user = useSelector(state => state.user);
    const navigation = useNavigation();

    return (
        <View style={styles.header}>
            <View>
                {Object.keys(user).length === 0 ?
                    <Text>Welcome, guest!</Text>
                    :
                    <Text>Welcome, {user.firstName}!</Text>
                }
                <Text>Which movie do you want to watch?</Text>
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

export default Header;

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10
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