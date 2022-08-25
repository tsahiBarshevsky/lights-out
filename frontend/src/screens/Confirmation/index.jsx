import React, { useCallback } from 'react';
import { SafeAreaView, StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, BackHandler } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import moment from 'moment';
import { Header } from '../../components';
import { authentication } from '../../utils/firebase';
import { globalStyles } from '../../utils/globalStyles';
import { background, primary, secondary } from '../../utils/theme';

const ConfirmationScreen = ({ route }) => {
    const { reservation, movie } = route.params;
    const navigation = useNavigation();

    useFocusEffect(
        useCallback(() => {
            const onBackPressed = () => {
                navigation.popToTop();
                return true;
            };
            BackHandler.addEventListener('hardwareBackPress', onBackPressed);
            return () =>
                BackHandler.removeEventListener('hardwareBackPress', onBackPressed);
        }, [])
    );

    return (
        <SafeAreaView style={globalStyles.container}>
            <View style={styles.headerWrapper}>
                <Header
                    caption={"Reservation Summary"}
                    backFunction={() => navigation.popToTop()}
                />
            </View>
            <View style={styles.linearGradientWrapper}>
                <Image
                    source={{ uri: `https://image.tmdb.org/t/p/original/${movie.backdropPath}` }}
                    style={styles.image}
                    blurRadius={5}
                />
                <LinearGradient
                    colors={[background, 'transparent', background]}
                    style={styles.linearGradient}
                />
            </View>
            <ScrollView
                overScrollMode='never'
                contentContainerStyle={{ paddingBottom: 15 }}
            >
                <Text style={styles.caption}>You've Got</Text>
                <Text style={[styles.caption, styles.ticket]}>
                    {reservation.seats.length === 1 ? "Ticket!" : "Tickets!"}
                </Text>
                <Text style={styles.text}>
                    You need to show the code in the ticket to the conductor in order to enter the theater.
                </Text>
                {authentication.currentUser ?
                    <>
                        <View style={[styles.ticketConatiner, styles.ticketUpperContianer]}>
                            <Image
                                source={{ uri: `https://image.tmdb.org/t/p/original/${movie.posterPath}` }}
                                style={styles.poster}
                                resizeMode="center"
                            />
                            <View>
                                <Text style={styles.title}>{movie.title}</Text>
                                <Text style={styles.date}>
                                    {moment(reservation.date).format('dddd, MMMM DD | HH:mm')}
                                </Text>
                            </View>
                        </View>
                        <View style={styles.dividerContainer}>
                            <View style={[styles.filler, { left: 0 }]} />
                            <View style={styles.circle} />
                            <View style={styles.dividerWrapper}>
                                <View style={styles.divider} />
                            </View>
                            <View style={styles.circle} />
                            <View style={[styles.filler, { right: 0 }]} />
                        </View>
                        <View style={[styles.ticketConatiner, styles.ticketLowerContianer]}>
                            <TouchableOpacity
                                onPress={() => navigation.navigate('Ticket', { ticket: reservation })}
                                style={styles.button}
                                activeOpacity={1}
                            >
                                <Text style={styles.buttonCaption}>
                                    View {reservation.seats.length === 1 ? "Ticket" : "Tickets"}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </>
                    :
                    <Text style={styles.text}>
                        We have emailed you your tickets inforamtion.
                    </Text>
                }
            </ScrollView>
        </SafeAreaView>
    )
}

export default ConfirmationScreen;

const styles = StyleSheet.create({
    headerWrapper: {
        position: 'absolute',
        top: 0,
        width: '100%',
        zIndex: 2
    },
    linearGradientWrapper: {
        zIndex: 1,
        marginTop: 10
    },
    linearGradient: {
        position: 'absolute',
        top: 0,
        width: '100%',
        height: '100%'
    },
    image: {
        height: 300,
        width: '100%',
        opacity: 0.6
    },
    caption: {
        fontFamily: 'BebasNeue',
        fontSize: 50,
        color: 'white',
        textAlign: 'center'
    },
    ticket: {
        transform: [{ translateY: -13 }],
        marginBottom: -10
    },
    text: {
        fontFamily: 'Poppins',
        color: 'white',
        textAlign: 'center'
    },
    ticketConatiner: {
        backgroundColor: secondary,
        padding: 10,
        marginHorizontal: 15
    },
    ticketUpperContianer: {
        flexDirection: 'row',
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15
    },
    ticketLowerContianer: {
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15
    },
    poster: {
        width: 45,
        height: 65,
        borderRadius: 7,
        marginRight: 15
    },
    title: {
        fontFamily: 'BebasNeue',
        fontSize: 22,
        flexShrink: 1,
        color: 'white',
        lineHeight: 25
    },
    date: {
        fontFamily: 'Poppins',
        color: 'white'
    },
    button: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: primary,
        width: '70%',
        height: 32,
        borderRadius: 50,
        elevation: 1,
        alignSelf: 'center'
    },
    buttonCaption: {
        fontFamily: 'Poppins',
        fontSize: 13,
        transform: [{ translateY: 1 }]
    },
    dividerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        backgroundColor: secondary
    },
    dividerWrapper: {
        flex: 1,
        height: 1,
        paddingHorizontal: 10,
        overflow: 'hidden',
    },
    divider: {
        height: 2,
        borderWidth: 1,
        borderColor: '#FFFFFF',
        borderStyle: 'dashed'
    },
    circle: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: background
    },
    filler: {
        width: 15,
        height: 30,
        backgroundColor: background,
        position: 'absolute',
    }
});