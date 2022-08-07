import React from 'react';
import { StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const MovieCard = ({ item }) => {
    const navigation = useNavigation();

    return (
        <TouchableOpacity
            onPress={() => navigation.navigate('Movie', { movie: item })}
            style={styles.container}
            activeOpacity={1}
        >
            <Image
                source={{ uri: `https://image.tmdb.org/t/p/original/${item.posterPath}` }}
                style={styles.image}
            />
        </TouchableOpacity>
    )
}

export default MovieCard;

const styles = StyleSheet.create({
    container: {
        width: 270,
        height: 400,
        backgroundColor: 'lightblue',
        borderRadius: 15,
        overflow: 'hidden'
    },
    image: {
        width: 270,
        height: 400
    }
});