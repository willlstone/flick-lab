import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from "expo-file-system";


const getPoster = (path) =>
  `https://image.tmdb.org/t/p/w500${path}`;

const getBackground = (path) =>
`https://image.tmdb.org/t/p/w1280${path}`;

export const getMovieWatchlist = async () => {
    try {
        const jsonValue = await AsyncStorage.getItem('@movieWatchlist');
        return jsonValue != null ? JSON.parse(jsonValue) : [];
      } catch(e) {
        console.log("error getting movie watchlist");
      }
}

export const saveMovieToWatchlist = async (movie) => {
    const cleanedMovie = {
        id: movie.id,
        poster: movie.poster || getPoster(movie.poster_path),
        title: movie.title,
        backdrop: movie.backdrop || getBackground(movie.backdrop_path),
        key: movie.id,
    }

    try {
        const currentMovies = await getMovieWatchlist() || [];
        const newMovieList = currentMovies.some(item => item.id === cleanedMovie.id) ? currentMovies.filter(item => item.id !== cleanedMovie.id) : [...currentMovies, cleanedMovie];
        const jsonValue = JSON.stringify(newMovieList)
        await AsyncStorage.setItem('@movieWatchlist', jsonValue);
    } catch (e) {
        console.log('error saving movie');
    }
}

export const getTVWatchlist = async () => {
    try {
        const jsonValue = await AsyncStorage.getItem('@tvWatchlist');
        return jsonValue != null ? JSON.parse(jsonValue) : [];
      } catch(e) {
        console.log("error getting tv watchlist");
      }
}

export const saveTVToWatchlist = async (tv) => {
    const cleanedTV = {
        id: tv.id,
        poster: tv.poster || getPoster(tv.poster_path),
        title: tv.name,
        backdrop: tv.backdrop || getBackground(tv.backdrop_path),
        key: tv.id,
    }

    try {
        const currentTV = await getTVWatchlist() || [];
        const newTVList = currentTV.some(item => item.id === cleanedTV.id) ? currentTV.filter(item => item.id !== cleanedTV.id) : [...currentTV, cleanedTV];
        const jsonValue = JSON.stringify(newTVList)
        await AsyncStorage.setItem('@tvWatchlist', jsonValue);
    } catch (e) {
        console.log('error saving tv');
    }
}

export const getMovieRatings = async () => {
    try {
        const jsonValue = await AsyncStorage.getItem('@movieRatings');
        return jsonValue != null ? JSON.parse(jsonValue) : [];
      } catch(e) {
        console.log("error getting movie ratings");
      }
}

export const rateMovie = async (movie, grade) => {
    const cleanedMovie = {
        id: movie.id,
        poster: movie.poster || getPoster(movie.poster_path),
        title: movie.title,
        backdrop: movie.backdrop || getBackground(movie.backdrop_path),
        key: movie.id,
        grade,
    };

    try {
        const currentRatings = await getMovieRatings() || [];
        const previousIndex = currentRatings.findIndex(item => item.id === cleanedMovie.id);
        let newRatings;
        if (previousIndex >= 0) {
            currentRatings[previousIndex].grade = grade;
            newRatings = [...currentRatings];
        }
        else {
            newRatings = [...currentRatings, cleanedMovie];
        }
    
        const jsonValue = JSON.stringify(newRatings)
        await AsyncStorage.setItem('@movieRatings', jsonValue);
    } catch (e) {
        console.log('error saving movie');
    }
}

export const getTVRatings = async () => {
    try {
        const jsonValue = await AsyncStorage.getItem('@tvRatings');
        return jsonValue != null ? JSON.parse(jsonValue) : [];
      } catch(e) {
        console.log("error getting tv ratings");
      }
}

export const rateTV = async (movie, grade) => {
    const cleanedMovie = {
        id: movie.id,
        poster: movie.poster || getPoster(movie.poster_path),
        title: movie.title,
        backdrop: movie.backdrop || getBackground(movie.backdrop_path),
        key: movie.id,
        grade,
    };

    try {
        const currentRatings = await getTVRatings() || [];
        const previousIndex = currentRatings.findIndex(item => item.id === cleanedMovie.id);
        let newRatings;
        if (previousIndex >= 0) {
            currentRatings[previousIndex].grade = grade;
            newRatings = [...currentRatings];
        }
        else {
            newRatings = [...currentRatings, cleanedMovie];
        }
    
        const jsonValue = JSON.stringify(newRatings)
        await AsyncStorage.setItem('@tvRatings', jsonValue);
    } catch (e) {
        console.log('error saving tv');
    }
}

export const resetCache = async () => {
    await AsyncStorage.setItem('@movieRatings', "[]");
    await AsyncStorage.setItem('@tvRatings', "[]");
    await AsyncStorage.setItem('@tvWatchlist', "[]");
    await AsyncStorage.setItem('@movieWatchlist', "[]");
}

export const clearCache = async () => {
    // await AsyncStorage.clear();
    // Deletes whole giphy directory with all its content
// export async function deleteAllGifs() {
    // console.log('Deleting cache directory...');
    // await FileSystem.deleteAsync(FileSystem.cacheDirectory);
  
}

export const getTheme = async () => {
    try {
        const jsonValue = await AsyncStorage.getItem('@theme');
        return jsonValue != null ? jsonValue : 'system';
      } catch(e) {
        console.log("error getting system theme");
      }
}

export const saveTheme = async (theme) => {
    try {
        await AsyncStorage.setItem('@theme', theme);
    } catch (e) {
        console.log('error saving theme');
    }
}

