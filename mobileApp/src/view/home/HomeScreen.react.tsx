import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import RootScreen from './RootScreen.react'
import MangaDetail from './MangaDetail.react'
import MangaPage from './MangaPage.react'
const Stack = createStackNavigator()

export default function SettingsScreen(): JSX.Element {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: false,
      }}
    >
      <Stack.Screen
        name="MangaList"
        component={RootScreen}
      />
      <Stack.Screen
        name="MangaDetail"
        component={MangaDetail}
      />
      <Stack.Screen
        name="MangaPage"
        component={MangaPage}
      />
    </Stack.Navigator>
  )
}
