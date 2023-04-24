/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useState } from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import HomeScreen from './src/view/home/HomeScreen.react';
import SettingsScreen from './src/view/settings/SettingsScreen.react';
import { ApiFetcherContext } from './src/context/ApiFetcherContext';


const Tab = createBottomTabNavigator();

export default function App(): JSX.Element {
  const [loading, setLoading] = useState<boolean>(false)
  return (
    <ApiFetcherContext.Provider value={{loading, setLoading}}>
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="Home"
        screenOptions={({route}) => ({
          tabBarIcon: ({color, size}) => {
            let iconName: string = 'search';

            if (route.name === 'Home') {
              iconName = 'ios-home-outline';
            } else if (route.name === 'Profile') {
              iconName = 'search';
            }
            return (
              <Icon
                name={iconName}
                size={size}
                color={color}
              />
            );
          },
        })}>
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen
          name="Settings"
          component={SettingsScreen}
        />
      </Tab.Navigator>
    </NavigationContainer>
    </ApiFetcherContext.Provider>
  );
}
