import React, { useState, useCallback, useRef, useEffect } from 'react';
import { SafeAreaView, StyleSheet, Dimensions, View, Text, RefreshControl, ScrollView } from 'react-native';
import Carousel from 'react-native-snap-carousel-v4';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import { globalStyles } from '../../utils/globalStyles';
import { Header, MovieCard, SearchBar, SortPanel } from '../../components';
import { localhost } from '../../utils/utilities';
import { authentication } from '../../utils/firebase';

const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
}

const HomeScreen = () => {
    const [refreshing, setRefreshing] = useState(false);
    const sortPanelRef = useRef(null);
    const movies = useSelector(state => state.movies);
    const dispatch = useDispatch();
    const navigation = useNavigation();

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        wait(2000).then(() => {
            setRefreshing(false);
            Promise.all([
                fetch(`http://${localhost}/get-all-movies?field=title`),
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

    const nowShowingFilter = (movie) => {
        return moment().isAfter(moment(movie.releaseDate));
    }

    const showingNextWeekFilter = (movie) => {
        return moment(movie.releaseDate).isoWeek() - moment().isoWeek() === 1;
    }

    useEffect(() => {
        const unsubscribe = authentication.onAuthStateChanged((user) => {
            if (user) {
                fetch(`http://${localhost}/get-user-info?uid=${user.uid}`)
                    .then((res) => res.json())
                    .then((res) => dispatch({ type: 'SET_USER', user: res }))
                    .finally(() => navigation.canGoBack() && navigation.goBack());
            }
            else {
                if (navigation.canGoBack())
                    navigation.goBack();
            }
        });
        return unsubscribe;
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
        <>
            <SafeAreaView style={globalStyles.container}>
                <ScrollView
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                        />
                    }
                >
                    <Header />
                    <SearchBar sortPanelRef={sortPanelRef} />
                    <Text style={styles.title}>Now Showing</Text>
                    <View style={styles.carousel}>
                        <Carousel
                            data={movies.filter(nowShowingFilter)}
                            renderItem={(props) => <MovieCard {...props} />}
                            sliderWidth={Dimensions.get('window').width}
                            itemWidth={270}
                            layout="default"
                            snapToAlignment="start"
                            enableSnap
                            decelerationRate="fast"
                            inactiveSlideOpacity={0.45}
                        />
                    </View>
                    <Text style={styles.title}>Coming Next Week</Text>
                    <Carousel
                        data={movies.filter(showingNextWeekFilter)}
                        renderItem={(props) => <MovieCard {...props} />}
                        sliderWidth={Dimensions.get('window').width}
                        itemWidth={270}
                        layout="default"
                        snapToAlignment="start"
                        enableSnap
                        decelerationRate="fast"
                        inactiveSlideOpacity={0.45}
                    />
                </ScrollView>
            </SafeAreaView>
            <SortPanel sortPanelRef={sortPanelRef} />
        </>
    )
}

export default HomeScreen;

const styles = StyleSheet.create({
    title: {
        fontSize: 20,
        marginBottom: 5
    },
    carousel: {
        marginBottom: 45
    }
});