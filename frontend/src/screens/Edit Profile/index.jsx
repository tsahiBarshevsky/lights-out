import React, { useState, useRef, useCallback } from 'react';
import { AntDesign, MaterialIcons, Entypo } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, ErrorMessage } from 'formik';
import { BallIndicator } from 'react-native-indicators';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { Header, WarningModal } from '../../components';
import { globalStyles } from '../../utils/globalStyles';
import { background, primary } from '../../utils/theme';
import { editingSchema } from '../../utils/schemas';
import { updatePersonalDeatil } from '../../redux/actions/user';
import { localhost } from '../../utils/utilities';
import config from '../../utils/config';

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
    Keyboard,
    BackHandler
} from 'react-native';

const EditProfileScreen = () => {
    const [disabled, setDisabled] = useState(false);
    const [image, setImage] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const user = useSelector(state => state.user);
    const formRef = useRef(null);
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

    const renderImage = () => {
        if (Object.keys(user.image).length > 0) {
            if (image)
                return (
                    <Image
                        source={{ uri: image }}
                        style={{ width: '100%', height: '100%' }}
                    />
                );
            else
                return (
                    <Image
                        source={{ uri: user.image.url }}
                        style={{ width: '100%', height: '100%' }}
                    />
                );
        }
        else {
            if (image)
                return (
                    <Image
                        source={{ uri: image }}
                        style={{ width: '100%', height: '100%' }}
                    />
                );
            else
                return <AntDesign name='user' size={80} color='white' />;
        }
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
                onPress={pickImage}
            >
                <Entypo name="camera" size={12} color={background} />
            </TouchableOpacity>
        );
    }

    const updateDatabase = (firstName, lastName, phone, url, publicID) => {
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
                    phone: phone,
                    image: url && publicID ? {
                        url: url,
                        public_id: publicID
                    } : user.image
                })
            })
            .then((res) => res.json())
            .then((res) => {
                console.log(res);
                const image = url && publicID ? {
                    url: url,
                    public_id: publicID
                } : user.image;
                dispatch(updatePersonalDeatil(firstName, lastName, phone, image));
                setTimeout(() => {
                    navigation.goBack();
                }, 200);
            })
            .catch((error) => {
                console.log('error', error);
                setDisabled(false);
            });
    }

    const onEditProfile = (values) => {
        const { firstName, lastName, phone } = values;
        setDisabled(true);
        Keyboard.dismiss();
        if (image) {
            if (Object.keys(user.image).length > 0) {
                // Delete existing image from Cloudinary and upload new one
                fetch(`https://cloudinary-management.herokuapp.com/delete-image?public_id=${user.image.public_id}`)
                    .then((res) => res.json())
                    .then((res) => {
                        console.log(res);
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
                                updateDatabase(firstName, lastName, phone, data.url, data.public_id);
                            });
                    })
                    .catch((error) => console.log("error: ", error.message));
            }
            else {
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
                        updateDatabase(firstName, lastName, phone, data.url, data.public_id);
                    });
            }
        }
        else
            updateDatabase(firstName, lastName, phone, null, null);
    }

    const onCancelEdit = () => {
        setIsModalVisible(false);
        setTimeout(() => {
            navigation.goBack();
        }, 500);
    }

    useFocusEffect(
        useCallback(() => {
            const onBackPressed = () => {
                const { firstName, lastName, phone } = formRef.current?.values;
                if (
                    firstName !== user.firstName ||
                    lastName !== user.lastName ||
                    phone !== user.phone ||
                    image
                )
                    setIsModalVisible(true);
                else
                    navigation.goBack();
                return true;
            };
            BackHandler.addEventListener('hardwareBackPress', onBackPressed);
            return () =>
                BackHandler.removeEventListener('hardwareBackPress', onBackPressed);
        }, [formRef.current?.values])
    );

    return (
        <>
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
                        <TouchableOpacity
                            activeOpacity={1}
                            style={styles.picker}
                            onPress={pickImage}
                        >
                            {image || Object.keys(user.image).length > 0 ?
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
                            innerRef={formRef}
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
            <WarningModal
                isModalVisible={isModalVisible}
                setIsModalVisible={setIsModalVisible}
                onCancel={onCancelEdit}
                caption="cancel editing?"
            />
        </>
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