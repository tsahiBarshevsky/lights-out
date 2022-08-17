import React, { useState } from 'react';
import { StyleSheet, SafeAreaView, useWindowDimensions, Text, TouchableOpacity, View, FlatList, Image } from 'react-native';
import { TabView, TabBar } from 'react-native-tab-view';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { globalStyles } from '../../utils/globalStyles';
import { SignUpTab, SignInTab, Header } from '../../components';
import { authentication } from '../../utils/firebase';
import { signOutUser } from '../../redux/actions/user';
import { signOut } from 'firebase/auth';
import EditingModal from './modal';
import { background } from '../../utils/theme';

const PersonalAreaScreen = () => {
    const [index, setIndex] = useState(0);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [type, setType] = useState('');
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

    const onOpenModal = (type) => {
        setType(type);
        setIsModalVisible(true);
    }

    const onSignOut = () => {
        signOut(authentication);
        dispatch(signOutUser());
        navigation.goBack();
    }

    const ListHeader = () => (
        <View style={styles.headerContainer}>
            <Header caption={"My Profile"} />
            <View style={styles.avatar}>
                <Image
                    source={{ uri: 'https://firebasestorage.googleapis.com/v0/b/save-the-date-5d2e8.appspot.com/o/tsahi.13%40gmail.com?alt=media&token=dced2eef-5079-4655-964b-c49ba72fad5a' }}
                    style={{ width: '100%', height: '100%' }}
                />
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

    return !authentication.currentUser ? (
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
                <FlatList
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
                />
            </SafeAreaView>
            <EditingModal
                isModalVisible={isModalVisible}
                setIsModalVisible={setIsModalVisible}
                user={user}
                field={type}
            />
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
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        overflow: 'hidden',
        marginVertical: 10
    }
});