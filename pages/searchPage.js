import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from 'react-native-paper';
import React, { useContext, useEffect, createRef } from 'react';
import ExploreView from '../components/ExploreView';
import Details from '../components/MovieDetails';
import Search from '../components/Search';
import CardTest from '../components/CardTest';
import GridView from '../components/GridView';
import { StateContext } from '../services/state';

const Stack = createNativeStackNavigator();

export default function SearchPage({ jumpTo }) {
  const theme = useTheme();
  const { tabIsReset, resetTab } = useContext(StateContext);

  const navigationRef = createRef();

  useEffect(() => {
    if (tabIsReset) {
      resetTab(false);
      navigationRef.current?.navigate('Search', {});
    }
  }, [tabIsReset]);
  return (
    <NavigationContainer theme={theme} ref={navigationRef}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Search" component={Search} />
        <Stack.Screen name="Explore" component={ExploreView} />
        <Stack.Screen name="Grid" component={GridView} />
        <Stack.Screen name="Details" component={Details} />
        <Stack.Screen name="Images" component={CardTest} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
