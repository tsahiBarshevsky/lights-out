import React, { useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import update from 'immutability-helper';
import moment from 'moment';
import { Formik, ErrorMessage } from 'formik';
import { Header } from '../../components';
import { globalStyles } from '../../utils/globalStyles';
import { bookSeats } from '../../redux/actions/screenings';
import { addNewReservation } from '../../redux/actions/reservations';
import { localhost } from '../../utils/utilities';
import { authentication } from '../../utils/firebase';
import { primary } from '../../utils/theme';
import { checkoutSchema } from '../../utils/schemas';

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
    TouchableOpacity,
    Keyboard,
} from 'react-native';

const ChockoutScreen = ({ route }) => {
    const {
        movie,
        movieScreenings,
        selectedScreening,
        selectedSeats,
        price,
        type,
        ticketPrice,
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
        Keyboard.dismiss();
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
            reservationDate: new Date(),
            active: true
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
            <ScrollView
                keyboardShouldPersistTaps="always"
                contentContainerStyle={styles.scrollView}
            >
                <Header
                    caption={"Complete Reservation"}
                    backFunction={() => navigation.goBack()}
                />
                <View style={styles.wrapper}>
                    <Text style={[styles.title, styles.text]}>Selected Movie</Text>
                    <Text style={[styles.text, { fontSize: 15 }]}>{movie.title}</Text>
                    <View>
                        <Text style={styles.subtitle}>When?</Text>
                        <Text style={styles.text}>
                            {moment(movieScreenings[selectedScreening].date).format('dddd, MMMM DD, YYYY; HH:mm')}
                        </Text>
                    </View>
                    <View>
                        <Text style={styles.subtitle}>Ticket type</Text>
                        <Text style={styles.text}>{type}</Text>
                    </View>
                    <View>
                        <Text style={styles.subtitle}>Ticket price</Text>
                        <Text style={styles.text}>{ticketPrice}₪</Text>
                    </View>
                    <View>
                        <Text style={styles.subtitle}>Amount</Text>
                        <Text style={styles.text}>{selectedSeats.length}</Text>
                    </View>
                    <View>
                        <Text style={styles.subtitle}>Seats</Text>
                        {Object.keys(groups).map((item) => {
                            return (
                                <View key={item} style={{ flexDirection: 'row' }}>
                                    <Text style={styles.text}>Line {item} seats </Text>
                                    {groups[item].map((group, index) => {
                                        return (
                                            <View key={index}>
                                                <Text style={styles.text}>{group.number + 1}</Text>
                                            </View>
                                        )
                                    }).reduce((acc, elem) => {
                                        return acc === null ? [elem] : [...acc, <Text style={styles.text} key={elem}>, </Text>, elem]
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
                            validationSchema={checkoutSchema}
                            enableReinitialize
                            onSubmit={(values) => onCheckout(values)}
                            innerRef={formRef}
                            validateOnChange={false}
                            validateOnBlur={false}
                        >
                            {({ handleChange, handleBlur, handleSubmit, values, errors }) => {
                                return (
                                    <View>
                                        <Text style={[styles.title, styles.text]}>Personal Details</Text>
                                        <View style={[globalStyles.textInputWrapper, errors.firstName && globalStyles.error]}>
                                            <TextInput
                                                placeholder='First name...'
                                                value={values.firstName}
                                                onChangeText={handleChange('firstName')}
                                                underlineColorAndroid="transparent"
                                                placeholderTextColor='rgba(255, 255, 255, 0.35)'
                                                selectionColor='white'
                                                blurOnSubmit={false}
                                                onBlur={handleBlur('firstName')}
                                                returnKeyType='next'
                                                onSubmitEditing={() => lastNameRef.current?.focus()}
                                                style={globalStyles.textInput}
                                            />
                                        </View>
                                        <ErrorMessage
                                            name='firstName'
                                            render={(message) => {
                                                return (
                                                    <View style={globalStyles.errorContainer}>
                                                        <Text style={globalStyles.errorText}>{message}</Text>
                                                    </View>
                                                )
                                            }}
                                        />
                                        <View style={[globalStyles.textInputWrapper, errors.lastName && globalStyles.error]}>
                                            <TextInput
                                                placeholder='Last name...'
                                                value={values.lastName}
                                                ref={lastNameRef}
                                                onChangeText={handleChange('lastName')}
                                                underlineColorAndroid="transparent"
                                                placeholderTextColor='rgba(255, 255, 255, 0.35)'
                                                selectionColor='white'
                                                blurOnSubmit={false}
                                                onBlur={handleBlur('lastName')}
                                                returnKeyType='next'
                                                onSubmitEditing={() => {
                                                    if (user)
                                                        phoneRef.current.focus();
                                                    else
                                                        emailRef.current?.focus();
                                                }}
                                                style={globalStyles.textInput}
                                            />
                                        </View>
                                        <ErrorMessage
                                            name='lastName'
                                            render={(message) => {
                                                return (
                                                    <View style={globalStyles.errorContainer}>
                                                        <Text style={globalStyles.errorText}>{message}</Text>
                                                    </View>
                                                )
                                            }}
                                        />
                                        <View style={[globalStyles.textInputWrapper, errors.email && globalStyles.error]}>
                                            <TextInput
                                                placeholder='Email...'
                                                value={values.email}
                                                ref={emailRef}
                                                onChangeText={handleChange('email')}
                                                underlineColorAndroid="transparent"
                                                placeholderTextColor='rgba(255, 255, 255, 0.35)'
                                                selectionColor='white'
                                                blurOnSubmit={false}
                                                onBlur={handleBlur('email')}
                                                returnKeyType='next'
                                                onSubmitEditing={() => phoneRef.current?.focus()}
                                                style={globalStyles.textInput}
                                                editable={user ? false : true}
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
                                        <View style={[globalStyles.textInputWrapper, errors.phone && globalStyles.error]}>
                                            <TextInput
                                                placeholder='Phone...'
                                                value={values.phone}
                                                ref={phoneRef}
                                                onChangeText={handleChange('phone')}
                                                underlineColorAndroid="transparent"
                                                placeholderTextColor='rgba(255, 255, 255, 0.35)'
                                                selectionColor='white'
                                                blurOnSubmit={false}
                                                onBlur={handleBlur('phone')}
                                                onSubmitEditing={() => creditRef.current?.focus()}
                                                style={globalStyles.textInput}
                                                keyboardType='number-pad'
                                                maxLength={10}
                                                returnKeyType='next'
                                            />
                                        </View>
                                        <ErrorMessage
                                            name='phone'
                                            render={(message) => {
                                                return (
                                                    <View style={globalStyles.errorContainer}>
                                                        <Text style={globalStyles.errorText}>{message}</Text>
                                                    </View>
                                                )
                                            }}
                                        />
                                        <Text style={[styles.title, styles.text, { marginTop: 10 }]}>Payment Details</Text>
                                        <View style={[globalStyles.textInputWrapper, errors.creditNumber && globalStyles.error]}>
                                            <TextInput
                                                placeholder='Credit card number...'
                                                value={values.creditNumber}
                                                ref={creditRef}
                                                underlineColorAndroid="transparent"
                                                placeholderTextColor='rgba(255, 255, 255, 0.35)'
                                                selectionColor='white'
                                                blurOnSubmit={false}
                                                onBlur={handleBlur('creditNumber')}
                                                onSubmitEditing={() => expiryRef.current?.focus()}
                                                style={globalStyles.textInput}
                                                keyboardType='number-pad'
                                                onChangeText={(text) => formatCreditCard(text)}
                                                maxLength={19}
                                                returnKeyType='next'
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
                                        <View style={[globalStyles.textInputWrapper, errors.expiryDate && globalStyles.error]}>
                                            <TextInput
                                                placeholder='Expiry date...'
                                                value={values.expiryDate}
                                                ref={expiryRef}
                                                underlineColorAndroid="transparent"
                                                placeholderTextColor='rgba(255, 255, 255, 0.35)'
                                                selectionColor='white'
                                                blurOnSubmit={false}
                                                onBlur={handleBlur('expiryDate')}
                                                style={globalStyles.textInput}
                                                keyboardType='number-pad'
                                                onSubmitEditing={() => cvcRef.current?.focus()}
                                                onChangeText={(text) => formatExpiryDate(text)}
                                                maxLength={5}
                                                returnKeyType='next'
                                            />
                                        </View>
                                        <ErrorMessage
                                            name='expiryDate'
                                            render={(message) => {
                                                return (
                                                    <View style={globalStyles.errorContainer}>
                                                        <Text style={globalStyles.errorText}>{message}</Text>
                                                    </View>
                                                )
                                            }}
                                        />
                                        <View style={[globalStyles.textInputWrapper, errors.cvc && globalStyles.error]}>
                                            <TextInput
                                                placeholder='CVC...'
                                                value={values.cvc}
                                                ref={cvcRef}
                                                underlineColorAndroid="transparent"
                                                placeholderTextColor='rgba(255, 255, 255, 0.35)'
                                                selectionColor='white'
                                                onBlur={handleBlur('cvc')}
                                                style={globalStyles.textInput}
                                                keyboardType='number-pad'
                                                onSubmitEditing={handleSubmit}
                                                onChangeText={handleChange('cvc')}
                                                maxLength={3}
                                            />
                                        </View>
                                        <ErrorMessage
                                            name='cvc'
                                            render={(message) => {
                                                return (
                                                    <View style={globalStyles.errorContainer}>
                                                        <Text style={globalStyles.errorText}>{message}</Text>
                                                    </View>
                                                )
                                            }}
                                        />
                                    </View>
                                )
                            }}
                        </Formik>
                        <TouchableOpacity
                            onPress={() => formRef.current?.handleSubmit()}
                            activeOpacity={1}
                            style={styles.button}
                        >
                            <Text style={styles.buttonCaption}>
                                Complete Reservation
                            </Text>
                        </TouchableOpacity>
                    </KeyboardAvoidingView>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default ChockoutScreen;

const styles = StyleSheet.create({
    scrollView: {
        paddingBottom: 15
    },
    wrapper: {
        paddingHorizontal: 15,
        paddingTop: 10
    },
    text: {
        fontFamily: 'Poppins',
        color: 'white'
    },
    title: {
        fontSize: 20,
        marginVertical: 5
    },
    subtitle: {
        fontFamily: 'Poppins',
        fontSize: 14,
        color: '#67676b',
        marginTop: 5,
        marginBottom: -5
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