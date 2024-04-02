import { useState, useEffect, useCallback } from 'react';
import {
  View, ScrollView, RefreshControl,
} from 'react-native';
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';
import { fetchMovieCategory, fetchTrending } from '../services/api';
import HorizontalMovieGrid from './HorizontalMovieGrid';
import HorizontalMovieList from './HorizontalMovieList';
import MovieBanners from './MovieBanners';

export default function DiscoverTV({ navigation }) {
  const [airingToday, setAiringToday] = useState([]);
  const [popular, setPopular] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setAiringToday(await fetchMovieCategory('airing_today', 1, 'tv'));
    setPopular(await fetchMovieCategory('popular', 1, 'tv'));
    setTopRated(await fetchMovieCategory('top_rated', 1, 'tv'));
    setUpcoming(await fetchMovieCategory('on_the_air', 1, 'tv'));
    setRefreshing(false);
  }, []);

  console.log(airingToday);

  useEffect(() => {
    const fetchData = async () => {
      setAiringToday(await fetchMovieCategory('airing_today', 1, 'tv'));
      setPopular(await fetchMovieCategory('popular', 1, 'tv'));
      setTopRated(await fetchMovieCategory('top_rated', 1, 'tv'));
      setUpcoming(await fetchMovieCategory('on_the_air', 1, 'tv'));
    };

    if (airingToday.length === 0 || popular.length === 0 || upcoming.length === 0 || topRated.length === 0) {
      fetchData();
    }
  }, [airingToday]);

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
        <MovieBanners movies={airingToday.filter((show) => show.language === 'en')} title="Airing Today" navigation={navigation} category="tv" />
        <HorizontalMovieGrid movies={popular} title="Popular" param="popular" navigation={navigation} category="tv" />
        <HorizontalMovieList movies={upcoming} title="This Week" param="on_the_air" navigation={navigation} category="tv" />
        <HorizontalMovieGrid movies={topRated} title="Top Rated" param="top_rated" navigation={navigation} category="tv" />
      </ScrollView>
    </>
  );
}

const styles = {
  container: {
    marginLeft: 24,
  },
};
