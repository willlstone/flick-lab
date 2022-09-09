import { useContext } from 'react';
import {
  ScrollView, TouchableOpacity, Image, View,
} from 'react-native';
import { Title, Button } from 'react-native-paper';
import { StateContext } from '../services/state';
import Skeleton from './skeleton/HorizontalListSkeleton';
import FastImage from '../helpers/FastImage';

export default function HorizontalMovieList({
  movies, title, func, param, navigation, category,
}) {
  const {
    setMovie, setExploreMovies, setExploreFunction, setExploreParam,
  } = useContext(StateContext);

  const onPress = () => {
    navigation.navigate('Explore', { movies, exploreParam: param, category });
  };

  if (!movies || movies.length === 0) {
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
        {movies?.map((movie) => (
          <TouchableOpacity
            key={movie.id}
            onPress={() => {
              navigation.push('Details', { id: movie.id, category });
            }}
          >
            <Image
              style={styles.singleRowPoster}
              cacheKey={`${movie.id}-poster-${category}`}
              // uri={`https://image.tmdb.org/t/p/w500/${movie.poster}`}
              source={{uri: `https://image.tmdb.org/t/p/w500/${movie.poster}`}}
            />
          </TouchableOpacity>
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
  singleRowPoster: {
    width: 150,
    height: 225,
    marginRight: 12,
    borderRadius: 12,
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
