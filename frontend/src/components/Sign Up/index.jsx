import React, { useRef, useState } from 'react';
import { Formik, ErrorMessage } from 'formik';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';
import { authentication } from '../../utils/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { localhost } from '../../utils/utilities';

// React Native components
import {
    StyleSheet,
    TextInput,
    View,
    ScrollView,
    KeyboardAvoidingView,
    TouchableOpacity,
    Text,
    Keyboard
} from 'react-native';

const SignUpTab = () => {
    const [passwordVisibilty, setPasswordVisibilty] = useState(true);
    const dispatch = useDispatch();
    const firstNameRef = useRef(null);
    const lastNameRef = useRef(null);
    const passwordRef = useRef(null);
    const phoneRef = useRef(null);

    const onSignUp = (values) => {
        Keyboard.dismiss();
        createUserWithEmailAndPassword(authentication, values.email.trim(), values.password)
            .then(() => {
                fetch(`http://${localhost}/add-new-user`,
                    {
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            uid: authentication.currentUser.uid,
                            email: values.email,
                            phone: values.phone,
                            firstName: values.firstName,
                            lastName: values.lastName,
                        })
                    })
                    .then((res) => res.json())
                    .then((res) => {
                        dispatch({
                            type: 'SET_USER', user: {
                                _id: res,
                                uid: authentication.currentUser.uid,
                                email: values.email.trim(),
                                phone: values.phone,
                                firstName: values.firstName.trim(),
                                lastName: values.lastName.trim()
                            }
                        });
                    })
                    .catch((error) => console.log('error', error.message));
            })
            .catch((error) => console.log(error.message));
    }

    return (
        <ScrollView
            keyboardShouldPersistTaps="always"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 15 }}
        >
            <KeyboardAvoidingView
                enabled
                behavior={Platform.OS === 'ios' ? 'padding' : null}
            >
                <Formik
                    initialValues={initialValues}
                    enableReinitialize
                    onSubmit={(values) => onSignUp(values)}
                >
                    {({ handleChange, handleBlur, handleSubmit, values, errors, setErrors, touched }) => {
                        return (
                            <View style={{ paddingHorizontal: 15 }}>
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
                                        onSubmitEditing={() => passwordRef.current?.focus()}
                                        style={styles.textInput}
                                    />
                                </View>
                                <View style={styles.textInputWrapper}>
                                    <TextInput
                                        placeholder='Password...'
                                        value={values.password}
                                        ref={passwordRef}
                                        onChangeText={handleChange('password')}
                                        secureTextEntry={passwordVisibilty}
                                        underlineColorAndroid="transparent"
                                        placeholderTextColor='black'
                                        selectionColor='black'
                                        blurOnSubmit={false}
                                        onBlur={handleBlur('password')}
                                        returnKeyType='next'
                                        onSubmitEditing={() => firstNameRef.current?.focus()}
                                        style={styles.textInput}
                                    />
                                    <TouchableOpacity onPress={() => setPasswordVisibilty(!passwordVisibilty)}>
                                        {passwordVisibilty ?
                                            <FontAwesome
                                                name="eye"
                                                size={20}
                                                color="rgba(0, 0, 0, 0.25)"
                                            />
                                            :
                                            <FontAwesome
                                                name="eye-slash"
                                                size={20}
                                                color="rgba(0, 0, 0, 0.25)"
                                            />
                                        }
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.textInputWrapper}>
                                    <TextInput
                                        placeholder='First name...'
                                        value={values.firstName}
                                        ref={firstNameRef}
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
                                <TouchableOpacity onPress={handleSubmit}>
                                    <Text>Sign Up</Text>
                                </TouchableOpacity>
                            </View>
                        )
                    }}
                </Formik>
            </KeyboardAvoidingView>
        </ScrollView>
    )
}

const initialValues = {
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: ''
};

export default SignUpTab;

const styles = StyleSheet.create({});