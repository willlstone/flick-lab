import {Alert} from 'react-native';
import axios from 'axios';

export const fetchLiked = async (user) => {
  const { data } = await fetch(`https://nwated6uoe.execute-api.us-east-1.amazonaws.com/dev?user=${user}`).then((x) => x.json());
  const movies = data.Items.map(
    ({
      id,
      title,
      poster_path,
      backdrop,
      vote_average,
      genres,
    }) => ({
      id: id,
      key: String(id),
      title,
      poster: poster_path,
      // backdrop: getBackground(backdrop_path),
      rating: vote_average,
      genres,
      backdrop
    })
  );
  // console.log(movies);
  return movies;
};

const API_KEY = '2450bb1a282abe67567830ede1023579';

const genres = {
  12: 'Adventure',
  14: 'Fantasy',
  16: 'Animation',
  18: 'Drama',
  27: 'Horror',
  28: 'Action',
  35: 'Comedy',
  36: 'History',
  37: 'Western',
  53: 'Thriller',
  80: 'Crime',
  99: 'Documentary',
  878: 'Science Fiction',
  9648: 'Mystery',
  10402: 'Music',
  10749: 'Romance',
  10751: 'Family',
  10752: 'War',
  10770: 'TV Movie',
};

const API_URL = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&sort_by=popularity.desc`;

const getPosterPath = (path) =>
  `https://image.tmdb.org/t/p/w780${path}`;
const getBackground = (path) =>
  `https://image.tmdb.org/t/p/w1280${path}`;
  const getProfile = (path) =>
  `https://image.tmdb.org/t/p/w185${path}`;
export const getMovies = async () => {
  const { results } = await fetch(API_URL).then((x) => x.json());
  const movies = results.map(
    ({
      id,
      original_title,
      poster_path,
      backdrop_path,
      vote_average,
      overview,
      release_date,
      genre_ids,
    }) => ({
      id: id,
      key: String(id),
      title: original_title,
      poster: getPosterPath(poster_path),
      backdrop: getBackground(backdrop_path),
      rating: vote_average,
      description: overview,
      releaseDate: release_date,
      genres: genre_ids.map((genre) => genres[genre]),
      genre_ids
    })
  );

  return movies;
};

export const getMoviesByGenre = async (genreId, page) => {
  // console.log('getting movies for page ', page);
  const GENRE_URL = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=en-US&sort_by=popularity.desc&page=${page}&with_genres=${genreId}&with_original_language=en`
  const { results } = await fetch(GENRE_URL).then((x) => x.json());
  const movies = results.map(
    ({
      id,
      original_title,
      poster_path,
      backdrop_path,
      vote_average,
      overview,
      release_date,
      genre_ids,
    }) => ({
      id: id,
      key: String(id),
      title: original_title,
      poster: getPosterPath(poster_path),
      backdrop: getBackground(backdrop_path),
      rating: vote_average,
      description: overview,
      releaseDate: release_date,
      genres: genre_ids.map((genre) => genres[genre]),
    })
  );

  return movies;
};

export async function fetchMovieDetails(movieId, category = "movie") {
  try {
    const { data } = await axios.get(`https://api.themoviedb.org/3/${category}/${movieId}?api_key=2450bb1a282abe67567830ede1023579&language=en-US`);
    return data;
  } catch (error) {
    console.log.apply(error)
    Alert.alert('Error getting movie details', '', [{ text: 'Retry', onPress: () => fetchMovieDetails() }])
  }
}

export async function fetchVideos(movieId) {
  try {
    console.log('fetch videos for ', movieId)
    const { data } = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=2450bb1a282abe67567830ede1023579&language=en-US`)
    return data.results;
  } catch (error) {
    console.log.apply(error)
    Alert.alert('Error getting videos', '', [{ text: 'Retry', onPress: () => fetchVideos() }])
  }
}

export async function fetchProviders(movieId) {
  try {
    const { data } = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}/watch/providers?api_key=2450bb1a282abe67567830ede1023579`);
    const usData = data.results.US;
    const stream = usData?.flatrate?.map((provider) => getPosterPath(provider.logo_path));
    const rent = usData?.rent?.map((provider) => getPosterPath(provider.logo_path));
    const buy = usData?.buy?.map((provider) => getPosterPath(provider.logo_path));
    return { stream, rent, buy };
  } catch (error) {
    console.log.apply(error)
  }
}

export async function fetchImages(movieId, category = "movie") {
  try {
    const { data } = await axios.get(`https://api.themoviedb.org/3/${category}/${movieId}/images?api_key=2450bb1a282abe67567830ede1023579`);
    const images = data.backdrops.map(({file_path}) => getBackground(file_path));
    const logos = data.logos.filter(movie => movie.iso_639_1 === "en" && !movie.file_path.includes('.svg')).map(({file_path}) => getPosterPath(file_path));
    const posters = data.posters.map(({file_path}) => getPosterPath(file_path));
    return { images, logos, posters};
  } catch (error) {
    console.log.apply(error)
  }
}

export async function fetchCast(id, category = "movie") {
  try {
    const { data } = await axios.get(`https://api.themoviedb.org/3/${category}/${id}/credits?api_key=${API_KEY}`);
    const cast = data.cast
    .filter(crewMember => crewMember.known_for_department === 'Acting')
    .filter(castMember => castMember.profile_path)
    .map(castMember => getProfile(castMember.profile_path));
    return cast;
  } catch (error) {
    console.log.apply(error)
  }
}


export async function handleLike(item) {
  // console.log('like');
  const data = {
      id: item.id,
      user: 'WillStone',
      like: true,
      poster_path: item.poster,
      title: item.title,
      vote_average: item.rating,
      genres: item.genres,
      backdrop: item.backdrop
  }
  // console.log(req);
}

export async function getRecommendations(id, category = "movie") {
    try {
        const { data } = await axios.get(`https://api.themoviedb.org/3/${category}/${id}/recommendations?api_key=2450bb1a282abe67567830ede1023579&language=en-US&page=1`);
        const movies = data.results.filter(movie => movie?.poster_path !== null).map(
            ({
              id,
              original_title,
              poster_path,
              backdrop_path,
              vote_average,
              overview,
              release_date,
              genre_ids,
            }) => ({
              id: id,
              key: String(id),
              title: original_title,
              poster: getPosterPath(poster_path),
              backdrop: getBackground(backdrop_path),
              rating: vote_average,
              description: overview,
              releaseDate: release_date,
              genres: genre_ids.map((genre) => genres[genre]),
            })
          );
          return movies;
    } 
    catch (error) {
        console.log.apply(error)
      }
}

export async function getSimilarMovies(id, category = "movie") {
    try {
        const { data } = await axios.get(`https://api.themoviedb.org/3/${category}/${id}/similar?api_key=2450bb1a282abe67567830ede1023579&language=en-US&page=1`);
        const movies = data.results.filter(movie => movie?.poster_path !== null).map(
            ({
              id,
              original_title,
              poster_path,
              backdrop_path,
              vote_average,
              overview,
              release_date,
              genre_ids,
            }) => ({
              id: id,
              key: String(id),
              title: original_title,
              poster: getPosterPath(poster_path),
              backdrop: getBackground(backdrop_path),
              rating: vote_average,
              description: overview,
              releaseDate: release_date,
              genres: genre_ids.map((genre) => genres[genre]),
            })
          );
        
          return movies;
    } 
    catch (error) {
        console.log.apply(error)
      }
}

export async function fetchMovieCategory(category, page = 1, format = "movie") {
    try {
        const { data } = await axios.get(`https://api.themoviedb.org/3/${format}/${category}?api_key=${API_KEY}&language=en-US&region=US&page=${page}`);
        const movies = data.results.map(
            ({
              id,
              original_title,
              poster_path,
              backdrop_path,
              vote_average,
              overview,
              release_date,
              genre_ids,
              name,
              original_language,
            }) => ({
              id: id,
              key: String(id),
              title: original_title || name,
              poster: getPosterPath(poster_path),
              backdrop: getBackground(backdrop_path),
              rating: vote_average,
              description: overview,
              releaseDate: release_date,
              genres: genre_ids.map((genre) => genres[genre]),
              language: original_language,
            })
          );
        
          return movies;
    } 
    catch (error) {
        console.log.apply(error)
      }
}

export async function fetchTrending(category, time) {
    try {
        const { data } = await axios.get(`https://api.themoviedb.org/3/trending/${category}/${time}?api_key=${API_KEY}`);
        const movies = data.results.map(
            ({
              id,
              original_title,
              poster_path,
              backdrop_path,
              vote_average,
              overview,
              release_date,
              genre_ids,
            }) => ({
              id: id,
              key: String(id),
              title: original_title,
              poster: getPosterPath(poster_path),
              backdrop: getBackground(backdrop_path),
              rating: vote_average,
              description: overview,
              releaseDate: release_date,
              genres: genre_ids.map((genre) => genres[genre]),
            })
          );
        
          return movies;
    } 
    catch (error) {
        console.log.apply(error)
      }
}

export async function fetchCollection(id) {
    try {
        const { data } = await axios.get(`https://api.themoviedb.org/3/collection/${id}?api_key=${API_KEY}&language=en-US`);
        const movies = data.parts.map(
            ({
              id,
              original_title,
              poster_path,
              backdrop_path,
              vote_average,
              overview,
              release_date,
              genre_ids,
            }) => ({
              id: id,
              key: String(id),
              title: original_title,
              poster: getPosterPath(poster_path),
              backdrop: getBackground(backdrop_path),
              rating: vote_average,
              description: overview,
              releaseDate: release_date,
              genres: genre_ids.map((genre) => genres[genre]),
            })
          );
        
          return movies;
    } 
    catch (error) {
        console.log.apply(error)
      }
}

export async function search(query, category = "movie") {
  try {
      const { data } = await axios.get(`https://api.themoviedb.org/3/search/${category}?api_key=${API_KEY}&query=${query}`);
      const movies = data.results.filter(movie => movie?.poster_path !== null).map(
          ({
            id,
            original_title,
            poster_path,
            backdrop_path,
            vote_average,
            overview,
            release_date,
            genre_ids,
          }) => ({
            id: id,
            key: String(id),
            title: original_title,
            poster: getPosterPath(poster_path),
            backdrop: getBackground(backdrop_path),
            rating: vote_average,
            description: overview,
            releaseDate: release_date,
            genres: genre_ids.map((genre) => genres[genre]),
          })
        );
        return movies;
  } 
  catch (error) {
      console.log.apply(error)
    }
}




