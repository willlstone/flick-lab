import React, { createRef, useEffect, useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from 'react-native-paper';
import ExploreView from '../components/ExploreView';
import Details from '../components/MovieDetails';
import CardTest from '../components/CardTest';
import AccountHome from '../components/AccountHome';
import GridView from '../components/GridView';
import { StateContext } from '../services/state';
import Settings from '../components/Settings';
import SortableGrid from '../components/SortableGrid';

const Stack = createNativeStackNavigator();

export default function AccountPage() {
  const theme = useTheme();
  const { tabIsReset, resetTab } = useContext(StateContext);
  const navigationRef = createRef();

  useEffect(() => {
    if (tabIsReset) {
      resetTab(false);
      navigationRef.current?.navigate('Home', {});
    }
  }, [tabIsReset]);

  return (
    <NavigationContainer theme={theme} ref={navigationRef}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Home" component={AccountHome} />
        <Stack.Screen name="Settings" component={Settings} />
        <Stack.Screen name="Explore" component={ExploreView} />
        <Stack.Screen name="Details" component={Details} />
        <Stack.Screen name="Images" component={CardTest} />
        <Stack.Screen name="Grid" component={GridView} />
        <Stack.Screen name="SortableGrid" component={SortableGrid} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
