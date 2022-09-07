import ExploreView from "../components/ExploreView";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Details from "../components/MovieDetails";
import Search from "../components/Search";
import CardTest from "../components/CardTest";
import { useTheme } from 'react-native-paper';
import GridView from "../components/GridView";
import { StateContext } from "../services/state";
import { useContext, useEffect, createRef } from "react";

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
        headerShown: false
      }}>
        <Stack.Screen name="Search" component={Search} />
        <Stack.Screen name="Explore" component={ExploreView} />
        <Stack.Screen name="Grid" component={GridView} />
        <Stack.Screen name="Details" component={Details} />
        <Stack.Screen name="Images" component={CardTest} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};