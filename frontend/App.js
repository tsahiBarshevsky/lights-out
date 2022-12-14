import 'react-native-gesture-handler';
import React from 'react';
import Toast from 'react-native-toast-message';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { I18nManager, LogBox } from 'react-native';
import { useFonts } from 'expo-font';
import { WeekProvider } from './src/utils/context';
import { AppNavigator } from './src/components';
import rootReducer from './src/redux/reducers';
import { toastConfig } from './src/utils/toastConfig';

I18nManager.allowRTL(false);
I18nManager.forceRTL(false);
const store = createStore(rootReducer);
LogBox.ignoreAllLogs();

export default function App() {
    const [loaded] = useFonts({
        Poppins: require('./assets/Fonts/Poppins-Light.ttf'),
        PoppinsBold: require('./assets/Fonts/Poppins-SemiBold.ttf'),
        BebasNeue: require('./assets/Fonts/BebasNeue-Regular.ttf'),
        Imax: require('./assets/Fonts/IMAX.ttf'),
        Satisfy: require('./assets/Fonts/Satisfy-Regular.ttf')
    });

    if (!loaded)
        return null;
    return (
        <Provider store={store}>
            <WeekProvider>
                <AppNavigator />
            </WeekProvider>
            <Toast config={toastConfig} />
        </Provider>
    )
}