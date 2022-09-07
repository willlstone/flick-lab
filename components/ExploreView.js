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
import { Title, useTheme } from 'react-native-paper';
import { fetchMovieCategory, handleLike } from '../services/api';
import DoubleClick from './DoubleClick';
import BackButton from './BackButton';
import FastImage from '../helpers/FastImage';
import GridSwitch from './GridSwitch';

const { width, height } = Dimensions.get('window');

const SPACING = 10;
const ITEM_SIZE = Math.round(width * 0.72);
const EMPTY_ITEM_SIZE = (width - ITEM_SIZE) / 2;
const BACKDROP_HEIGHT = height * 0.75;

// backdrop function
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
    // renderItem (inside backdrop)
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

  // backdrop
  return (
    <View style={{ height: BACKDROP_HEIGHT, width, position: 'absolute' }}>
      <FlatList
        // data={movies.reverse()}
        data={[{ key: 'empty-left' }, ...movies, { key: 'empty-right' }]}
        keyExtractor={(item) => `${item.key}-backdrop`}
        removeClippedSubviews={false}
        contentContainerStyle={{ width, height: BACKDROP_HEIGHT }}
        initialNumToRender={1}
        maxToRenderPerBatch={5}
        renderItem={renderItem}
      />
      {/* TODO: fix colors to match theme */}
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
  // console.log({props});
  // const { jumpTo, backFunc, setDisplayPage } = props;
  const { navigation } = props;
  const { movies, exploreParam, category = 'movie' } = props.route.params;
  const [exploreMovies, setExploreMovies] = useState(movies);

  useEffect(() => {
    console.log({ exploreParam });
    setExploreMovies(movies);
  }, [movies]);
  //   const { item } = props.route.params;
  // const item = { id: 53 };

  const { colors } = useTheme();

  // const {
  //   setMovie, exploreMovies, exploreFunction, exploreParam, setExploreMovies,
  // } = useContext(StateContext);

  // const [scrollPosition, setScrollPosition]=useState(0)

  // const [movies, setMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const scrollX = useRef(new Animated.Value(0)).current;

  // const [ref, setRef] = useState(null);

  // ref.scrollToIndex(4);
  // this.flatListRef.scrollToIndex(5);

  // scrollX.current = 1000;

  // useEffect(() => {
  //   const fetchData = async () => {
  //     const movies = await getMoviesByGenre(item.id, 1);
  //     // Add empty items to create fake space
  //     // [empty_item, ...movies, empty_item]
  //     // setMovies([{ key: 'empty-left' }, ...movies, { key: 'empty-right' }]);
  //     setMovies(movies);
  //   //   console.log(movies.map((movie) => movie.title));
  //   };

  //   if (movies.length === 0) {
  //     fetchData(movies);
  //   }
  // }, [movies]);

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

    return (
      <DoubleClick
        icon
        delay={300}
        timeout={1000}
        doubleClick={() => {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          handleLike(item);
        }}
        // singleClick={() => navigation.push('Detail', { item })}
        singleClick={() => {
          // setMovie(item.id);
          // jumpTo('albums');
          // setDisplayPage('details');
          navigation.navigate('Details', { id: item.id, category });
        }}
      >

        {/* TODO: switch color here to match theme */}
        <View style={{ width: ITEM_SIZE }}>
          <Animated.View
            style={{
              marginHorizontal: SPACING,
              padding: SPACING * 2,
              alignItems: 'center',
              transform: [{ translateY }],
              // backgroundColor: 'rgba(255,255,255,0.8)',
              backgroundColor: colors.background,
              borderRadius: 34,
              marginTop: '100%',
              marginBottom: 20,
            }}
          >
            {/* <SharedElement id={`item.${item.id}.poster`} style={styles.shared}> */}
            <FastImage
              uri={item.poster}
              cacheKey={`${item.id}-poster`}
              style={styles.posterImage}
            />
            {/* </SharedElement> */}

            {/* <SharedElement id={`item.${item.id}.info`}> */}
            <Title style={{ fontSize: 24, textAlign: 'center', fontWeight: '800' }} numberOfLines={1}>
              {item.title}
            </Title>
            {/* <Rating rating={item.rating} /> */}
            {/* <Genres genres={item.genres} /> */}
            {/* </SharedElement> */}
          </Animated.View>
        </View>
      </DoubleClick>
    );
  });

  if (exploreMovies.length === 0) {
    // return <Loading />;
    return null;
  }

  // Animated.nativeEvent.contentOffset = { x: ITEM_SIZE * 4 }

  // const getItemLayout = (data, index) => (
  //   { length: 50, offset: ITEM_SIZE * index, index }
  // )

  return (
    <View style={{ ...styles.container, backgroundColor: colors.background }}>
      {/* <BackButton onPress={() => navigation.goBack()} /> */}
      <GridSwitch onPress={() => navigation.push('Grid', { movies: exploreMovies, exploreParam, category })} icon="view-grid-outline" />
      <Backdrop movies={exploreMovies} scrollX={scrollX} />
      <StatusBar hidden />
      <Animated.FlatList
      //  ref={(ref) => {
      //   // setRef(ref);
      // }}
        // ref={(ref) => { this.flatListRef = ref; }}
        showsHorizontalScrollIndicator={false}
        data={[{ key: 'empty-left' }, ...exploreMovies, { key: 'empty-right' }]}
        // extraData={movies}
        keyExtractor={(item) => item.key}
        horizontal
        bounces={false}
        decelerationRate={Platform.OS === 'ios' ? 0 : 0.98}
        contentContainerStyle={{ alignItems: 'center' }}
        snapToInterval={ITEM_SIZE}
        // snapToAlignment="start"
        // contentOffset={{x: ITEM_SIZE * 2}}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false },
        )}
        onScrollEndDrag={() => {
          Haptics.impactAsync('light');
        }}
        scrollEventThrottle={16}
        initialNumToRender={1}
        // initialScrollIndex={4}
        // onScrollToIndexFailed={() => {console.log('failed to scroll')}}
        maxToRenderPerBatch={5}
        onEndReachedThreshold={0.5}
        onEndReached={({ }) => {
          // this.flatListRef.scrollToIndex({animated: true, index: 0});
          // TODO: uncomment this to get more movies
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
    // backgroundColor: 'white',
    // backgroundColor: colors.background,
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
