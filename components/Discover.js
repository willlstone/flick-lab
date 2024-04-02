import { useState, useEffect, useCallback } from 'react';
import {
  View, ScrollView, RefreshControl,
} from 'react-native';
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';
import { fetchMovieCategory, fetchTrending } from '../services/api';
import HorizontalMovieGrid from './HorizontalMovieGrid';
import HorizontalMovieList from './HorizontalMovieList';
import MovieBanners from './MovieBanners';

export default function Discover({ navigation }) {
  const [nowPlaying, setNowPlaying] = useState([]);
  const [popular, setPopular] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [trending, setTrending] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setNowPlaying(await fetchMovieCategory('now_playing'));
    setPopular(await fetchMovieCategory('popular'));
    setTopRated(await fetchMovieCategory('top_rated'));
    setUpcoming(await fetchMovieCategory('upcoming'));
    setTrending(await fetchTrending('movie', 'week'));
    setRefreshing(false);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setNowPlaying(await fetchMovieCategory('now_playing'));
      setPopular(await fetchMovieCategory('popular'));
      setTopRated(await fetchMovieCategory('top_rated'));
      setUpcoming(await fetchMovieCategory('upcoming'));
      setTrending(await fetchTrending('movie', 'week'));
    };

    if (nowPlaying.length === 0 || popular.length === 0 || upcoming.length === 0 || topRated.length === 0) {
      fetchData();
    }
  }, [nowPlaying]);

  return (
    <>
      <SafeAreaInsetsContext.Consumer>
        {(insets) => <View style={{ paddingTop: insets.top }} />}
      </SafeAreaInsetsContext.Consumer>

      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        refreshControl={(
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
      )}
      >
        <MovieBanners movies={trending} title="Trending this Week" navigation={navigation} />
        <HorizontalMovieList movies={nowPlaying} title="Now Playing" func={fetchMovieCategory} param="now_playing" navigation={navigation} />
        <HorizontalMovieGrid movies={popular} title="Popular" func={fetchMovieCategory} param="popular" navigation={navigation} />
        <HorizontalMovieList movies={upcoming} title="Upcoming" func={fetchMovieCategory} param="upcoming" navigation={navigation} />
        <HorizontalMovieGrid movies={topRated} title="Top Rated" func={fetchMovieCategory} param="top_rated" navigation={navigation} />
      </ScrollView>
    </>
  );
}

const styles = {
  container: {
    marginLeft: 24,
  },
};
