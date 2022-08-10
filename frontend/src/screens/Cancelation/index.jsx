import React, { useRef } from 'react';
import { SafeAreaView, StyleSheet, ScrollView, KeyboardAvoidingView, TextInput, Text, View, Button } from 'react-native';
import { Formik } from 'formik';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import update from 'immutability-helper';
import { globalStyles } from '../../utils/globalStyles';
import { unbookSeats } from '../../redux/actions/screenings';
import { cancelReservation } from '../../redux/actions/reservations';
import { authentication } from '../../utils/firebase';
import { localhost } from '../../utils/utilities';

const CancelationScreen = ({ route }) => {
    const { reservation, location } = route.params;
    const screenings = useSelector(state => state.screenings);
    const user = useSelector(state => state.user);
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const formRef = useRef(null);
    const creditNumberRef = useRef(null);

    const onCancelReservation = (values) => {
        if (values.email.trim() !== reservation.contact.email || values.creditNumber !== reservation.payment.creditNumber) {
            console.log('Email or creditNumber is not matched');
            return;
        }
        const screening = screenings.find((screening) => screening._id === reservation.screeningID);
        const index = screenings.findIndex((screening) => screening._id === reservation.screeningID);
        var seats = screening.seats;
        reservation.seats.forEach((seat) => {
            const newArray = update(seats[seat.line], {
                [seat.number]: {
                    $merge: {
                        available: true
                    }
                }
            });
            seats = update(seats, { [seat.line]: { $set: newArray } });
        });
        fetch(`http://${localhost}/cancel-reservation?screeningID=${screening._id}&reservationID=${reservation._id}`,
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
                dispatch(unbookSeats(seats, index));
                dispatch(cancelReservation(location));
                navigation.goBack();
            })
            .catch((error) => console.log(error.message));
    }

    return (
        <SafeAreaView style={globalStyles.container}>
            <ScrollView keyboardShouldPersistTaps="never">
                <KeyboardAvoidingView
                    enabled
                    behavior={Platform.OS === 'ios' ? 'padding' : null}
                >
                    <Text>{reservation._id}</Text>
                    <Formik
                        initialValues={{ email: '', creditNumber: '' }}
                        enableReinitialize
                        onSubmit={(values) => onCancelReservation(values)}
                        innerRef={formRef}
                    >
                        {({ handleChange, handleBlur, handleSubmit, values, setFieldValue, errors, setErrors, touched }) => {
                            return (
                                <View>
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
                                            onSubmitEditing={() => creditNumberRef.current?.focus()}
                                            style={styles.textInput}
                                        />
                                    </View>
                                    <View style={styles.textInputWrapper}>
                                        <TextInput
                                            placeholder='Credit number...'
                                            value={values.creditNumber}
                                            ref={creditNumberRef}
                                            underlineColorAndroid="transparent"
                                            placeholderTextColor='black'
                                            selectionColor='black'
                                            onBlur={handleBlur('creditNumber')}
                                            style={styles.textInput}
                                            keyboardType='number-pad'
                                            onSubmitEditing={handleSubmit}
                                            onChangeText={handleChange('creditNumber')}
                                            maxLength={4}
                                        />
                                    </View>
                                </View>
                            )
                        }}
                    </Formik>
                    <Button title='Cancel' onPress={() => formRef.current?.handleSubmit()} />
                </KeyboardAvoidingView>
            </ScrollView>
        </SafeAreaView>
    )
}

export default CancelationScreen;

const styles = StyleSheet.create({});