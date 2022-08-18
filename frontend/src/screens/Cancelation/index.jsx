import React, { useRef } from 'react';
import { Formik, ErrorMessage } from 'formik';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import update from 'immutability-helper';
import { Header } from '../../components';
import { globalStyles } from '../../utils/globalStyles';
import { unbookSeats } from '../../redux/actions/screenings';
import { cancelReservation } from '../../redux/actions/reservations';
import { localhost } from '../../utils/utilities';
import { cancelationSchema } from '../../utils/schemas';
import { primary } from '../../utils/theme';

// React Native components
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    KeyboardAvoidingView,
    TextInput,
    Text,
    View,
    TouchableOpacity
} from 'react-native';

const CancelationScreen = ({ route }) => {
    const { reservation, location } = route.params;
    const screenings = useSelector(state => state.screenings);
    const dispatch = useDispatch();
    const navigation = useNavigation();
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
            <ScrollView keyboardShouldPersistTaps="always">
                <Header
                    caption={"Cancel Reservation"}
                    backFunction={() => navigation.goBack()}
                />
                <KeyboardAvoidingView
                    enabled
                    behavior={Platform.OS === 'ios' ? 'padding' : null}
                >
                    <Formik
                        initialValues={{ email: '', creditNumber: '' }}
                        enableReinitialize
                        onSubmit={(values) => onCancelReservation(values)}
                        validationSchema={cancelationSchema}
                        validateOnChange={false}
                        validateOnBlur={false}
                    >
                        {({ handleChange, handleBlur, handleSubmit, values, errors }) => {
                            return (
                                <View style={{ paddingHorizontal: 15 }}>
                                    <Text style={styles.title}>Email</Text>
                                    <View style={[globalStyles.textInputWrapper, errors.email && globalStyles.error]}>
                                        <TextInput
                                            placeholder="Email with which the order was made..."
                                            value={values.email}
                                            onChangeText={handleChange('email')}
                                            underlineColorAndroid="transparent"
                                            placeholderTextColor='rgba(255, 255, 255, 0.35)'
                                            selectionColor='white'
                                            blurOnSubmit={false}
                                            onBlur={handleBlur('email')}
                                            returnKeyType='next'
                                            keyboardType="email-address"
                                            onSubmitEditing={() => creditNumberRef.current?.focus()}
                                            style={globalStyles.textInput}
                                        />
                                    </View>
                                    <ErrorMessage
                                        name='email'
                                        render={(message) => {
                                            return (
                                                <View style={globalStyles.errorContainer}>
                                                    <Text style={globalStyles.errorText}>{message}</Text>
                                                </View>
                                            )
                                        }}
                                    />
                                    <Text style={styles.title}>Credit Card Number</Text>
                                    <View style={[globalStyles.textInputWrapper, errors.creditNumber && globalStyles.error]}>
                                        <TextInput
                                            placeholder='Last 4 digits of credit card...'
                                            value={values.creditNumber}
                                            ref={creditNumberRef}
                                            underlineColorAndroid="transparent"
                                            placeholderTextColor='rgba(255, 255, 255, 0.35)'
                                            selectionColor='white'
                                            onBlur={handleBlur('creditNumber')}
                                            style={globalStyles.textInput}
                                            keyboardType='number-pad'
                                            onSubmitEditing={handleSubmit}
                                            onChangeText={handleChange('creditNumber')}
                                            maxLength={4}
                                        />
                                    </View>
                                    <ErrorMessage
                                        name='creditNumber'
                                        render={(message) => {
                                            return (
                                                <View style={globalStyles.errorContainer}>
                                                    <Text style={globalStyles.errorText}>{message}</Text>
                                                </View>
                                            )
                                        }}
                                    />
                                    <TouchableOpacity
                                        onPress={handleSubmit}
                                        style={styles.button}
                                        activeOpacity={1}
                                    >

                                        <Text style={styles.buttonCaption}>
                                            Cancel Reservation
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            )
                        }}
                    </Formik>
                </KeyboardAvoidingView>
            </ScrollView>
        </SafeAreaView>
    )
}

export default CancelationScreen;

const styles = StyleSheet.create({
    title: {
        fontFamily: 'Poppins',
        color: 'white',
        marginBottom: -10,
        marginTop: 10
    },
    button: {
        marginTop: 25,
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: primary,
        width: '100%',
        height: 38,
        borderRadius: 50,
        elevation: 2
    },
    buttonCaption: {
        fontFamily: 'PoppinsBold',
        transform: [{ translateY: 2 }],
        letterSpacing: 1.1
    }
});