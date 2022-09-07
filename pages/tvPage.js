import { createRef, useEffect, useContext } from 'react';
import ExploreView from "../components/ExploreView";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Details from "../components/MovieDetails";
import DiscoverTV from "../components/DiscoverTV";
import CardTest from "../components/CardTest";
import { useTheme } from 'react-native-paper';
import GridView from '../components/GridView';
import { StateContext } from '../services/state';

const Stack = createNativeStackNavigator();

export default function TVPage({ jumpTo }) {
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
        headerShown: false
      }}>
        <Stack.Screen name="Discover" component={DiscoverTV} />
        <Stack.Screen name="Explore" component={ExploreView} />
        <Stack.Screen name="Details" component={Details} />
        <Stack.Screen name="Images" component={CardTest} />
        <Stack.Screen name="Grid" component={GridView} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};