import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native';
import Modal from "react-native-modal";

const { width } = Dimensions.get('window');

const WraningModal = (props) => {
    const { isModalVisible, setIsModalVisible, onCancelReservation } = props;

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
                <Text>Cancel reservation, are you sure?</Text>
                <TouchableOpacity
                    onPress={onCancelReservation}
                >
                    <Text>Yes</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => setIsModalVisible(false)}
                >
                    <Text>No</Text>
                </TouchableOpacity>
            </View>
        </Modal>
    )
}

export default WraningModal;

const styles = StyleSheet.create({
    modalContainer: {
        width: width * 0.7,
        alignSelf: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 15,
        paddingVertical: 10,
        paddingHorizontal: 15
    }
});