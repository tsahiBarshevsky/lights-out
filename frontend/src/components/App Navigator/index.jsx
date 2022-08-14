import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import { background } from '../../utils/theme';

// App screens
import {
    CancelationScreen,
    ChockoutScreen,
    HomeScreen,
    MovieScreen,
    PersonalAreaScreen,
    ScreeningsScreen,
    SearchScreen,
    SplashScreen,
    TicketScreen
} from '../../screens';

const Stack = createStackNavigator();
const navigatorTheme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        background: background
    }
};
const options = {
    cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS
};

const AppNavigator = () => {
    return (
        <NavigationContainer theme={navigatorTheme}>
            <Stack.Navigator
                initialRouteName='Splash'
                screenOptions={{ headerShown: false }}
            >
                <Stack.Screen name='Splash' component={SplashScreen}
                    options={{
                        headerShown: false,
                        animationEnabled: false
                    }}
                />
                <Stack.Screen name='Home' component={HomeScreen}
                    options={{
                        headerShown: false,
                        animationEnabled: false
                    }}
                />
                <Stack.Screen name='Movie' component={MovieScreen} options={options} />
                <Stack.Screen name='Screenings' component={ScreeningsScreen} options={options} />
                <Stack.Screen name='Checkout' component={ChockoutScreen} options={options} />
                <Stack.Screen name='Search' component={SearchScreen} options={options} />
                <Stack.Screen name='Personal area' component={PersonalAreaScreen} options={options} />
                <Stack.Screen name='Ticket' component={TicketScreen} options={options} />
                <Stack.Screen name='Cancelation' component={CancelationScreen} options={options} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default AppNavigator;