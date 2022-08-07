import React from 'react';
import { StyleSheet, Text, SafeAreaView, View, FlatList } from 'react-native';
import { MovieCard } from '../../components';
import { globalStyles } from '../../utils/globalStyles';

const SearchScreen = ({ route }) => {
    const { results } = route.params;

    return (
        <SafeAreaView style={globalStyles.container}>
            <Text>{results.length} movies found</Text>
            <FlatList
                data={results}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => {
                    return (
                        <MovieCard movie={item} />
                    )
                }}
                ItemSeparatorComponent={() => <View style={{ marginVertical: 5 }} />}
            />
        </SafeAreaView>
    )
}

export default SearchScreen;

const styles = StyleSheet.create({});