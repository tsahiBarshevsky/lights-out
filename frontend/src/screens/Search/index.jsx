import React from 'react';
import { StyleSheet, Text, SafeAreaView, View, FlatList, Image, TouchableOpacity } from 'react-native';
import { Header } from '../../components';
import { useNavigation } from '@react-navigation/native';
import Vector from '../../../assets/Images/movie-theater.png';
import { globalStyles } from '../../utils/globalStyles';

const SearchScreen = ({ route }) => {
    const { results } = route.params;
    const navigation = useNavigation();

    const ListHeader = () => (
        <View style={styles.headerContainer}>
            <Text style={[styles.text, styles.title]}>
                {results.length === 1 ? "One movie found" : `${results.length} movies found`}
            </Text>
        </View>
    );

    const Item = ({ item }) => (
        <TouchableOpacity
            onPress={() => navigation.navigate('Movie', { movie: item })}
            style={styles.itemContainer}
            activeOpacity={1}
        >
            <Image
                source={{ uri: `https://image.tmdb.org/t/p/original/${item.posterPath}` }}
                style={styles.poster}
            />
        </TouchableOpacity>
    );

    const Separator = () => (
        <View style={{ marginBottom: 20 }} />
    )

    const EmptyList = () => (
        <View style={styles.emptyListContainer}>
            <Image
                source={Vector}
                style={styles.image}
            />
            <Text style={[styles.text, styles.emptyMessage]}>Oops! No movies found</Text>
        </View>
    );

    return (
        <SafeAreaView style={globalStyles.container}>
            <Header
                caption={"Search Results"}
                backFunction={() => navigation.goBack()}
            />
            <FlatList
                data={results}
                keyExtractor={(item) => item._id}
                renderItem={Item}
                ItemSeparatorComponent={Separator}
                ListEmptyComponent={EmptyList}
                ListHeaderComponent={results.length > 0 ? ListHeader : null}
                contentContainerStyle={styles.flatList}
                numColumns={2}
                key={2}
            />
        </SafeAreaView>
    )
}

export default SearchScreen;

const styles = StyleSheet.create({
    text: {
        fontFamily: 'Poppins',
        color: 'white'
    },
    flatList: {
        flexGrow: 1,
        paddingBottom: 15
    },
    headerContainer: {
        paddingHorizontal: 15,
        marginBottom: 10
    },
    title: {
        fontSize: 17
    },
    itemContainer: {
        flex: 1 / 2,
        aspectRatio: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    poster: {
        width: '80%',
        height: '100%',
        borderRadius: 15
    },
    emptyListContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyMessage: {
        fontSize: 20
    },
    image: {
        width: 150,
        height: 150,
        marginBottom: 15
    }
});