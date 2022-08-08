import React from 'react';
import { SafeAreaView, StyleSheet, Text, View, Image, FlatList } from 'react-native';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { globalStyles } from '../../utils/globalStyles';
import { ticketPrice } from '../../utils/utilities';

const TicketScreen = ({ route }) => {
    const { ticket } = route.params;
    const movies = useSelector(state => state.movies);
    const screenings = useSelector(state => state.screenings);
    const screening = screenings.find((screening) => screening._id === ticket.screeningID);

    const findMoviePoster = (id) => {
        return movies.find((movie) => movie._id === id).backdropPath;
    }


    const Separator = () => (
        <View style={styles.separator} />
    );

    return (
        <SafeAreaView style={globalStyles.container}>
            <FlatList
                data={ticket.seats}
                keyExtractor={(item, index) => index}
                ItemSeparatorComponent={Separator}
                contentContainerStyle={{ paddingHorizontal: 15, paddingBottom: 15 }}
                renderItem={({ item }) => {
                    return (
                        <View style={styles.ticketContainer}>
                            <View style={styles.poster}>
                                <Image
                                    source={{ uri: `https://image.tmdb.org/t/p/original/${findMoviePoster(ticket.movie.id)}` }}
                                    style={styles.image}
                                />
                            </View>
                            <View style={styles.wrapper}>
                                <Text style={styles.movie}>{ticket.movie.title}</Text>
                                <View style={styles.inforamtionContainer}>
                                    <View style={[styles.information, styles.space]}>
                                        <Text style={styles.title}>Date</Text>
                                        <Text style={styles.value}>{moment(screening.date).format('D/M/YY')}</Text>
                                    </View>
                                    <View style={[styles.information, styles.space]}>
                                        <Text style={styles.title}>Time</Text>
                                        <Text style={styles.value}>{moment(screening.date).format('HH:mm')}</Text>
                                    </View>
                                    <View style={[styles.information, styles.space]}>
                                        <Text style={styles.title}>Hall</Text>
                                        <Text style={styles.value}>{screening.hall}</Text>
                                    </View>
                                    <View style={styles.information}>
                                        <Text style={styles.title}>Line</Text>
                                        <Text style={styles.value}>{item.line}</Text>
                                    </View>
                                    <View style={styles.information}>
                                        <Text style={styles.title}>Seat</Text>
                                        <Text style={styles.value}>{item.number + 1}</Text>
                                    </View>
                                </View>
                                <View style={styles.divider} />
                                <View style={styles.order}>
                                    <View>
                                        <Text style={styles.title}>Order ID</Text>
                                        <Text style={styles.value}>{ticket.orderID}</Text>
                                    </View>
                                    <View>
                                        <Text style={styles.title}>Price</Text>
                                        <Text style={styles.value}>{ticketPrice}₪</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    )
                }}
            />
        </SafeAreaView>
    )
}

export default TicketScreen;

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 15
    },
    ticketContainer: {
        backgroundColor: 'white',
        borderRadius: 15
    },
    wrapper: {
        paddingTop: 20,
        paddingHorizontal: 15,
        paddingBottom: 10
    },
    poster: {
        width: '100%',
        height: 120,
        overflow: 'hidden'
    },
    image: {
        ...StyleSheet.absoluteFillObject,
        borderTopRightRadius: 15,
        borderTopLeftRadius: 15
    },
    separator: {
        marginVertical: 10
    },
    movie: {
        fontSize: 20,
        flexShrink: 1,
        marginBottom: 10
    },
    inforamtionContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexWrap: 'wrap'
    },
    information: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '33.3%',
    },
    space: {
        paddingBottom: 15
    },
    title: {
        color: '#acacac',
        fontWeight: 'bold',
        fontSize: 15,
        marginBottom: 2
    },
    value: {
        fontSize: 17
    },
    divider: {
        width: '100%',
        height: 1,
        backgroundColor: '#9c9c9c',
        marginVertical: 25
    },
    order: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    }
});