import AsyncStorage from '@react-native-async-storage/async-storage';

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
        poster: movie.poster,
        title: movie.title,
        backdrop: movie.backdrop
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
        poster: tv.poster,
        title: tv.name,
        backdrop: tv.backdrop
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
