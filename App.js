import React from 'react';
import {
  IconButton, MD3DarkTheme, MD3LightTheme as DefaultTheme, Provider as PaperProvider,
} from 'react-native-paper';
import { useColorScheme, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Navigation from './components/Navigation';
import { StateContextProvider } from './services/state';

const someColors = {
  backdrop: 'red',
  background: 'red',
  elevation: {
    level0: 'red',
    level1: 'blue',
    level2: 'red',
    level3: 'green',
    level4: 'purple',
    level5: 'orange',
  },
  error: 'red',
  errorContainer: 'red',
  inverseOnSurface: 'red',
  inversePrimary: 'red',
  inverseSurface: 'red',
  onBackground: 'red',
  onError: 'red',
  onErrorContainer: 'red',
  onPrimary: 'red',
  onPrimaryContainer: 'red',
  onSecondary: 'red',
  onSecondaryContainer: 'red',
  onSurface: 'rgba(230, 225, 229, 1)',
  onSurfaceDisabled: 'rgba(230, 225, 229, 0.38)',
  onSurfaceVariant: 'rgba(202, 196, 208, 1)',
  onTertiary: 'rgba(73, 37, 50, 1)',
  onTertiaryContainer: 'rgba(255, 216, 228, 1)',
  outline: 'rgba(147, 143, 153, 1)',
  primary: 'rgba(208, 188, 255, 1)',
  primaryContainer: 'rgba(79, 55, 139, 1)',
  secondary: 'rgba(204, 194, 220, 1)',
  secondaryContainer: 'rgba(74, 68, 88, 1)',
  surface: 'rgba(28, 27, 31, 1)',
  surfaceDisabled: 'rgba(230, 225, 229, 0.12)',
  surfaceVariant: 'rgba(73, 69, 79, 1)',
  tertiary: 'rgba(239, 184, 200, 1)',
  tertiaryContainer: 'rgba(99, 59, 72, 1)',
};

const lightTheme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: '#1A1A1A',
    accent: '#FAFAFA',
    // onSurface: 'teal',
  },
};

const darkTheme = {
  ...MD3DarkTheme,
  roundness: 2,
  colors: {
    // ...someColors,
    ...MD3DarkTheme.colors,
    // onSurface: 'orange',
    // backgr: 'blue',
    // "backdrop": "rgba(50, 47, 55, 0.4)",
    // "background": "rgba(28, 27, 31, 1)",
    // chancges active tab selected color onSurface: '#1A1A1A',
    // secondaryContainer changes the selected tab oval
    // bottomnav color is elevation.level2
    elevation: {
      level0: 'transparent',
      level1: 'blue',
      level2: 'rgba(28, 27, 31, 1)',
      level3: 'green',
      level4: 'purple',
      level5: 'orange',
    },
  },
  // colors: {
  //   ...DefaultTheme.colors,
  //   primary: "#FAFAFA",
  //   accent: "#1A1A1A",
  // the movie details white color (onSurface) for dark mode:: rgba(230, 225, 229, 1)
  // },
};

// "error": "rgba(179, 38, 30, 1)",
// "errorContainer": "rgba(249, 222, 220, 1)",
// "inverseOnSurface": "rgba(244, 239, 244, 1)",
// "inversePrimary": "rgba(208, 188, 255, 1)",
// "inverseSurface": "rgba(49, 48, 51, 1)",
// "onBackground": "rgba(28, 27, 31, 1)",
// "onError": "rgba(255, 255, 255, 1)",
// "onErrorContainer": "rgba(65, 14, 11, 1)",
// "onPrimary": "rgba(255, 255, 255, 1)",
// "onPrimaryContainer": "rgba(33, 0, 93, 1)",
// "onSecondary": "rgba(255, 255, 255, 1)",
// "onSecondaryContainer": "rgba(29, 25, 43, 1)",
// "onSurface": "rgba(28, 27, 31, 1)",
// "onSurfaceDisabled": "rgba(28, 27, 31, 0.38)",
// "onSurfaceVariant": "rgba(73, 69, 79, 1)",

// console.log(MD3DarkTheme.colors);

export default function App() {
  const scheme = useColorScheme();
  // console.log(scheme);
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
