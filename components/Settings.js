import { useState, useEffect, useContext } from 'react';
import {
  View, StyleSheet, SafeAreaView, Image,
} from 'react-native';
import {
  Title, IconButton, useTheme, Caption, RadioButton, Divider, Button,
} from 'react-native-paper';
import {
  clearCache, getTheme, resetCache, saveTheme,
} from '../services/storage';
import { StateContext } from '../services/state';

export default function Settings({ navigation }) {
  const [value, setValue] = useState('');
  const { setThemeReset, themeReset } = useContext(StateContext);
  const { colors } = useTheme();

  const handleThemeChange = async (value) => {
    await saveTheme(value);
    setValue(value);
    await setThemeReset(!themeReset);
  };

  useEffect(() => {
    const getData = async () => {
      setValue(await getTheme());
    };
    getData();
  });

  const handleResetCache = async () => await resetCache();

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ ...styles.row, marginBottom: 10 }}>
        <Title style={{ ...styles.title, color: colors.primary }}>Settings</Title>
      </View>
      <Divider />

      <Caption>App theme</Caption>
      <RadioButton.Group
        onValueChange={(value) => handleThemeChange(value)}
        value={value}
      >
        <RadioButton.Item label="Light Theme" value="light" />
        <RadioButton.Item label="Dark Theme" value="dark" />
        <RadioButton.Item label="Use System Theme" value="system" />
      </RadioButton.Group>

      <Divider />

      <Caption>App Storage</Caption>
      <Button
        mode="contained"
        style={{ marginRight: 24, marginTop: 10 }}
        onPress={handleResetCache}
      >
        Reset App Data
      </Button>

      <View style={{
        display: 'flex', flexDirection: 'column', justifyContent: 'center', alignContent: 'center', position: 'absolute', bottom: 10,
      }}
      >
        <Caption>This app is powered by the TMDb API.</Caption>
        <Image
          source={require('../assets/tmdb.png')}
        />
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginLeft: 24,
  },
  info: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontWeight: '700',
  },
});
