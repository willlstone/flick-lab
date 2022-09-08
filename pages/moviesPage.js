import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from 'react-native-paper';
import React, { useContext, useEffect, createRef } from 'react';
import ExploreView from '../components/ExploreView';
import GridView from '../components/GridView';
import Details from '../components/MovieDetails';
import Discover from '../components/Discover';
import CardTest from '../components/CardTest';
import { StateContext } from '../services/state';

const Stack = createNativeStackNavigator();

export default function MoviesPage() {
  const theme = useTheme();
  const { tabIsReset, resetTab } = useContext(StateContext);

  const navigationRef = createRef();

  useEffect(() => {
    if (tabIsReset) {
      resetTab(false);
      navigationRef.current?.navigate('Discover', {});
    }
  }, [tabIsReset]);

  return (
    <NavigationContainer theme={theme} ref={navigationRef}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Discover" component={Discover} />
        <Stack.Screen name="Explore" component={ExploreView} />
        <Stack.Screen name="Details" component={Details} />
        <Stack.Screen name="Images" component={CardTest} />
        <Stack.Screen name="Grid" component={GridView} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
