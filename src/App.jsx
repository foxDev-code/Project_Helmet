import React, { useState, useEffect, useRef } from 'react';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import ThreeBackground from './components/ThreeBackground';

export default function App() {
  const [currentPage, setCurrentPage] = useState('landing');
  const [isAudioMuted, setIsAudioMuted] = useState(true);
  const audioCtxRef = useRef(null);

  // System Hum Node References
  const systemHumNodeRef = useRef(null);
  const systemHumOsc1Ref = useRef(null);
  const systemHumOsc2Ref = useRef(null);

  const initAudio = () => {
    if (!audioCtxRef.current) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtxRef.current = new AudioContext();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
  };

  const playHoverClick = () => {
    if (isAudioMuted || !audioCtxRef.current) return;
    initAudio();

    const ctx = audioCtxRef.current;
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1600, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.08);

    gainNode.gain.setValueAtTime(0.05, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.08);
  };

  const playExplodeHiss = () => {
    if (isAudioMuted || !audioCtxRef.current) return;
    initAudio();

    const ctx = audioCtxRef.current;
    const bufferSize = ctx.sampleRate * 1.2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(2500, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 1.2);
    filter.Q.value = 1.5;

    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0.12, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);

    noiseSource.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);

    noiseSource.start();
    noiseSource.stop(ctx.currentTime + 1.2);

    // Clunk bass drop
    const clunk = ctx.createOscillator();
    const clunkGain = ctx.createGain();
    clunk.type = 'triangle';
    clunk.frequency.setValueAtTime(90, ctx.currentTime);
    clunk.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 0.2);

    clunkGain.gain.setValueAtTime(0.2, ctx.currentTime);
    clunkGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);

    clunk.connect(clunkGain);
    clunkGain.connect(ctx.destination);
    clunk.start();
    clunk.stop(ctx.currentTime + 0.2);
  };

  const startSystemHum = () => {
    if (isAudioMuted || !audioCtxRef.current) return;
    initAudio();
    if (systemHumNodeRef.current) return;

    const ctx = audioCtxRef.current;
    const humNode = ctx.createGain();
    humNode.gain.setValueAtTime(0.03, ctx.currentTime);
    systemHumNodeRef.current = humNode;

    const osc1 = ctx.createOscillator();
    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(55, ctx.currentTime);
    systemHumOsc1Ref.current = osc1;

    const osc2 = ctx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(110, ctx.currentTime);
    systemHumOsc2Ref.current = osc2;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(120, ctx.currentTime);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(humNode);
    humNode.connect(ctx.destination);

    osc1.start();
    osc2.start();
  };

  const stopSystemHum = () => {
    if (systemHumOsc1Ref.current) {
      try { systemHumOsc1Ref.current.stop(); } catch {}
      systemHumOsc1Ref.current = null;
    }
    if (systemHumOsc2Ref.current) {
      try { systemHumOsc2Ref.current.stop(); } catch {}
      systemHumOsc2Ref.current = null;
    }
    if (systemHumNodeRef.current) {
      systemHumNodeRef.current.disconnect();
      systemHumNodeRef.current = null;
    }
  };

  // Alarm sound generator (sweeps/beeps)
  const playAlarmSound = (freq1 = 880, duration = 0.15) => {
    if (isAudioMuted || !audioCtxRef.current) return;
    initAudio();

    const ctx = audioCtxRef.current;
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq1, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(freq1 / 2, ctx.currentTime + duration);

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1400, ctx.currentTime);

    gainNode.gain.setValueAtTime(0.04, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    osc.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + duration);
  };

  // Scrub alarms synthesis during scroll sequene page movement
  const handleScrubAlarmState = (progress) => {
    if (isAudioMuted || !audioCtxRef.current) return;
    initAudio();

    if (progress >= 0.45 && progress < 0.7) {
      // Moderate warning alarm beep
      if (Math.random() > 0.85) {
        playAlarmSound(660, 0.25);
      }
    } else if (progress >= 0.7) {
      // Rapid emergency alarm beeps
      if (Math.random() > 0.7) {
        playAlarmSound(1200, 0.12);
      }
    }
  };

  // Handle global system hum starting/stopping when audio status changes
  useEffect(() => {
    if (!isAudioMuted) {
      startSystemHum();
    } else {
      stopSystemHum();
    }
    return () => stopSystemHum();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAudioMuted]);

  const handleAudioBtnClick = () => {
    initAudio();
    setIsAudioMuted(!isAudioMuted);
  };

  const handleGoToDashboard = () => {
    if (playHoverClick) playHoverClick();
    setCurrentPage('dashboard');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleGoToLanding = () => {
    if (playHoverClick) playHoverClick();
    setCurrentPage('landing');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  // Listen to standard clicks on links or button elements to trigger haptics
  useEffect(() => {
    const handleDocumentClick = (e) => {
      const target = e.target;
      if (target.tagName === 'A' || target.tagName === 'BUTTON' || target.closest('a') || target.closest('button')) {
        playHoverClick();
      }
    };
    document.addEventListener('click', handleDocumentClick);
    return () => document.removeEventListener('click', handleDocumentClick);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAudioMuted]);

  return (
    <>
      {/* Noise background overlay */}
      <div className="noise-bg" />

      {/* Three.js Constellation Background */}
      <ThreeBackground />

      {/* Pages render */}
      {currentPage === 'landing' ? (
        <LandingPage
          onGoToDashboard={handleGoToDashboard}
          playHoverClick={playHoverClick}
          playExplodeHiss={playExplodeHiss}
          onScrubAlarm={handleScrubAlarmState}
        />
      ) : (
        <Dashboard
          onGoBack={handleGoToLanding}
          playHoverClick={playHoverClick}
          playAlarmSound={playAlarmSound}
        />
      )}

      {/* Floating Audio Toggle Button (bottom corner) */}
      <button
        onClick={handleAudioBtnClick}
        className={`btn-audio-toggle-floating ${!isAudioMuted ? 'active' : ''}`}
        title={isAudioMuted ? 'Unmute Audio Context' : 'Mute Audio Context'}
        data-cursor-hover="hover-danger"
        data-cursor-text={isAudioMuted ? 'UNMUTE' : 'MUTE'}
      >
        <i className={`fa-solid ${isAudioMuted ? 'fa-volume-xmark' : 'fa-volume-low'}`}></i>
      </button>
    </>
  );
}
