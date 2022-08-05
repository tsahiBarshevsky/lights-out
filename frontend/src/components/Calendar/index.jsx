import React, { useState, useEffect } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import moment from 'moment';

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
        <View style={styles.wrapper}>
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
                    <Text>{uniqueMonths[0]}</Text>
                }
                <Text> {new Date().getFullYear()}</Text>
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
                            style={[
                                styles.dayContainer,
                                selectedDate && styles.selectedDay
                            ]}
                        >
                            <Text style={[styles.text, styles.day]}>{d.format('ddd')}</Text>
                            <View style={[styles.dateContainer, selectedDate ? styles.selectedDate : styles.otherDate]}>
                                <Text style={selectedDate ? styles.date : { color: '#b8b9bb' }}>
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
    container: {
        flexGrow: 0,
    },
    wrapper: {
        paddingHorizontal: 15,
        marginVertical: 10
    },
    text: {
        color: 'black'
    },
    month: {
        flexDirection: 'row',
        alignSelf: 'center',
        marginBottom: 5
    },
    separator: {
        paddingHorizontal: 3
    },
    dayContainer: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 7,
        paddingVertical: 5,
        borderRadius: 50
    },
    selectedDay: {
        backgroundColor: 'lightgreen'
    },
    day: {
        marginBottom: 10
    },
    dateContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 25,
        height: 25,
        borderRadius: 25 / 2
    },
    selectedDate: {
        backgroundColor: 'white'
    },
    otherDate: {
        backgroundColor: '#f1f2f6'
    },
    date: {
        color: 'lightgreen',
        fontWeight: 'bold'
    }
});