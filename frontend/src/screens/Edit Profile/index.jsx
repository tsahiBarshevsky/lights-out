import React, { useState, useRef } from 'react';
import { AntDesign, MaterialIcons, Entypo } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, ErrorMessage } from 'formik';
import { BallIndicator } from 'react-native-indicators';
import { useNavigation } from '@react-navigation/native';
import { Header } from '../../components';
import { globalStyles } from '../../utils/globalStyles';
import { background, primary } from '../../utils/theme';
import { editingSchema } from '../../utils/schemas';
import { updatePersonalDeatil } from '../../redux/actions/user';
import { localhost } from '../../utils/utilities';

// React Native components
import {
    SafeAreaView,
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    KeyboardAvoidingView,
    ScrollView,
    TextInput,
    Keyboard
} from 'react-native';

const EditProfileScreen = () => {
    const user = useSelector(state => state.user);
    const [disabled, setDisabled] = useState(false);
    const firstNameRef = useRef(null);
    const lastNameRef = useRef(null);
    const phoneRef = useRef(null);
    const dispatch = useDispatch();
    const navigation = useNavigation();

    const initialValues = {
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone
    };

    const renderImage = () => {
        if (Object.keys(user).length > 0) {
            if (Object.keys(user.image).length > 0)
                return (
                    <Image
                        source={{ uri: user.image.url }}
                        style={{ width: '100%', height: '100%' }}
                    />
                );
        }
        return <AntDesign name='user' size={80} color='white' />;
    }

    const renderPickerButton = () => {
        if (Object.keys(user).length > 0) {
            if (Object.keys(user.image).length > 0)
                return (
                    <TouchableOpacity
                        activeOpacity={1}
                        style={styles.picker}
                        onPress={() => console.log('edit image')}
                    >
                        <MaterialIcons name="edit" size={15} color={background} />
                    </TouchableOpacity>
                );
        }
        return (
            <TouchableOpacity
                activeOpacity={1}
                style={styles.picker}
                onPress={() => console.log('add image')}
            >
                <Entypo name="camera" size={12} color={background} />
            </TouchableOpacity>
        );
    }

    const onEditProfile = (values) => {
        const { firstName, lastName, phone } = values;
        setDisabled(true);
        Keyboard.dismiss();
        fetch(`http://${localhost}/update-user-detail?userID=${user._id}`,
            {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    firstName: firstName,
                    lastName: lastName,
                    phone: phone
                })
            })
            .then((res) => res.json())
            .then((res) => {
                console.log(res);
                dispatch(updatePersonalDeatil(firstName, lastName, phone));
                setTimeout(() => {
                    navigation.goBack();
                }, 200);
            })
            .catch((error) => {
                console.log('error', error);
                setDisabled(false);
            });
    }

    return (
        <SafeAreaView style={globalStyles.container}>
            <Header caption={"Edit Profile"} />
            <ScrollView
                keyboardShouldPersistTaps="always"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollView}
            >
                <View style={styles.imageWrapper}>
                    <View style={styles.image}>
                        {renderImage()}
                    </View>
                    {renderPickerButton()}
                </View>
                <KeyboardAvoidingView
                    enabled
                    behavior={Platform.OS === 'ios' ? 'padding' : null}
                >
                    <Formik
                        initialValues={initialValues}
                        enableReinitialize
                        onSubmit={(values) => onEditProfile(values)}
                        validationSchema={editingSchema}
                        validateOnChange={false}
                        validateOnBlur={false}
                    >
                        {({ handleChange, handleBlur, handleSubmit, values, errors }) => {
                            return (
                                <View style={{ paddingHorizontal: 15 }}>
                                    <Text style={styles.title}>First Name</Text>
                                    <View style={[globalStyles.textInputWrapper, errors.firstName && globalStyles.error]}>
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
                                    <Text style={styles.title}>Last Name</Text>
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
                                    <Text style={styles.title}>Phone</Text>
                                    <View style={[globalStyles.textInputWrapper, errors.phone && globalStyles.error]}>
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
                                            <Text style={styles.buttonCaption}>
                                                Save Changes
                                            </Text>
                                        }
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

export default EditProfileScreen;

const styles = StyleSheet.create({
    imageWrapper: {
        width: 100,
        height: 100,
        marginTop: 10,
        alignSelf: 'center'
    },
    image: {
        justifyContent: 'flex-end',
        alignItems: 'center',
        width: 100,
        height: 100,
        borderRadius: 50,
        overflow: 'hidden',
        backgroundColor: '#444549',
        alignSelf: 'center'
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