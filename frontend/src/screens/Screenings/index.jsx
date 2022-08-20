import React, { useState } from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, View, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { LinearGradient } from 'expo-linear-gradient';
import moment from 'moment';
import { globalStyles } from '../../utils/globalStyles';
import { Header, WarningModal } from '../../components';
import { primary, background } from '../../utils/theme';
import { convertMinutesToHours } from '../../utils/utilities';

const ScreeningsScreen = ({ route }) => {
    const { movie, movieScreenings } = route.params;
    // console.log('movie.language', movie.language)
    // console.log('movie.certification', movie.certification)
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
                    <View style={styles.header}>
                        <Image
                            source={{ uri: `https://image.tmdb.org/t/p/original/${movie.posterPath}` }}
                            style={styles.poster}
                            resizeMode="center"
                        />
                        <View style={{ flex: 1 }}>
                            <Text style={styles.title}>{movie.title}</Text>
                            <View style={{ marginTop: 10 }}>
                                <View style={styles.certificationWrapper}>
                                    <Text style={styles.certification}>
                                        {movie.certification}
                                    </Text>
                                </View>
                                <Text style={[styles.text, { fontSize: 12 }]}>
                                    {movie.language}, {convertMinutesToHours(movie.duration)}
                                </Text>
                            </View>
                        </View>
                    </View>
                    {Object.keys(movieScreenings).map((hall) => {
                        const type = movieScreenings[hall][0].hall.type;
                        return (
                            <View key={hall}>
                                <Text style={styles.text}>
                                    Hall {hall} -  <Text style={[styles.text, type === 'IMAX' && styles.imax]}>{type}</Text>
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
    imax: {
        fontFamily: 'Imax'
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
    header: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        marginTop: -55,
        marginBottom: 10,
        zIndex: 2
    },
    poster: {
        width: 55,
        height: 80,
        borderRadius: 7,
        marginRight: 15
    },
    certificationWrapper: {
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'flex-start',
        paddingHorizontal: 12,
        paddingVertical: 2,
        marginBottom: 2,
        borderRadius: 7,
        backgroundColor: primary,
    },
    certification: {
        fontFamily: 'Poppins',
        fontSize: 12,
        color: 'black',
        transform: [{ translateY: 1 }]
    },
    title: {
        fontFamily: 'BebasNeue',
        fontSize: 22,
        flexShrink: 1,
        color: 'white',
        lineHeight: 25
    },
    hours: {
        flexGrow: 0,
        marginTop: 2,
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
        backgroundColor: '#2e2e37',
        borderColor: '#2e2e37'
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