import React, { useState, useContext } from 'react';
import { StyleSheet, Text, View, Image, ScrollView, FlatList, SafeAreaView, TouchableOpacity, StatusBar } from 'react-native';
import { FontAwesome, AntDesign, FontAwesome5, Entypo } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { Calendar, Header } from '../../components';
import { globalStyles } from '../../utils/globalStyles';
import { background, primary } from '../../utils/theme';
import { WeekContext } from '../../utils/context';
import { convertMinutesToHours } from '../../utils/utilities';

const format = 'DD/MM/YY HH:mm';
const initial = { hours: 0, minutes: 0, seconds: 0, milliseconds: 0 };

const MovieScreen = ({ route }) => {
    const { movie } = route.params;
    const { week } = useContext(WeekContext);
    const [date, setDate] = useState(moment());
    const screenings = useSelector(state => state.screenings);
    const hasScreenings = screenings.find((screening) => screening.movie.id === movie.tmdbID);
    const navigation = useNavigation();

    const Separator = () => (
        <View style={{ paddingHorizontal: 5 }} />
    );

    const onNavigate = () => {
        const filteredScreenings = screenings.filter((item) => {
            return (
                moment(item.date).set(initial).format(format) === date.set(initial).format(format) &&
                item.movie.id === movie.tmdbID
            );
        });
        // Order by halls
        const movieScreenings = filteredScreenings.reduce((c, v) => {
            c[v.hall.number] = c[v.hall.number] || [];
            c[v.hall.number].push(v);
            return c;
        }, {});
        navigation.navigate('Screenings', {
            movie: movie,
            movieScreenings: movieScreenings
        });
    }

    return (
        <SafeAreaView style={globalStyles.container}>
            <View style={styles.headerWrapper}>
                <Header
                    caption={"Movie Detail"}
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
                <View style={styles.ratingWrapper}>
                    <Text style={[styles.text, styles.title]}>{movie.title}</Text>
                    {movie.rating > 0 &&
                        <View style={styles.rating}>
                            <AntDesign style={styles.star} name="star" size={20} color={primary} />
                            <Text style={[styles.text, styles.ratingCaption]}>
                                {movie.rating}
                            </Text>
                        </View>
                    }
                </View>
            </View>
            <ScrollView
                contentContainerStyle={[
                    styles.scrollView,
                    hasScreenings ? styles.screenings : styles.noScreenings
                ]}
                overScrollMode="never"
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.aboutContainer}>
                    <View style={styles.about}>
                        <FontAwesome name="video-camera" size={17} color="white" />
                        <Text style={styles.aboutTitle}>Genre</Text>
                        <Text style={styles.aboutCaption}>{movie.genre}</Text>
                    </View>
                    <View style={styles.about}>
                        <AntDesign name="clockcircle" size={17} color="white" />
                        <Text style={styles.aboutTitle}>Duration</Text>
                        {movie.duration > 0 ?
                            <Text style={styles.aboutCaption}>
                                {convertMinutesToHours(movie.duration)}
                            </Text>
                            :
                            <Text style={styles.aboutCaption}>N/A</Text>
                        }
                    </View>
                    <View style={styles.about}>
                        <FontAwesome5 name="calendar-week" size={17} color="white" />
                        <Text style={styles.aboutTitle}>Released</Text>
                        <Text style={styles.aboutCaption}>{moment(movie.releaseDate).format('DD/MM/YY')}</Text>
                    </View>
                </View>
                <Text style={[styles.text, styles.sectionTitle]}>Cast</Text>
                <FlatList
                    data={movie.cast}
                    keyExtractor={(item) => item.cast_id}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.cast}
                    contentContainerStyle={{ alignItems: 'flex-start' }}
                    ItemSeparatorComponent={Separator}
                    renderItem={({ item }) => {
                        return (
                            <View style={styles.actorWrapper}>
                                {item.profile_path ?
                                    <Image
                                        source={{ uri: `https://image.tmdb.org/t/p/original${item.profile_path}` }}
                                        style={styles.actorImage}
                                        resizeMode="center"
                                    />
                                    :
                                    <View style={styles.actorVector}>
                                        <Entypo name="user" size={35} color="black" />
                                    </View>
                                }
                                <Text
                                    style={[styles.text, styles.actorName]}
                                    numberOfLines={2}
                                    ellipsizeMode="tail"
                                >
                                    {item.original_name}
                                </Text>
                            </View>
                        )
                    }}
                />
                <Text style={[styles.text, styles.sectionTitle]}>Overview</Text>
                <Text style={styles.text}>{movie.overview}</Text>
            </ScrollView>
            {hasScreenings &&
                <View style={styles.dates}>
                    <Calendar
                        week={week}
                        date={date}
                        setDate={setDate}
                    />
                    <TouchableOpacity
                        onPress={onNavigate}
                        style={styles.button}
                        activeOpacity={1}
                    >
                        <Text style={styles.buttonCaption}>
                            Get Reservation
                        </Text>
                    </TouchableOpacity>
                </View>
            }
        </SafeAreaView>
    )
}

export default MovieScreen;

const styles = StyleSheet.create({
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
    scrollView: {
        paddingHorizontal: 15
    },
    screenings: {
        paddingBottom: 185
    },
    noScreenings: {
        paddingBottom: 10,
    },
    text: {
        fontFamily: 'Poppins',
        color: 'white'
    },
    title: {
        fontSize: 25,
        lineHeight: 35
    },
    sectionTitle: {
        fontSize: 19
    },
    image: {
        height: 200,
        width: '100%',
        opacity: 0.6
    },
    ratingWrapper: {
        position: 'absolute',
        bottom: 0,
        paddingHorizontal: 15,
        paddingBottom: 25
    },
    rating: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    ratingCaption: {
        transform: [{ translateY: 2 }]
    },
    star: {
        marginRight: 7
    },
    aboutContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 15
    },
    about: {
        width: '30%',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderRadius: 15,
        borderColor: '#67676b',
        paddingHorizontal: 5,
        paddingTop: 5
    },
    aboutTitle: {
        fontFamily: 'Poppins',
        fontSize: 12,
        color: '#67676b',
        marginTop: 3
    },
    aboutCaption: {
        fontFamily: 'PoppinsBold',
        color: 'white',
        marginTop: -5
    },
    cast: {
        paddingVertical: 10
    },
    actorWrapper: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 55
    },
    actorImage: {
        width: 55,
        height: 55,
        borderRadius: 55 / 2,
        marginBottom: 5
    },
    actorVector: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        width: 55,
        height: 55,
        borderRadius: 55 / 2,
        marginBottom: 5,
        overflow: 'hidden'
    },
    actorName: {
        fontSize: 10,
        textAlign: 'center'
    },
    dates: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'flex-start',
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50,
        backgroundColor: '#2c2c35',
        paddingHorizontal: 15,
        paddingTop: 15,
        paddingBottom: 10
    },
    button: {
        // position: 'absolute',
        // bottom: 15,
        marginTop: 15,
        // marginBottom: 15,
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: primary,
        width: '70%',
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