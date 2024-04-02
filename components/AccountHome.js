import {
  useState, useContext, useEffect, useCallback,
} from 'react';
import {
  SafeAreaView, ScrollView, RefreshControl, StyleSheet, View,
} from 'react-native';
import {
  Text, IconButton, Title, useTheme,
} from 'react-native-paper';
import HorizontalMovieList from './HorizontalMovieList';
import HorizontalMovieGrid from './HorizontalMovieGrid';
import {
  getMovieWatchlist, getTVWatchlist, getMovieRatings, getTVRatings, resetCache,
} from '../services/storage';
import { StateContext } from '../services/state';

function AccountHome({ navigation }) {
  const [movieWatchlist, setMovieWatchlist] = useState([]);
  const [tvWatchlist, setTVWatchlist] = useState([]);
  const [movieRatings, setMovieRatings] = useState([]);
  const [tvRatings, setTVRatings] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const { tabIsReset, resetTab } = useContext(StateContext);

  const { colors } = useTheme();

  useEffect(() => {
    const getData = async () => {
      // await resetCache();
      setMovieWatchlist(await getMovieWatchlist());
      setTVWatchlist(await getTVWatchlist());
      setMovieRatings(await getMovieRatings());
      setTVRatings(await getTVRatings());
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
    setMovieRatings(await getMovieRatings());
    setTVRatings(await getTVRatings());
    setRefreshing(false);
  }, []);

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
        <View style={styles.row}>
          <Title style={{ ...styles.title, color: colors.primary }}>My Stuff</Title>
          <IconButton
            icon="cog"
            size={20}
            iconColor={colors.primary}
            onPress={() => navigation.push('Settings')}
          />
        </View>

        {movieWatchlist?.length === 0 && tvWatchlist.length === 0
          ? (
            <View style={styles.info}>
              <Text>Favorite movies and tv to find them here later!</Text>
            </View>
          )
          : (
            <>
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

              <HorizontalMovieGrid movies={movieRatings} title="My Movie Ratings" navigation={navigation} category="movie" ratings />

              <HorizontalMovieGrid movies={tvRatings} title="My TV Ratings" navigation={navigation} category="tv" ratings />
            </>
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

export default AccountHome;
