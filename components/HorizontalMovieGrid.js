import {
  ScrollView, TouchableOpacity, Image, View, FlatList,
} from 'react-native';
import { Title, Button, Text } from 'react-native-paper';
import { useFonts } from 'expo-font';
import Skeleton from './skeleton/HorizontalGridSkeleton';
import FastImage from '../helpers/FastImage';

export default function HorizontalMovieGrid({
  movies, title, param, navigation, category, ratings = false, movieRatings = [], tvRatings = [],
}) {
  const doubleRow = movies?.length > 7;

  const moviePairs = movies.reduce((previousValue, currentValue, currentIndex, array) => {
    if (!doubleRow) previousValue.push(array.slice(currentIndex, currentIndex + 1));
    else if (currentIndex % 2 === 0) previousValue.push(array.slice(currentIndex, currentIndex + 2));
    return previousValue;
  }, []);

  const cleanedMovies = movies.map((movie) => ({ ...movie, key: movie.id }));

  const [fontsLoaded] = useFonts({
    Avenida: require('../assets/fonts/AVENIDA.ttf'),
  });

  const onPress = () => {
    if (ratings) {
      navigation.navigate('SortableGrid', { movies: cleanedMovies, category });
    } else {
      navigation.navigate('Explore', { movies: cleanedMovies, exploreParam: param, category });
    }
  };

  if (!moviePairs || moviePairs.length === 0) {
    return <Skeleton />;
  }

  return (
    <>
      <View style={styles.titleRow}>
        <Title style={styles.rowHeader}>{title}</Title>
        <Button
          icon="unfold-more-vertical"
          onPress={onPress}
        >
          See All
        </Button>
      </View>
      <FlatList
        style={styles.scrollView}
        horizontal
        showsHorizontalScrollIndicator={false}
        data={moviePairs}
        initialNumToRender={5}
        renderItem={({ item: moviePair, index }) => {
          const movieGradeTop = movies?.find((item) => item.id === moviePair[0].id)?.grade;
          const movieGradeBottom = movies?.find((item) => item.id === moviePair?.at(1)?.id)?.grade;

          return (
            <View style={styles.verticalMovies} key={`${moviePair[0].id}-grid-view`}>
              <TouchableOpacity
                key={moviePair[0].id}
                onPress={() => {
                  navigation.navigate('Details', { id: moviePair[0].id, category });
                }}
              >
                <FastImage
                  style={styles.singleRowPoster}
                  cacheKey={`${moviePair[0].id}-poster-${category}`}
                  uri={`https://image.tmdb.org/t/p/w500/${moviePair[0].poster}`}
                />
                { ratings && (
                <View style={styles.gradeViewSmall}>
                  <Text style={{ ...styles.gradeTextSmall }}>{movieGradeTop}</Text>
                </View>
                )}
              </TouchableOpacity>

              {moviePair?.at(1)
              && (
              <TouchableOpacity
                key={moviePair[1].id}
                onPress={() => {
                  navigation.navigate('Details', { id: moviePair[1].id, category });
                }}
              >
                <FastImage
                  style={styles.singleRowPoster}
                  cacheKey={`${moviePair[1].id}-poster-${category}`}
                  uri={`https://image.tmdb.org/t/p/w500/${moviePair[1].poster}`}
                  // source={{ uri: `https://image.tmdb.org/t/p/w500/${moviePair[1].poster}` }}
                />
                { ratings && (
                <View style={styles.gradeViewSmall}>
                  <Text style={{ ...styles.gradeTextSmall }}>{movieGradeBottom}</Text>
                </View>
                )}
              </TouchableOpacity>
              )}

            </View>
          );
        }}
      />
    </>
  );
}

const styles = {
  rowHeader: {
    marginBottom: 10,
    fontWeight: '800',
  },
  verticalMovies: {
    display: 'flex',
    flexDirection: 'column',
  },
  singleRowPoster: {
    width: 100,
    height: 150,
    marginRight: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  scrollView: {
    marginBottom: 10,
  },
  titleRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  gradeViewSmall: {
    marginRight: 8,
    // borderColor: 'white',
    // borderWidth: 1,
    width: 25,
    height: 25,
    // borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 9,
    right: 0,
  },
  gradeTextSmall: {
    fontFamily: 'Avenida',
    color: 'white',
    fontWeight: '600',
    fontSize: 18,
  },
};
