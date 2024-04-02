import React, {
  useRef, useEffect, useState,
} from 'react';
import {
  View, Image, Animated,
  StyleSheet, Dimensions, TouchableOpacity, useColorScheme,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import MaskedView from '@react-native-community/masked-view';
import {
  Caption, Title, Chip, ActivityIndicator, useTheme, IconButton, Button, Text,
} from 'react-native-paper';
import * as Haptics from 'expo-haptics';
import { BottomSheet } from 'react-native-btr';
import { useFonts } from 'expo-font';
import Overview from './DummyText';
import { BANNER_H } from './constants';
import Gridception from './ImageGrid';
import {
  fetchCollection,
  fetchImages, fetchProviders, getRecommendations, getSimilarMovies, fetchMovieDetails, handleLike,
} from '../services/api';
import HorizontalMovieList from './HorizontalMovieList';
import MovieBanners from './MovieBanners';
import Cast from './Cast';
import {
  getMovieWatchlist, getTVWatchlist, getMovieRatings, rateMovie, getTVRatings, rateTV,
} from '../services/storage';

function Details(props) {
  const { route, navigation } = props;
  const { id, category = 'movie' } = route?.params;

  const theme = useTheme();
  const scheme = useColorScheme();
  const { width, height } = Dimensions.get('window');

  const [movie, setMovie] = useState({});
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [movieWatchlist, setMovieWatchlist] = useState([]);
  const [tvWatchlist, setTVWatchlist] = useState([]);
  const [movieRatings, setMovieRatings] = useState([]);
  const [tvRatings, setTVRatings] = useState([]);
  const [visible, setVisible] = useState(false);

  const [fontsLoaded] = useFonts({
    Avenida: require('../assets/fonts/AVENIDA.ttf'),
  });

  const { colors } = theme;
  const gradeColor = theme.dark ? 'white' : 'rgba(28, 27, 31, 1)';

  const movieGrade = category === 'movie'
    ? movieRatings?.find((item) => item.id === movie.id)?.grade
    : tvRatings.find((item) => item.id === movie.id)?.grade;

  const toggleVisible = () => {
    setVisible(!visible);
  };

  const handleSetGrade = async (grade) => {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    if (category === 'movie') {
      await rateMovie(movie, grade);
      setMovieRatings(await getMovieRatings());
    } else {
      await rateTV(movie, grade);
      setTVRatings(await getTVRatings());
    }

    setVisible(false);
  };

  useEffect(() => {
    const getData = async () => {
      setMovieWatchlist(await getMovieWatchlist());
      setTVWatchlist(await getTVWatchlist());
      setMovieRatings(await getMovieRatings());
      setTVRatings(await getTVRatings());
    };
    getData();
  }, []);

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

  const handleTapHeart = async () => {
    await handleLike(movie, category);
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    category === 'movie'
      ? await setMovieWatchlist(await getMovieWatchlist())
      : await setTVWatchlist(await getTVWatchlist());
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
    navigation.navigate('Images', { images });
  };

  const generatePercentage = (decimalScore) => {
    if (!decimalScore) return 'N/A';
    const percentage = Math.round(decimalScore * 10);
    return `${percentage}%`;
  };

  const isLiked = () => (category === 'movie'
    ? movieWatchlist?.some((item) => item.id === movie.id)
    : tvWatchlist?.some((item) => item.id === movie.id));
  return (
    <View>
      { isLoading && <ActivityIndicator animating color={colors.primary} style={styles.loader} size="large" pointerEvents="none" /> }
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
            source={{ uri: getHDBackground(movie.backdrop_path) }}
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
                { movieGrade
                && (
                  <View style={styles.gradeViewSmall}>
                    <Text style={{ ...styles.gradeTextSmall }}>{movieGrade}</Text>
                  </View>
                )}

                <View style={styles.col}>
                  <Image
                    style={{ width: 23, aspectRatio: 32 / 23 }}
                    source={require('../assets/icons/tmdb.png')}
                  />
                  <Caption style={{ ...styles.score, color: 'rgba(230, 225, 229, 1)', fontWeight: '600' }}>{generatePercentage(movie?.vote_average)}</Caption>
                </View>
              </View>

              <IconButton
                icon={isLiked() ? 'heart' : 'heart-outline'}
                iconColor="rgba(255, 102, 102, 0.88)"
                size={30}
                style={{ position: 'absolute', right: 0, bottom: 0 }}
                onPress={handleTapHeart}
              />
            </BlurView>
          </MaskedView>
        </View>

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
        </View>

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

        { recommendations?.length > 0 && (
        <View style={{ marginLeft: 24 }}>
          <HorizontalMovieList
            title="Recommendations"
            navigation={navigation}
            movies={recommendations}
            category={category}
          />
        </View>
        )}

        <Cast id={movie.id} category={category} />

        <Button
          icon="share"
          mode="contained-tonal"
          onPress={toggleVisible}
          style={{ marginHorizontal: 24 }}
        >
          Rate
        </Button>

      </Animated.ScrollView>

      <BottomSheet
        visible={visible}
        onBackButtonPress={toggleVisible}
        onBackdropPress={toggleVisible}
      >
        <View style={{ ...styles.bottomNavigationView, backgroundColor: colors.background }}>
          <View
            style={{
            }}
          >
            <Title
              style={styles.centeredTitle}
            >
              Give Rating
            </Title>

            <View style={{ display: 'flex', flexDirection: 'column', alignItems: 'space-around' }}>

              <View style={{
                display: 'flex', flexDirection: 'row', justifyContent: 'space-around', width, marginBottom: 10,
              }}
              >

                <TouchableOpacity style={movieGrade === 'A+' ? styles.selectedGradeView : styles.gradeView(gradeColor)} onPress={() => handleSetGrade('A+')}>
                  <Title style={{ ...styles.gradeText, color: movieGrade === 'A+' ? 'white' : gradeColor }}>A+</Title>
                </TouchableOpacity>

                <TouchableOpacity style={movieGrade === 'B+' ? styles.selectedGradeView : styles.gradeView(gradeColor)} onPress={() => handleSetGrade('B+')}>
                  <Title style={{ ...styles.gradeText, color: movieGrade === 'B+' ? 'white' : gradeColor }}>B+</Title>
                </TouchableOpacity>

                <TouchableOpacity style={movieGrade === 'C+' ? styles.selectedGradeView : styles.gradeView(gradeColor)} onPress={() => handleSetGrade('C+')}>
                  <Title style={{ ...styles.gradeText, color: movieGrade === 'C+' ? 'white' : gradeColor }}>C+</Title>
                </TouchableOpacity>

                <TouchableOpacity style={movieGrade === 'D+' ? styles.selectedGradeView : styles.gradeView(gradeColor)} onPress={() => handleSetGrade('D+')}>
                  <Title style={{ ...styles.gradeText, color: movieGrade === 'D+' ? 'white' : gradeColor }}>D+</Title>
                </TouchableOpacity>

              </View>

              <View style={{
                display: 'flex', flexDirection: 'row', justifyContent: 'space-around', width, marginBottom: 10,
              }}
              >

                <TouchableOpacity style={movieGrade === 'A' ? styles.selectedGradeView : styles.gradeView(gradeColor)} onPress={() => handleSetGrade('A')}>
                  <Title style={{ ...styles.gradeText, color: movieGrade === 'A' ? 'white' : gradeColor }}>A</Title>
                </TouchableOpacity>

                <TouchableOpacity style={movieGrade === 'B' ? styles.selectedGradeView : styles.gradeView(gradeColor)} onPress={() => handleSetGrade('B')}>
                  <Title style={{ ...styles.gradeText, color: movieGrade === 'B' ? 'white' : gradeColor }}>B</Title>
                </TouchableOpacity>

                <TouchableOpacity style={movieGrade === 'C' ? styles.selectedGradeView : styles.gradeView(gradeColor)} onPress={() => handleSetGrade('C')}>
                  <Title style={{ ...styles.gradeText, color: movieGrade === 'C' ? 'white' : gradeColor }}>C</Title>
                </TouchableOpacity>

                <TouchableOpacity style={movieGrade === 'D' ? styles.selectedGradeView : styles.gradeView(gradeColor)} onPress={() => handleSetGrade('D')}>
                  <Title style={{ ...styles.gradeText, color: movieGrade === 'D' ? 'white' : gradeColor }}>D</Title>
                </TouchableOpacity>

              </View>
              <View style={{
                display: 'flex', flexDirection: 'row', justifyContent: 'space-around', width,
              }}
              >

                <TouchableOpacity style={movieGrade === 'A-' ? styles.selectedGradeView : styles.gradeView(gradeColor)} onPress={() => handleSetGrade('A-')}>
                  <Title style={{ ...styles.gradeText, color: movieGrade === 'A-' ? 'white' : gradeColor }}>A-</Title>
                </TouchableOpacity>

                <TouchableOpacity style={movieGrade === 'B-' ? styles.selectedGradeView : styles.gradeView(gradeColor)} onPress={() => handleSetGrade('B-')}>
                  <Title style={{ ...styles.gradeText, color: movieGrade === 'B-' ? 'white' : gradeColor }}>B-</Title>
                </TouchableOpacity>

                <TouchableOpacity style={movieGrade === 'C-' ? styles.selectedGradeView : styles.gradeView(gradeColor)} onPress={() => handleSetGrade('C-')}>
                  <Title style={{ ...styles.gradeText, color: movieGrade === 'C-' ? 'white' : gradeColor }}>C-</Title>
                </TouchableOpacity>

                <TouchableOpacity style={movieGrade === 'F' ? styles.selectedGradeView : styles.gradeView(gradeColor)} onPress={() => handleSetGrade('F')}>
                  <Title style={{ ...styles.gradeText, color: movieGrade === 'F' ? 'white' : gradeColor }}>F</Title>
                </TouchableOpacity>

              </View>
            </View>
          </View>
        </View>
      </BottomSheet>

    </View>
  );
}

const styles = {
  gradeView: (color) => ({
    borderColor: color,
    borderWidth: 1,
    width: 50,
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  }),
  selectedGradeView: {
    borderColor: 'white',
    backgroundColor: '#71D7C0',
    borderWidth: 1,
    width: 50,
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradeText: {
    fontFamily: 'Avenida',
    color: 'white',
    fontWeight: '600',
    fontSize: 30,
  },
  gradeViewSmall: {
    marginRight: 8,
    borderColor: 'white',
    borderWidth: 1,
    width: 25,
    height: 25,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradeTextSmall: {
    fontFamily: 'Avenida',
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  score: {
    margin: 5,
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
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
  centeredTitle: {
    textAlign: 'center',
    marginBottom: 10,
    fontWeight: '800',
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
    borderRadius: 10,
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
  bottomNavigationView: {
    width: '100%',
    height: '33%',
    // justifyContent: 'center',
    // alignItems: 'center',
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
