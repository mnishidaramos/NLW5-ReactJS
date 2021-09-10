import { createContext } from "react";

type Episode = {
    title: string;
    members: string;
    thumbnail: string;
    duration: number;
    url: string;
};

type PlayerContextData = {
    episodeList: Episode[];
    currentEpisodeIndex: number;
    isPlaying: boolean;
    play: (episode: Episode) => void;
    togglePlay: () => void;
    setPlayingState: (estate: boolean) => void;
}

export const PlayerContext = createContext({} as PlayerContextData);
//Também é possível fazer o seguinte:
// export const PlayerContext = createContext({
//     episodeList: [],
//     currentEpisodeIndex: 0,
// });