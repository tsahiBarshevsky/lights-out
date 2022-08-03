import React, { useEffect, useState } from 'react';
import { SafeAreaView, Image, StyleSheet, Text, TouchableOpacity, View, Button } from 'react-native';
import update from 'immutability-helper';
import { globalStyles } from '../../utils/globalStyles';
import { localhost, ticketPrice } from '../../utils/utilities';

const HomeScreen = () => {
    const [movies, setMovies] = useState([]);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [price, setPrice] = useState(0);
    const [screening, setScreening] = useState({});
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

    const hall = {
        number: "1",
        seats: {
            "1": { numberOfSeats: 6 },
            "2": { numberOfSeats: 8 },
            "3": { numberOfSeats: 8 },
            "4": { numberOfSeats: 8 },
            "5": { numberOfSeats: 8 },
            "6": { numberOfSeats: 6 },
        }
    };

    const onSelectSeat = (line, index) => {
        // Update seats in screening
        // const newArray = update(screening.seats[line], {
        //     [index]: {
        //         $merge: {
        //             available: false
        //         }
        //     }
        // });
        // const newData = update(screening.seats, { [line]: { $set: newArray } });
        // setScreening(update(screening, { ["seats"]: { $set: newData } }));
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
        const newScreening = { hall: hall.number, seats: {} };
        Object.keys(hall.seats).forEach((line) => {
            const size = hall.seats[line].numberOfSeats;
            var seats = [];
            [...Array(size).keys()].forEach((_, index) => {
                seats.push({ number: index, available: true });
            });
            newScreening.seats[line] = seats;
        });
        setScreening(newScreening);
    }

    useEffect(() => {
        fetch(`http://${localhost}/get-all-movies`)
            .then((res) => res.json())
            .then((res) => setMovies(res))
            .catch((error) => console.log(error));
    }, []);

    return Object.keys(screening).length > 0 ? (
        <SafeAreaView style={globalStyles.container}>
            {movies.length > 0 && <Text>{movies[0].title}</Text>}
            <Text>Hall {screening.hall}</Text>
            <View style={{ marginVertical: 10 }}>
                {Object.keys(screening.seats).map((line) => {
                    return (
                        <View style={styles.line} key={line}>
                            <Text>{line}</Text>
                            <View style={styles.seats}>
                                {screening.seats[line].map((e, i) => {
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
        </SafeAreaView>
    ) : (
        <SafeAreaView style={globalStyles.container}>
            <Button title='generate screening' onPress={generateScreening} />
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