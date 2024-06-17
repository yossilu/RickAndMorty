import { useContext } from "react";
import RickAndMortyContext from "../contexts/RickAndMortyProvider";

const useRickAndMortyApi = () => {
    return useContext(RickAndMortyContext);
}

export default useRickAndMortyApi;