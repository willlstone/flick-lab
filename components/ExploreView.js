import {
  useEffect, useState, useRef, useCallback,
} from 'react';
import {
  StatusBar,
  View,
  StyleSheet,
  FlatList,
  Dimensions,
  Animated,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Title, useTheme, ToggleButton, IconButton,
} from 'react-native-paper';
import { fetchMovieCategory, handleLike } from '../services/api';
import DoubleClick from './DoubleClick';
import BackButton from './BackButton';
import FastImage from '../helpers/FastImage';
import GridSwitch from './GridSwitch';
import { getMovieWatchlist, getTVWatchlist } from '../services/storage';

const { width, height } = Dimensions.get('window');

const SPACING = 10;
const ITEM_SIZE = Math.round(width * 0.72);
const EMPTY_ITEM_SIZE = (width - ITEM_SIZE) / 2;
const BACKDROP_HEIGHT = height * 0.75;

function Backdrop({ movies, scrollX }) {
  const { colors } = useTheme();

  const renderItem = useCallback(({ item, index }) => {
    if (!item.backdrop) {
      return null;
    }

    const translateX = scrollX.interpolate({
      inputRange: [(index - 2) * ITEM_SIZE, (index - 1) * ITEM_SIZE],
      outputRange: [0, width],
    });
    return (
      <Animated.View
        removeClippedSubviews={false}
        style={{
          position: 'absolute',
          width: translateX,
          height,
          overflow: 'hidden',
        }}
      >
        <FastImage
          uri={item.backdrop}
          cacheKey={`${item.id}-backdrop`}
          style={{
            width,
            height: BACKDROP_HEIGHT,
            position: 'absolute',
          }}
        />
      </Animated.View>
    );
  });

  return (
    <View style={{ height: BACKDROP_HEIGHT, width, position: 'absolute' }}>
      <FlatList
        data={[{ key: 'empty-left' }, ...movies, { key: 'empty-right' }]}
        keyExtractor={(item) => `${item.key}-backdrop`}
        removeClippedSubviews={false}
        contentContainerStyle={{ width, height: BACKDROP_HEIGHT }}
        initialNumToRender={1}
        maxToRenderPerBatch={5}
        renderItem={renderItem}
      />
      <LinearGradient
        colors={['rgba(0, 0, 0, 0)', colors.background]}
        style={{
          height: BACKDROP_HEIGHT,
          width,
          position: 'absolute',
          bottom: 0,
        }}
      />
    </View>
  );
}

export default function ExploreView(props) {
  const { navigation } = props;
  const { movies, exploreParam, category = 'movie' } = props.route.params;
  const [exploreMovies, setExploreMovies] = useState(movies);
  const [movieWatchlist, setMovieWatchlist] = useState([]);
  const [tvWatchlist, setTVWatchlist] = useState([]);
  const { colors } = useTheme();
  const [currentPage, setCurrentPage] = useState(1);
  const scrollX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const getData = async () => {
      setMovieWatchlist(await getMovieWatchlist());
      setTVWatchlist(await getTVWatchlist());
    };
    getData();
  }, []);

  useEffect(() => {
    setExploreMovies(movies);
  }, [movies]);

  const getMore = async () => {
    const newMovies = await fetchMovieCategory(exploreParam, currentPage + 1, category);
    setCurrentPage(currentPage + 1);
    const oldMovies = exploreMovies;
    setExploreMovies([...oldMovies, ...newMovies]);
  };

  const renderItem = useCallback(({ item, index }) => {
    if (!item.poster) {
      return <View style={{ width: EMPTY_ITEM_SIZE }} />;
    }

    const inputRange = [
      (index - 2) * ITEM_SIZE,
      (index - 1) * ITEM_SIZE,
      index * ITEM_SIZE,
    ];

    const translateY = scrollX.interpolate({
      inputRange,
      outputRange: [100, 50, 100],
      extrapolate: 'clamp',
    });

    const isLiked = () => (category === 'movie'
      ? movieWatchlist?.some((listItem) => listItem.id === item.id)
      : tvWatchlist?.some((listItem) => listItem.id === item.id));

    const handleTapHeart = async () => {
      await handleLike(item, category);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      category === 'movie'
        ? await setMovieWatchlist(await getMovieWatchlist())
        : await setTVWatchlist(await getTVWatchlist());
    };

    return (
      <DoubleClick
        icon
        delay={300}
        timeout={1000}
        doubleClick={() => {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          handleLike(item, category);
        }}
        singleClick={() => {
          navigation.navigate('Details', { id: item.id, category });
        }}
      >

        <View style={{ width: ITEM_SIZE }}>
          <Animated.View
            style={{
              marginHorizontal: SPACING,
              padding: SPACING * 2,
              alignItems: 'center',
              transform: [{ translateY }],
              backgroundColor: colors.background,
              borderRadius: 34,
              marginTop: '100%',
              marginBottom: 20,
            }}
          >
            <FastImage
              uri={item.poster}
              cacheKey={`${item.id}-poster`}
              style={styles.posterImage}
            />

            <IconButton
              icon={isLiked() ? 'heart' : 'heart-outline'}
              iconColor="rgba(255, 102, 102, 0.88)"
              size={30}
              style={{ position: 'absolute', right: 12, bottom: 55 }}
              onPress={handleTapHeart}
            />

            <Title style={{ fontSize: 24, textAlign: 'center', fontWeight: '800' }} numberOfLines={1}>
              {item.title}
            </Title>
          </Animated.View>
        </View>
      </DoubleClick>
    );
  });

  if (exploreMovies.length === 0) {
    return null;
  }

  return (
    <View style={{ ...styles.container, backgroundColor: colors.background }}>
      <GridSwitch onPress={() => navigation.push('Grid', { movies: exploreMovies, exploreParam, category })} icon="view-grid-outline" />
      <Backdrop movies={exploreMovies} scrollX={scrollX} />
      <StatusBar hidden />
      <Animated.FlatList
        showsHorizontalScrollIndicator={false}
        data={[{ key: 'empty-left' }, ...exploreMovies, { key: 'empty-right' }]}
        keyExtractor={(item) => item.key}
        horizontal
        bounces={false}
        decelerationRate={Platform.OS === 'ios' ? 0 : 0.98}
        contentContainerStyle={{ alignItems: 'center' }}
        snapToInterval={ITEM_SIZE}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false },
        )}
        onScrollEndDrag={() => {
          Haptics.impactAsync('light');
        }}
        scrollEventThrottle={16}
        initialNumToRender={1}
        maxToRenderPerBatch={5}
        onEndReachedThreshold={0.5}
        onEndReached={() => {
          getMore();
        }}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 24,
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  posterImage: {
    width: '100%',
    height: ITEM_SIZE * 1.2,
    resizeMode: 'cover',
    borderRadius: 24,
    margin: 0,
    marginBottom: 10,
  },
  shared: {
    width: '100%',
  },
});
