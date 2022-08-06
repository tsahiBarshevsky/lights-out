import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import update from 'immutability-helper';
import { globalStyles } from '../../utils/globalStyles';
import { bookSeats } from '../../redux/actions/screenings';
import { localhost } from '../../utils/utilities';

const ChockoutScreen = ({ route }) => {
    const { movieScreenings, selectedScreening, selectedSeats, price } = route.params;
    const screenings = useSelector(state => state.screenings);
    const dispatch = useDispatch();
    const navigation = useNavigation();

    const onCheckout = () => {
        const id = movieScreenings[selectedScreening]._id;
        console.log('id', id)
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
        fetch(`http://${localhost}/book-seats?id=${id}`,
            {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    seats: seats
                })
            })
            .then((res) => res.json())
            .then((res) => console.log(res))
            .then(() => {
                const index = screenings.findIndex((item) => item._id === movieScreenings[selectedScreening]._id);
                dispatch(bookSeats(seats, index));
                navigation.popToTop();
            })
            .catch((error) => console.log(error.message));
    }

    return (
        <View style={globalStyles.container}>
            <Button title='checkout' onPress={onCheckout} />
        </View>
    )
}

export default ChockoutScreen;

const styles = StyleSheet.create({});