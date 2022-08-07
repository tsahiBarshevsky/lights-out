import React, { useState, useCallback } from 'react';
import { SafeAreaView, StyleSheet, View, FlatList, RefreshControl } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { globalStyles } from '../../utils/globalStyles';
import { MovieCard, SearchPanel } from '../../components';
import { localhost } from '../../utils/utilities';

const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
}

const HomeScreen = () => {
    const [refreshing, setRefreshing] = useState(false);
    const movies = useSelector(state => state.movies);
    const dispatch = useDispatch();

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        wait(2000).then(() => {
            setRefreshing(false);
            Promise.all([
                fetch(`http://${localhost}/get-all-movies`),
                fetch(`http://${localhost}/get-all-halls`),
                fetch(`http://${localhost}/get-all-screenings`)
            ])
                .then(([movies, halls, screenings]) => Promise.all([
                    movies.json(),
                    halls.json(),
                    screenings.json()
                ]))
                .then(([movies, halls, screenings]) => {
                    dispatch({ type: 'SET_MOVIES', movies: movies });
                    dispatch({ type: 'SET_HALLS', halls: halls });
                    dispatch({ type: 'SET_SCREENINGS', screenings: screenings });
                })
        });
    }, []);

    // const [screening, setScreening] = useState({
    //     hall: "1",
    //     seats: {
    //         "1": [
    //             { number: 0, available: true },
    //             { number: 1, available: true },
    //             { number: 2, available: true },
    //             { number: 3, available: true },
    //             { number: 4, available: true },
    //             { number: 5, available: true }
    //         ],
    //         "2": [
    //             { number: 0, available: true },
    //             { number: 1, available: true },
    //             { number: 2, available: false },
    //             { number: 3, available: false },
    //             { number: 4, available: true },
    //             { number: 5, available: true }
    //         ]
    //     }
    // });

    // const hall = {
    //     number: "1",
    //     seats: {
    //         "1": { numberOfSeats: 6 },
    //         "2": { numberOfSeats: 8 },
    //         "3": { numberOfSeats: 8 },
    //         "4": { numberOfSeats: 8 },
    //         "5": { numberOfSeats: 8 },
    //         "6": { numberOfSeats: 6 },
    //     }
    // };

    return (
        <SafeAreaView style={globalStyles.container}>
            <SearchPanel />
            <FlatList
                data={movies}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => {
                    return (
                        <MovieCard movie={item} />
                    )
                }}
                ItemSeparatorComponent={() => <View style={{ marginVertical: 5 }} />}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
            />
        </SafeAreaView>
    )
}

export default HomeScreen;

const styles = StyleSheet.create({});