import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { SkypeIndicator } from 'react-native-indicators';
import { localhost } from '../../utils/utilities';
import { authentication } from '../../utils/firebase';
import { background, primary } from '../../utils/theme';

const SplashScreen = () => {
    const [dataLoaded, setDataLoaded] = useState(false);
    const dispatch = useDispatch();
    const navigation = useNavigation();

    useEffect(() => {
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
                const genres = [...new Set(movies.map(movie => movie.genre))];
                dispatch({ type: 'SET_GENRES', genres: genres });
            })
            .finally(() => setDataLoaded(true));
    }, []);

    useEffect(() => {
        const unsubscribe = authentication.onAuthStateChanged((user) => {
            if (user) {
                Promise.all([
                    fetch(`http://${localhost}/get-user-info?uid=${user.uid}`),
                    fetch(`http://${localhost}/get-all-reservations?uid=${user.uid}`)
                ])
                    .then(([userInfo, reservations]) => Promise.all([
                        userInfo.json(),
                        reservations.json()
                    ]))
                    .then(([userInfo, reservations]) => {
                        dispatch({ type: 'SET_USER', user: userInfo });
                        dispatch({ type: 'SET_RESERVATIONS', reservations: reservations });
                    })
                    .finally(() => navigation.replace('Home'));
            }
            else
                navigation.replace('Home');
        });
        return unsubscribe;
    }, [dataLoaded]);

    return (
        <>
            <StatusBar backgroundColor={background} barStyle="light-content" />
            <View style={styles.container}>
                <Text style={styles.text}> Lights Out </Text>
                <SkypeIndicator size={35} color='white' style={styles.indicator} />
            </View>
        </>
    )
}

export default SplashScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    text: {
        fontFamily: 'Satisfy',
        fontSize: 45,
        textAlign: 'center',
        color: 'white',
        marginBottom: 100
    },
    indicator: {
        flexGrow: 0
    }
});