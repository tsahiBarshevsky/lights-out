import React, { useState, useCallback, useRef, useEffect } from 'react';
import { SafeAreaView, StyleSheet, Dimensions, View, Text, RefreshControl, ScrollView, Animated, StatusBar } from 'react-native';
import Carousel from 'react-native-snap-carousel-v4';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import { globalStyles } from '../../utils/globalStyles';
import { UserBar, MovieCard, SearchBar, SortPanel } from '../../components';
import { localhost } from '../../utils/utilities';
import { authentication } from '../../utils/firebase';

const headerHeight = 104;
const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
}

const HomeScreen = () => {
    const [refreshing, setRefreshing] = useState(false);
    const sortPanelRef = useRef(null);
    const movies = useSelector(state => state.movies);
    const screenings = useSelector(state => state.screenings);
    const dispatch = useDispatch();
    const navigation = useNavigation();

    // Header animation handler
    const ref = useRef(null);
    const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);
    const scrollY = useRef(new Animated.Value(0))
    const handleScroll = Animated.event(
        [
            {
                nativeEvent: {
                    contentOffset: { y: scrollY.current },
                },
            },
        ],
        {
            useNativeDriver: true,
        },
    );
    const scrollYClamped = Animated.diffClamp(scrollY.current, 0, headerHeight);
    const translateY = scrollYClamped.interpolate({
        inputRange: [0, headerHeight],
        outputRange: [0, -(headerHeight)],
    });
    const translateYNumber = useRef();
    translateY.addListener(({ value }) => {
        translateYNumber.current = value;
    });

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

    const comingSoonFilter = (movie) => {
        // return moment(movie.releaseDate).isoWeek() - moment().isoWeek() === 1;
        const res = screenings.find((screening) => screening.movie.id === movie.tmdbID);
        if (res === undefined)
            return true;
        return false;
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
            <StatusBar backgroundColor="#f1f2f6" barStyle='dark-content' />
            <SafeAreaView style={globalStyles.container}>
                <Animated.View style={[styles.header, { transform: [{ translateY }] }]}>
                    <UserBar />
                    <SearchBar sortPanelRef={sortPanelRef} />
                </Animated.View>
                <AnimatedScrollView
                    contentContainerStyle={styles.scrollView}
                    ref={ref}
                    onScroll={handleScroll}
                // refreshControl={
                //     <RefreshControl
                //         refreshing={refreshing}
                //         onRefresh={onRefresh}
                //     />
                // }
                >
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
                    <Text style={styles.title}>Coming Soon</Text>
                    <Carousel
                        data={movies.filter(comingSoonFilter)}
                        renderItem={(props) => <MovieCard {...props} />}
                        sliderWidth={Dimensions.get('window').width}
                        itemWidth={270}
                        layout="default"
                        snapToAlignment="start"
                        enableSnap
                        decelerationRate="fast"
                        inactiveSlideOpacity={0.45}
                    />
                </AnimatedScrollView>
            </SafeAreaView>
            <SortPanel sortPanelRef={sortPanelRef} />
        </>
    )
}

export default HomeScreen;

const styles = StyleSheet.create({
    header: {
        position: 'absolute',
        backgroundColor: '#f1f2f6',
        left: 0,
        right: 0,
        width: '100%',
        zIndex: 1,
        height: headerHeight
    },
    title: {
        fontSize: 20,
        marginBottom: 10
    },
    carousel: {
        marginBottom: 35
    },
    scrollView: {
        paddingTop: headerHeight,
        paddingBottom: 20
    }
});

// import React, { useRef } from 'react';
// import { SafeAreaView, StyleSheet, StatusBar, Animated, View, Text, RefreshControl, ScrollView } from 'react-native';
// import { globalStyles } from '../../utils/globalStyles';

// const headerHeight = 58;

// const HomeScreen = () => {
//     const ref = useRef(null);
//     const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);
//     const scrollY = useRef(new Animated.Value(0))
//     const handleScroll = Animated.event(
//         [
//             {
//                 nativeEvent: {
//                     contentOffset: { y: scrollY.current },
//                 },
//             },
//         ],
//         {
//             useNativeDriver: true,
//         },
//     );
//     const scrollYClamped = Animated.diffClamp(scrollY.current, 0, headerHeight);
//     const translateY = scrollYClamped.interpolate({
//         inputRange: [0, headerHeight],
//         outputRange: [0, -(headerHeight)],
//     });
//     const translateYNumber = useRef();
//     translateY.addListener(({ value }) => {
//         translateYNumber.current = value;
//     });

//     return (
//         <SafeAreaView style={{ flex: 1, backgroundColor: '#1c1c1c' }}>
//             <StatusBar backgroundColor="#1c1c1c" barStyle='dark-content' />
//             <Animated.View style={[styles.header, { transform: [{ translateY }] }]}>
//                 <Text style={{ color: 'white' }}>Header</Text>
//             </Animated.View>
//             <AnimatedScrollView
//                 scrollEventThrottle={50}
//                 ref={ref}
//                 onScroll={handleScroll}
//                 contentContainerStyle={{ paddingTop: headerHeight, backgroundColor: '#1c1c1c' }}
//             >
//                 {[...Array(50).keys()].map((item) => {
//                     return (
//                         <View key={item}>
//                             <Text style={{ color: 'white' }}>{item}</Text>
//                         </View>
//                     )
//                 })}
//             </AnimatedScrollView>
//         </SafeAreaView>
//     )
// }

// export default HomeScreen;

// const styles = StyleSheet.create({
//     header: {
//         position: 'absolute',
//         backgroundColor: '#1c1c1c',
//         left: 0,
//         right: 0,
//         width: '100%',
//         zIndex: 1,
//         height: headerHeight
//     }
// });