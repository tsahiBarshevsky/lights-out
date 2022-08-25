import React, { useState } from 'react';
import { StyleSheet, SafeAreaView, useWindowDimensions, Text, TouchableOpacity, View, FlatList, Image } from 'react-native';
import { TabView, TabBar } from 'react-native-tab-view';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { AntDesign, MaterialIcons, Entypo, FontAwesome5 } from '@expo/vector-icons';
import { globalStyles } from '../../utils/globalStyles';
import { SignUpTab, SignInTab, Header, ReservationCard } from '../../components';
import { authentication } from '../../utils/firebase';
import { signOutUser } from '../../redux/actions/user';
import { signOut } from 'firebase/auth';
import { resetReservations } from '../../redux/actions/reservations';
import { background, primary } from '../../utils/theme';
import Vector from '../../../assets/Images/movies.png';

const PersonalAreaScreen = () => {
    const [index, setIndex] = useState(0);
    const [isLoggedIn, setIsLoggedIn] = useState(authentication.currentUser);
    const user = useSelector(state => state.user);
    const reservations = useSelector(state => state.reservations);
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

    const renderImage = () => {
        if (Object.keys(user).length > 0) {
            if (Object.keys(user.image).length > 0)
                return (
                    <Image
                        source={{ uri: user.image.url }}
                        style={{ width: '100%', height: '100%' }}
                    />
                );
        }
        return <AntDesign name='user' size={80} color='white' />;
    }

    const onSignOut = () => {
        signOut(authentication);
        setIsLoggedIn(false);
        dispatch(signOutUser());
        dispatch(resetReservations());
    }

    const Separator = () => (
        <View style={styles.separator} />
    );

    const EmptyList = () => (
        <View style={styles.emptyListContainer}>
            <Image
                source={Vector}
                style={styles.vector}
            />
            <Text style={[styles.text, styles.emptyMessage]}>
                You haven't ordered tickets yet
            </Text>
        </View>
    );

    return !isLoggedIn ? (
        <SafeAreaView style={globalStyles.container}>
            <Header
                caption={"Personal Area"}
                backFunction={() => navigation.goBack()}
            />
            <TabView
                overScrollMode='never'
                navigationState={{ index, routes }}
                onIndexChange={setIndex}
                initialLayout={{ width: layout.width }}
                renderScene={renderScene}
                renderTabBar={(props) =>
                    <TabBar
                        {...props}
                        style={{ backgroundColor: background, elevation: 0 }}
                        tabStyle={{ minHeight: 10 }}
                        indicatorStyle={styles.indicatorStyle}
                        indicatorContainerStyle={styles.indicatorContainerStyle}
                        labelStyle={styles.labelStyle}
                        pressColor='transparent'
                        activeColor='#FFFFFF'
                        inactiveColor='#FFFFFF33'
                    />
                }
            />
        </SafeAreaView>
    ) : (
        <>
            <SafeAreaView style={globalStyles.container}>
                <Header
                    caption={"My Profile"}
                    backFunction={() => navigation.goBack()}
                />
                <View style={styles.userInfo}>
                    <View style={styles.imageWrapper}>
                        <View style={styles.image}>
                            {renderImage()}
                        </View>
                    </View>
                    <Text style={[styles.text, styles.title]}>
                        {user.firstName} {user.lastName}
                    </Text>
                    <Text style={[styles.text, styles.subtitle]}>
                        {authentication.currentUser.email}
                    </Text>
                    <Text style={[styles.text, styles.subtitle]}>
                        {user.phone}
                    </Text>
                </View>
                <View style={styles.optionContainer}>
                    <View style={styles.option}>
                        <FontAwesome5 name="user-edit" size={17} color="white" />
                        <Text style={styles.optionCaption}>Edit Profile</Text>
                    </View>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Edit profile')}
                        activeOpacity={1}
                    >
                        <Entypo name="chevron-right" size={22} color="white" />
                    </TouchableOpacity>
                </View>
                <View style={[styles.optionContainer, { paddingBottom: 7 }]}>
                    <View style={styles.option}>
                        <Entypo name="ticket" size={20} color="white" />
                        <Text style={styles.optionCaption}>My Reservations</Text>
                    </View>
                </View>
                <FlatList
                    data={reservations}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item, index }) => {
                        return (
                            <ReservationCard
                                item={item}
                                index={index}
                            />
                        )
                    }}
                    ItemSeparatorComponent={Separator}
                    ListEmptyComponent={EmptyList}
                    contentContainerStyle={{ flexGrow: 1 }}
                />
                <View style={[styles.optionContainer, { paddingBottom: 7 }]}>
                    <View style={styles.option}>
                        <MaterialIcons name="logout" size={20} color="white" />
                        <Text style={styles.optionCaption}>Sign Out</Text>
                    </View>
                    <TouchableOpacity
                        onPress={onSignOut}
                        activeOpacity={1}
                    >
                        <Entypo name="chevron-right" size={22} color="white" />
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </>
    )
}

export default PersonalAreaScreen;

const styles = StyleSheet.create({
    text: {
        fontFamily: 'Poppins',
        color: 'white'
    },
    indicatorStyle: {
        backgroundColor: 'white',
        borderRadius: 45
    },
    indicatorContainerStyle: {
        marginHorizontal: 40,
        paddingHorizontal: 80
    },
    labelStyle: {
        fontFamily: 'Poppins',
        fontSize: 17,
        textTransform: 'capitalize',
        marginBottom: -7
    },
    separator: {
        marginVertical: 5
    },
    headerContainer: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20
    },
    imageWrapper: {
        width: 100,
        height: 100,
        backgroundColor: primary,
        borderRadius: 50,
        marginVertical: 10,
        padding: 5,
        justifyContent: 'center',
        alignItems: 'center'
    },
    image: {
        justifyContent: 'flex-end',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        borderRadius: 50,
        overflow: 'hidden',
        backgroundColor: '#444549'
    },
    userInfo: {
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 5
    },
    title: {
        fontSize: 18
    },
    subtitle: {
        fontSize: 13,
        marginBottom: -3,
        color: '#acacac'
    },
    optionContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: 15,
        paddingVertical: 5
    },
    option: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    optionCaption: {
        fontFamily: 'PoppinsBold',
        color: 'white',
        transform: [{ translateY: 2 }],
        letterSpacing: 1.1,
        marginLeft: 10
    },
    emptyListContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyMessage: {
        fontSize: 17,
        textAlign: 'center'
    },
    vector: {
        width: 100,
        height: 100,
        marginBottom: 15
    }
});