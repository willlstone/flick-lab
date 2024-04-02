import { useState } from 'react';
import {
  StyleSheet, ScrollView, TouchableOpacity, View,
} from 'react-native';
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';
import FastImage from '../helpers/FastImage';
import { fetchMovieCategory } from '../services/api';
import GridSwitch from './GridSwitch';

export default function GridView(props) {
  const { navigation } = props;
  const { movies, exploreParam = 'na', category = 'movie' } = props.route.params;

  const [gridMovies, setGridMovies] = useState(movies);
  const [currentPage, setCurrentPage] = useState(1);

  const getMore = async () => {
    const newMovies = await fetchMovieCategory(exploreParam, currentPage + 1, category);
    setCurrentPage(currentPage + 1);
    const oldMovies = gridMovies;
    setGridMovies([...oldMovies, ...newMovies]);
  };

  const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
    const paddingToBottom = 20;
    return layoutMeasurement.height + contentOffset.y
          >= contentSize.height - paddingToBottom;
  };

  const displayMovies = () => {
    const newMovies = gridMovies;
    return newMovies;
  };

  return (
    <>
      <SafeAreaInsetsContext.Consumer>
        {(insets) => <View style={{ paddingTop: insets.top }} />}
      </SafeAreaInsetsContext.Consumer>

      <GridSwitch
        onPress={() => navigation.push('Explore', { movies: gridMovies, exploreParam })}
        icon="unfold-more-vertical"
        style={styles.button}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.container}
        onScroll={({ nativeEvent }) => {
          if (exploreParam && isCloseToBottom(nativeEvent)) {
            getMore();
          }
        }}
        scrollEventThrottle={400}
      >
        {displayMovies()?.map((movie) => (
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
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 24,
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    zIndex: 1,
  },
  singleRowPoster: {
    width: 100,
    height: 150,
    marginBottom: 12,
    borderRadius: 12,
  },
  scrollView: {
    marginTop: 25,
  },
});
