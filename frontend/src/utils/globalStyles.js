import { StyleSheet, Platform, StatusBar, Dimensions } from 'react-native';
import { background, error, secondary } from './theme';

const { width } = Dimensions.get('window');

const globalStyles = StyleSheet.create({
    container: {
        flex: 1,
        // paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
        backgroundColor: background,
        width: width
    },
    textInputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 25,
        paddingHorizontal: 15,
        paddingVertical: 5,
        marginTop: 10,
        backgroundColor: secondary,
        borderWidth: 1,
        borderColor: secondary
    },
    error: {
        borderColor: error,
        backgroundColor: '#85141f33'
    },
    textInput: {
        flex: 1,
        color: 'white',
        fontFamily: 'Poppins',
        transform: [{ translateY: 2 }]
    },
    errorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 3
    },
    errorText: {
        color: error,
        fontFamily: 'Poppins',
        fontSize: 10
    }
});

export { globalStyles };