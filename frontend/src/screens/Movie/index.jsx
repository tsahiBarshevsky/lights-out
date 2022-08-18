import React from 'react';
import { StyleSheet, Text, View, Image, ScrollView, FlatList, SafeAreaView, TouchableOpacity, StatusBar } from 'react-native';
import { FontAwesome, AntDesign, FontAwesome5, Entypo } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { Header } from '../../components';
import { globalStyles } from '../../utils/globalStyles';
import { primary } from '../../utils/theme';

const format = 'DD/MM/YY HH:mm';
const initial = { hours: 0, minutes: 0, seconds: 0, milliseconds: 0 };

const MovieScreen = ({ route }) => {
    const { movie } = route.params;
    const screenings = useSelector(state => state.screenings);
    const navigation = useNavigation();

    const convertMinutesToHours = (minutes) => {
        const m = minutes % 60;
        const h = (minutes - m) / 60;
        return `${h.toString()}h ${(m < 10 ? "0" : "")}${m.toString()}m`;
    }

    const Separator = () => (
        <View style={{ paddingHorizontal: 5 }} />
    );

    const onNavigate = () => {
        const filteredScreenings = screenings.filter((item) => {
            return (
                moment(item.date).set(initial).format(format) === moment().set(initial).format(format) &&
                moment(item.date).isAfter(moment(new Date())) &&
                item.movie.id === movie.tmdbID
            );
        });
        navigation.navigate('Screenings', {
            movie: movie,
            filteredScreenings: filteredScreenings
        });
    }

    return (
        <SafeAreaView style={globalStyles.container}>
            <Header
                caption={"Movie Detail"}
                backFunction={() => navigation.goBack()}
            />
            <View style={styles.poster}>
                <Image
                    source={{ uri: `https://image.tmdb.org/t/p/original/${movie.backdropPath}` }}
                    style={styles.image}
                    blurRadius={5}
                />
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
            <ScrollView
                contentContainerStyle={styles.scrollView}
                overScrollMode="never"
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
            {screenings.find((screening) => screening.movie.id === movie.tmdbID) &&
                <TouchableOpacity
                    onPress={onNavigate}
                    style={styles.button}
                    activeOpacity={1}
                >
                    <Text style={styles.buttonCaption}>
                        Get Reservation
                    </Text>
                </TouchableOpacity>
            }
        </SafeAreaView>
    )
}

export default MovieScreen;

const styles = StyleSheet.create({
    scrollView: {
        paddingHorizontal: 15,
        paddingBottom: 10
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
    poster: {
        width: '100%',
        height: 220,
        justifyContent: 'flex-end',
        overflow: 'hidden',
        marginTop: 5,
        marginBottom: 10,
        paddingHorizontal: 15,
        paddingBottom: 15,
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    image: {
        ...StyleSheet.absoluteFillObject,
        opacity: 0.3
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
    button: {
        // position: 'absolute',
        // bottom: 15,
        marginTop: 10,
        marginBottom: 15,
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