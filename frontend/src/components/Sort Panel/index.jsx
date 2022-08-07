import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, FlatList } from 'react-native';
import { Modalize } from 'react-native-modalize';
import { Entypo } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';
import { localhost } from '../../utils/utilities';

const SortPanel = ({ sortPanelRef }) => {
    const [sortType, setSortType] = useState('title');
    const dispatch = useDispatch();

    const onSortTypeChange = (type) => {
        setSortType(type);
        sortPanelRef.current?.close();
        setTimeout(() => {
            fetch(`http://${localhost}/get-all-movies?field=${type}`)
                .then((movies) => movies.json())
                .then((movies) => dispatch({ type: 'SET_MOVIES', movies: movies }))
        }, 500);
    }

    const Separator = () => (
        <View style={styles.separator} />
    );

    return (
        <Modalize
            ref={sortPanelRef}
            threshold={50}
            adjustToContentHeight
            withHandle={false}
            modalStyle={styles.modalStyle}
            openAnimationConfig={{ timing: { duration: 200 } }}
            closeAnimationConfig={{ timing: { duration: 500 } }}
            scrollViewProps={{ scrollEnabled: false }}
        >
            <View style={styles.bottomSheetContainer}>
                <Text>Sort movies by...</Text>
                <FlatList
                    data={types}
                    keyExtractor={(item) => item}
                    scrollEnabled={false}
                    renderItem={({ item }) => {
                        return (
                            <TouchableOpacity
                                onPress={() => onSortTypeChange(item)}
                                style={styles.button}
                                key={item}
                            >
                                <Text style={styles.text}>{item}</Text>
                                {item === sortType &&
                                    <Entypo name='check' size={20} color='black' />
                                }
                            </TouchableOpacity>
                        )
                    }}
                    ItemSeparatorComponent={Separator}
                />
            </View>
        </Modalize>
    )
}

const types = ['title', 'duration', 'release date', 'rating'];

export default SortPanel;

const styles = StyleSheet.create({
    bottomSheetContainer: {
        height: '100%',
        paddingVertical: 10
    },
    modalStyle: {
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20
    },
    button: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 15,
        height: 30
    },
    text: {
        textTransform: 'capitalize'
    },
    separator: {
        marginVertical: 2
    }
});