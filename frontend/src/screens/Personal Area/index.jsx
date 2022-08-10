import React, { useState } from 'react';
import { StyleSheet, SafeAreaView, useWindowDimensions, Text, TouchableOpacity, View, FlatList } from 'react-native';
import { TabView, TabBar } from 'react-native-tab-view';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { globalStyles } from '../../utils/globalStyles';
import { SignUpTab, SignInTab } from '../../components';
import { authentication } from '../../utils/firebase';
import { signOutUser } from '../../redux/actions/user';
import { signOut } from 'firebase/auth';
import EditingModal from './modal';

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
        // signOut(authentication);
        // dispatch(signOutUser());
        setTimeout(() => {
            navigation.goBack();
        }, 200);
    }

    const Header = () => (
        <>
            <View>
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
            <Text>My reservations</Text>
        </>
    );

    const Separator = () => (
        <View style={styles.separator} />
    );

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
        <>
            <SafeAreaView style={globalStyles.container}>
                <FlatList
                    data={reservations}
                    keyExtractor={(item) => item._id}
                    ListHeaderComponent={Header}
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
    },
    separator: {
        marginVertical: 5
    }
});