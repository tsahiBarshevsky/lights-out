import React from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Header } from '../../components';
import { globalStyles } from '../../utils/globalStyles';

const ConfirmationScreen = ({ route }) => {
    const { reservation, movie } = route.params;
    const navigation = useNavigation();

    return (
        <SafeAreaView style={globalStyles.container}>
            <Header
                caption={"Reservation Summary"}
                backFunction={() => navigation.popToTop()}
            />
        </SafeAreaView>
    )
}

export default ConfirmationScreen;

const styles = StyleSheet.create({});