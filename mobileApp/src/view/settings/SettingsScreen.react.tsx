import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import RootScreen from './RootScreen.react'
import UploadScreen from './UploadScreen.react'
const Stack = createStackNavigator()

export default function SettingsScreen(): JSX.Element {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
      }}
    >
      <Stack.Screen
        name="SettingsRoot"
        component={RootScreen}
      />
      <Stack.Screen
        name="Upload"
        component={UploadScreen}
      />
    </Stack.Navigator>
  )
}
