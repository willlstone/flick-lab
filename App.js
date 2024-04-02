import React, { useEffect, useState, useContext } from 'react';
import {
  MD3DarkTheme, MD3LightTheme as DefaultTheme, Provider as PaperProvider,
} from 'react-native-paper';
import { useColorScheme, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Navigation from './components/Navigation';
import { StateContextProvider, StateContext } from './services/state';
import { getTheme } from './services/storage';

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
  const [current, setCurrent] = useState('light');

  const { themeReset } = useContext(StateContext);

  useEffect(() => {
    const currentTheme = async () => {
      const savedTheme = await getTheme();
      let setScheme;
      if (savedTheme === 'light') setScheme = 'light';
      else if (savedTheme === 'dark') setScheme = 'dark';
      else setScheme = scheme;
      setCurrent(setScheme);
    };
    currentTheme();
  }, [themeReset]);

  return (
    <StateContextProvider>
      <ThemeWrapper />
    </StateContextProvider>

  );
}

function ThemeWrapper() {
  const scheme = useColorScheme();
  const [current, setCurrent] = useState('light');
  const { themeReset } = useContext(StateContext);

  useEffect(() => {
    const currentTheme = async () => {
      const savedTheme = await getTheme();
      let setScheme;
      if (savedTheme === 'light') setScheme = 'light';
      else if (savedTheme === 'dark') setScheme = 'dark';
      else setScheme = scheme;
      setCurrent(setScheme);
    };
    currentTheme();
  }, [themeReset]);

  return (
    <PaperProvider theme={current === 'dark' ? darkTheme : lightTheme}>
      <SafeAreaProvider>
        <Navigation />
      </SafeAreaProvider>
    </PaperProvider>
  );
}
