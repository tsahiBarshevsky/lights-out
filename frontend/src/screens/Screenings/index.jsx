import React, { useEffect, useState } from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, View, TouchableOpacity, Button } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';
import update from 'immutability-helper';
import { bookSeats } from '../../redux/actions/screenings';
import { globalStyles } from '../../utils/globalStyles';
import { ticketPrice } from '../../utils/utilities';

const ScreeningsScreen = ({ route }) => {
    const { movie } = route.params;
    const [movieScreenings, setMovieScreenings] = useState([]);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [price, setPrice] = useState(0);
    const [selectedScreening, setSelectedScreening] = useState(0);
    const screenings = useSelector(state => state.screenings);
    const dispatch = useDispatch();

    const onSelectScreening = (index) => {
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
        var seats = movieScreenings[selectedScreening].seats;
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
        dispatch(bookSeats(seats, selectedScreening));
        setMovieScreenings(update(movieScreenings, { [selectedScreening]: { $merge: { seats: seats } } }));
        setPrice(0);
        setSelectedSeats([]);
    }

    useEffect(() => {
        setMovieScreenings(screenings.filter((item => item.movie.id === movie.tmdbID)));
    }, []);

    return movieScreenings.length > 0 && (
        <SafeAreaView style={globalStyles.container}>
            <Text>{movie.title}'s screenings</Text>
            <Text>Hall {movieScreenings[selectedScreening].hall}</Text>
            <FlatList
                horizontal
                data={movieScreenings}
                keyExtractor={(item) => item._id}
                renderItem={({ item, index }) => {
                    return (
                        <TouchableOpacity onPress={() => onSelectScreening(index)}>
                            <Text style={index === selectedScreening && { color: 'red' }}>
                                {moment(item.date).format('HH:mm')}
                            </Text>
                        </TouchableOpacity>
                    )
                }}
                ItemSeparatorComponent={() => <View style={{ marginHorizontal: 5 }} />}
                style={{ flexGrow: 0, marginVertical: 10 }}
            />
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
            <Text>{price}₪</Text>
            <Button title='Book now' onPress={onBookSeats} />
        </SafeAreaView>
    )
}

export default ScreeningsScreen;

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