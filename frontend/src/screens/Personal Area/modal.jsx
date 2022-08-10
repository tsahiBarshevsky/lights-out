import React from 'react';
import { StyleSheet, Text, View, TextInput, Dimensions, Keyboard, TouchableOpacity } from 'react-native';
import Modal from "react-native-modal";
import { Formik } from 'formik';
import { useDispatch } from 'react-redux';
import { updatePersonalDeatil } from '../../redux/actions/user';
import { localhost } from '../../utils/utilities';

const { width } = Dimensions.get('window');

// first name - require, no numbers
// last name - require, no numbers
// phone - match with regex, require

const EditingModal = (props) => {
    const { isModalVisible, setIsModalVisible, user, field } = props;
    const dispatch = useDispatch();

    const onBackdropPress = () => {
        Keyboard.dismiss();
        setIsModalVisible(false);
    }

    const onEditPersonalDetail = (values) => {
        Keyboard.dismiss();
        const value = Object.values(values)[0];
        fetch(`http://${localhost}/update-user-detail?userID=${user._id}`,
            {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    value: value,
                    field: field
                })
            })
            .then((res) => res.json())
            .then((res) => console.log('message', res))
            .then(() => {
                dispatch(updatePersonalDeatil(field, value));
                setIsModalVisible(false);
            });
    }

    const renderForm = () => {
        switch (field) {
            case 'firstName':
                return (
                    <Formik
                        initialValues={{ firstName: user.firstName }}
                        enableReinitialize
                        onSubmit={(values) => onEditPersonalDetail(values)}
                    >
                        {({ handleChange, handleSubmit, values, errors, setErrors, touched }) => {
                            return (
                                <View style={{ paddingHorizontal: 15 }}>
                                    <View style={styles.textInputWrapper}>
                                        <TextInput
                                            placeholder='First name...'
                                            value={values.firstName}
                                            onChangeText={handleChange('firstName')}
                                            underlineColorAndroid="transparent"
                                            placeholderTextColor='black'
                                            selectionColor='black'
                                            blurOnSubmit={false}
                                            onSubmitEditing={handleSubmit}
                                            style={styles.textInput}
                                        />
                                    </View>
                                    <TouchableOpacity
                                        onPress={handleSubmit}
                                        style={styles.button}
                                    >
                                        <Text>Save Changes</Text>
                                    </TouchableOpacity>
                                </View>
                            )
                        }}
                    </Formik>
                );
            case 'lastName':
                return (
                    <Formik
                        initialValues={{ lastName: user.lastName }}
                        enableReinitialize
                        onSubmit={(values) => onEditPersonalDetail(values)}
                    >
                        {({ handleChange, handleSubmit, values, errors, setErrors, touched }) => {
                            return (
                                <View style={{ paddingHorizontal: 15 }}>
                                    <View style={styles.textInputWrapper}>
                                        <TextInput
                                            placeholder='Last name...'
                                            value={values.lastName}
                                            onChangeText={handleChange('lastName')}
                                            underlineColorAndroid="transparent"
                                            placeholderTextColor='black'
                                            selectionColor='black'
                                            blurOnSubmit={false}
                                            onSubmitEditing={handleSubmit}
                                            style={styles.textInput}
                                        />
                                    </View>
                                    <TouchableOpacity
                                        onPress={handleSubmit}
                                        style={styles.button}
                                    >
                                        <Text>Save Changes</Text>
                                    </TouchableOpacity>
                                </View>
                            )
                        }}
                    </Formik>
                );
            case 'phone':
                return (
                    <Formik
                        initialValues={{ phone: user.phone }}
                        enableReinitialize
                        onSubmit={(values) => onEditPersonalDetail(values)}
                    >
                        {({ handleChange, handleSubmit, values, errors, setErrors, touched }) => {
                            return (
                                <View style={{ paddingHorizontal: 15 }}>
                                    <View style={styles.textInputWrapper}>
                                        <TextInput
                                            placeholder='Phone...'
                                            value={values.phone}
                                            onChangeText={handleChange('phone')}
                                            underlineColorAndroid="transparent"
                                            placeholderTextColor='black'
                                            selectionColor='black'
                                            onSubmitEditing={handleSubmit}
                                            style={styles.textInput}
                                            keyboardType='number-pad'
                                            maxLength={10}
                                        />
                                    </View>
                                    <TouchableOpacity
                                        onPress={handleSubmit}
                                        style={styles.button}
                                    >
                                        <Text>Save Changes</Text>
                                    </TouchableOpacity>
                                </View>
                            )
                        }}
                    </Formik>
                );
            default:
                return null;
        }
    }

    return (
        <Modal
            isVisible={isModalVisible}
            onBackdropPress={onBackdropPress}
            animationIn={"fadeIn"}
            animationOut={"fadeOut"}
            animationInTiming={500}
            animationOutTiming={250}
            useNativeDriver
        >
            <View style={styles.modalContainer}>
                {renderForm()}
            </View>
        </Modal>
    )
}

export default EditingModal;

const styles = StyleSheet.create({
    modalContainer: {
        width: width * 0.7,
        alignSelf: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 15,
        paddingVertical: 10
    },
    textInputWrapper: {
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        paddingHorizontal: 10,
        paddingVertical: 5,
        backgroundColor: 'lightblue',
        width: width * 0.62,
        marginBottom: 10
    },
    textInput: {
        justifyContent: 'flex-start',
        width: '100%'
    },
    button: {
        backgroundColor: 'green'
    }
});