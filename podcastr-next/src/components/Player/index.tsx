import { useEffect, useRef, useState } from 'react';

import { usePlayer } from '../../contexts/PlayerContext';
import Image from 'next/image';
import Slider from 'rc-slider';
import { 
    MdPlayArrow,
    MdPause,
    MdSkipNext,
    MdSkipPrevious,
    MdLoop,
    MdShuffle
} from 'react-icons/md';

import 'rc-slider/assets/index.css';
import styles from './styles.module.scss';
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString';

export function Player() {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [progress, setProgress] = useState(0);

    const { episodeList,
        currentEpisodeIndex,
        isPlaying,
        isLooping,
        isShuffling,
        hasNext,
        hasPrevious,
        togglePlay,
        toggleLoop,
        toggleShuffle,
        playNext,
        playPrevious,
        setPlayingState,
        clearPlayerState,  
    } = usePlayer();

    const episode = episodeList[currentEpisodeIndex];

    useEffect(() => {
        if(!audioRef.current) {
            return;
        }

        if(isPlaying) {
            audioRef.current.play();
        } else {
            audioRef.current.pause();
        }
    }, [isPlaying]);

    function setupProgressListener () {
        audioRef.current.currentTime = 0;

        audioRef.current.addEventListener('timeupdate', () => {
            setProgress(Math.floor(audioRef.current.currentTime));
        });
    }

    function handleSeek(amount: number) {
        audioRef.current.currentTime = amount;
        setProgress(amount);
    }

    function handleEpisodeEnded() {
        if(hasNext){
            playNext();
        } else {
            clearPlayerState();
        }
    }

    return (
        <div className={styles.playerContainer}>
            <header>
                <img src="/playing.png" alt="Tocando agora" />
                <strong>Tocando agora</strong>
            </header>

            { episode ? (
                <div className={styles.currentEpisode}>
                    <Image 
                        width={592} 
                        height={592}
                        src={episode.thumbnail}
                        objectFit="cover"
                    />
                    <strong>{episode.title}</strong>
                    <span>{episode.members}</span>
                </div>
            ) : (
                <div className={styles.emptyPlayer}>
                    <strong>Selecione um podcast para ouvir</strong>
                </div>
            )}

            <footer className={!episode ? styles.empty : ''}>
                <div className={styles.progress}>
                    <span>{convertDurationToTimeString(progress)}</span>
                    <div className={styles.slider}>
                        { episode ? (
                            <Slider
                                max={episode.duration}
                                value={progress}
                                onChange={handleSeek}
                                trackStyle={{ backgroundColor: '#04d361'}}
                                railStyle={{ backgroundColor: '#9f75ff'}}
                                handleStyle={{ borderColor: '#04d361', borderWidth: 4}}
                            />
                        ) : (
                            <div className={styles.emptySlider}/>
                        )}
                    </div>
                    <span>{convertDurationToTimeString(episode?.duration ?? 0)}</span>
                </div>

                { episode && (
                    <audio
                        src={episode.url}
                        autoPlay
                        loop={isLooping}
                        ref={audioRef}
                        onEnded={handleEpisodeEnded}
                        onPlay={() => setPlayingState(true)}
                        onPause={() => setPlayingState(false)}
                        onLoadedMetadata={setupProgressListener}
                    />
                )}

                <div className={styles.buttons}>
                    <MdShuffle
                        onClick={toggleShuffle}
                        className={isShuffling ? styles.isActive : styles.playerButtons}
                        title="Embaralhar"
                    />
                    {/* <button
                        type="button" 
                        disabled={!episode || episodeList.length === 1}
                        onClick={toggleShuffle}
                        className={isShuffling ? styles.isActive : ''}
                        >
                        <img src="/shuffle.png" alt="Embaralhar"/>
                    </button> */}

                    <MdSkipPrevious
                        onClick={playPrevious}
                        title="Tocar anterior"
                        className={styles.playerButtons}
                    />
                    {/* <button type="button" disabled={!episode || !hasPrevious} onClick={playPrevious}>
                        <img src="/play-previous.png" alt="Tocar anterior"/>
                    </button> */}

                    {isPlaying
                        ? <MdPause 
                            onClick={togglePlay}
                            className={styles.playButton}
                            />
                        : <MdPlayArrow 
                            onClick={togglePlay}
                            className={styles.playButton}
                        />
                    }
                    {/* <button
                      type="button"
                      disabled={!episode}
                      className={styles.playButton}
                      onClick={togglePlay}
                    >
                        {isPlaying
                            ? <img src="/pause.png" alt="Pausar"/>
                            : <img src="/play.png" alt="Tocar"/>
                        }
                    </button> */}

                    <MdSkipNext 
                        onClick={playNext}
                        title="Tocar próxima"
                        className={styles.playerButtons}
                    />
                    {/* <button type="button" disabled={!episode || hasNext} onClick={playNext}>
                        <img src="/play-next.png" alt="Tocar próxima"/>
                    </button> */}

                    <MdLoop
                        onClick={toggleLoop}
                        className={isLooping ? styles.isActive : styles.playerButtons}
                        title="Repetir"
                    />
                    {/* <button
                      type="button"
                      disabled={!episode}
                      onClick={toggleLoop}
                      className={isLooping ? styles.isActive : ''}
                      >
                        <img src="/repeat.png" alt="Repetir"/>
                    </button> */}
                </div>
            </footer>
        </div>
    )
}