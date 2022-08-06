import React, { useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import update from 'immutability-helper';
import moment from 'moment';
import { Formik } from 'formik';
import { globalStyles } from '../../utils/globalStyles';
import { bookSeats } from '../../redux/actions/screenings';
import { localhost, ticketPrice } from '../../utils/utilities';

// React Native Components
import {
    StyleSheet,
    Platform,
    SafeAreaView,
    Text,
    View,
    ScrollView,
    KeyboardAvoidingView,
    TextInput
} from 'react-native';

const ChockoutScreen = ({ route }) => {
    const {
        movie,
        movieScreenings,
        selectedScreening,
        selectedSeats,
        price,
        groups
    } = route.params;
    const screenings = useSelector(state => state.screenings);
    const dispatch = useDispatch();
    const navigation = useNavigation();

    // Textinpus refs
    const lastNameRef = useRef(null);
    const emailRef = useRef(null);
    const phoneRef = useRef(null);

    const onCheckout = () => {
        const id = movieScreenings[selectedScreening]._id;
        const newReservation = {
            screeningID: id,
            contact: {
                fullName: 'full name',
                phone: '05251515151',
                email: 'user1@gmail.com'
            },
            seats: selectedSeats.sort((a, b) => { return a.number - b.number }),
            sum: price,
            date: movieScreenings[selectedScreening].date
        };
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
                    seats: seats,
                    newReservation: newReservation
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
        <SafeAreaView style={globalStyles.container}>
            {/* <Button title='checkout' onPress={onCheckout} /> */}
            <ScrollView>
                <Text style={styles.title}>Selected movie</Text>
                <Text>{movie.title} at {moment(movieScreenings[selectedScreening].date).format('dddd DD/MM/YYYY HH:mm')}</Text>
                <View>
                    <Text style={styles.subtitle}>Ticket type</Text>
                    <Text>Regular</Text>
                </View>
                <View>
                    <Text style={styles.subtitle}>Amount</Text>
                    <Text>{selectedSeats.length}</Text>
                </View>
                <View>
                    <Text style={styles.subtitle}>Ticket price</Text>
                    <Text>{ticketPrice}₪</Text>
                </View>
                <View>
                    <Text style={styles.subtitle}>Seats</Text>
                    {Object.keys(groups).map((item) => {
                        return (
                            <View key={item} style={{ flexDirection: 'row' }}>
                                <Text>Line {item} seats </Text>
                                {groups[item].map((group, index) => {
                                    return (
                                        <View key={index}>
                                            <Text>{group.number + 1}</Text>
                                        </View>
                                    )
                                }).reduce((acc, elem) => {
                                    return acc === null ? [elem] : [...acc, <Text key={elem}>, </Text>, elem]
                                }, null)}
                            </View>
                        );
                    })}
                </View>
                <Text style={styles.title}>Personal details</Text>
                <KeyboardAvoidingView
                    enabled
                    behavior={Platform.OS === 'ios' ? 'padding' : null}
                >
                    <Formik
                        initialValues={initialValues}
                        enableReinitialize
                        onSubmit={(values) => console.log(values)}
                    >
                        {({ handleChange, handleBlur, handleSubmit, values, errors, setErrors, touched }) => {
                            return (
                                <View style={{ paddingHorizontal: 15 }}>
                                    <View style={styles.textInputWrapper}>
                                        <TextInput
                                            placeholder='First name...'
                                            value={values.firstName}
                                            onChangeText={handleChange('firstName')}
                                            underlineColorAndroid="transparent"
                                            placeholderTextColor='black'
                                            selectionColor='black'
                                            blurOnSubmit={false}
                                            onBlur={handleBlur('firstName')}
                                            returnKeyType='next'
                                            onSubmitEditing={() => lastNameRef.current?.focus()}
                                            style={styles.textInput}
                                        />
                                    </View>
                                    <View style={styles.textInputWrapper}>
                                        <TextInput
                                            placeholder='Last name...'
                                            value={values.lastName}
                                            ref={lastNameRef}
                                            onChangeText={handleChange('lastName')}
                                            underlineColorAndroid="transparent"
                                            placeholderTextColor='black'
                                            selectionColor='black'
                                            blurOnSubmit={false}
                                            onBlur={handleBlur('lastName')}
                                            returnKeyType='next'
                                            onSubmitEditing={() => emailRef.current?.focus()}
                                            style={styles.textInput}
                                        />
                                    </View>
                                    <View style={styles.textInputWrapper}>
                                        <TextInput
                                            placeholder='Email...'
                                            value={values.email}
                                            onChangeText={handleChange('email')}
                                            underlineColorAndroid="transparent"
                                            placeholderTextColor='black'
                                            selectionColor='black'
                                            blurOnSubmit={false}
                                            onBlur={handleBlur('email')}
                                            returnKeyType='next'
                                            onSubmitEditing={() => phoneRef.current?.focus()}
                                            style={styles.textInput}
                                        />
                                    </View>
                                    <View style={styles.textInputWrapper}>
                                        <TextInput
                                            placeholder='Phone...'
                                            value={values.phone}
                                            ref={phoneRef}
                                            onChangeText={handleChange('phone')}
                                            underlineColorAndroid="transparent"
                                            placeholderTextColor='black'
                                            selectionColor='black'
                                            onBlur={handleBlur('phone')}
                                            onSubmitEditing={handleSubmit}
                                            style={styles.textInput}
                                            keyboardType='number-pad'
                                            maxLength={10}
                                        />
                                    </View>
                                </View>
                            )
                        }}
                    </Formik>
                </KeyboardAvoidingView>
            </ScrollView>
        </SafeAreaView>
    )
}

const initialValues = {
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
};

export default ChockoutScreen;

const styles = StyleSheet.create({
    title: {
        fontSize: 18,
        marginBottom: 5
    },
    subtitle: {
        fontSize: 16
    }
});