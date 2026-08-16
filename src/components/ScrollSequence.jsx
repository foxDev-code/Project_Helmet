import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import TelemetryHUD from './TelemetryHUD';

gsap.registerPlugin(ScrollTrigger);

const totalFrames = 100;

export default function ScrollSequence({ onScrubAlarm }) {
  const containerRef = useRef(null);
  const pinnedRef = useRef(null);
  const canvasRef = useRef(null);

  const [loadedCount, setLoadedCount] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Store preprocessed canvas offscreen images
  const frameImagesRef = useRef([]);
  const currentFrameIndexRef = useRef(0);

  const processFrameImage = (img) => {
    try {
      const offscreen = document.createElement('canvas');
      const w = img.naturalWidth || img.width || 1920;
      const h = img.naturalHeight || img.height || 1080;
      offscreen.width = w;
      offscreen.height = h;
      const oCtx = offscreen.getContext('2d');
      oCtx.drawImage(img, 0, 0);

      const imgData = oCtx.getImageData(0, 0, w, h);
      const data = imgData.data;

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        // Background is light grey/white. Check minimum of RGB channels.
        const minVal = Math.min(r, g, b);
        if (minVal > 175) {
          // Fade-out pixels between 175 and 235
          const alpha = Math.max(0, Math.min(255, (235 - minVal) * 4.25));
          data[i + 3] = Math.min(data[i + 3], alpha);
        }
      }
      oCtx.putImageData(imgData, 0, 0);
      return offscreen;
    } catch (e) {
      console.warn("Failed to process image frame background:", e);
      return img;
    }
  };

  useEffect(() => {
    let active = true;
    let loaded = 0;
    const images = [];

    for (let i = 1; i <= totalFrames; i++) {
      const img = new Image();
      const formattedIndex = String(i).padStart(3, '0');
      img.src = `./${formattedIndex}.png`;

      img.onload = () => {
        if (!active) return;
        images[i - 1] = processFrameImage(img);
        loaded++;
        setLoadedCount(loaded);
        setProgressPercent(Math.round((loaded / totalFrames) * 100));

        if (loaded === totalFrames) {
          frameImagesRef.current = images;
          setIsLoaded(true);
        }
      };

      img.onerror = () => {
        if (!active) return;
        loaded++;
        setLoadedCount(loaded);
        setProgressPercent(Math.round((loaded / totalFrames) * 100));
        if (loaded === totalFrames) {
          frameImagesRef.current = images;
          setIsLoaded(true);
        }
      };
    }

    return () => {
      active = false;
    };
  }, []);

  const drawFrame = (index) => {
    const canvas = canvasRef.current;
    if (!canvas || !frameImagesRef.current[index]) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = frameImagesRef.current[index];
    const rect = canvas.getBoundingClientRect();
    const cWidth = rect.width;
    const cHeight = rect.height;

    const imgWidth = img.naturalWidth || img.width || 1920;
    const imgHeight = img.naturalHeight || img.height || 1080;

    const imgRatio = imgWidth / imgHeight;
    const canvasRatio = cWidth / cHeight;

    let drawWidth, drawHeight, drawX, drawY;

    if (canvasRatio > imgRatio) {
      drawWidth = cWidth;
      drawHeight = cWidth / imgRatio;
      drawX = 0;
      drawY = (cHeight - drawHeight) / 2;
    } else {
      drawWidth = cHeight * imgRatio;
      drawHeight = cHeight;
      drawX = (cWidth - drawWidth) / 2;
      drawY = 0;
    }

    ctx.clearRect(0, 0, cWidth, cHeight);
    ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
    currentFrameIndexRef.current = index;
  };

  const resizeCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    drawFrame(currentFrameIndexRef.current);
  };

  useEffect(() => {
    if (!isLoaded) return;

    // Set up canvas sizes initial check
    resizeCanvas();

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const scrollTriggerInstance = ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top top',
      end: '+=2600',
      pin: pinnedRef.current,
      pinSpacing: true,
      scrub: 0.5,
      onUpdate: (self) => {
        setScrollProgress(self.progress);
        const frameIdx = Math.min(
          totalFrames - 1,
          Math.floor(self.progress * (totalFrames - 1))
        );
        if (frameIdx !== currentFrameIndexRef.current) {
          drawFrame(frameIdx);
        }
        if (onScrubAlarm) {
          onScrubAlarm(self.progress);
        }
      }
    });

    window.addEventListener('resize', resizeCanvas);

    // Force ScrollTrigger calculations update
    setTimeout(() => {
      ScrollTrigger.refresh();
      resizeCanvas();
    }, 400);

    return () => {
      scrollTriggerInstance.kill();
      window.removeEventListener('resize', resizeCanvas);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded]);

  return (
    <div ref={containerRef} id="sequence" className="sequence-container-wrapper">
      <div ref={pinnedRef} className="sequence-pinned-section">
        {/* Preloader Overlay */}
        <div className={`sequence-preloader ${isLoaded ? 'loaded' : ''}`}>
          <div className="preloader-spinner"></div>
          <div className="preloader-text font-bold tracking-widest text-[#eef1f3]">INITIALIZING SURAKSHA FRAME ENGINE</div>
          <div className="preloader-bar-bg">
            <div className="preloader-bar-fill" style={{ width: `${progressPercent}%` }}></div>
          </div>
          <div className="preloader-counter text-xs text-[#9aa5b1] font-mono mt-2">
            LOADING FRAME {loadedCount} / {totalFrames} [{progressPercent}%]
          </div>
        </div>

        {/* Canvas */}
        <canvas ref={canvasRef} id="sequence-canvas" />
        <div className="canvas-blend-vignette" />

        {/* HUD Corner Target Brackets */}
        <div className="hud-corner hud-corner-tl"></div>
        <div className="hud-corner hud-corner-tr"></div>
        <div className="hud-corner hud-corner-bl"></div>
        <div className="hud-corner hud-corner-br"></div>

        {/* Pinned Telemetry HUD Overlay */}
        {isLoaded && <TelemetryHUD progress={scrollProgress} />}
      </div>
    </div>
  );
}
