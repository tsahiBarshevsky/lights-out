import React, { useContext, useEffect, useState, useCallback } from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, View, TouchableOpacity, BackHandler } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';
import update from 'immutability-helper';
import { globalStyles } from '../../utils/globalStyles';
import { ticketPrice } from '../../utils/utilities';
import { Calendar, Header } from '../../components';
import { WeekContext } from '../../utils/context';
import { primary, secondary } from '../../utils/theme';
import WarningModal from './modal';

const format = 'DD/MM/YY HH:mm';
const initial = { hours: 0, minutes: 0, seconds: 0, milliseconds: 0 };

const ScreeningsScreen = ({ route }) => {
    const { movie } = route.params;
    const { week } = useContext(WeekContext);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [originalScreenings, setOriginalScreenings] = useState([]);
    const [date, setDate] = useState(moment());
    const [movieScreenings, setMovieScreenings] = useState([]);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [price, setPrice] = useState(0);
    const [selectedScreening, setSelectedScreening] = useState(0);
    const screenings = useSelector(state => state.screenings);
    const dispatch = useDispatch();
    const navigation = useNavigation();

    const onSelectScreening = (item) => {
        const index = movieScreenings.findIndex((e) => e._id === item._id);
        setSelectedScreening(index);
        if (selectedSeats.length > 0)
            setSelectedSeats([]);
        if (price > 0)
            setPrice(0);
    }

    const onSelectSeat = (line, index) => {
        const j = selectedSeats.findIndex((seat) => seat.line === line && seat.number === index);
        if (j !== -1) {
            setPrice(prevState => prevState - ticketPrice);
            setSelectedSeats(update(selectedSeats, { $splice: [[j, 1]] }));
        }
        else {
            setPrice(prevState => prevState + ticketPrice);
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
        navigation.navigate('Checkout', {
            movie,
            movieScreenings,
            selectedScreening,
            selectedSeats,
            price,
            groups
        });
    }

    const onCancelReservation = () => {
        setIsModalVisible(false);
        setTimeout(() => {
            navigation.goBack();
        }, 500);
    }

    useEffect(() => {
        setOriginalScreenings(screenings.filter((item => item.movie.id === movie.tmdbID)));
    }, []);

    useEffect(() => {
        const filter = screenings.filter((item) => {
            return (
                moment(item.date).set(initial).format(format) === date.set(initial).format(format) &&
                // moment(item.date).isAfter(moment(new Date())) &&
                item.movie.id === movie.tmdbID
            );
        });
        setMovieScreenings(filter);
        setSelectedScreening(0);
    }, [date]);

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

    return originalScreenings.length > 0 && (
        <>
            <SafeAreaView style={globalStyles.container}>
                <Header caption={"Select Seats"} />
                {movieScreenings.length > 0 &&
                    <>
                        <View style={styles.screen}>
                            <View style={styles.screenLine} />
                            <Text style={[styles.text, styles.screenText]}>Screen</Text>
                        </View>
                        <View>
                            {Object.keys(movieScreenings[selectedScreening].seats).map((line) => {
                                return (
                                    <View style={styles.line} key={line}>
                                        <Text style={[styles.text, styles.lineText]}>{line}</Text>
                                        <View style={styles.seats}>
                                            {movieScreenings[selectedScreening].seats[line].map((e, i) => {
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
                        </View>
                        <View style={styles.legend}>
                            <View style={[styles.circle, styles.availableSeat]} />
                            <Text style={[styles.text, styles.legendCaption]}>Available</Text>
                            <View style={[styles.circle, styles.selectedSeat]} />
                            <Text style={[styles.text, styles.legendCaption]}>Selected</Text>
                            <View style={[styles.circle, styles.reservedSeat]} />
                            <Text style={[styles.text, styles.legendCaption]}>Reserved</Text>
                        </View>
                        <View style={styles.dates}>
                            <Text style={[styles.text, { alignSelf: 'center' }]}>
                                Select Date and Time
                            </Text>
                            <Calendar
                                week={week}
                                date={date}
                                setDate={setDate}
                            />
                            <FlatList
                                horizontal
                                data={movieScreenings}
                                keyExtractor={(item) => item._id}
                                showsHorizontalScrollIndicator={false}
                                renderItem={({ item, index }) => {
                                    return (
                                        <TouchableOpacity
                                            onPress={() => onSelectScreening(item, index)}
                                            activeOpacity={1}
                                            style={[
                                                styles.hourButton,
                                                movieScreenings.findIndex((e) => e._id === item._id) === selectedScreening && styles.selectedHour
                                            ]}
                                        >
                                            <Text
                                                style={[
                                                    styles.text,
                                                    { transform: [{ translateY: 2 }] },
                                                    movieScreenings.findIndex((e) => e._id === item._id) === selectedScreening && styles.selectedHourText
                                                ]}
                                            >
                                                {moment(item.date).format('HH:mm')}
                                            </Text>
                                        </TouchableOpacity>
                                    )
                                }}
                                ItemSeparatorComponent={() => <View style={{ marginHorizontal: 5 }} />}
                                style={styles.hours}
                            />
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
                                >
                                    <Text style={styles.buttonCaption}>Book Tickets</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </>
                }
            </SafeAreaView>
            <WarningModal
                isModalVisible={isModalVisible}
                setIsModalVisible={setIsModalVisible}
                onCancelReservation={onCancelReservation}
            />
        </>
    )
}

export default ScreeningsScreen;

const styles = StyleSheet.create({
    text: {
        color: 'white',
        fontFamily: 'Poppins'
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
        fontSize: 8
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
    dates: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'flex-start',
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50,
        backgroundColor: '#2c2c35',
        paddingHorizontal: 15,
        paddingTop: 15,
        paddingBottom: 10
    },
    hours: {
        flexGrow: 0,
        marginTop: 20,
        marginBottom: 15
    },
    hourButton: {
        paddingHorizontal: 13,
        paddingVertical: 5,
        borderRadius: 10,
        borderWidth: 1.5,
        borderColor: '#4d4c4c',
        backgroundColor: '#4d4c4c',
        elevation: 1
    },
    selectedHour: {
        borderColor: primary
    },
    selectedHourText: {
        color: primary
    },
    book: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 5
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
        borderRadius: 12
    },
    buttonCaption: {
        fontFamily: 'Poppins',
        transform: [{ translateY: 2 }]
    },
    disabled: {
        backgroundColor: 'grey'
    }
});