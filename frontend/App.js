import 'react-native-gesture-handler';
import React from 'react';
import { StripeProvider } from '@stripe/stripe-react-native';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { I18nManager } from 'react-native';
import { WeekProvider } from './src/utils/context';
import { AppNavigator } from './src/components';
import rootReducer from './src/redux/reducers';
import config from './src/utils/config';

I18nManager.allowRTL(false);
I18nManager.forceRTL(false);
const store = createStore(rootReducer);

export default function App() {
    return (
        <Provider store={store}>
            <StripeProvider publishableKey={config.PUBLISHABLE_KEY}>
                <WeekProvider>
                    <AppNavigator />
                </WeekProvider>
            </StripeProvider>
        </Provider>
    )
}