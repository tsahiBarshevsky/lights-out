import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { authentication } from '../../utils/firebase';

const Header = () => {
    const navigation = useNavigation();

    return (
        <View style={styles.header}>
            <View>
                {!authentication.currentUser ?
                    <Text>Welcome, guest!</Text>
                    :
                    <Text>Welcome, {authentication.currentUser.email}!</Text>
                }
                <Text>Which movie do you want to watch?</Text>
            </View>
            <TouchableOpacity
                onPress={() => navigation.navigate('PersonalArea')}
                style={styles.avatar}
            >
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
        width: 40,
        height: 40,
        borderRadius: 10,
        backgroundColor: 'green'
    }
});