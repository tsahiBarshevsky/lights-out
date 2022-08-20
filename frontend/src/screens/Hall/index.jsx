import React, { useState, useCallback } from 'react';
import { SafeAreaView, StyleSheet, Text, View, BackHandler, TouchableOpacity, Image } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import update from 'immutability-helper';
import { Header, WarningModal } from '../../components';
import { globalStyles } from '../../utils/globalStyles';
import { background, primary } from '../../utils/theme';
import moment from 'moment';

const HallScreen = ({ route }) => {
    const { movie, screening } = route.params;
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [price, setPrice] = useState(0);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const navigation = useNavigation();

    const onBackPressed = () => {
        if (selectedSeats.length > 0)
            setIsModalVisible(true);
        else
            navigation.goBack();
    }

    const onCancelReservation = () => {
        setIsModalVisible(false);
        setTimeout(() => {
            navigation.goBack();
        }, 500);
    }

    const onSelectSeat = (line, index) => {
        const j = selectedSeats.findIndex((seat) => seat.line === line && seat.number === index);
        if (j !== -1) {
            setPrice(prevState => prevState - screening.hall.ticketPrice);
            setSelectedSeats(update(selectedSeats, { $splice: [[j, 1]] }));
        }
        else {
            setPrice(prevState => prevState + screening.hall.ticketPrice);
            setSelectedSeats(update(selectedSeats, { $push: [{ line: line, number: index }] }));
        }
    }

    const onBookSeats = () => {
        const groups = selectedSeats.sort((a, b) => { return a.number - b.number }).reduce((group, seat) => {
            const { line } = seat;
            group[line] = group[line] ?? [];
            group[line].push(seat);
            return group;
        }, {});
        const hall = screening.hall;
        navigation.navigate('Checkout', {
            movie,
            screening,
            selectedSeats,
            price,
            type: hall.type,
            ticketPrice: hall.ticketPrice,
            groups
        });
    }

    useFocusEffect(
        useCallback(() => {
            const onBackPressed = () => {
                if (selectedSeats.length > 0)
                    setIsModalVisible(true);
                else
                    navigation.goBack();
                return true;
            };
            BackHandler.addEventListener('hardwareBackPress', onBackPressed);
            return () =>
                BackHandler.removeEventListener('hardwareBackPress', onBackPressed);
        }, [selectedSeats, isModalVisible])
    );

    return (
        <>
            <SafeAreaView style={globalStyles.container}>
                <View style={styles.headerWrapper}>
                    <Header
                        caption={"Select Seats"}
                        backFunction={onBackPressed}
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
                <View style={styles.header}>
                    <Image
                        source={{ uri: `https://image.tmdb.org/t/p/original/${movie.posterPath}` }}
                        style={styles.poster}
                        resizeMode="center"
                    />
                    <View style={{ flex: 1 }}>
                        <Text style={styles.title}>{movie.title}</Text>
                        <View style={styles.screening}>
                            <Text style={[styles.text, styles.smaller]}>
                                {moment(screening.date).format('dddd, MMMM DD | HH:mm')}
                            </Text>
                            <View style={{ alignItems: 'center' }}>
                                <Text style={[styles.text, styles.smaller, styles.hall]}>
                                    Hall {screening.hall.number}
                                </Text>
                                <Text
                                    style={[
                                        styles.text,
                                        screening.hall.type === 'IMAX' ? styles.imax : styles.smaller]
                                    }
                                >
                                    {screening.hall.type}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={styles.screen}>
                    <View style={styles.screenLine} />
                    <Text style={[styles.text, styles.screenText]}>
                        Screen
                    </Text>
                </View>
                {Object.keys(screening).length > 0 && Object.keys(screening.seats).map((line) => {
                    return (
                        <View style={styles.line} key={line}>
                            <Text style={[styles.text, styles.lineText]}>{line}</Text>
                            <View style={styles.seats}>
                                {screening.seats[line].map((e, i) => {
                                    return (
                                        <TouchableOpacity
                                            onPress={() => onSelectSeat(line, i)}
                                            key={e.number}
                                            disabled={!e.available}
                                            activeOpacity={1}
                                            style={[
                                                styles.seat,
                                                e.available ?
                                                    (selectedSeats.findIndex((seat) => seat.line === line && seat.number === i) !== -1 ?
                                                        styles.selected : styles.available)
                                                    : styles.unavailable
                                            ]}
                                        >
                                            <Text style={[styles.seatNumber, !e.available && { color: 'white' }]}>
                                                {e.number + 1}
                                            </Text>
                                        </TouchableOpacity>
                                    )
                                })}
                            </View>
                            <Text style={[styles.text, styles.lineText]}>{line}</Text>
                        </View>
                    )
                })}
                <View style={styles.legend}>
                    <View style={[styles.circle, styles.availableSeat]} />
                    <Text style={[styles.text, styles.legendCaption]}>Available</Text>
                    <View style={[styles.circle, styles.selectedSeat]} />
                    <Text style={[styles.text, styles.legendCaption]}>Selected</Text>
                    <View style={[styles.circle, styles.reservedSeat]} />
                    <Text style={[styles.text, styles.legendCaption]}>Reserved</Text>
                </View>
                <View style={styles.book}>
                    <View style={styles.priceAndSeats}>
                        <Text style={[styles.text, styles.seatsCaption]}>
                            {selectedSeats.length} Seats
                        </Text>
                        <Text style={[styles.text, styles.price]}>{price}₪</Text>
                    </View>
                    <TouchableOpacity
                        onPress={onBookSeats}
                        disabled={selectedSeats.length === 0}
                        style={[styles.button, selectedSeats.length === 0 && styles.disabled]}
                        activeOpacity={1}
                    >
                        <Text style={styles.buttonCaption}>Book Tickets</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
            <WarningModal
                isModalVisible={isModalVisible}
                setIsModalVisible={setIsModalVisible}
                onCancel={onCancelReservation}
                caption="free your seleced seats?"
            />
        </>
    )
}

export default HallScreen;

const styles = StyleSheet.create({
    text: {
        color: 'white',
        fontFamily: 'Poppins'
    },
    imax: {
        fontFamily: 'Imax',
        transform: [{ translateY: -3 }]
    },
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
        height: 160,
        width: '100%',
        opacity: 0.6
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        marginTop: -55,
        paddingHorizontal: 15,
        marginBottom: 10,
        zIndex: 2
    },
    poster: {
        width: 40,
        height: 60,
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
    screening: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end'
    },
    smaller: {
        fontSize: 12
    },
    hall: {
        marginBottom: -5
    },
    screen: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 5,
        marginBottom: 10
    },
    screenLine: {
        height: 3,
        width: '85%',
        alignSelf: 'center',
        backgroundColor: 'white',
        borderRadius: 3 / 2,
    },
    screenText: {
        fontSize: 11
    },
    line: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 5,
        paddingHorizontal: 10
    },
    lineText: {
        fontSize: 10
    },
    seats: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    seat: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 30,
        height: 30,
        borderRadius: 10,
        marginHorizontal: 3
    },
    available: {
        backgroundColor: 'white'
    },
    unavailable: {
        backgroundColor: '#373741'
    },
    selected: {
        backgroundColor: primary
    },
    seatNumber: {
        fontFamily: 'Poppins',
        transform: [{ translateY: 2 }]
    },
    legend: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 10,
        paddingBottom: 15
    },
    legendCaption: {
        fontSize: 13,
        transform: [{ translateY: 1 }],
        marginRight: 10
    },
    circle: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginRight: 5
    },
    availableSeat: {
        backgroundColor: 'white'
    },
    selectedSeat: {
        backgroundColor: primary
    },
    reservedSeat: {
        backgroundColor: '#373741'
    },
    book: {
        position: 'absolute',
        bottom: 15,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 15
    },
    seatsCaption: {
        fontSize: 10
    },
    price: {
        fontSize: 20,
        lineHeight: 24
    },
    button: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: primary,
        width: '70%',
        height: 38,
        borderRadius: 50
    },
    buttonCaption: {
        fontFamily: 'PoppinsBold',
        transform: [{ translateY: 2 }]
    },
    disabled: {
        backgroundColor: 'grey'
    }
});