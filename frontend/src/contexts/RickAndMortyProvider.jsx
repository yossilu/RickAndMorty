import { createContext, useReducer, useMemo, useCallback, useState } from 'react';
import { axiosPrivate } from '../api/axios';
import useAuth from "../hooks/useAuth";

const BASE_URL = 'http://localhost:5000';

const RickAndMortyContext = createContext({});

///////////////////////////

// UNUSED //////////

///////////////////////
// Define action types
const SET_CHARACTERS = 'SET_CHARACTERS';
const UPDATE_CHARACTER = 'UPDATE_CHARACTER';
const SET_LOCATIONS = 'SET_LOCATIONS';
const UPDATE_LOCATION = 'UPDATE_LOCATION';
const SET_EPISODES = 'SET_EPISODES';
const UPDATE_EPISODE = 'UPDATE_EPISODE';

// Define combined reducer
const rickAndMortyReducer = (state, action) => {
    switch (action.type) {
        case SET_CHARACTERS:
            return { ...state, characters: [...action.payload] };
        case UPDATE_CHARACTER:
            return {
                ...state,
                characters: state.characters.map(character => 
                    character.id === action.payload.id ? { ...character, ...action.payload } : character
                )
            };
        case SET_LOCATIONS:
            return { ...state, locations: [...action.payload] };
        case UPDATE_LOCATION:
            return {
                ...state,
                locations: state.locations.map(location => 
                    location.id === action.payload.id ? { ...location, ...action.payload } : location
                )
            };
        case SET_EPISODES:
            return { ...state, episodes: [...action.payload] };
        case UPDATE_EPISODE:
            return {
                ...state,
                episodes: state.episodes.map(episode => 
                    episode.id === action.payload.id ? { ...episode, ...action.payload } : episode
                )
            };
        default:
            return state;
    }
}

export const RickAndMortyProvider = ({ children }) => {
    const [state, dispatch] = useReducer(rickAndMortyReducer, { characters: [], locations: [], episodes: [] });
    const [loadingCharacters, setLoadingCharacters] = useState(false);
    const [loadingLocations, setLoadingLocations] = useState(false);
    const [loadingEpisodes, setLoadingEpisodes] = useState(false);
    const { auth } = useAuth();

    const getAllCharacters = useCallback(async (page = 1) => {
        setLoadingCharacters(true);
        try {
          const response = await axiosPrivate.get(`/rick-and-morty/getAll?page=${page}`,
          );
          dispatch({ type: 'SET_CHARACTERS', payload: response.data.results });
        } catch (error) {
          console.error("Error fetching characters", error);
        } finally {
          setLoadingCharacters(false);
        }
      }, [dispatch, setLoadingCharacters]);

    const getAllLocations = useCallback(async (page = 1) => {
        setLoadingLocations(true);
        try {
            const response = await axiosPrivate.get(`/rick-and-morty/getLocations?page=${page}`,);
            dispatch({ type: SET_LOCATIONS, payload: response.data.results });
        } catch (error) {
            console.error("Error fetching locations", error);
        } finally {
            setLoadingLocations(false);
        }
    }, []);

    const getAllEpisodes = useCallback(async () => {
        setLoadingEpisodes(true);
        try {
            const response = await axiosPrivate.get(`/episode`);
            dispatch({ type: SET_EPISODES, payload: response.data.results });
        } catch (error) {
            console.error("Error fetching episodes", error);
        } finally {
            setLoadingEpisodes(false);
        }
    }, []);

    const getAllCharactersAllPages = useCallback(async () => {
        setLoadingCharacters(true);
        try {
          let allCharacters = [];
          let page = 1;
          let response;
          do {
            response = await axiosPrivate.get(`/rick-and-morty/getAll?page=${page}`);
            allCharacters = allCharacters.concat(response.data.results);
            page++;
          } while (response.data.info.next);
          dispatch({ type: 'SET_CHARACTERS', payload: allCharacters });
        } catch (error) {
          console.error("Error fetching characters", error);
        } finally {
          setLoadingCharacters(false);
        }
      }, [dispatch, setLoadingCharacters]);

    const contextValue = useMemo(() => ({
        characters: state.characters,
        locations: state.locations,
        episodes: state.episodes,
        getAllCharacters,
        getAllLocations,
        getAllEpisodes,
        loadingCharacters,
        loadingLocations,
        loadingEpisodes,
        getAllCharactersAllPages
    }), [
        state.characters,
        state.locations,
        state.episodes,
        getAllCharacters,
        getAllLocations,
        getAllEpisodes,
        loadingCharacters,
        loadingLocations,
        loadingEpisodes
    ]);

    return (
        <RickAndMortyContext.Provider value={contextValue}>
            {children}
        </RickAndMortyContext.Provider>
    );
}

export default RickAndMortyContext;
