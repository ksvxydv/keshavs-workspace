import { useState, useRef, useEffect } from "react";
import { FaPlay, FaPause, FaStepForward, FaStepBackward, FaStop, FaRedo, FaTimes } from "react-icons/fa";
import { motion } from "framer-motion";
import useSystem from "../core/system/useSystem";

const PLAYLIST = [
  {
    id: 1,
    title: "Apocalypse",
    artist: "Cigarettes After Sex",
    url: "/music/apocalypse.mp3",
    cover: "https://images.unsplash.com/photo-1505682614136-0a12f9f7beea?w=500&q=80", 
  },
  {
    id: 2,
    title: "Sunsetz",
    artist: "Cigarettes After Sex",
    url: "/music/sunsetz.mp3",
    cover: "https://images.unsplash.com/photo-1495571758719-6ec1e876d6ae?w=500&q=80",
  },
  {
    id: 3,
    title: "K.",
    artist: "Cigarettes After Sex",
    url: "/music/k.mp3",
    cover: "https://images.unsplash.com/photo-1485627941502-d2e6429a8af0?w=500&q=80",
  },
  {
    id: 4,
    title: "Sweet",
    artist: "Cigarettes After Sex",
    url: "/music/sweet.mp3",
    cover: "https://images.unsplash.com/photo-1516280440502-3112bd78ab0c?w=500&q=80",
  },
  {
    id: 5,
    title: "Cry",
    artist: "Cigarettes After Sex",
    url: "/music/cry.mp3",
    cover: "https://images.unsplash.com/photo-1518063319789-7217e6706b04?w=500&q=80",
  },
  {
    id: 6,
    title: "Heavenly",
    artist: "Cigarettes After Sex",
    url: "/music/heavenly.mp3",
    cover: "https://images.unsplash.com/photo-1482062364825-616fd23b8fc1?w=500&q=80",
  }
];

export default function Music() {
  const { volume } = useSystem();
  
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loopMode, setLoopMode] = useState(0); // 0: None, 1: Playlist, 2: Song
  
  const audioRef = useRef(null);
  const canvasRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const sourceRef = useRef(null);
  const animationRef = useRef(null);

  const currentTrack = PLAYLIST[currentTrackIndex];

  // Initialize Web Audio API
  const initAudio = () => {
    if (audioContextRef.current) return;
    
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    audioContextRef.current = new AudioContext();
    analyserRef.current = audioContextRef.current.createAnalyser();
    
    // Smoothness and frequency resolution
    analyserRef.current.fftSize = 128;
    analyserRef.current.smoothingTimeConstant = 0.8;
    
    // We must ensure CORS if loading from external, but for local it's fine.
    // If it fails, it will just not draw the waveform.
    sourceRef.current = audioContextRef.current.createMediaElementSource(audioRef.current);
    sourceRef.current.connect(analyserRef.current);
    analyserRef.current.connect(audioContextRef.current.destination);
  };

  // The rendering loop
  const drawVisualizer = () => {
    if (!canvasRef.current || !analyserRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    
    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    analyserRef.current.getByteFrequencyData(dataArray);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const baseRadius = 45;

    // Draw a subtle glowing center circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, baseRadius - 2, 0, 2 * Math.PI);
    ctx.fillStyle = "rgba(255, 255, 255, 0.05)";
    ctx.fill();

    // We only use the first half of the frequencies (the bass/mids) for a cooler look
    const bandsToDraw = Math.floor(bufferLength * 0.75);

    for (let i = 0; i < bandsToDraw; i++) {
      // Normalize value 0-1
      const value = dataArray[i] / 255.0;
      
      // Scale height
      const barHeight = value * 45; 
      
      // Calculate angle (mirror it to make a full circle)
      const rads = (Math.PI * 2) * (i / bandsToDraw);
      
      const xStart = centerX + Math.cos(rads) * baseRadius;
      const yStart = centerY + Math.sin(rads) * baseRadius;
      
      const xEnd = centerX + Math.cos(rads) * (baseRadius + barHeight);
      const yEnd = centerY + Math.sin(rads) * (baseRadius + barHeight);

      // Draw the bar
      ctx.beginPath();
      ctx.moveTo(xStart, yStart);
      ctx.lineTo(xEnd, yEnd);
      
      // Make it thick and glowing
      ctx.lineWidth = 3;
      ctx.lineCap = "round";
      ctx.strokeStyle = `rgba(255, 255, 255, ${0.3 + value})`;
      
      // Glow effect
      ctx.shadowBlur = 10;
      ctx.shadowColor = "rgba(255, 255, 255, 0.5)";
      
      ctx.stroke();
    }
    
    // Keep looping if playing
    if (isPlaying) {
      animationRef.current = requestAnimationFrame(drawVisualizer);
    }
  };

  // Sync volume with System Context
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  // Start/Stop Visualizer
  useEffect(() => {
    if (isPlaying) {
      if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume();
      }
      drawVisualizer();
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }
    
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isPlaying]);

  // Handle Play/Pause
  const resumeContext = () => {
    if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }
  };

  const togglePlay = () => {
    initAudio(); 
    resumeContext();
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(e => console.error("Audio play failed:", e));
    }
    setIsPlaying(!isPlaying);
  };

  const handleStop = () => {
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setIsPlaying(false);
    setProgress(0);
    // Draw one last blank frame
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  };

  const playNext = () => {
    initAudio();
    resumeContext();
    setCurrentTrackIndex((prev) => (prev + 1) % PLAYLIST.length);
    setIsPlaying(true);
  };

  const playPrev = () => {
    initAudio();
    resumeContext();
    setCurrentTrackIndex((prev) => (prev - 1 + PLAYLIST.length) % PLAYLIST.length);
    setIsPlaying(true);
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    const current = audioRef.current.currentTime;
    const duration = audioRef.current.duration;
    if (duration) {
      setProgress((current / duration) * 100);
    }
  };

  const handleEnded = () => {
    if (loopMode === 2) {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(console.error);
      }
    } else if (loopMode === 1) {
      playNext();
    } else {
      handleStop();
    }
  };

  // Auto-play when track changes if it was already playing
  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch(console.error);
    }
  }, [currentTrackIndex]);

  return (
    <div className="flex flex-col items-center justify-center h-full w-full bg-black/60 text-white backdrop-blur-3xl overflow-hidden rounded-b-xl border border-white/10 relative">
      
      {/* Background blur of current cover */}
      <div 
        className="absolute inset-0 z-0 opacity-20"
        style={{
          backgroundImage: `url(${currentTrack.cover})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(50px)',
          transition: 'background-image 0.5s ease-in-out',
        }}
      />

      <div className="relative z-10 flex flex-col items-center p-8 w-full max-w-md">
        
        {/* Dynamic Visualizer Canvas */}
        <motion.div 
          key="visualizer"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, type: "spring" }}
          className="w-56 h-56 rounded-[2rem] shadow-2xl mb-10 border border-white/5 bg-black/40 backdrop-blur-xl flex items-center justify-center relative overflow-hidden"
        >
          {/* Subtle spinning record groove effect behind the canvas */}
          <div className="absolute inset-0 rounded-full border border-white/5 scale-[0.6] opacity-30" />
          <div className="absolute inset-0 rounded-full border border-white/5 scale-[0.7] opacity-20" />
          
          <canvas 
            ref={canvasRef} 
            width={224} 
            height={224} 
            className="w-full h-full relative z-10"
          />
        </motion.div>

        {/* Track Info */}
        <div className="text-center mb-8 w-full">
          <h2 className="text-3xl font-bold truncate tracking-tight text-white/95">{currentTrack.title}</h2>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1.5 bg-white/10 rounded-full mb-10 overflow-hidden relative cursor-pointer"
             onClick={(e) => {
               if (audioRef.current && audioRef.current.duration) {
                 const rect = e.currentTarget.getBoundingClientRect();
                 const pos = (e.clientX - rect.left) / rect.width;
                 audioRef.current.currentTime = pos * audioRef.current.duration;
               }
             }}>
          <motion.div 
            className="h-full bg-white relative"
            style={{ width: `${progress}%` }}
            layout
          />
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between w-full max-w-xs mx-auto">
          <button 
            onClick={() => setLoopMode((prev) => (prev + 1) % 3)} 
            className={`p-3 transition-all relative flex items-center justify-center ${
              loopMode === 0 ? "text-white/40 hover:text-white/60" :
              loopMode === 1 ? "text-white hover:scale-110" :
              "text-red-400 hover:scale-110"
            }`}
          >
            <FaRedo className="text-lg" />
            {loopMode === 0 && (
              <FaTimes className="absolute text-[9px]" style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />
            )}
            {loopMode === 2 && (
              <span className="absolute text-[10px] font-bold" style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                1
              </span>
            )}
          </button>
          
          <button onClick={playPrev} className="p-3 text-white/80 hover:text-white hover:scale-110 transition-all">
            <FaStepBackward className="text-2xl" />
          </button>
          
          <button 
            onClick={togglePlay} 
            className="w-16 h-16 flex items-center justify-center bg-white text-black rounded-full hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(255,255,255,0.25)]"
          >
            {isPlaying ? <FaPause className="text-2xl" /> : <FaPlay className="text-2xl ml-1" />}
          </button>
          
          <button onClick={playNext} className="p-3 text-white/80 hover:text-white hover:scale-110 transition-all">
            <FaStepForward className="text-2xl" />
          </button>

          <button onClick={handleStop} className="p-3 text-white/40 hover:text-white hover:scale-110 transition-all">
            <FaStop className="text-lg" />
          </button>
        </div>

      </div>

      <audio 
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
      />
    </div>
  );
}
