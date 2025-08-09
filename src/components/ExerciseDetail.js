import React, { useState, useRef, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { speakingExercises } from '../data';

const ExerciseDetail = () => {
    const { id } = useParams();
    const exercise = speakingExercises.find(ex => ex.id === id);

    const [recording, setRecording] = useState(false);
    const [audioBlob, setAudioBlob] = useState(null);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);

    // New state for playback
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const audioRef = useRef(null);

    // New state for speech recognition
    const [transcribedText, setTranscribedText] = useState('');
    const [recognition, setRecognition] = useState(null);
    const [recognitionActive, setRecognitionActive] = useState(false);

    const speakText = (text) => {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'en-US'; // Set language to English
            window.speechSynthesis.speak(utterance);
        } else {
            alert('Trình duyệt của bạn không hỗ trợ tính năng đọc văn bản.');
        }
    };

    const initSpeechRecognition = () => {
        if (!('webkitSpeechRecognition' in window)) {
            alert('Trình duyệt của bạn không hỗ trợ nhận diện giọng nói. Vui lòng sử dụng Chrome.');
            return null;
        }
        const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
        const recognitionInstance = new SpeechRecognition();
        recognitionInstance.continuous = true;
        recognitionInstance.interimResults = true;
        recognitionInstance.lang = 'en-US';

        recognitionInstance.onresult = (event) => {
            let interimTranscript = '';
            let finalTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; ++i) {
                const transcript = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    finalTranscript += transcript;
                } else {
                    interimTranscript += transcript;
                }
            }
            setTranscribedText(finalTranscript + interimTranscript); // Display both interim and final
        };

        recognitionInstance.onend = () => {
            setRecognitionActive(false);
            console.log('Speech recognition ended.');
        };

        recognitionInstance.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            setRecognitionActive(false);
            alert(`Lỗi nhận diện giọng nói: ${event.error}`);
        };

        return recognitionInstance;
    };

    useEffect(() => {
        setRecognition(initSpeechRecognition());
    }, []);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);
            audioChunksRef.current = [];

            mediaRecorderRef.current.ondataavailable = (event) => {
                audioChunksRef.current.push(event.data);
            };

            mediaRecorderRef.current.onstop = () => {
                const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                setAudioBlob(blob);
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorderRef.current.start();
            setRecording(true);
            setAudioBlob(null); // Clear previous recording
            setIsPlaying(false); // Stop playback if recording starts
            setTranscribedText(''); // Clear previous transcription

            // Start speech recognition
            if (recognition) {
                recognition.start();
                setRecognitionActive(true);
            }

        } catch (err) {
            console.error('Error accessing microphone:', err);
            alert('Không thể truy cập microphone. Vui lòng kiểm tra quyền truy cập.');
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
            mediaRecorderRef.current.stop();
            setRecording(false);
        }
        // Stop speech recognition
        if (recognition && recognitionActive) {
            recognition.stop();
            setRecognitionActive(false);
        }
    };

    const togglePlayPause = () => {
        if (audioBlob) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    useEffect(() => {
        if (audioBlob) {
            const audioUrl = URL.createObjectURL(audioBlob);
            audioRef.current.src = audioUrl;
            audioRef.current.onloadedmetadata = () => {
                setDuration(audioRef.current.duration);
            };
            audioRef.current.ontimeupdate = () => {
                setCurrentTime(audioRef.current.currentTime);
            };
            audioRef.current.onended = () => {
                setIsPlaying(false);
                setCurrentTime(0);
                URL.revokeObjectURL(audioUrl); // Clean up the URL after playback
            };
        }
    }, [audioBlob]);

    if (!exercise) {
        return (
            <div className="home-container">
                <Header />
                <main className="home-content">
                    <div className="card">
                        <h1>Không tìm thấy bài luyện tập</h1>
                        <p>Bài luyện tập bạn đang tìm không tồn tại.</p>
                        <Link to="/speaking">
                            <button>Quay lại danh sách bài tập</button>
                        </Link>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="home-container">
            <Header />
            <main className="speaking-detail home-content">
                <div className="content-section intro-section">
                    <h1>Bài Luyện Tập {exercise.id.toUpperCase()}</h1>
                    <p className="exercise-text">" {exercise.text} "
                        <button className="speaker-icon-button" onClick={() => speakText(exercise.text)} title="Đọc mẫu">
                            🔊
                        </button>
                    </p>
                </div>
                <div className="content-section main-interactive-section">
                    <div className="card">
                        <h2>Luyện tập của bạn</h2>
                        <p>Bấm nút bên dưới để bắt đầu/dừng ghi âm!</p>
                        <button
                            onClick={recording ? stopRecording : startRecording}
                            className={recording ? 'record-button recording' : 'record-button'}
                        >
                            {recording ? 'Dừng Ghi Âm' : 'Bắt đầu nói'}
                        </button>
                        {recording && recognitionActive && <p className="recording-status">Đang ghi âm và nhận diện giọng nói...</p>}
                        {transcribedText && (
                            <div className="transcribed-text-container">
                                <h3>Văn bản đã nhận diện:</h3>
                                <p className="transcribed-text">{transcribedText}</p>
                            </div>
                        )}
                        {audioBlob && !recording && (
                            <div className="audio-playback-container">
                                <p>Bản ghi âm của bạn:</p>
                                <div className="playback-controls">
                                    <button onClick={togglePlayPause} className="play-pause-button">
                                        {isPlaying ? '⏸️' : '▶️'}
                                    </button>
                                    <span className="audio-time">{formatTime(currentTime)} / {formatTime(duration)}</span>
                                </div>
                                <audio ref={audioRef} />
                            </div>
                        )}
                    </div>
                    <Link to="/speaking">
                        <button>Quay lại danh sách bài tập</button>
                    </Link>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default ExerciseDetail;