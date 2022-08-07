import React, { useState } from 'react';
import { StyleSheet, TextInput, View, TouchableOpacity, ToastAndroid, Keyboard } from 'react-native';
import { EvilIcons, FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { localhost } from '../../utils/utilities';

const SearchBar = ({ sortPanelRef }) => {
    const [term, setTerm] = useState('');
    const navigation = useNavigation();

    const onSearchMovie = () => {
        Keyboard.dismiss();
        setTimeout(async () => {
            const response = await fetch(`http://${localhost}/search-movie-by-name?name=${term}`);
            const results = await response.json();
            if (results.length === 0)
                ToastAndroid.show('No movie found', ToastAndroid.LONG);
            else
                navigation.navigate('Search', { results });
            setTerm('');
        }, 200);
    }

    return (
        <View style={styles.container}>
            <EvilIcons name="search" size={24} color="black" />
            <TextInput
                placeholder='Search for a movie...'
                value={term}
                onChangeText={(text) => setTerm(text)}
                underlineColorAndroid="transparent"
                placeholderTextColor='black'
                selectionColor='black'
                blurOnSubmit={false}
                onSubmitEditing={onSearchMovie}
                style={styles.textInput}
                returnKeyType='search'
            />
            <TouchableOpacity
                onPress={() => sortPanelRef.current?.open()}
                style={styles.button}
                activeOpacity={0.8}
            >
                <FontAwesome name="sliders" size={20} color="black" />
            </TouchableOpacity>
        </View>
    )
}

export default SearchBar;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 5,
        marginBottom: 5,
        paddingHorizontal: 10,
        borderRadius: 15,
        height: 40
    },
    textInput: {
        flex: 1,
        textAlign: 'left',
        marginHorizontal: 10
    },
    button: {
        width: 25,
        height: 25,
        justifyContent: 'center',
        alignItems: 'center',
    }
});