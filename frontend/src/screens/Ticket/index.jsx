import React from 'react';
import { SafeAreaView, StyleSheet, Text, View, Image, FlatList, Dimensions } from 'react-native';
import { useSelector } from 'react-redux';
import moment from 'moment';
import Barcode from '@kichiyaki/react-native-barcode-generator';
import { globalStyles } from '../../utils/globalStyles';
import { Header } from '../../components';
import { background, secondary } from '../../utils/theme';

const { width } = Dimensions.get('window');

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
            <Header caption={ticket.seats.length === 1 ? "Ticket" : "Tickets"} />
            <FlatList
                data={ticket.seats}
                keyExtractor={(item, index) => index}
                ItemSeparatorComponent={Separator}
                contentContainerStyle={styles.flatList}
                renderItem={({ item }) => {
                    return (
                        <>
                            <View style={styles.ticketUpperContainer}>
                                <View style={styles.poster}>
                                    <Image
                                        source={{ uri: `https://image.tmdb.org/t/p/original/${findMoviePoster(ticket.movie.id)}` }}
                                        style={styles.image}
                                    />
                                </View>
                                <View style={styles.wrapper}>
                                    <Text style={[styles.movie, styles.text]}>{ticket.movie.title}</Text>
                                    <View style={styles.inforamtionContainer}>
                                        <View style={[styles.information, styles.space]}>
                                            <Text style={styles.title}>Date</Text>
                                            <Text style={[styles.value, styles.text]}>{moment(screening.date).format('D/M/YY')}</Text>
                                        </View>
                                        <View style={[styles.information, styles.space]}>
                                            <Text style={[styles.title]}>Time</Text>
                                            <Text style={[styles.value, styles.text]}>{moment(screening.date).format('HH:mm')}</Text>
                                        </View>
                                        <View style={[styles.information, styles.space]}>
                                            <Text style={styles.title}>Hall</Text>
                                            <Text style={[styles.value, styles.text]}>{screening.hall.number}</Text>
                                        </View>
                                        <View style={styles.information}>
                                            <Text style={styles.title}>Line</Text>
                                            <Text style={[styles.value, styles.text]}>{item.line}</Text>
                                        </View>
                                        <View style={styles.information}>
                                            <Text style={styles.title}>Seat</Text>
                                            <Text style={[styles.value, styles.text]}>{item.number + 1}</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                            <View style={styles.dividerContainer}>
                                <View style={[styles.filler, { left: 0 }]} />
                                <View style={styles.circle} />
                                <View style={styles.dividerWrapper}>
                                    <View style={styles.divider} />
                                </View>
                                <View style={styles.circle} />
                                <View style={[styles.filler, { right: 0 }]} />
                            </View>
                            <View style={styles.ticketLowerContainer}>
                                <View style={styles.order}>
                                    <View>
                                        <Text style={styles.title}>Order ID</Text>
                                        <Text style={[styles.value, styles.text]}>{ticket.orderID}</Text>
                                    </View>
                                    <View>
                                        <Text style={styles.title}>Price</Text>
                                        <Text style={[styles.value, styles.text]}>{screening.hall.ticketPrice}₪</Text>
                                    </View>
                                </View>
                                <Barcode
                                    value={item.code}
                                    format='CODE39'
                                    lineColor='white'
                                    background={secondary}
                                    height={50}
                                    maxWidth={width - 65}
                                    style={styles.barcode}
                                />
                            </View>
                        </>
                    )
                }}
            />
        </SafeAreaView>
    )
}

export default TicketScreen;

const styles = StyleSheet.create({
    flatList: {
        // paddingHorizontal: 15,
        marginTop: 15,
        paddingBottom: 30
    },
    text: {
        fontFamily: 'Poppins',
        color: 'white'
    },
    ticketUpperContainer: {
        backgroundColor: secondary,
        borderTopRightRadius: 15,
        borderTopLeftRadius: 15,
        marginHorizontal: 15
    },
    ticketLowerContainer: {
        backgroundColor: secondary,
        borderBottomRightRadius: 15,
        borderBottomLeftRadius: 15,
        paddingHorizontal: 15,
        paddingBottom: 15,
        marginHorizontal: 15
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
        fontSize: 22,
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
        fontFamily: 'PoppinsBold',
        fontSize: 13,
        marginBottom: -3,
        letterSpacing: 1.2
    },
    value: {
        fontSize: 17
    },
    dividerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        backgroundColor: secondary
    },
    dividerWrapper: {
        flex: 1,
        height: 1,
        paddingHorizontal: 10,
        overflow: 'hidden',
    },
    divider: {
        height: 2,
        borderWidth: 1,
        borderColor: '#FFFFFF',
        borderStyle: 'dashed'
    },
    circle: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: background
    },
    filler: {
        width: 15,
        height: 30,
        backgroundColor: background,
        position: 'absolute',
    },
    order: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    barcode: {
        marginTop: 10
    }
});