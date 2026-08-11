import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { playStartupChime } from "../../core/system/audio";
import { FaPowerOff } from "react-icons/fa";

export default function StartupSequence({ onComplete }) {
  // Stage 0: Waiting for user interaction (Power Button)
  // Stage 1: Booting (K-OS logo + progress bar)
  // Stage 2: Quote
  // Stage 3: Credit
  // Stage 4: Fade out to desktop
  const [stage, setStage] = useState(0);
  const [progress, setProgress] = useState(0);

  const handlePowerOn = () => {
    setStage(1);
    playStartupChime();
    
    // Simulate progress bar loading over 2 seconds
    let currentProgress = 0;
    const progressInterval = setInterval(() => {
      currentProgress += Math.random() * 15;
      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(progressInterval);
      }
      setProgress(currentProgress);
    }, 200);

    // Boot sequence timers
    const timers = [
      setTimeout(() => setStage(2), 2500),  // Quote
      setTimeout(() => setStage(3), 6000),  // Credit
      setTimeout(() => setStage(4), 8500),  // Desktop reveal
      setTimeout(() => onComplete(), 9300),
    ];

    return () => {
      clearInterval(progressInterval);
      timers.forEach(clearTimeout);
    };
  };

  return (
    <motion.div
      className="fixed inset-0 z-[9999] overflow-hidden"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{
        opacity: 0,
        transition: {
          duration: 0.9,
          ease: "easeInOut",
        },
      }}
    >
      {/* Desktop blur - Always solid black before stage 4 */}
      <motion.div
        className="absolute inset-0 bg-black"
        animate={{
          opacity: stage === 4 ? 0 : 1,
        }}
        transition={{
          duration: 1.2,
          ease: "easeInOut",
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex h-full items-center justify-center">
        <AnimatePresence mode="wait">
          {stage === 0 && (
            <motion.div
              key="power"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center gap-6"
            >
              <button
                onClick={handlePowerOn}
                className="group relative flex h-24 w-24 items-center justify-center rounded-full border-2 border-white/20 bg-white/5 transition-all duration-300 hover:border-white/50 hover:bg-white/10 hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] active:scale-95"
              >
                <FaPowerOff className="text-4xl text-white/50 transition-colors duration-300 group-hover:text-white" />
              </button>
              <p className="text-sm tracking-[0.2em] text-white/40 uppercase">
                Power On
              </p>
            </motion.div>
          )}

          {stage === 1 && (
            <motion.div
              key="logo"
              initial={{ opacity: 0, filter: "blur(10px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, filter: "blur(10px)" }}
              transition={{ duration: 0.8 }}
              className="flex flex-col items-center gap-12"
            >
              <h1 className="text-6xl font-extralight tracking-[0.28em] text-white ml-[0.28em]">
                K-OS
              </h1>
              
              {/* Progress Bar Container */}
              <div className="h-1.5 w-48 overflow-hidden rounded-full bg-white/20">
                <motion.div 
                  className="h-full bg-white"
                  initial={{ width: "0%" }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.2, ease: "linear" }}
                />
              </div>
            </motion.div>
          )}

          {stage === 2 && (
            <motion.div
              key="quote"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="px-10 text-center"
            >
              <p className="text-5xl font-extralight leading-[1.5] tracking-tight text-white">
                “Good artists copy;
                <br />
                great artists steal.”
              </p>
            </motion.div>
          )}

          {stage === 3 && (
            <motion.div
              key="credit"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <p className="text-sm uppercase tracking-[0.35em] text-white/60 ml-[0.35em]">
                Designed & Developed by
              </p>
              <h2 className="mt-4 text-5xl font-extralight tracking-wide text-white">
                Keshav
              </h2>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
