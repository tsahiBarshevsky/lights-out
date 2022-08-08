import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { localhost } from '../../utils/utilities';
import { authentication } from '../../utils/firebase';

const SplashScreen = () => {
    const [dataLoaded, setDataLoaded] = useState(false);
    const dispatch = useDispatch();
    const navigation = useNavigation();

    useEffect(() => {
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
        <View style={styles.container}>
            <Text>Loading...</Text>
        </View>
    )
}

export default SplashScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});