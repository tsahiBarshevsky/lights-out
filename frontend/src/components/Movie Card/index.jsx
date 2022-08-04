import React from 'react';
import { StyleSheet, Text, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const MovieCard = ({ movie }) => {
    const navigation = useNavigation();

    return (
        <TouchableOpacity
            onPress={() => navigation.navigate('Movie', { movie })}
            style={styles.container}
            activeOpacity={1}
        >
            <Image
                source={{ uri: `https://image.tmdb.org/t/p/original/${movie.posterPath}` }}
                style={styles.image}
            />
            <Text>{movie.title}</Text>
        </TouchableOpacity>
    )
}

export default MovieCard;

const styles = StyleSheet.create({
    container: {
        width: 270,
        backgroundColor: 'lightblue',
        padding: 10,
        borderRadius: 15
    },
    image: {
        width: 250,
        height: 400,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        marginBottom: 10
    }
});