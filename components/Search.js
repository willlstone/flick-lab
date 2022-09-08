import {
  useState, useEffect, useMemo, useRef,
} from 'react';
import {
  View, ScrollView, TouchableOpacity, Animated, Easing,
} from 'react-native';
import debouce from 'lodash.debounce';
import {
  TextInput, useTheme, SegmentedButtons,
} from 'react-native-paper';
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';
import { search } from '../services/api';
import FastImage from '../helpers/FastImage';

export default function Search({ navigation }) {
  const [] = useState('');
  const [query, setQuery] = useState('asf');
  const [category, setCategory] = useState('movie');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const inputRef = useRef();
  const rotationDegree = useRef(new Animated.Value(0)).current;

  const startRotationAnimation = (durationMs, rotationDegree) => {
    Animated.loop(Animated.timing(
      rotationDegree,
      {
        toValue: 360,
        duration: durationMs,
        easing: Easing.linear,
        useNativeDriver: false,
      },
    )).start();
  };

  useEffect(() => {
    startRotationAnimation(1000, rotationDegree);
  }, []);

  const handleChange = (e) => {
    setQuery(e);
  };

  const debouncedResults = useMemo(() => debouce(handleChange, 1000), []);

  useEffect(() => () => {
    debouncedResults.cancel();
  });

  useEffect(() => {
    const fetchResults = async () => {
      setResults(await search(query, category));
      await setIsLoading(false);
    };

    if (query?.length > 3) {
      setIsLoading(true);
      fetchResults();
    }
  }, [query, category]);

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
          right={
            isLoading
              ? <TextInput.Icon icon="loading" style={styles.spinner(rotationDegree)} onPress={() => inputRef.current.setNativeProps({ text: '' })} />
              : <TextInput.Icon icon="close" onPress={() => inputRef.current.setNativeProps({ text: '' })} />
        }

          left={<TextInput.Icon icon="magnify" />}
          onChangeText={(e) => {
            if (e.length > 3) {
              debouncedResults(e);
            }
          }}
        />
        <View style={styles.row}>
          <SegmentedButtons
            density="small"
            value={category}
            onValueChange={setCategory}
            buttons={[
              {
                value: 'movie',
                label: 'Movies',
                icon: 'movie-outline',
              },
              {
                value: 'tv',
                label: 'TV',
                icon: 'television-classic',
              },
              {
                value: 'user',
                label: 'Users',
                icon: 'account-outline',
              },
            ]}
          />
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
    justifyContent: 'center',
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
  spinner: (rotationDegree) => ({
    transform: [{
      rotateZ: rotationDegree.interpolate({
        inputRange: [0, 360],
        outputRange: ['0deg', '360deg'],
      }),
    }],
  }),
};
