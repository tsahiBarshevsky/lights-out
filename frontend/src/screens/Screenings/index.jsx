import React, { useContext, useEffect, useState } from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, View, TouchableOpacity, Button } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';
import update from 'immutability-helper';
import { bookSeats } from '../../redux/actions/screenings';
import { globalStyles } from '../../utils/globalStyles';
import { ticketPrice } from '../../utils/utilities';
import { Calendar } from '../../components';
import { WeekContext } from '../../utils/context';

const format = 'DD/MM/YY HH:mm';
const initial = { hours: 0, minutes: 0, seconds: 0, milliseconds: 0 };

const ScreeningsScreen = ({ route }) => {
    const { movie } = route.params;
    const { week } = useContext(WeekContext);
    const [originalScreenings, setOriginalScreenings] = useState([]);
    const [date, setDate] = useState(moment());
    const [movieScreenings, setMovieScreenings] = useState([]);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [price, setPrice] = useState(0);
    const [selectedScreening, setSelectedScreening] = useState(0);
    const screenings = useSelector(state => state.screenings);
    const dispatch = useDispatch();

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
        const index = screenings.findIndex((item) => item._id === movieScreenings[selectedScreening]._id);
        dispatch(bookSeats(seats, index));
        setMovieScreenings(update(movieScreenings, { [selectedScreening]: { $merge: { seats: seats } } }));
        setPrice(0);
        setSelectedSeats([]);
    }

    useEffect(() => {
        setOriginalScreenings(screenings.filter((item => item.movie.id === movie.tmdbID)));
    }, []);

    useEffect(() => {
        const filter = screenings.filter((item) => {
            return (
                moment(item.date).set(initial).format(format) === date.set(initial).format(format) &&
                moment(item.date).isAfter(moment(new Date())) &&
                item.movie.id === movie.tmdbID
            );
        });
        setMovieScreenings(filter);
        setSelectedScreening(0);
    }, [date]);

    return originalScreenings.length > 0 && (
        <SafeAreaView style={globalStyles.container}>
            <Text>{movie.title}'s screenings</Text>
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
            }
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