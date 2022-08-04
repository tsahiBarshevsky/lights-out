import React, { useEffect, useState } from 'react';
import { SafeAreaView, Image, StyleSheet, Text, TouchableOpacity, View, Button } from 'react-native';
import update from 'immutability-helper';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { globalStyles } from '../../utils/globalStyles';
import { localhost, ticketPrice } from '../../utils/utilities';
import { bookSeats } from '../../redux/actions/screenings';

const HomeScreen = () => {
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [price, setPrice] = useState(0);
    // const [screening, setScreening] = useState({});
    const movies = useSelector(state => state.movies);
    const halls = useSelector(state => state.halls);
    const screenings = useSelector(state => state.screenings);
    const dispatch = useDispatch();
    // const [screening, setScreening] = useState({
    //     hall: "1",
    //     seats: {
    //         "1": [
    //             { number: 0, available: true },
    //             { number: 1, available: true },
    //             { number: 2, available: true },
    //             { number: 3, available: true },
    //             { number: 4, available: true },
    //             { number: 5, available: true }
    //         ],
    //         "2": [
    //             { number: 0, available: true },
    //             { number: 1, available: true },
    //             { number: 2, available: false },
    //             { number: 3, available: false },
    //             { number: 4, available: true },
    //             { number: 5, available: true }
    //         ]
    //     }
    // });

    // const hall = {
    //     number: "1",
    //     seats: {
    //         "1": { numberOfSeats: 6 },
    //         "2": { numberOfSeats: 8 },
    //         "3": { numberOfSeats: 8 },
    //         "4": { numberOfSeats: 8 },
    //         "5": { numberOfSeats: 8 },
    //         "6": { numberOfSeats: 6 },
    //     }
    // };

    const onBookSeats = () => {
        var seats = screenings[0].seats;
        selectedSeats.forEach((seat) => {
            const newArray = update(seats[seat.line], {
                [seat.number]: {
                    $merge: {
                        available: false
                    }
                }
            });
            seats = update(seats, { [seat.line]: { $set: newArray } });
        });
        dispatch(bookSeats(seats, 0));
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

    const generateScreening = () => {
        const newScreening = { hall: halls[0].number, seats: {} };
        Object.keys(halls[0].seats).forEach((line) => {
            const size = halls[0].seats[line].numberOfSeats;
            var seats = [];
            [...Array(size).keys()].forEach((_, index) => {
                seats.push({ number: index, available: true });
            });
            newScreening.seats[line] = seats;
        });
        //setScreening(newScreening);
    }

    useEffect(() => {
        // generateScreening();
    }, []);

    return Object.keys(screenings[0]).length > 0 && (
        <SafeAreaView style={globalStyles.container}>
            <Text>{screenings[0].movie.title}</Text>
            <Text>Hall {screenings[0].hall}</Text>
            <Text>{moment(screenings[0].date).format('DD/MM/YYYY HH:mm')}</Text>
            <View style={{ marginVertical: 10 }}>
                {Object.keys(screenings[0].seats).map((line) => {
                    return (
                        <View style={styles.line} key={line}>
                            <Text>{line}</Text>
                            <View style={styles.seats}>
                                {screenings[0].seats[line].map((e, i) => {
                                    return (
                                        <TouchableOpacity
                                            onPress={() => onSelectSeat(line, i)}
                                            key={e.number}
                                            disabled={!e.available}
                                            style={[
                                                styles.seat,
                                                e.available ? (selectedSeats.findIndex((seat) => seat.line === line && seat.number === i) !== -1 ? styles.selected : styles.available) : styles.unavailable
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
            </View>
            <Text>{price}₪</Text>
            <Button title='Book now' onPress={onBookSeats} />
        </SafeAreaView>
    )
}

export default HomeScreen;

const styles = StyleSheet.create({
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
        backgroundColor: 'lightgreen'
    },
    unavailable: {
        backgroundColor: 'lightgrey'
    },
    selected: {
        backgroundColor: 'lightblue'
    }
});