import React from 'react';
import { StyleSheet, Text, View, Image, ScrollView, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import Star from 'react-native-star-view';
import { globalStyles } from '../../utils/globalStyles';

const MovieScreen = ({ route }) => {
    const { movie } = route.params;
    const navigation = useNavigation();

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
                    <Star score={movie.rating} totalScore={10} style={starStyle} />
                </View>
                <Button title='get reservation' onPress={() => navigation.navigate('Screenings', { movie })} />
                <Text>Release date: {moment(movie.releaseDate).format('DD/MM/YYYY')}</Text>
                <Text>Genre: {movie.genre}</Text>
                <Text>Duration: {movie.duration}m</Text>
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
        marginBottom: 15,
        overflow: 'hidden',
        padding: 15,
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    image: {
        ...StyleSheet.absoluteFillObject,
        opacity: 0.3
    }
});