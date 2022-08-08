import React, { useRef, useState } from 'react';
import { Formik, ErrorMessage } from 'formik';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { authentication } from '../../utils/firebase';

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

const SignInTab = () => {
    const [passwordVisibilty, setPasswordVisibilty] = useState(true);
    const passwordRef = useRef(null);

    const onSignIn = (values) => {
        Keyboard.dismiss();
        setTimeout(() => {
            signInWithEmailAndPassword(authentication, values.email.trim(), values.password)
                .catch((error) => console.log(error.message))
        }, 500);
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
                    onSubmit={(values) => onSignIn(values)}
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
                                        onSubmitEditing={handleSubmit}
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
                                <TouchableOpacity onPress={handleSubmit}>
                                    <Text>Sign In</Text>
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
    password: ''
};

export default SignInTab;

const styles = StyleSheet.create({});