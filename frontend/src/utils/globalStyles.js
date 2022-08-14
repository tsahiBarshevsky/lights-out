import { StyleSheet, Platform, StatusBar, Dimensions } from 'react-native';
import { background } from './theme';

const { width } = Dimensions.get('window');

const globalStyles = StyleSheet.create({
    container: {
        flex: 1,
        // paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
        backgroundColor: background,
        width: width
    }
});

export { globalStyles };