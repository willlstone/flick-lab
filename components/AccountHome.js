import {
  useState, useContext, useEffect, useCallback,
} from 'react';
import {
  SafeAreaView, ScrollView, RefreshControl, StyleSheet, View
} from 'react-native';
import { Text } from 'react-native-paper';
import HorizontalMovieList from './HorizontalMovieList';
import HorizontalMovieGrid from './HorizontalMovieGrid';
import { getMovieWatchlist, getTVWatchlist } from '../services/storage';
import { StateContext } from '../services/state';

function AccountHome({ navigation }) {
  const [movieWatchlist, setMovieWatchlist] = useState([]);
  const [tvWatchlist, setTVWatchlist] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const { tabIsReset, resetTab } = useContext(StateContext);

  useEffect(() => {
    const getData = async () => {
      setMovieWatchlist(await getMovieWatchlist());
      setTVWatchlist(await getTVWatchlist());
    };
    getData();
  }, []);

  useEffect(() => {
    if (tabIsReset) {
      resetTab(false);
      onRefresh();
    }
  }, [tabIsReset]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setMovieWatchlist(await getMovieWatchlist());
    setTVWatchlist(await getTVWatchlist());
    setRefreshing(false);
  }, []);

  if (movieWatchlist?.length === 0 && tvWatchlist.length === 0) {
    return (
      <View style={styles.info}>
      <Text>Favorite movies and tv to find them here later!</Text>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollView}
        refreshControl={(
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
      )}
      >
        {movieWatchlist.length < 8
          ? (
            <HorizontalMovieList movies={movieWatchlist} title="Movie Watchlist" navigation={navigation} />
          )
          : (
            <HorizontalMovieGrid movies={movieWatchlist} title="Movie Watchlist" navigation={navigation} />
          )}

        {tvWatchlist.length < 8
          ? (
            <HorizontalMovieList movies={tvWatchlist} title="TV Watchlist" navigation={navigation} category="tv" />
          )
          : (
            <HorizontalMovieGrid movies={tvWatchlist} title="TV Watchlist" navigation={navigation} category="tv" />
          )}
      </ScrollView>
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

});

export default AccountHome;
