'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PsyduckCanvas from '@/components/PsyduckCanvas';
import { PLAINTEXT_MESSAGE, CIPHERTEXT_MESSAGE } from '@/lib/vigenere';
import { Film } from 'lucide-react';

export default function Home() {
  const [currentPage, setCurrentPage] = useState<1 | 2 | 3>(1);

  // Page 1 State
  const [password, setPassword] = useState('');
  const [accessError, setAccessError] = useState(false);

  // Page 2 State
  const [keyInput, setKeyInput] = useState('');
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [displayedText, setDisplayedText] = useState(CIPHERTEXT_MESSAGE);
  const [decryptionComplete, setDecryptionComplete] = useState(false);

  // Page 3 State
  const [introStage, setIntroStage] = useState<'ready' | '1' | '2' | '3' | 'video'>('ready');
  const [videoEnded, setVideoEnded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Handle Page 1 Submission
  const handleAccessSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.trim().toLowerCase() === 'blue') {
      setCurrentPage(2);
    } else {
      setAccessError(true);
      setTimeout(() => setAccessError(false), 1800);
    }
  };

  // Handle Page 2 Key Entry - Automatically decrypts upon entering key 'blue' or 'oh'
  const handleKeySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    triggerDecryption();
  };

  useEffect(() => {
    const clean = keyInput.trim().toLowerCase();
    if ((clean === 'blue' || clean === 'oh') && !isDecrypting && !decryptionComplete) {
      triggerDecryption();
    }
  }, [keyInput, isDecrypting, decryptionComplete]);

  const triggerDecryption = () => {
    if (isDecrypting || decryptionComplete) return;
    setIsDecrypting(true);
    const totalLength = PLAINTEXT_MESSAGE.length;
    let currentIdx = 0;

    const interval = setInterval(() => {
      currentIdx += Math.floor(Math.random() * 14) + 10;
      if (currentIdx >= totalLength) {
        currentIdx = totalLength;
        clearInterval(interval);
        setDisplayedText(PLAINTEXT_MESSAGE);
        setProgress(100);
        setDecryptionComplete(true);
        setIsDecrypting(false);
      } else {
        const decryptedPart = PLAINTEXT_MESSAGE.slice(0, currentIdx);
        const encryptedPart = CIPHERTEXT_MESSAGE.slice(currentIdx);
        setDisplayedText(decryptedPart + encryptedPart);
        const currentProgress = Math.floor((currentIdx / totalLength) * 100);
        setProgress(currentProgress);
      }
    }, 12);
  };

  // Countdown timer on Page 3: "Are you ready?" -> "1" -> "2" -> "3" -> video
  useEffect(() => {
    if (currentPage === 3) {
      setIntroStage('ready');
      const timer1 = setTimeout(() => setIntroStage('1'), 1800);
      const timer2 = setTimeout(() => setIntroStage('2'), 3000);
      const timer3 = setTimeout(() => setIntroStage('3'), 4200);
      const timer4 = setTimeout(() => setIntroStage('video'), 5400);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
        clearTimeout(timer4);
      };
    }
  }, [currentPage]);

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-slate-50 text-slate-900 flex flex-col justify-center items-center select-none">
      {/* 3D WebGL Background Canvas */}
      <PsyduckCanvas currentPage={currentPage} />

      <AnimatePresence mode="wait">
        {/* PAGE 1: ACCESS SCREEN */}
        {currentPage === 1 && (
          <motion.div
            key="page1"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, filter: 'blur(10px)' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="z-10 flex flex-col items-center justify-center p-6 text-center max-w-md w-full"
          >
            <h1 className="text-8xl md:text-9xl font-extrabold tracking-tighter text-slate-900 mb-6">
              20
            </h1>

            <div className="mb-6 text-xs text-sky-700 tracking-widest uppercase crypto-font font-medium">
              Hint: Favorite color
            </div>

            <form onSubmit={handleAccessSubmit} className="w-full space-y-4">
              <div className="relative glass-card glass-card-focus rounded-2xl overflow-hidden transition-all">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter passcode"
                  className="w-full px-6 py-4 bg-transparent text-center text-lg text-slate-900 placeholder-slate-400 focus:outline-none tracking-widest"
                  autoFocus
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-2xl bg-sky-600 hover:bg-sky-500 text-white font-semibold tracking-widest text-sm transition-all duration-300 active:scale-[0.99] cursor-pointer"
              >
                ACCESS
              </button>
            </form>

            {accessError && (
              <p className="mt-4 text-xs text-rose-500 tracking-wider crypto-font font-medium">
                Incorrect passcode. Try favorite color
              </p>
            )}
          </motion.div>
        )}

        {/* PAGE 2: CLEAN CRYPTOGRAPHY LAB */}
        {currentPage === 2 && (
          <motion.div
            key="page2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="z-10 w-full max-w-4xl min-h-screen px-4 py-8 flex flex-col justify-between items-center"
          >
            {/* Progress Bar */}
            <div className="w-full h-2 bg-sky-100 overflow-hidden my-3 rounded-full border border-sky-200">
              <div
                className="h-full bg-sky-500 transition-all duration-200 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Cipher Text Display Area */}
            <div className="w-full my-4 p-6 md:p-8 rounded-3xl glass-card overflow-y-auto max-h-[50vh]">
              <div
                className={`whitespace-pre-wrap transition-colors duration-500 ${
                  decryptionComplete
                    ? 'message-font text-slate-800 text-base md:text-lg leading-relaxed'
                    : 'crypto-font text-sky-800 text-xs md:text-sm tracking-wide'
                }`}
              >
                {displayedText}
              </div>
            </div>

            {/* Clean Input & Key Hint */}
            {!decryptionComplete ? (
              <form onSubmit={handleKeySubmit} className="w-full max-w-md flex flex-col items-center gap-3">
                <div className="text-sm md:text-base text-sky-700 tracking-wide crypto-font font-medium text-center px-2">
                  enter "decrypt" to decrypt the whole message, baldylocks
                </div>
                <div className="w-full relative glass-card glass-card-focus rounded-2xl overflow-hidden">
                  <input
                    type="text"
                    value={keyInput}
                    onChange={(e) => setKeyInput(e.target.value)}
                    placeholder="Enter cipher key"
                    className="w-full px-5 py-3.5 text-center text-slate-900 crypto-font bg-transparent focus:outline-none"
                    autoFocus
                  />
                </div>
              </form>
            ) : (
              /* Reveal interactive film icon & thank you message section when 100% complete */
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="w-full max-w-md flex flex-col items-center gap-4 my-3"
              >
                <div className="w-full flex flex-col items-center gap-2">
                  <label className="text-sm font-medium text-sky-800 tracking-wide">
                    you wanna thank me?
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Write your message here..."
                    className="w-full p-4 rounded-2xl glass-card glass-card-focus text-slate-900 placeholder-slate-400 focus:outline-none resize-none text-sm"
                  />
                </div>

                <button
                  onClick={() => setCurrentPage(3)}
                  aria-label="Play video"
                  className="p-4 rounded-full bg-sky-600 hover:bg-sky-500 border border-sky-300 text-white transition-all hover:scale-105 active:scale-95 cursor-pointer mt-1"
                >
                  <Film className="w-6 h-6" />
                </button>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* PAGE 3: INTRO COUNTDOWN (Are you ready? -> 1 -> 2 -> 3) & VIDEO */}
        {currentPage === 3 && (
          <motion.div
            key="page3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="z-10 w-full min-h-screen bg-transparent flex flex-col items-center justify-center p-4 relative"
          >
            <AnimatePresence mode="wait">
              {introStage === 'ready' && (
                <motion.div
                  key="ready"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.1 }}
                  transition={{ duration: 0.8 }}
                  className="text-3xl md:text-5xl font-light tracking-widest text-sky-700 text-center"
                >
                  Are you ready?
                </motion.div>
              )}

              {introStage === '1' && (
                <motion.div
                  key="1"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1.3 }}
                  exit={{ opacity: 0, scale: 1.8 }}
                  transition={{ duration: 0.6 }}
                  className="text-9xl font-black text-sky-600"
                >
                  1
                </motion.div>
              )}

              {introStage === '2' && (
                <motion.div
                  key="2"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1.3 }}
                  exit={{ opacity: 0, scale: 1.8 }}
                  transition={{ duration: 0.6 }}
                  className="text-9xl font-black text-sky-600"
                >
                  2
                </motion.div>
              )}

              {introStage === '3' && (
                <motion.div
                  key="3"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1.3 }}
                  exit={{ opacity: 0, scale: 1.8 }}
                  transition={{ duration: 0.6 }}
                  className="text-9xl font-black text-sky-500"
                >
                  3
                </motion.div>
              )}

              {introStage === 'video' && (
                <motion.div
                  key="videoStage"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1 }}
                  className="w-full flex flex-col items-center justify-center max-w-4xl"
                >
                  <div className="w-full aspect-video rounded-3xl overflow-hidden glass-card bg-black relative border border-sky-300">
                    <video
                      ref={videoRef}
                      src="/001102868.mp4"
                      controls
                      autoPlay
                      onEnded={() => setVideoEnded(true)}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  {videoEnded && (
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 1.2 }}
                      className="mt-8 text-center space-y-2 text-slate-800"
                    >
                     
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
