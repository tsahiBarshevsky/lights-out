import React, { useRef, useState } from 'react';
import { Formik, ErrorMessage } from 'formik';
import { Fontisto, FontAwesome, MaterialIcons, AntDesign, Entypo } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';
import { authentication } from '../../utils/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import * as ImagePicker from 'expo-image-picker';
import { BallIndicator } from 'react-native-indicators';
import { localhost } from '../../utils/utilities';
import { globalStyles } from '../../utils/globalStyles';
import { registrationSchema } from '../../utils/schemas';
import { background, error, primary } from '../../utils/theme';

// React Native components
import {
    StyleSheet,
    TextInput,
    View,
    ScrollView,
    KeyboardAvoidingView,
    TouchableOpacity,
    Text,
    Keyboard,
    Image
} from 'react-native';
import config from '../../utils/config';

const SignUpTab = () => {
    const [disabled, setDisabled] = useState(false);
    const [image, setImage] = useState(null);
    const [passwordVisibilty, setPasswordVisibilty] = useState(true);
    const dispatch = useDispatch();
    const firstNameRef = useRef(null);
    const lastNameRef = useRef(null);
    const passwordRef = useRef(null);
    const phoneRef = useRef(null);

    const createUser = (user, url, publicID) => {
        createUserWithEmailAndPassword(authentication, user.email.trim(), user.password)
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
                            email: user.email.trim(),
                            phone: user.phone,
                            firstName: user.firstName.trim(),
                            lastName: user.lastName.trim(),
                            image: url && publicID ? {
                                url: url,
                                public_id: publicID
                            } : {}
                        })
                    })
                    .then((res) => res.json())
                    .then((res) => {
                        dispatch({
                            type: 'SET_USER', user: {
                                _id: res,
                                uid: authentication.currentUser.uid,
                                email: user.email.trim(),
                                phone: user.phone,
                                firstName: user.firstName.trim(),
                                lastName: user.lastName.trim(),
                                image: url && publicID ? {
                                    url: url,
                                    public_id: publicID
                                } : {}
                            }
                        });
                    })
                    .catch((error) => {
                        console.log('error', error.message);
                        setDisabled(false);
                    });

            })
            .catch((error) => {
                console.log(error.message);
                setDisabled(false);
            });
    }

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1
        });
        if (!result.cancelled)
            setImage(result.uri);
    }

    const onSignUp = (values) => {
        Keyboard.dismiss();
        setDisabled(true);
        if (image) {
            const newFile = {
                uri: image,
                type: `test/${image.split(".")[1]}`,
                name: `test.${image.split(".")[1]}`
            }
            const data = new FormData();
            data.append('file', newFile);
            data.append('upload_preset', 'whatToWear');
            data.append('folder', 'Lights Out');
            data.append('cloud_name', config.CLOUDINARY_KEY);
            fetch(`https://api.cloudinary.com/v1_1/${config.CLOUDINARY_KEY}/image/upload`, {
                method: 'POST',
                body: data
            })
                .then((res) => res.json())
                .then((data) => {
                    console.log('Image uploaded');
                    createUser(values, data.url, data.public_id);
                });

        }
        else {
            values.image = {};
            createUser(values, null, null);
        }
    }

    return (
        <ScrollView
            keyboardShouldPersistTaps="always"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollView}
        >
            <View style={styles.imageWrapper}>
                <View style={styles.image}>
                    {image ?
                        <Image source={{ uri: image }} style={{ width: '100%', height: '100%' }} />
                        :
                        <AntDesign name='user' size={80} color='white' />
                    }
                </View>
                <TouchableOpacity
                    activeOpacity={1}
                    style={styles.picker}
                    onPress={pickImage}
                >
                    {image ?
                        <MaterialIcons name="edit" size={15} color={background} />
                        :
                        <Entypo name="camera" size={12} color={background} />
                    }
                </TouchableOpacity>
            </View>
            <KeyboardAvoidingView
                enabled
                behavior={Platform.OS === 'ios' ? 'padding' : null}
            >
                <Formik
                    initialValues={initialValues}
                    enableReinitialize
                    onSubmit={(values) => onSignUp(values)}
                    validationSchema={registrationSchema}
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
                                        returnKeyType='next'
                                        onSubmitEditing={() => firstNameRef.current?.focus()}
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
                                <View style={[globalStyles.textInputWrapper, errors.firstName && globalStyles.error]}>
                                    <AntDesign
                                        name="user"
                                        size={14}
                                        color={errors.firstName ? error : "white"}
                                        style={styles.icon}
                                    />
                                    <TextInput
                                        placeholder='First name...'
                                        value={values.firstName}
                                        ref={firstNameRef}
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
                                    <AntDesign
                                        name="user"
                                        size={14}
                                        color={errors.lastName ? error : "white"}
                                        style={styles.icon}
                                    />
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
                                        onSubmitEditing={() => phoneRef.current?.focus()}
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
                                <View style={[globalStyles.textInputWrapper, errors.phone && globalStyles.error]}>
                                    <FontAwesome
                                        name="phone"
                                        size={14}
                                        color={errors.phone ? error : "white"}
                                        style={styles.icon}
                                    />
                                    <TextInput
                                        placeholder='Phone...'
                                        value={values.phone}
                                        ref={phoneRef}
                                        onChangeText={handleChange('phone')}
                                        underlineColorAndroid="transparent"
                                        placeholderTextColor='rgba(255, 255, 255, 0.35)'
                                        selectionColor='white'
                                        keyboardType="phone-pad"
                                        blurOnSubmit={false}
                                        onBlur={handleBlur('phone')}
                                        onSubmitEditing={handleSubmit}
                                        style={globalStyles.textInput}
                                        maxLength={10}
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
                                <TouchableOpacity
                                    onPress={handleSubmit}
                                    style={styles.button}
                                    activeOpacity={1}
                                    disabled={disabled}
                                >
                                    {disabled ?
                                        <BallIndicator size={18} count={8} color='black' />
                                        :
                                        <Text style={styles.buttonCaption}>Sign Up</Text>
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
    password: '',
    firstName: '',
    lastName: '',
    phone: ''
};

export default SignUpTab;

const styles = StyleSheet.create({
    scrollView: {
        paddingVertical: 15
    },
    imageWrapper: {
        width: 100,
        height: 100,
        alignSelf: 'center',
        marginVertical: 10
    },
    image: {
        justifyContent: 'flex-end',
        alignItems: 'center',
        width: 100,
        height: 100,
        borderRadius: 50,
        overflow: 'hidden',
        backgroundColor: '#444549',
        alignSelf: 'center',
    },
    picker: {
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 2,
        right: 2,
        zIndex: 1,
        width: 25,
        height: 25,
        borderRadius: 25 / 2,
        backgroundColor: primary
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