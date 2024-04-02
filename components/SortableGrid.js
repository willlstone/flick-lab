import { useState } from 'react';
import {
  StyleSheet, ScrollView, TouchableOpacity, View,
} from 'react-native';
import {
  Text, IconButton, useTheme, Title,
} from 'react-native-paper';
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';
import FastImage from '../helpers/FastImage';
import { fetchMovieCategory } from '../services/api';
import { getMovieRatings, getTVRatings } from '../services/storage';
import GridSwitch from './GridSwitch';

export default function SortableGrid(props) {
  const { navigation } = props;
  const { movies, category = 'movie' } = props.route.params;
  const { colors } = useTheme();
  const [sort, setSort] = useState('Date Added');

  const [gridMovies, setGridMovies] = useState(movies);
  const [currentPage, setCurrentPage] = useState(1);

  const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
    const paddingToBottom = 20;
    return layoutMeasurement.height + contentOffset.y
          >= contentSize.height - paddingToBottom;
  };

  const displayMovies = () => {
    const newMovies = gridMovies;
    return newMovies;
  };

  const reverseMovies = () => {
    const newArray = [...gridMovies];
    newArray.reverse();
    setGridMovies(newArray);
  };

  const handleChangeSort = async () => {
    if (sort === 'Date Added') {
      setSort('Grade');
      const newArray = [...gridMovies];
      newArray.sort((a, b) => (a.grade.charCodeAt(0) === b.grade.charCodeAt(0) // If the letters are the same
        ? (a.grade.charCodeAt(1) || 44) - (b.grade.charCodeAt(1) || 44) // Just compare the postfix
        : a.grade.charCodeAt(0) - b.grade.charCodeAt(0)), // Otherwise compare the letters
      );
      setGridMovies(newArray);
    } else if (sort === 'Grade') {
      setSort('Date Added');
      category === 'movie' ? setGridMovies(await getMovieRatings()) : setGridMovies(await getTVRatings());
    }
  };

  return (
    <>
      <SafeAreaInsetsContext.Consumer>
        {(insets) => <View style={{ paddingTop: insets.top }} />}
      </SafeAreaInsetsContext.Consumer>

      <View style={styles.row}>
        <TouchableOpacity onPress={handleChangeSort}>
          <Text style={{ fontWeight: '700', color: colors.primary }}>{`Sort by ${sort}`}</Text>
        </TouchableOpacity>
        <IconButton
          icon="sort-ascending"
          style={styles.button}
          iconColor={colors.primary}
          size={25}
          onPress={() => reverseMovies()}
        />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.container}
        scrollEventThrottle={400}
      >
        {displayMovies()?.map((movie) => (
          <TouchableOpacity
            key={movie.id}
            onPress={() => {
              navigation.push('Details', { id: movie.id });
            }}
          >
            <FastImage
              style={styles.singleRowPoster}
              cacheKey={`${movie.id}-poster`}
              uri={`https://image.tmdb.org/t/p/w500/${movie.poster}`}
            />
            <View style={styles.gradeViewSmall}>
              <Text style={{ ...styles.gradeTextSmall }}>{movie.grade}</Text>
            </View>
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
    width: 110,
    height: 165,
    marginBottom: 12,
    borderRadius: 12,
  },
  scrollView: {
    // marginTop: 25,
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
    right: -5,
  },
  gradeTextSmall: {
    fontFamily: 'Avenida',
    color: 'white',
    fontWeight: '600',
    fontSize: 18,
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginHorizontal: 24,
  },
});
