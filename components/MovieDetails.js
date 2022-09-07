import React, {
  useRef, useEffect, useState,
} from 'react';
import {
  View, Image, Animated,
  StyleSheet,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import MaskedView from '@react-native-community/masked-view';
import {
  Caption, Title, Chip, ActivityIndicator, useTheme,
} from 'react-native-paper';
import { useScrollToTop } from '@react-navigation/native';
import Overview from './DummyText';
import { BANNER_H } from './constants';
import Gridception from './ImageGrid';
import {
  fetchCollection,
  fetchImages, fetchProviders, getRecommendations, getSimilarMovies, fetchMovieDetails,
} from '../services/api';
import BackButton from './BackButton';
import HorizontalMovieList from './HorizontalMovieList';
import MovieBanners from './MovieBanners';
import FastImage from '../helpers/FastImage';

function Details(props) {
  const { route, navigation } = props;
  const { id, category = 'movie' } = route?.params;

  const { colors } = useTheme();

  const [movie, setMovie] = useState({});
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setMovie(await fetchMovieDetails(id, category));
      setImages(await fetchImages(id, category));
    };

    fetchData()
      .catch(console.error);
  }, [id]);

  const getHDBackground = (path) => `https://image.tmdb.org/t/p/original${path}`;
  const getYear = (date) => {
    if (!date) return 'N/A';
    return date.slice(0, 4);
  };
  const getRuntime = (totalMinutes) => {
    if (!totalMinutes || totalMinutes === 0) return 'N/A';
    const minutes = totalMinutes % 60;
    const hours = Math.floor(totalMinutes / 60);
    return `${hours}h ${minutes}m`;
  };

  const getTVYears = (movie) => {
    const { first_air_date, last_episode_to_air: { air_date } } = movie;
    const startYear = getYear(first_air_date);
    const lastYear = getYear(air_date);
    if (startYear === lastYear) return startYear;
    return `${startYear}-${lastYear}`;
  };

  const getNumberOfSeasons = (movie) => {
    const { number_of_seasons } = movie;
    return number_of_seasons > 1 ? `${number_of_seasons} seasons` : '1 season';
  };

  const [providers, setProviders] = useState();
  const [similarMovies, setSimilarMovies] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [collection, setCollection] = useState();
  const [activeProvider, setActiveProvider] = useState('stream');

  const scrollA = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const prvdrs = await fetchProviders(movie.id);
      const similar = await getSimilarMovies(movie.id, category);
      const recs = await getRecommendations(movie.id, category);
      const col = await fetchCollection(movie?.belongs_to_collection?.id);
      console.log('movie id: ', movie.id);
      setProviders(prvdrs);
      setSimilarMovies(similar);
      setRecommendations(recs);
      setCollection(col);
      setIsLoading(false);
    };
    scrollViewRef.current.scrollTo({
      y: 0,
      animated: true,
    });
    fetchData();
  }, [movie]);

  const onPress = () => {
    // url and index of the image you have clicked alongwith onPress event.
    navigation.navigate('Images', { images });
  };

  const generatePercentage = (decimalScore) => {
    if (!decimalScore) return 'N/A';
    const percentage = Math.round(decimalScore * 10);
    return `${percentage}%`;
  };
  return (
    <View>
      { isLoading && <ActivityIndicator animating color={colors.primary} style={styles.loader} size="large" pointerEvents="none" /> }
      {/* <BackButton onPress={() => navigation.goBack()} /> */}
      <Animated.ScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollA } } }],
          { useNativeDriver: true },
        )}
        scrollEventThrottle={16}
      >
        <View style={styles.bannerContainer}>
          <Animated.Image
            style={styles.banner(scrollA)}
            // uri={getHDBackground(movie.backdrop_path)}
            source={{ uri: getHDBackground(movie.backdrop_path) }}
            // cacheKey={`${movie.id}-backdrop`}
            animated
            addLogging
          />
        </View>

        <View style={styles.infoView}>
          <MaskedView
            maskElement={(
              <LinearGradient
                colors={['transparent', 'black']}
                style={StyleSheet.absoluteFill}
              />
          )}
            style={StyleSheet.absoluteFill}
          >
            {/* TODO: Decide should use tint-dark or not */}
            <BlurView tint="dark" intensity={100} style={StyleSheet.absoluteFill}>
              {images?.logos?.at(0) ? (
                <Animated.Image
                  style={styles.movieLogo(scrollA)}
                  source={{ uri: images?.logos?.at(0) }}
                  resizeMode="contain"
                />
              ) : (
                <Title style={styles.movieTitle}>{movie?.title || movie?.name}</Title>
              )}

              {movie?.runtime > 0
                && (
                <View style={styles.detailsGroup}>
                  <Caption style={{ color: 'rgba(230, 225, 229, 1)' }}>{movie?.genres[0]?.name}</Caption>
                  <Caption style={{ color: 'rgba(230, 225, 229, 1)' }}>{getYear(movie?.release_date)}</Caption>
                  <Caption style={{ color: 'rgba(230, 225, 229, 1)' }}>{getRuntime(movie?.runtime)}</Caption>
                </View>
                )}

              {movie?.number_of_seasons
                && (
                <View style={styles.detailsGroup}>
                  <Caption style={{ color: 'rgba(230, 225, 229, 1)' }}>{movie?.genres[0]?.name}</Caption>
                  <Caption style={{ color: 'rgba(230, 225, 229, 1)' }}>{getTVYears(movie)}</Caption>
                  <Caption style={{ color: 'rgba(230, 225, 229, 1)' }}>{getNumberOfSeasons(movie)}</Caption>
                </View>
                )}

              <View style={styles.row}>
                {/* <View style={styles.col}>
                  <SvgUri
                    width={25}
                    height={25}
                    uri={ratingIcons.rottenTomatoes.critic.certifiedFresh}
                  />
                  <Caption style={styles.score}>88%</Caption>
                </View> */}

                {/* <View style={styles.col}>
                  <Image
                    style={{ width: 23, aspectRatio: 1 / 1 }}
                    source={require('../assets/icons/metacritic.png')}
                  />
                  <Caption style={styles.score}>88%</Caption>
                </View> */}

                <View style={styles.col}>
                  <Image
                    style={{ width: 23, aspectRatio: 32 / 23 }}
                    source={require('../assets/icons/tmdb.png')}
                  />
                  <Caption style={{ ...styles.score, color: 'rgba(230, 225, 229, 1)', fontWeight: '600' }}>{generatePercentage(movie?.vote_average)}</Caption>
                </View>

                {/* <View style={styles.col}>
                  <Image
                    style={{ width: 30, aspectRatio: 320 / 161 }}
                    source={require('../assets/icons/imdb.png')}
                  />
                  <Caption style={styles.score}>88%</Caption>

                </View> */}
              </View>

            </BlurView>
          </MaskedView>
        </View>

        {/* <Button style={{marginLeft: 18, marginRight: 18}} mode="outlined">Favorite</Button>
        <Button style={{marginLeft: 18, marginRight: 18}} mode="contained">Favorite</Button>
        <Button style={{marginLeft: 18, marginRight: 18}} mode="contained-tonal">Favorite</Button> */}

        {/* <View style={{marginTop: 10, display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly'}}>
            <Button mode="outlined">Favorite</Button>
            <Button mode="contained">Favorite</Button>
            <Button mode="contained-tonal">Favorite</Button>
        </View> */}

        <Title style={styles.rowHeader}>Where to Watch</Title>
        <View style={{
          ...styles.rowLeft, display: 'flex', flexDirection: 'row', justifyContent: 'flex-start',
        }}
        >
          <Chip selected={activeProvider === 'stream'} showSelectedOverlay mode="outlined" style={styles.providerChips} onPress={() => setActiveProvider('stream')}>Stream</Chip>
          <Chip selected={activeProvider === 'rent'} showSelectedOverlay mode="outlined" style={styles.providerChips} onPress={() => setActiveProvider('rent')}>Rent</Chip>
          <Chip selected={activeProvider === 'buy'} showSelectedOverlay mode="outlined" style={styles.providerChips} onPress={() => setActiveProvider('buy')}>Buy</Chip>
        </View>

        <View style={{
          ...styles.rowLeft, display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', marginBottom: 10,
        }}
        >
          {providers?.[activeProvider]
            && (
              providers?.[activeProvider].map((provider) => <Image source={{ uri: provider }} style={styles.providerImage} key={provider} />)
            )}
          {/* <View style={{marginRight: 10}}>
            <View style={{
              backgroundColor: 'red', borderRadius: 10, width: 17, height: 17, position: 'absolute', right: -5, top: -5, zIndex: 2,
            }}
            >
              <Text style={{ textAlign: 'center', color: 'white' }}>$</Text>
            </View>
            <Avatar.Image style={styles.providerIcons} size={40} source={{ uri: providers?.stream[0] }} />
          </View>

          <View style={{marginRight: 10}}>
            <Avatar.Image style={styles.providerIcons} size={40} source={{ uri: 'https://image.tmdb.org/t/p/w92/3LQzaSBH1kjQB9oKc4n72dKj8oY.jpg' }} />
          </View>
          <View style={{marginRight: 10}}>
            <Avatar.Image style={styles.providerIcons} size={40} source={{ uri: 'https://image.tmdb.org/t/p/w92/xL9SUR63qrEjFZAhtsipskeAMR7.jpg' }} />
          </View> */}
        </View>
        {/* </Card> */}

        <Title style={styles.rowHeader}>Images</Title>
        {true && (
        <Gridception
          style={{ height: 350, marginLeft: 18, marginRight: 18 }}
          images={images.images}
          onPress={onPress}
        />
        )}

        <Title style={styles.rowHeader}>Synopsis</Title>
        <Overview text={movie?.overview} />

        {movie?.belongs_to_collection && collection?.length > 0 && (
        <View style={{ marginLeft: 24 }}>
          <MovieBanners movies={collection} title={movie.belongs_to_collection.name} navigation={navigation} />
        </View>
        )}

        <View style={{ marginLeft: 24 }}>
          <HorizontalMovieList
            title={category === 'movie' ? 'Similar Movies' : 'Similar Shows'}
            navigation={navigation}
            movies={similarMovies}
            category={category}
          />
        </View>

        <View style={{ marginLeft: 24 }}>
          <HorizontalMovieList
            title="Recommendations"
            navigation={navigation}
            movies={recommendations}
            category={category}
          />
        </View>

      </Animated.ScrollView>
    </View>
  );
}

const styles = {
  score: {
    margin: 5,
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    // justifyContent: 'space-evenly',
    // alignItems: 'center',
    marginLeft: 24,
  },
  col: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  loader: {
    position: 'absolute',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    zIndex: 9,
  },
  rowHeader: {
    marginLeft: 24,
    marginBottom: 10,
    fontWeight: '800',
  },
  rowLeft: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginLeft: 24,
    marginRight: 24,
    // paddingTop: 10,
    borderRadius: 10,
    // marginTop: 10,
  },
  providerIcons: {
    marginLeft: 10,
  },
  providerImage: {
    marginLeft: 10,
    width: 50,
    height: 50,
    borderRadius: 12,
  },
  providerChips: {
    marginRight: 10,
    marginBottom: 10,
  },
  detailsGroup: {
    display: 'flex',
    flexDirection: 'row',
    paddingLeft: '15%',
    paddingRight: '15%',
    justifyContent: 'space-around',
  },
  infoView: {
    marginTop: -500,
    alignItems: 'center',
    height: 510,
  },
  bannerContainer: {
    marginTop: -1000,
    paddingTop: 1000,
    alignItems: 'center',
    overflow: 'hidden',
  },
  blurContainer: {
    flex: 1,
    justifyContent: 'center',
    marginTop: -200,
  },
  banner: (scrollA) => ({
    height: BANNER_H,
    width: '200%',
    transform: [
      {
        translateY: scrollA.interpolate({
          inputRange: [-BANNER_H, 0, BANNER_H, BANNER_H + 1],
          outputRange: [-BANNER_H / 2, 0, BANNER_H * 0.75, BANNER_H * 0.75],
        }),
      },
      {
        scale: scrollA.interpolate({
          inputRange: [-BANNER_H, 0, BANNER_H, BANNER_H + 1],
          outputRange: [2, 1, 0.5, 0.5],
        }),
      },
    ],
  }),
  movieTitle: {
    flex: 1,
    marginLeft: 24,
    marginRight: 24,
    width: '90%',
    marginTop: 350,
    // marginHorizontal: 24,
    paddingTop: 50,
    height: 100,
    fontWeight: '900',
    fontSize: 40,
    flexWrap: 'wrap',
    color: 'rgba(230, 225, 229, 1)',
  },
  movieLogo: (scrollA) => ({
    height: 100,
    width: '100%',
    marginTop: 350,
    transform: [
      {
        scale: scrollA.interpolate({
          inputRange: [-BANNER_H, 0, BANNER_H, BANNER_H + 1],
          outputRange: [2, 1, 0.5, 0.5],
        }),
      },
    ],
  }),
};

export default Details;
