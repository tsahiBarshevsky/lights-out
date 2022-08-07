import React from 'react';
import { StyleSheet, Text, View, Image, ScrollView, Button } from 'react-native';
import { FontAwesome, AntDesign, FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import Star from 'react-native-star-view';
import { globalStyles } from '../../utils/globalStyles';

const MovieScreen = ({ route }) => {
    const { movie } = route.params;
    const navigation = useNavigation();

    const converMinutesToHours = (minutes) => {
        const m = minutes % 60;
        const h = (minutes - m) / 60;
        return `${h.toString()}h ${(m < 10 ? "0" : "")}${m.toString()}m`;
    }

    return (
        <View style={globalStyles.container}>
            <ScrollView>
                <View style={styles.poster}>
                    <Image
                        source={{ uri: `https://image.tmdb.org/t/p/original/${movie.backdropPath}` }}
                        style={styles.image}
                        blurRadius={5}
                    />
                    <Text>{movie.title}</Text>
                    {movie.rating > 0 ?
                        <Star score={movie.rating} totalScore={10} style={starStyle} />
                        :
                        <Text>No rating yet</Text>
                    }
                </View>
                <View style={styles.aboutContainer}>
                    <View style={styles.about}>
                        <FontAwesome name="video-camera" size={18} color="black" />
                        <Text>Genre</Text>
                        <Text>{movie.genre}</Text>
                    </View>
                    <View style={styles.about}>
                        <AntDesign name="clockcircle" size={18} color="black" />
                        <Text>Duration</Text>
                        {movie.duration > 0 ?
                            <Text>{converMinutesToHours(movie.duration)}</Text>
                            :
                            <Text>N/A</Text>
                        }
                    </View>
                    <View style={styles.about}>
                        <FontAwesome5 name="calendar-week" size={18} color="black" />
                        <Text>Released</Text>
                        <Text>{moment(movie.releaseDate).format('DD/MM/YY')}</Text>
                    </View>
                </View>
                <Button
                    title='get reservation'
                    onPress={() => navigation.navigate('Screenings', { movie })}
                    disabled={moment(movie.releaseDate).isoWeek() - moment().isoWeek() > 1}
                />
                <Text>Rating: {movie.rating}</Text>
                <Text>Overview</Text>
                <Text>{movie.overview}</Text>
            </ScrollView>
        </View>
    )
}

const starStyle = {
    width: 100,
    height: 20
};

export default MovieScreen;

const styles = StyleSheet.create({
    poster: {
        width: '100%',
        height: 250,
        justifyContent: 'flex-end',
        overflow: 'hidden',
        marginTop: 5,
        marginBottom: 15,
        padding: 15,
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    image: {
        ...StyleSheet.absoluteFillObject,
        opacity: 0.3
    },
    aboutContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        marginBottom: 14
    },
    about: {
        width: 90,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderRadius: 10,
        padding: 5
    }
});