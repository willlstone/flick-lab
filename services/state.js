import React, { createContext, useState } from 'react';
import { fetchImages, fetchMovieDetails } from './api';

export const StateContext = createContext({});
const { Provider } = StateContext;

export const StateContextProvider = ({children, initialIsLoading = false}) => {
    const [movie, setMovie] = useState({});
    const [images, setImages] = useState({});
    const [exploreMovies, setExploreMovies] = useState([]);
    const [exploreFunction, setExploreFunction] = useState();
    const [exploreParam, setExploreParam] = useState("");
    const [isLoading, setIsLoading] = useState(initialIsLoading);
    const [tabIsReset, resetTab] = useState(false);

    const useSetMovie = async (id) => {
        setIsLoading(true);
        setMovie(await fetchMovieDetails(id));
        setImages(await fetchImages(id));
        setIsLoading(false);

    };

    return (
        <Provider
        value={{
           tabIsReset,
           resetTab
        }}>
            {children}
        </Provider>
    )
}