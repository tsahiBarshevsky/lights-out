import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native';
import Modal from "react-native-modal";
import { background, primary } from '../../utils/theme';

const { width } = Dimensions.get('window');

const WarningModal = (props) => {
    const { isModalVisible, setIsModalVisible, onCancel, caption } = props;

    return (
        <Modal
            isVisible={isModalVisible}
            onBackdropPress={() => setIsModalVisible(false)}
            animationIn={"fadeIn"}
            animationOut={"fadeOut"}
            animationInTiming={500}
            animationOutTiming={250}
            useNativeDriver
        >
            <View style={styles.modalContainer}>
                <Text style={[styles.title, styles.text, styles.textWhite]}>
                    Are you sure you want to {caption}
                </Text>
                <TouchableOpacity
                    onPress={onCancel}
                    style={[styles.button, styles.yellow]}
                    activeOpacity={1}
                >
                    <Text style={styles.text}>Yes</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => setIsModalVisible(false)}
                    style={[styles.button, styles.grey]}
                    activeOpacity={1}
                >
                    <Text style={[styles.text, styles.textWhite]}>No</Text>
                </TouchableOpacity>
            </View>
        </Modal>
    )
}

export default WarningModal;

const styles = StyleSheet.create({
    modalContainer: {
        width: width * 0.75,
        alignSelf: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 15,
        paddingVertical: 10,
        paddingHorizontal: 10,
        backgroundColor: background
    },
    text: {
        fontFamily: 'Poppins'
    },
    textWhite: {
        color: 'white'
    },
    title: {
        fontSize: 15
    },
    button: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: 38,
        backgroundColor: 'white',
        borderRadius: 25
    },
    yellow: {
        backgroundColor: primary,
        marginVertical: 10
    },
    grey: {
        backgroundColor: '#33383f'
    }
});