import { useContext } from 'react';
import { ScrollView, TouchableOpacity } from 'react-native';
import { Title } from 'react-native-paper';
import { StateContext } from '../services/state';
import MyLoader from './skeleton/bannerListSkeleton';
import FastImage from '../helpers/FastImage';

export default function MovieBanners({
  movies, title, navigation, category,
}) {
  if (!movies || movies.length === 0) {
    return (
      <MyLoader />
    );
  }

  return (
    <>
      <Title style={styles.rowHeader}>{title}</Title>
      <ScrollView style={styles.scrollView} horizontal showsHorizontalScrollIndicator={false}>
        {movies?.map((movie) => (
          <TouchableOpacity
            key={movie.id}
            onPress={() => {
              navigation.push('Details', { id: movie.id, category });
            }}
          >
            <FastImage
              cacheKey={`${movie.id}-banner`}
              style={styles.singleRowPoster}
              uri={movie.backdrop}
            />
            <Title style={styles.movieName}>{movie.title}</Title>
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
    width: 325,
    height: 175,
    marginRight: 12,
    borderRadius: 12,
  },
  scrollView: {
    marginBottom: 10,
  },
  movieName: {
    position: 'absolute',
    bottom: 0,
    left: 10,
    fontWeight: '800',
    color: 'white',
  },
};
