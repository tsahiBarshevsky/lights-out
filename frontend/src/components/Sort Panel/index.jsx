import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, FlatList } from 'react-native';
import { Modalize } from 'react-native-modalize';
import { Entypo } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';
import { localhost } from '../../utils/utilities';
import { background, primary, secondary } from '../../utils/theme';

const SortPanel = ({ sortPanelRef, genres }) => {
    const [genre, setGenre] = useState('');
    const [sortType, setSortType] = useState('title');
    const dispatch = useDispatch();

    const onChangeGenre = (newGenre) => {
        if (newGenre !== genre)
            setGenre(newGenre);
        else
            setGenre('');
    }

    const onResetFilters = () => {
        fetch(`http://${localhost}/get-all-movies`)
            .then((movies) => movies.json())
            .then((movies) => {
                dispatch({ type: 'SET_MOVIES', movies: movies });
                setGenre('');
                setSortType('title');
                sortPanelRef.current?.close();
            });
    }

    const onApplyFilters = () => {
        fetch(`http://${localhost}/sort-and-filter-movies?field=${sortType}&genre=${genre}`)
            .then((movies) => movies.json())
            .then((movies) => dispatch({ type: 'SET_MOVIES', movies: movies }))
        sortPanelRef.current?.close();
    }

    const GenreButton = ({ item }) => (
        <TouchableOpacity
            onPress={() => onChangeGenre(item)}
            activeOpacity={1}
            style={[styles.button, genre === item && styles.selected]}
        >
            <Text
                style={[
                    styles.text,
                    styles.buttonCaption,
                    genre === item && styles.selectedText
                ]}
            >
                {item}
            </Text>
        </TouchableOpacity>
    );

    const SortButton = ({ item }) => (
        <TouchableOpacity
            onPress={() => setSortType(item)}
            activeOpacity={1}
            style={[styles.button, sortType === item && styles.selected]}
        >
            <Text
                style={[
                    styles.text,
                    styles.buttonCaption,
                    sortType === item && styles.selectedText
                ]}
            >
                {item}
            </Text>
        </TouchableOpacity>
    );

    const Separator = () => (
        <View style={styles.separator} />
    );

    return (
        <Modalize
            ref={sortPanelRef}
            threshold={50}
            adjustToContentHeight
            withHandle={true}
            handlePosition="inside"
            modalStyle={styles.modalStyle}
            handleStyle={styles.handleStyle}
            openAnimationConfig={{ timing: { duration: 200 } }}
            closeAnimationConfig={{ timing: { duration: 500 } }}
        >
            <View style={styles.bottomSheetContainer}>
                <Text style={[styles.text, styles.title]}>Sort & Filter</Text>
                <View style={styles.divider} />
                <Text style={[styles.text, styles.subtitle]}>Genre</Text>
                <FlatList
                    data={genres}
                    horizontal
                    keyExtractor={(item) => item.toString()}
                    ItemSeparatorComponent={Separator}
                    renderItem={GenreButton}
                    overScrollMode="never"
                    showsHorizontalScrollIndicator={false}
                    style={{ marginBottom: 20 }}
                />
                <Text style={[styles.text, styles.subtitle]}>Sort by</Text>
                <FlatList
                    data={types}
                    horizontal
                    keyExtractor={(item) => item.toString()}
                    ItemSeparatorComponent={Separator}
                    renderItem={SortButton}
                    overScrollMode="never"
                    showsHorizontalScrollIndicator={false}
                    style={{ marginBottom: 10 }}
                />
                <View style={styles.divider} />
                <View style={styles.buttons}>
                    <TouchableOpacity
                        onPress={onResetFilters}
                        style={[styles.actionButton, styles.reset]}
                        activeOpacity={1}
                    >
                        <Text style={styles.text}>Reset</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={onApplyFilters}
                        style={[styles.actionButton, styles.apply]}
                        activeOpacity={1}
                    >
                        <Text style={[styles.text, styles.selectedText]}>Apply</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modalize>
    )
}

const types = ['title', 'duration', 'release date', 'rating'];

export default SortPanel;

const styles = StyleSheet.create({
    bottomSheetContainer: {
        paddingTop: 20,
        paddingBottom: 10
    },
    modalStyle: {
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        backgroundColor: background,
        paddingHorizontal: 15
    },
    handleStyle: {
        backgroundColor: secondary,
        marginTop: 2
    },
    text: {
        fontFamily: 'Poppins',
        color: 'white',
        textTransform: 'capitalize'
    },
    title: {
        fontSize: 18,
        textAlign: 'center'
    },
    subtitle: {
        fontSize: 13,
        marginBottom: 5
    },
    divider: {
        width: '100%',
        height: 1,
        backgroundColor: secondary,
        marginBottom: 10
    },
    button: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 30,
        paddingHorizontal: 13,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: primary,
        overflow: 'hidden'
    },
    buttonCaption: {
        transform: [{ translateY: 1 }]
    },
    buttons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 5
    },
    actionButton: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '45%',
        paddingVertical: 5,
        borderRadius: 25
    },
    reset: {
        backgroundColor: '#33383f'
    },
    apply: {
        backgroundColor: primary
    },
    selected: {
        backgroundColor: primary
    },
    selectedText: {
        color: 'black'
    },
    separator: {
        marginHorizontal: 5
    }
});