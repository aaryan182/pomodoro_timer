import React, { useState, useEffect, useRef } from 'react';
import './Timer.css';
import workTimeSound from './audio/worktime.mp4';
import breakTimeSound from './audio/breaktime.mp4';
import startSound from './audio/start-sound.mp4';
import tickSound from './audio/tick.mp4';

const Timer = () => {
    const [minutes, setMinutes] = useState(25);
    const [seconds, setSeconds] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [mode, setMode] = useState('work'); // 'work' or 'break'
    const audioRef = useRef(null);
    const tickAudioRef = useRef(null);
    const tickIntervalRef = useRef(null);
    const [isTickPlaying, setIsTickPlaying] = useState(false);


    useEffect(() => {
        let interval = null;

        if (isRunning) {
            interval = setInterval(() => {
                if (seconds > 0) {
                    setSeconds(seconds - 1);
                } else {
                    if (minutes === 0) {
                        if (mode === 'work') {
                            setMode('break');
                            setMinutes(5); // Set break time to 5 minutes
                            audioRef.current.src = workTimeSound;
                            audioRef.current.play();
                        } else {
                            setMode('work');
                            setMinutes(25); // Set work time to 25 minutes
                            audioRef.current.src = breakTimeSound;
                            audioRef.current.play();
                        }
                    } else {
                        setMinutes(minutes - 1);
                        setSeconds(59);
                    }
                }
            }, 1000);
        } else {
            clearInterval(interval);
            audioRef.current.src = null;
            // Stop ticking sound
            clearInterval(tickIntervalRef.current);
            setIsTickPlaying(false);
            tickAudioRef.current.pause();
            tickAudioRef.current.currentTime = 0;
        }

        if (isRunning && isTickPlaying) {
            tickIntervalRef.current = setInterval(() => {
            }, 1000);
            tickAudioRef.current.play();
        } else {
            clearInterval(tickIntervalRef.current);
            tickAudioRef.current.pause();
            tickAudioRef.current.currentTime = 0;
        }

        return () => {
            clearInterval(interval);
            clearInterval(tickIntervalRef.current);
            tickAudioRef.current.pause();
            tickAudioRef.current.currentTime = 0;
        };
    }, [isRunning, minutes, seconds, mode, isTickPlaying]);


    const startTimer = () => {
        audioRef.current.src = startSound;
        audioRef.current.play();

        audioRef.current.onended = () => {
            tickAudioRef.current.play();
            setIsTickPlaying(true);
        };

        setIsRunning(true);
    };


    const pauseTimer = () => {
        setIsRunning(false);
        setIsTickPlaying(false);
        tickAudioRef.current.pause();
    };

    const resetTimer = () => {
        setIsRunning(false);
        setIsTickPlaying(false);
        clearInterval(tickIntervalRef.current);
        tickAudioRef.current.pause();
        tickAudioRef.current.currentTime = 0;

        if (mode === 'work') {
            setMinutes(25);
        } else {
            setMinutes(5);
        }
        setSeconds(0);
    };



    return (
        <div className="timer-container">
            <h2 className={`timer-mode ${mode === 'work' ? 'work-mode' : 'break-mode'}`}>
                {mode === 'work' ? 'Work Time' : 'Break Time'}
            </h2>
            <div className="timer-display">
                {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
            </div>
            <div className="timer-controls">
                {isRunning ? (
                    <button className="timer-button pause" onClick={pauseTimer}>
                        Pause
                    </button>
                ) : (
                    <button className="timer-button start" onClick={startTimer}>
                        Start
                    </button>
                )}
                <button className="timer-button reset" onClick={resetTimer}>
                    Reset
                </button>
            </div>
            <audio ref={audioRef} />
            <audio ref={tickAudioRef} src={tickSound} />
        </div>
    );
};

export default Timer;
