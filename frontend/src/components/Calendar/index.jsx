import React, { useState, useEffect } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import moment from 'moment';
import { primary } from '../../utils/theme';

const format = 'DD/MM/YY HH:mm';
const initial = { hours: 0, minutes: 0, seconds: 0, milliseconds: 0 };

const Calendar = ({ week, date, setDate }) => {
    const [months, setMonths] = useState([]);
    const uniqueMonths = [...new Set(months)];

    const Separator = () => (
        <View style={styles.separator} />
    );

    useEffect(() => {
        const res = [];
        week.forEach((day) => res.push(moment(day).format('MMMM')));
        setMonths(res);
    }, []);

    return (
        <View>
            <View style={styles.month}>
                {uniqueMonths.length > 1 ?
                    uniqueMonths.map((month, index) => {
                        return (
                            <View key={index}>
                                <Text>{month}</Text>
                            </View>
                        )
                    }).reduce((acc, elem) => {
                        return acc === null ? [elem] : [...acc, <Text key={elem}>/</Text>, elem]
                    }, null)
                    :
                    <Text style={styles.text}>{uniqueMonths[0]}</Text>
                }
                <Text style={styles.text}> {new Date().getFullYear()}</Text>
            </View>
            <FlatList
                data={week}
                keyExtractor={(item) => item.toString()}
                horizontal
                overScrollMode='never'
                showsHorizontalScrollIndicator={false}
                renderItem={({ item, index }) => {
                    const d = moment(item);
                    const selectedDate = d.set(initial).format(format) === date.set(initial).format(format);
                    return (
                        <TouchableOpacity
                            onPress={() => setDate(moment(item))}
                            key={index}
                            activeOpacity={1}
                            style={[
                                styles.dayContainer,
                                selectedDate && styles.selectedDay
                            ]}
                        >
                            <Text style={[styles.text, styles.day]}>{d.format('ddd')}</Text>
                            <View style={[styles.dateContainer, selectedDate ? styles.selectedDate : styles.otherDate]}>
                                <Text
                                    style={[
                                        styles.text,
                                        { transform: [{ translateY: 1 }] },
                                        selectedDate ? { color: 'black' } : { color: 'white' }
                                    ]}
                                >
                                    {d.format('DD')}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    )
                }}
                ItemSeparatorComponent={Separator}
                style={styles.container}
            />
        </View>

    )
}

export default Calendar;

const styles = StyleSheet.create({
    text: {
        fontFamily: 'Poppins',
        color: 'white'
    },
    container: {
        flexGrow: 0
    },
    month: {
        flexDirection: 'row',
        alignSelf: 'center',
        marginBottom: 5
    },
    separator: {
        paddingHorizontal: 5
    },
    dayContainer: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 7,
        paddingVertical: 5,
        borderRadius: 50,
        backgroundColor: '#4d4c4c',
        width: 42
    },
    selectedDay: {
        backgroundColor: primary
    },
    day: {
        marginTop: 2,
        marginBottom: 10,
        fontSize: 10
    },
    dateContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 30,
        height: 30,
        borderRadius: 15
    },
    selectedDate: {
        backgroundColor: 'white'
    },
    otherDate: {
        backgroundColor: 'transparent'
    }
});