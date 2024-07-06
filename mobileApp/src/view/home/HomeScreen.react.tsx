import React, { useState } from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import RootScreen from './RootScreen.react'
import MangaDetail from './MangaDetail.react'
import MangaPage from './MangaPage.react'
const Stack = createStackNavigator()
import { HeaderBackButton } from '@react-navigation/elements'
import { useNavigation } from '@react-navigation/native'
import { Button } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import { TouchableOpacity } from 'react-native-gesture-handler'

export default function SettingsScreen(): JSX.Element {
  const naviation = useNavigation()
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        gestureEnabled: false,
        headerStyle: { height: 80 },
      }}
    >
      <Stack.Screen
        name="MangaList"
        component={RootScreen}
      />
      <Stack.Screen
        name="MangaDetail"
        component={MangaDetail}
        options={{
          headerLeft: (props) => (
            <HeaderBackButton
              {...props}
              onPress={() => naviation.goBack()}
            />
          ),
        }}
      />
      <Stack.Screen
        name="MangaPage"
        component={MangaPage}
        options={{
          headerLeft: (props) => (
            <HeaderBackButton
              {...props}
              onPress={() => naviation.goBack()}
            />
          ),
        }}
      />
    </Stack.Navigator>
  )
}
