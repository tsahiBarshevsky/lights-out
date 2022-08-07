import React, { useState } from 'react';
import { StyleSheet, TextInput, View, TouchableOpacity, ToastAndroid, Keyboard } from 'react-native';
import { EvilIcons, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { localhost } from '../../utils/utilities';

const SearchPanel = () => {
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

    const onResetSearch = () => {
        setTerm('');
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
            {term.length > 0 &&
                <TouchableOpacity
                    onPress={onResetSearch}
                    style={styles.button}
                    activeOpacity={0.8}
                >
                    <Ionicons name="close" size={18} color="white" />
                </TouchableOpacity>
            }
        </View>
    )
}

export default SearchPanel

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
        height: 40,
    },
    textInput: {
        flex: 1,
        textAlign: 'left',
        borderRadius: 15,
        marginHorizontal: 10
    },
    button: {
        width: 25,
        height: 25,
        borderRadius: 12.5,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#696969',
    }
});