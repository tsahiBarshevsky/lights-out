import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { primary, secondary } from '../../utils/theme';

const ReservationCard = ({ item, index }) => {
    const navigation = useNavigation();
    const movies = useSelector(state => state.movies);

    const findMoviePoster = (id) => {
        return movies.find((movie) => movie._id === id).posterPath;
    }

    return (
        <View style={styles.cardContainer}>
            <View style={styles.header}>
                <Image
                    source={{ uri: `https://image.tmdb.org/t/p/original/${findMoviePoster(item.movie.id)}` }}
                    style={styles.poster}
                    resizeMode="stretch"
                />
                <View style={{ flex: 1 }}>
                    <View style={styles.reservation}>
                        <Text style={styles.text}>#{item.orderID}</Text>
                        <Text style={styles.reservationDate}>{moment(item.reservationDate).format('DD/MM/YY HH:mm')}</Text>
                    </View>
                    <Text style={styles.title}>{item.movie.title}</Text>
                    <Text style={[styles.text, styles.subtitle]}>
                        {moment(item.date).format('DD/MM/YY HH:mm')}
                    </Text>
                    <Text style={[styles.text, styles.subtitle]}>
                        {item.seats.length} seats
                    </Text>
                </View>
            </View>
            <View style={styles.buttons}>
                {item.active && moment(new Date()).isBefore(moment(item.date)) &&
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Cancelation', { reservation: item, location: index })}
                        style={[styles.button, styles.cancel]}
                        activeOpacity={1}
                    >
                        <Text style={[styles.buttonCaption, styles.cancelCaption]}>
                            Cancel Reservation
                        </Text>
                    </TouchableOpacity>
                }
                {item.active && moment(new Date()).isBefore(moment(item.date)) &&
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Ticket', { ticket: item })}
                        style={[styles.button, styles.ticket]}
                        activeOpacity={1}
                    >
                        <Text style={styles.buttonCaption}>View Tickets</Text>
                    </TouchableOpacity>
                }
            </View>
        </View>
    )
}

export default ReservationCard

const styles = StyleSheet.create({
    cardContainer: {
        backgroundColor: secondary,
        padding: 10,
        marginHorizontal: 15,
        borderRadius: 15
    },
    text: {
        fontFamily: 'Poppins',
        color: 'white'
    },
    title: {
        fontFamily: 'PoppinsBold',
        color: 'white'
    },
    subtitle: {
        fontSize: 11,
        marginBottom: -5
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        marginBottom: 15
    },
    poster: {
        width: 55,
        height: 80,
        borderRadius: 7,
        marginRight: 10
    },
    reservation: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end'
    },
    reservationDate: {
        fontFamily: 'Poppins',
        fontSize: 10,
        color: '#acacac',
        transform: [{ translateY: -2 }]
    },
    buttons: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    button: {
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: primary,
        width: '48%',
        height: 32,
        borderRadius: 50,
        elevation: 1
    },
    buttonCaption: {
        fontFamily: 'Poppins',
        fontSize: 13,
        transform: [{ translateY: 1 }]
    },
    cancel: {
        backgroundColor: '#33383f'
    },
    cancelCaption: {
        color: 'white'
    },
    ticket: {
        backgroundColor: primary
    }
});