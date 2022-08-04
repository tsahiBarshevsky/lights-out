import React from 'react';
import { StyleSheet, Text, View, Image, ScrollView, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { globalStyles } from '../../utils/globalStyles';

const MovieScreen = ({ route }) => {
    const { movie } = route.params;
    const navigation = useNavigation();

    return (
        <View style={globalStyles.container}>
            <ScrollView>
                <Image
                    source={{ uri: `https://image.tmdb.org/t/p/original/${movie.posterPath}` }}
                    style={styles.image}
                />
                <Button title='get reservation' onPress={() => navigation.navigate('Screenings', { movie })} />
                <Text>{movie.title}</Text>
                <Text>Genre: {movie.genre}</Text>
                <Text>Duration: {movie.duration}m</Text>
                <Text>Rating: {movie.rating}</Text>
                <Text>Overview</Text>
                <Text>{movie.overview}</Text>
            </ScrollView>
        </View>
    )
}

export default MovieScreen

const styles = StyleSheet.create({
    image: {
        width: 250,
        height: 400,
        borderRadius: 20,
        marginBottom: 10
    }
});