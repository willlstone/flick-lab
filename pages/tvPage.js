import React, { createRef, useEffect, useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from 'react-native-paper';
import ExploreView from '../components/ExploreView';
import Details from '../components/MovieDetails';
import DiscoverTV from '../components/DiscoverTV';
import CardTest from '../components/CardTest';
import GridView from '../components/GridView';
import { StateContext } from '../services/state';

const Stack = createNativeStackNavigator();

export default function TVPage() {
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
        <Stack.Screen name="Discover" component={DiscoverTV} />
        <Stack.Screen name="Explore" component={ExploreView} />
        <Stack.Screen name="Details" component={Details} />
        <Stack.Screen name="Images" component={CardTest} />
        <Stack.Screen name="Grid" component={GridView} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
