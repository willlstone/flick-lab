import React from 'react';
import {
  MD3DarkTheme, MD3LightTheme as DefaultTheme, Provider as PaperProvider,
} from 'react-native-paper';
import { useColorScheme, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Navigation from './components/Navigation';
import { StateContextProvider } from './services/state';

const lightTheme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: '#1A1A1A',
    accent: '#FAFAFA',
    secondaryContainer: '#71D7C0',
    primary: '#71D7C0',
  },
};

const darkTheme = {
  ...MD3DarkTheme,
  roundness: 2,
  colors: {
    ...MD3DarkTheme.colors,
    secondaryContainer: '#71D7C0',
    primary: '#71D7C0',
    elevation: {
      level0: 'transparent',
      level1: 'blue',
      level2: 'rgba(28, 27, 31, 1)',
      level3: 'green',
      level4: 'purple',
      level5: 'orange',
    },
  },
};

export default function App() {
  const scheme = useColorScheme();
  return (
    <PaperProvider theme={scheme === 'dark' ? darkTheme : lightTheme}>
      <SafeAreaProvider>
        <StateContextProvider>
          <Navigation />
        </StateContextProvider>
      </SafeAreaProvider>
    </PaperProvider>
  );
}
