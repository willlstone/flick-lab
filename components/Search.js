import { useState, useEffect, useMemo, useRef } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import debouce from 'lodash.debounce';
import {
  Text, TextInput, useTheme, Searchbar, SegmentedButtons, Chip,
} from 'react-native-paper';
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';
import { search } from '../services/api';
import FastImage from '../helpers/FastImage';

import GridView from './GridView';

export default function Search({ navigation }) {
  const [text, setText] = useState('');
  const [query, setQuery] = useState('asf');
  const [category, setCategory] = useState('movie');
  const [results, setResults] = useState([]);
  const { colors } = useTheme();

  const inputRef = useRef();

  const handleChange = (e) => {
    console.log('handleChange');
    // console.log('handle change: ', e);
    setQuery(e);
  };

  const debouncedResults = useMemo(() => {
    console.log('debouncedResults');
    return debouce(handleChange, 1000);
  }, []);

  useEffect(() => () => {
    debouncedResults.cancel();
  });

  useEffect(() => {
    const fetchResults = async () => {
      setResults(await search(query, category));
    };

    if (query?.length > 3) {
      fetchResults();
      // console.log(results);
    }
  }, [query]);

  return (
    <>
      <SafeAreaInsetsContext.Consumer>
        {(insets) => <View style={{ paddingTop: insets.top }} />}
      </SafeAreaInsetsContext.Consumer>

      <View style={styles.container}>
      <TextInput
        ref={inputRef}
        style={{ marginTop: 20 }}
        label="Search"
        mode="outlined"
        right={<TextInput.Icon icon="close" onPress={() => inputRef.current.setNativeProps({ text: '' })} />}
        left={<TextInput.Icon icon="magnify" />}
        // value={text}
        onChangeText={(e) => {
          if (e.length > 3) {
            debouncedResults(e);
          }}}
      />
        {/* <Searchbar
          style={{ marginTop: 20 }}
          placeholder="Search"
          onChangeText={(e) => {
            if (e.length > 3) {
              console.log('length > 4');
              debouncedResults(e);
            }
            // setText(e);
          }}
      // value={text}
          icon="magnify"
          loading={false}
        /> */}
        <View style={styles.row}>
          <Chip selected={category === 'movie'} showSelectedOverlay={category === 'movie'} mode="outlined" style={styles.chip} onPress={() => setCategory('movie')}>Movies</Chip>
          <Chip selected={category === 'tv'} showSelectedOverlay={category === 'tv'} mode="outlined" style={styles.chip} onPress={() => setCategory('tv')}>TV</Chip>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.innerContainer}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={400}
        >
          {results?.map((movie) => (
            <TouchableOpacity
              key={movie.id}
              onPress={() => {
                navigation.push('Details', { id: movie.id, category });
              }}
            >
              <FastImage
                style={styles.singleRowPoster}
                cacheKey={`${movie.id}-poster`}
                uri={`https://image.tmdb.org/t/p/w500/${movie.poster}`}
              />
            </TouchableOpacity>
          ))}
        </ScrollView>

      </View>
    </>
  );
}

const styles = {
  container: {
    marginHorizontal: 24,
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    marginVertical: 10,
    alignItems: 'stretch',
  },
  chip: {
    marginRight: 10,
  },
  singleRowPoster: {
    width: 150,
    height: 225,
    // width: 100,
    // height: 150,
    marginBottom: 12,
    borderRadius: 12,
  },
  scrollView: {
    marginTop: 22,
    marginBottom: 'auto',
  },
  innerContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
    zIndex: 1,
  },
};
