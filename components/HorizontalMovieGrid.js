import {
  ScrollView, TouchableOpacity, Image, View,
} from 'react-native';
import { Title, Button } from 'react-native-paper';
import Skeleton from './skeleton/HorizontalGridSkeleton';
import FastImage from '../helpers/FastImage';

export default function HorizontalMovieGrid({
  movies, title, param, navigation, category,
}) {
  const moviePairs = movies.reduce((result, value, index, array) => {
    if (index % 2 === 0) result.push(array.slice(index, index + 2));
    return result;
  }, []);

  const onPress = () => {
    navigation.navigate('Explore', { movies, exploreParam: param, category });
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
      <ScrollView style={styles.scrollView} horizontal showsHorizontalScrollIndicator={false}>
        {moviePairs
            && moviePairs.map((moviePair) => (
              <View style={styles.verticalMovies} key={`${moviePair[0].id}-grid-view`}>
                <TouchableOpacity
                  key={moviePair[0].id}
                  onPress={() => {
                    navigation.navigate('Details', { id: moviePair[0].id, category });
                  }}
                >
                  <Image
                    style={styles.singleRowPoster}
                    cacheKey={`${moviePair[0].id}-poster-${category}`}
                    // uri={`https://image.tmdb.org/t/p/w500/${moviePair[0].poster}`}
                    source={{uri: `https://image.tmdb.org/t/p/w500/${moviePair[0].poster}`}}
                  />
                </TouchableOpacity>

                {moviePair?.at(1)
                  && (
                  <TouchableOpacity
                    key={moviePair[1].id}
                    onPress={() => {
                      navigation.navigate('Details', { id: moviePair[1].id, category });
                    }}
                  >
                    <Image
                      style={styles.singleRowPoster}
                      cacheKey={`${moviePair[1].id}-poster-${category}`}
                      // uri={`https://image.tmdb.org/t/p/w500/${moviePair[1].poster}`}
                      source={{uri: `https://image.tmdb.org/t/p/w500/${moviePair[1].poster}`}}
                    />
                  </TouchableOpacity>
                  )}

              </View>
            ))}
      </ScrollView>
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
};
