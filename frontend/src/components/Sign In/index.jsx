import React, { useRef, useState } from 'react';
import { Formik, ErrorMessage } from 'formik';
import { Fontisto, FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { BallIndicator } from 'react-native-indicators';
import { authentication } from '../../utils/firebase';
import { globalStyles } from '../../utils/globalStyles';
import { loginSchema } from '../../utils/schemas';
import { primary, error } from '../../utils/theme';

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
    const [disabled, setDisabled] = useState(false);
    const [passwordVisibilty, setPasswordVisibilty] = useState(true);
    const passwordRef = useRef(null);

    const onSignIn = (values) => {
        Keyboard.dismiss();
        setDisabled(true);
        setTimeout(() => {
            signInWithEmailAndPassword(authentication, values.email.trim(), values.password)
                .catch((error) => {
                    console.log(error.message);
                    setDisabled(false);
                });
        }, 500);
    }

    return (
        <ScrollView
            keyboardShouldPersistTaps="always"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollView}
        >
            <KeyboardAvoidingView
                enabled
                behavior={Platform.OS === 'ios' ? 'padding' : null}
            >
                <Formik
                    initialValues={initialValues}
                    enableReinitialize
                    onSubmit={(values) => onSignIn(values)}
                    validationSchema={loginSchema}
                    validateOnChange={false}
                    validateOnBlur={false}
                >
                    {({ handleChange, handleBlur, handleSubmit, values, errors }) => {
                        return (
                            <View style={{ paddingHorizontal: 15 }}>
                                <View style={[globalStyles.textInputWrapper, errors.email && globalStyles.error]}>
                                    <MaterialIcons
                                        name="email"
                                        size={14}
                                        color={errors.email ? error : "white"}
                                        style={styles.icon}
                                    />
                                    <TextInput
                                        placeholder='Email...'
                                        value={values.email}
                                        onChangeText={handleChange('email')}
                                        underlineColorAndroid="transparent"
                                        placeholderTextColor='rgba(255, 255, 255, 0.35)'
                                        selectionColor='white'
                                        blurOnSubmit={false}
                                        onBlur={handleBlur('email')}
                                        keyboardType="email-address"
                                        returnKeyType='next'
                                        onSubmitEditing={() => passwordRef.current?.focus()}
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
                                <View style={[globalStyles.textInputWrapper, errors.password && globalStyles.error]}>
                                    <Fontisto
                                        name="locked"
                                        size={14}
                                        color={errors.password ? error : "white"}
                                        style={styles.icon}
                                    />
                                    <TextInput
                                        placeholder='Password...'
                                        value={values.password}
                                        ref={passwordRef}
                                        onChangeText={handleChange('password')}
                                        secureTextEntry={passwordVisibilty}
                                        underlineColorAndroid="transparent"
                                        placeholderTextColor='rgba(255, 255, 255, 0.35)'
                                        selectionColor='white'
                                        blurOnSubmit={false}
                                        onBlur={handleBlur('password')}
                                        onSubmitEditing={handleSubmit}
                                        style={globalStyles.textInput}
                                    />
                                    <TouchableOpacity onPress={() => setPasswordVisibilty(!passwordVisibilty)}>
                                        {passwordVisibilty ?
                                            <FontAwesome
                                                name="eye"
                                                size={18}
                                                color={errors.password ? errorColor : validColor}
                                                style={styles.eye}
                                            />
                                            :
                                            <FontAwesome
                                                name="eye-slash"
                                                size={18}
                                                color={errors.password ? errorColor : validColor}
                                                style={styles.eye}
                                            />
                                        }
                                    </TouchableOpacity>
                                </View>
                                <ErrorMessage
                                    name='password'
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
                                    disabled={disabled}
                                >
                                    {disabled ?
                                        <BallIndicator size={18} count={8} color='black' />
                                        :
                                        <Text style={styles.buttonCaption}>Sign In</Text>
                                    }
                                </TouchableOpacity>
                            </View>
                        )
                    }}
                </Formik>
            </KeyboardAvoidingView>
        </ScrollView>
    )
}

const validColor = "rgba(255, 255, 255, 0.35)";
const errorColor = "rgb(133, 20, 31)";
const initialValues = {
    email: '',
    password: ''
};

export default SignInTab;

const styles = StyleSheet.create({
    scrollView: {
        paddingVertical: 15
    },
    icon: {
        marginRight: 10
    },
    eye: {
        marginLeft: 10
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