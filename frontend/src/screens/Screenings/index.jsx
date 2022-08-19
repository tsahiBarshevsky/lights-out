import React, { useState } from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { LinearGradient } from 'expo-linear-gradient';
import moment from 'moment';
import { globalStyles } from '../../utils/globalStyles';
import { Header, WarningModal } from '../../components';
import { primary, background } from '../../utils/theme';

const ScreeningsScreen = ({ route }) => {
    const { movie, movieScreenings } = route.params;
    const [id, setId] = useState('');
    const [screening, setScreening] = useState({});
    const [isModalVisible, setIsModalVisible] = useState(false);
    const screenings = useSelector(state => state.screenings);
    const navigation = useNavigation();

    const onSelectScreening = (item) => {
        if (item._id !== id) {
            setId(item._id);
            setScreening(screenings.find((screening) => screening._id === item._id));
        }
        else {
            setId('');
            setScreening({});
        }
    }

    const onChooseScreening = () => {
        navigation.navigate('Hall', { movie, screening });
    }

    const onCancelReservation = () => {
        setIsModalVisible(false);
        setTimeout(() => {
            navigation.goBack();
        }, 500);
    }

    return (
        <>
            <SafeAreaView style={globalStyles.container}>
                <View style={styles.headerWrapper}>
                    <Header
                        caption={"Select Screening"}
                        backFunction={() => navigation.goBack()}
                    />
                </View>
                <View style={styles.linearGradientWrapper}>
                    <Image
                        source={{ uri: `https://image.tmdb.org/t/p/original/${movie.backdropPath}` }}
                        style={styles.image}
                        blurRadius={5}
                    />
                    <LinearGradient
                        colors={[background, 'transparent', background]}
                        style={styles.linearGradient}
                    />
                </View>
                <View style={styles.wrapper}>
                    <Image
                        source={{ uri: `https://image.tmdb.org/t/p/original/${movie.posterPath}` }}
                        style={styles.poster}
                        resizeMode="center"
                    />
                    {Object.keys(movieScreenings).map((hall) => {
                        return (
                            <View key={hall}>
                                <Text style={styles.text}>
                                    Hall {hall} - {movieScreenings[hall][0].hall.type}
                                </Text>
                                <FlatList
                                    horizontal
                                    data={movieScreenings[hall]}
                                    keyExtractor={(item) => item._id}
                                    showsHorizontalScrollIndicator={false}
                                    renderItem={({ item }) => {
                                        return (
                                            <TouchableOpacity
                                                onPress={() => onSelectScreening(item)}
                                                activeOpacity={1}
                                                disabled={moment(item.date).isBefore(moment(new Date()))}
                                                style={[
                                                    styles.hourButton,
                                                    id === item._id && styles.selectedHour,
                                                    moment(item.date).isBefore(moment(new Date())) && styles.disabledHourButton
                                                ]}
                                            >
                                                <Text
                                                    style={[
                                                        styles.text,
                                                        { transform: [{ translateY: 2 }] },
                                                        id === item._id && styles.selectedHourText
                                                    ]}
                                                >
                                                    {moment(item.date).format('HH:mm')}
                                                </Text>
                                            </TouchableOpacity>
                                        )
                                    }}
                                    ItemSeparatorComponent={() => <View style={{ marginHorizontal: 5 }} />}
                                    style={styles.hours}
                                />
                            </View>
                        )
                    })}
                    <TouchableOpacity
                        onPress={onChooseScreening}
                        style={[styles.button, id === '' && styles.disabled]}
                        activeOpacity={1}
                        disabled={id === ''}
                    >
                        <Text style={styles.buttonCaption}>Select Seats</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
            <WarningModal
                isModalVisible={isModalVisible}
                setIsModalVisible={setIsModalVisible}
                onCancel={onCancelReservation}
                caption="cancel your reservation?"
            />
        </>
    )
}

export default ScreeningsScreen;

const styles = StyleSheet.create({
    text: {
        color: 'white',
        fontFamily: 'Poppins'
    },
    headerWrapper: {
        position: 'absolute',
        top: 0,
        width: '100%',
        zIndex: 2
    },
    linearGradientWrapper: {
        zIndex: 1,
        marginTop: 10
    },
    linearGradient: {
        position: 'absolute',
        top: 0,
        width: '100%',
        height: '100%'
    },
    image: {
        height: 200,
        width: '100%',
        opacity: 0.6
    },
    wrapper: {
        flex: 1,
        paddingHorizontal: 15
    },
    poster: {
        width: 55,
        height: 80,
        borderRadius: 7,
        marginTop: -55,
        zIndex: 2
    },
    hours: {
        flexGrow: 0,
        marginTop: 10,
        marginBottom: 15
    },
    hourButton: {
        paddingHorizontal: 13,
        paddingVertical: 5,
        borderRadius: 10,
        borderWidth: 1.5,
        borderColor: '#4d4c4c',
        backgroundColor: '#4d4c4c',
        elevation: 1
    },
    disabledHourButton: {
        backgroundColor: 'grey',
        borderColor: 'grey'
    },
    selectedHour: {
        borderColor: primary
    },
    selectedHourText: {
        color: primary
    },
    button: {
        position: 'absolute',
        bottom: 15,
        width: '100%',
        height: 38,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: primary,
        alignSelf: 'center',
        borderRadius: 50,
        elevation: 1
    },
    buttonCaption: {
        fontFamily: 'PoppinsBold',
        transform: [{ translateY: 2 }]
    },
    disabled: {
        backgroundColor: 'grey'
    }
});