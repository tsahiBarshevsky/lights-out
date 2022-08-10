import React, { useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import update from 'immutability-helper';
import moment from 'moment';
import { Formik } from 'formik';
import { globalStyles } from '../../utils/globalStyles';
import { bookSeats } from '../../redux/actions/screenings';
import { addNewReservation } from '../../redux/actions/reservations';
import { localhost, ticketPrice } from '../../utils/utilities';
import { authentication } from '../../utils/firebase';

// React Native Components
import {
    StyleSheet,
    Platform,
    SafeAreaView,
    Text,
    View,
    ScrollView,
    KeyboardAvoidingView,
    TextInput,
    Button,
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
    const user = useSelector(state => state.user);
    const dispatch = useDispatch();
    const navigation = useNavigation();

    // Refs
    const formRef = useRef(null);
    const lastNameRef = useRef(null);
    const emailRef = useRef(null);
    const phoneRef = useRef(null);
    const creditRef = useRef(null);
    const expiryRef = useRef(null);
    const cvcRef = useRef(null);

    const initialValues = {
        firstName: user ? user.firstName : '',
        lastName: user ? user.lastName : '',
        email: user ? user.email : '',
        phone: user ? user.phone : '',
        creditNumber: '',
        expiryDate: '',
        cvc: ''
    };

    const formatCreditCard = (input) => {
        const inputValue = input.replace(/ /g, "");
        let inputNumbersOnly = inputValue.replace(/\D/g, "");
        if (inputNumbersOnly.length > 16)
            inputNumbersOnly = inputNumbersOnly.substr(0, 16);
        const splits = inputNumbersOnly.match(/.{1,4}/g);
        let spacedNumber = "";
        if (splits)
            spacedNumber = splits.join(" ");
        formRef.current?.setFieldValue('creditNumber', spacedNumber);
    }

    const formatExpiryDate = (input) => {
        let textTemp = input;
        if (textTemp[0] !== '1' && textTemp[0] !== '0')
            textTemp = '';
        if (textTemp.length === 2) {
            if (parseInt(textTemp.substring(0, 2)) > 12 || parseInt(textTemp.substring(0, 2)) == 0)
                textTemp = textTemp[0];
            else {
                if (input.length === 2)
                    textTemp += '/';
                else
                    textTemp = textTemp[0];
            }
        }
        formRef.current?.setFieldValue('expiryDate', textTemp);
    }

    const onCheckout = (values) => {
        const id = movieScreenings[selectedScreening]._id;
        selectedSeats.forEach((seat) => {
            seat.code = 'ABC-' + Math.floor(Math.random() * (9999 - 1000 + 1) + 1000);
        });
        const newReservation = {
            screeningID: id,
            uid: authentication.currentUser.uid,
            movie: {
                id: movie._id,
                title: movie.title
            },
            contact: {
                fullName: `${values.firstName.trim()} ${values.lastName.trim()}`,
                phone: values.phone.trim(),
                email: values.email.trim()
            },
            seats: selectedSeats.sort((a, b) => { return a.number - b.number }),
            sum: price,
            payment: {
                creditNumber: values.creditNumber.slice(15),
                expiryDate: values.expiryDate,
                cvc: values.cvc
            },
            date: movieScreenings[selectedScreening].date,
            reservationDate: new Date()
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
            .then((res) => {
                newReservation._id = res._id;
                newReservation.orderID = res.orderID;
            })
            .then(() => {
                const index = screenings.findIndex((item) => item._id === movieScreenings[selectedScreening]._id);
                dispatch(bookSeats(seats, index));
                dispatch(addNewReservation(newReservation));
                navigation.popToTop();
            })
            .catch((error) => console.log(error.message));
    }

    return (
        <SafeAreaView style={globalStyles.container}>
            <ScrollView keyboardShouldPersistTaps="never">
                <Text style={styles.title}>Selected Movie</Text>
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
                <KeyboardAvoidingView
                    enabled
                    behavior={Platform.OS === 'ios' ? 'padding' : null}
                >
                    <Formik
                        initialValues={initialValues}
                        enableReinitialize
                        onSubmit={(values) => onCheckout(values)}
                        innerRef={formRef}
                    >
                        {({ handleChange, handleBlur, handleSubmit, values, setFieldValue, errors, setErrors, touched }) => {
                            return (
                                <View>
                                    <Text style={styles.title}>Personal Details</Text>
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
                                            onSubmitEditing={() => {
                                                if (user)
                                                    phoneRef.current.focus();
                                                else
                                                    emailRef.current?.focus();
                                            }}
                                            style={styles.textInput}
                                        />
                                    </View>
                                    <View style={styles.textInputWrapper}>
                                        <TextInput
                                            placeholder='Email...'
                                            value={values.email}
                                            ref={emailRef}
                                            onChangeText={handleChange('email')}
                                            underlineColorAndroid="transparent"
                                            placeholderTextColor='black'
                                            selectionColor='black'
                                            blurOnSubmit={false}
                                            onBlur={handleBlur('email')}
                                            returnKeyType='next'
                                            onSubmitEditing={() => phoneRef.current?.focus()}
                                            style={styles.textInput}
                                            editable={user ? false : true}
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
                                            blurOnSubmit={false}
                                            onBlur={handleBlur('phone')}
                                            onSubmitEditing={() => creditRef.current?.focus()}
                                            style={styles.textInput}
                                            keyboardType='number-pad'
                                            maxLength={10}
                                            returnKeyType='next'
                                        />
                                    </View>
                                    <Text style={styles.title}>Payment Details</Text>
                                    <View style={styles.textInputWrapper}>
                                        <TextInput
                                            placeholder='Credit card number...'
                                            value={values.creditNumber}
                                            ref={creditRef}
                                            underlineColorAndroid="transparent"
                                            placeholderTextColor='black'
                                            selectionColor='black'
                                            blurOnSubmit={false}
                                            onBlur={handleBlur('creditNumber')}
                                            onSubmitEditing={() => expiryRef.current?.focus()}
                                            style={styles.textInput}
                                            keyboardType='number-pad'
                                            onChangeText={(text) => formatCreditCard(text)}
                                            maxLength={19}
                                            returnKeyType='next'
                                        />
                                    </View>
                                    <View style={styles.textInputWrapper}>
                                        <TextInput
                                            placeholder='Expiry date...'
                                            value={values.expiryDate}
                                            ref={expiryRef}
                                            underlineColorAndroid="transparent"
                                            placeholderTextColor='black'
                                            selectionColor='black'
                                            blurOnSubmit={false}
                                            onBlur={handleBlur('expiryDate')}
                                            style={styles.textInput}
                                            keyboardType='number-pad'
                                            onSubmitEditing={() => cvcRef.current?.focus()}
                                            onChangeText={(text) => formatExpiryDate(text)}
                                            maxLength={5}
                                            returnKeyType='next'
                                        />
                                    </View>
                                    <View style={styles.textInputWrapper}>
                                        <TextInput
                                            placeholder='CVC...'
                                            value={values.cvc}
                                            ref={cvcRef}
                                            underlineColorAndroid="transparent"
                                            placeholderTextColor='black'
                                            selectionColor='black'
                                            onBlur={handleBlur('cvc')}
                                            style={styles.textInput}
                                            keyboardType='number-pad'
                                            onSubmitEditing={handleSubmit}
                                            onChangeText={handleChange('cvc')}
                                            maxLength={3}
                                        />
                                    </View>
                                </View>
                            )
                        }}
                    </Formik>
                    <Button title='checkout' onPress={() => formRef.current?.handleSubmit()} />
                </KeyboardAvoidingView>
            </ScrollView>
        </SafeAreaView>
    )
}

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