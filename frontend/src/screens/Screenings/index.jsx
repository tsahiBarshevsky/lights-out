import React, { useContext, useEffect, useState, useCallback } from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, View, TouchableOpacity, Button, BackHandler, Dimensions } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';
import update from 'immutability-helper';
import Modal from "react-native-modal";
import { bookSeats } from '../../redux/actions/screenings';
import { globalStyles } from '../../utils/globalStyles';
import { ticketPrice } from '../../utils/utilities';
import { Calendar, Header } from '../../components';
import { WeekContext } from '../../utils/context';
import { primary, secondary } from '../../utils/theme';

const { width } = Dimensions.get('window');
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
                        <View>
                            {Object.keys(movieScreenings[selectedScreening].seats).map((line) => {
                                return (
                                    <View style={styles.line} key={line}>
                                        <Text style={styles.text}>{line}</Text>
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
                                                        <Text style={styles.text}>{e.number + 1}</Text>
                                                    </TouchableOpacity>
                                                )
                                            })}
                                        </View>
                                        <Text style={styles.text}>{line}</Text>
                                    </View>
                                )
                            })}
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
                            <Text style={styles.text}>{price}₪</Text>
                            <Text style={styles.text}>{selectedSeats.length} Seats</Text>
                            <Button
                                title='Book now'
                                onPress={onBookSeats}
                                disabled={selectedSeats.length === 0}
                            />
                        </View>
                    </>
                }
                {/* <Text>{movie.title}'s screenings</Text>
                <Text>Hall {originalScreenings[selectedScreening].hall}</Text>
                <Calendar
                    week={week}
                    date={date}
                    setDate={setDate}
                />
                <FlatList
                    horizontal
                    data={movieScreenings}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item, index }) => {
                        return (
                            <TouchableOpacity onPress={() => onSelectScreening(item, index)}>
                                <Text style={movieScreenings.findIndex((e) => e._id === item._id) === selectedScreening && { color: 'red' }}>
                                    {moment(item.date).format('DD/MM HH:mm')}
                                </Text>
                            </TouchableOpacity>
                        )
                    }}
                    ItemSeparatorComponent={() => <View style={{ marginHorizontal: 5 }} />}
                    style={{ flexGrow: 0, marginVertical: 10 }}
                />
                {movieScreenings.length > 0 &&
                    <View>
                        {Object.keys(movieScreenings[selectedScreening].seats).map((line) => {
                            return (
                                <View style={styles.line} key={line}>
                                    <Text>{line}</Text>
                                    <View style={styles.seats}>
                                        {movieScreenings[selectedScreening].seats[line].map((e, i) => {
                                            return (
                                                <TouchableOpacity
                                                    onPress={() => onSelectSeat(line, i)}
                                                    key={e.number}
                                                    disabled={!e.available}
                                                    style={[
                                                        styles.seat,
                                                        e.available ?
                                                            (selectedSeats.findIndex((seat) => seat.line === line && seat.number === i) !== -1 ?
                                                                styles.selected : styles.available)
                                                            : styles.unavailable
                                                    ]}
                                                >
                                                    <Text>{e.number + 1}</Text>
                                                </TouchableOpacity>
                                            )
                                        })}
                                    </View>
                                    <Text>{line}</Text>
                                </View>
                            )
                        })}
                        <Text>{price}₪</Text>
                        <Button
                            title='Book now'
                            onPress={onBookSeats}
                            disabled={selectedSeats.length === 0}
                        />
                    </View>
                } */}
            </SafeAreaView>
            <Modal
                isVisible={isModalVisible}
                onBackdropPress={() => setIsModalVisible(false)}
                animationIn={"fadeIn"}
                animationOut={"fadeOut"}
                animationInTiming={500}
                animationOutTiming={250}
                useNativeDriver
            >
                <View style={styles.modalContainer}>
                    <Text>Cancel reservation, are you sure?</Text>
                    <TouchableOpacity
                        onPress={onCancelReservation}
                    >
                        <Text>Yes</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setIsModalVisible(false)}
                    >
                        <Text>No</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        </>
    )
}

export default ScreeningsScreen;

const styles = StyleSheet.create({
    text: {
        color: 'white',
        fontFamily: 'Poppins'
    },
    line: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        // backgroundColor: 'lightblue',
        marginBottom: 5,
        paddingHorizontal: 10
    },
    seats: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        // backgroundColor: 'pink'
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
    dates: {
        height: '100%',
        alignItems: 'flex-start',
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50,
        backgroundColor: '#2c2c35',
        paddingHorizontal: 15,
        paddingVertical: 10
    },
    hours: {
        flexGrow: 0,
        marginTop: 20
    },
    hourButton: {
        paddingHorizontal: 13,
        paddingVertical: 5,
        borderRadius: 10,
        borderWidth: 1.5,
        borderColor: '#33333b',
        backgroundColor: '#33333b',
        elevation: 1
    },
    selectedHour: {
        borderColor: primary
    },
    selectedHourText: {
        color: primary
    },
    modalContainer: {
        width: width * 0.7,
        alignSelf: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 15,
        paddingVertical: 10,
        paddingHorizontal: 15
    }
});