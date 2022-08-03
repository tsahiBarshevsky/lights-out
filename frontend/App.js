import 'react-native-gesture-handler';
import React from 'react';
import { I18nManager } from 'react-native';
import { AppNavigator } from './src/components';

I18nManager.allowRTL(false);
I18nManager.forceRTL(false);

export default function App() {
    return (
        <AppNavigator />
    )
}