import React, { useEffect, useState } from 'react';
import { StyleSheet, SafeAreaView, useWindowDimensions, Text, TouchableOpacity } from 'react-native';
import { TabView, TabBar } from 'react-native-tab-view';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { globalStyles } from '../../utils/globalStyles';
import { SignUpTab, SignInTab } from '../../components';
import { authentication } from '../../utils/firebase';
import { signOutUser } from '../../redux/actions/user';
import { signOut } from 'firebase/auth';

const PersonalAreaScreen = () => {
    const [index, setIndex] = useState(0);
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const layout = useWindowDimensions();
    const routes = [
        { key: 'signIn', title: 'Sign In' },
        { key: 'signUp', title: 'Sign Up' }
    ];

    const renderScene = ({ route }) => {
        switch (route.key) {
            case 'signIn':
                return <SignInTab />;
            case 'signUp':
                return <SignUpTab />;
            default:
                return null;
        }
    }

    const onSignOut = () => {
        signOut(authentication);
        dispatch(signOutUser());
        setTimeout(() => {
            navigation.goBack();
        }, 200);
    }

    return !authentication.currentUser ? (
        <SafeAreaView style={globalStyles.container}>
            <TabView
                overScrollMode='never'
                navigationState={{ index, routes }}
                onIndexChange={setIndex}
                initialLayout={{ width: layout.width }}
                renderScene={renderScene}
                renderTabBar={(props) =>
                    <TabBar
                        {...props}
                        style={{ backgroundColor: '#f1f2f6', elevation: 0 }}
                        tabStyle={{ minHeight: 10 }}
                        indicatorStyle={styles.indicatorStyle}
                        indicatorContainerStyle={styles.indicatorContainerStyle}
                        labelStyle={styles.labelStyle}
                        pressColor='transparent'
                        activeColor='#000000'
                        inactiveColor='#00000033'
                    />
                }
            />
        </SafeAreaView>
    ) : (
        <SafeAreaView style={globalStyles.container}>
            <TouchableOpacity onPress={onSignOut}>
                <Text>Sign Out</Text>
            </TouchableOpacity>
        </SafeAreaView>
    )
}

export default PersonalAreaScreen;

const styles = StyleSheet.create({
    indicatorStyle: {
        backgroundColor: 'black',
        borderRadius: 45
    },
    indicatorContainerStyle: {
        marginHorizontal: 40,
        paddingHorizontal: 80
    },
    labelStyle: {
        fontSize: 15
    }
});