import React, { useContext } from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// App screens
import {
    HomeScreen
} from '../../screens';

const Stack = createStackNavigator();
const navigatorTheme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        background: '#f1f2f6'
    }
}

const AppNavigator = () => {

    return (
        <NavigationContainer theme={navigatorTheme}>
            <Stack.Navigator
                initialRouteName='Home'
                screenOptions={{ headerShown: false }}
            >
                <Stack.Screen name='Home' component={HomeScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default AppNavigator;