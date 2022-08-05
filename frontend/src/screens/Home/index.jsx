import React from 'react';
import { SafeAreaView, StyleSheet, View, FlatList } from 'react-native';
import { useSelector } from 'react-redux';
import { globalStyles } from '../../utils/globalStyles';
import { MovieCard } from '../../components';

const HomeScreen = () => {
    const movies = useSelector(state => state.movies);
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
            <FlatList
                data={movies}
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

export default HomeScreen;

const styles = StyleSheet.create({});