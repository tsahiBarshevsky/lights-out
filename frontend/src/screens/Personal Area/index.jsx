import React, { useState } from 'react';
import { StyleSheet, SafeAreaView, useWindowDimensions, Text, TouchableOpacity, View, FlatList, Image } from 'react-native';
import { TabView, TabBar } from 'react-native-tab-view';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { AntDesign, MaterialIcons, Entypo, FontAwesome5 } from '@expo/vector-icons';
import { globalStyles } from '../../utils/globalStyles';
import { SignUpTab, SignInTab, Header } from '../../components';
import { authentication } from '../../utils/firebase';
import { signOutUser } from '../../redux/actions/user';
import { signOut } from 'firebase/auth';
import { resetReservations } from '../../redux/actions/reservations';
import { background, primary } from '../../utils/theme';

const PersonalAreaScreen = () => {
    const [index, setIndex] = useState(0);
    const [isModalVisible, setIsModalVisible] = useState(false);
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

    const renderPickerButton = () => {
        if (Object.keys(user).length > 0) {
            if (Object.keys(user.image).length > 0)
                return (
                    <TouchableOpacity
                        activeOpacity={1}
                        style={styles.picker}
                        onPress={() => console.log('edit image')}
                    >
                        <MaterialIcons name="edit" size={15} color={background} />
                    </TouchableOpacity>
                );
        }
        return (
            <TouchableOpacity
                activeOpacity={1}
                style={styles.picker}
                onPress={() => console.log('add image')}
            >
                <Entypo name="camera" size={12} color={background} />
            </TouchableOpacity>
        );
    }

    const onSignOut = () => {
        signOut(authentication);
        setIsLoggedIn(false);
        dispatch(signOutUser());
        dispatch(resetReservations());
    }

    const ListHeader = () => (
        <View style={styles.headerContainer}>
            <Header caption={"My Profile"} />
            <View style={styles.imageWrapper}>
                <View style={styles.image}>
                    {renderImage()}
                </View>
            </View>
            <Text style={styles.text}>{user.firstName} {user.lastName}</Text>
            <Text style={styles.text}>{authentication.currentUser.email}</Text>
            <Text style={styles.text}>{user.phone}</Text>
            <TouchableOpacity onPress={onSignOut}>
                <Text>Sign Out</Text>
            </TouchableOpacity>
            {/* <View>
                <Text>{user.firstName}</Text>
                <TouchableOpacity
                    onPress={() => onOpenModal('firstName')}
                >
                    <Text>Edit</Text>
                </TouchableOpacity>
            </View>
            <View>
                <Text>{user.lastName}</Text>
                <TouchableOpacity
                    onPress={() => onOpenModal('lastName')}
                >
                    <Text>Edit</Text>
                </TouchableOpacity>
            </View>
            <Text>{authentication.currentUser.email}</Text>
            <View>
                <Text>{user.phone}</Text>
                <TouchableOpacity
                    onPress={() => onOpenModal('phone')}
                >
                    <Text>Edit</Text>
                </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={onSignOut}>
                <Text>Sign Out</Text>
            </TouchableOpacity>
            <Text>My reservations</Text> */}
        </View>
    );

    const Separator = () => (
        <View style={styles.separator} />
    );

    return !isLoggedIn ? (
        <SafeAreaView style={globalStyles.container}>
            <Header caption={"Personal Area"} />
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
                <Header caption={"My Profile"} />
                <View style={styles.userInfo}>
                    <View style={styles.imageWrapper}>
                        <View style={styles.image}>
                            {renderImage()}
                        </View>
                    </View>
                    <Text style={styles.text}>{user.firstName} {user.lastName}</Text>
                    <Text style={styles.text}>{authentication.currentUser.email}</Text>
                    <Text style={styles.text}>{user.phone}</Text>
                </View>
                <View style={styles.optionContainer}>
                    <View style={styles.option}>
                        <FontAwesome5 name="user-edit" size={17} color="white" />
                        <Text style={styles.optionCaption}>Edit Profile</Text>
                    </View>
                    <TouchableOpacity>
                        <Entypo name="chevron-right" size={22} color="white" />
                    </TouchableOpacity>
                </View>
                <View style={styles.optionContainer}>
                    <View style={styles.option}>
                        <MaterialIcons name="logout" size={20} color="white" />
                        <Text style={styles.optionCaption}>Sign out</Text>
                    </View>
                    <TouchableOpacity
                        onPress={signOut}
                        activeOpacity={1}
                    >
                        <Entypo name="chevron-right" size={22} color="white" />
                    </TouchableOpacity>
                </View>
                {/* <FlatList
                    data={reservations}
                    keyExtractor={(item) => item._id}
                    ListHeaderComponent={ListHeader}
                    renderItem={({ item, index }) => {
                        return (
                            <View>
                                <Text>#{item.orderID}</Text>
                                <Text>{item.movie.title}</Text>
                                <Text>Reservation date {moment(item.reservationDate).format('DD/MM/YY HH:mm')}</Text>
                                <Text>Screening date {moment(item.date).format('DD/MM/YY HH:mm')}</Text>
                                {item.active &&
                                    <TouchableOpacity
                                        onPress={() => navigation.navigate('Ticket', { ticket: item })}
                                    >
                                        <Text>View tickets</Text>
                                    </TouchableOpacity>
                                }
                                {item.active && moment(new Date()).isBefore(moment(item.date)) &&
                                    <TouchableOpacity
                                        onPress={() => navigation.navigate('Cancelation', { reservation: item, location: index })}
                                    >
                                        <Text>Cancel reservation</Text>
                                    </TouchableOpacity>
                                }
                            </View>
                        )
                    }}
                    ItemSeparatorComponent={Separator}
                /> */}
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
        marginVertical: 10
    },
    image: {
        justifyContent: 'flex-end',
        alignItems: 'center',
        width: 100,
        height: 100,
        borderRadius: 50,
        overflow: 'hidden',
        backgroundColor: '#444549',
        alignSelf: 'center',
    },
    picker: {
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 2,
        right: 2,
        zIndex: 1,
        width: 25,
        height: 25,
        borderRadius: 25 / 2,
        backgroundColor: primary
    },
    userInfo: {
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10
    },
    optionContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: 15,
        backgroundColor: 'blue'
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
    }
});