import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import TelemetryHUD from './TelemetryHUD';
import { removeFrameBackdrop } from './frameMatte';

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
  const processedFramesRef = useRef(new Map());
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
      removeFrameBackdrop(imgData.data, w, h);
      oCtx.putImageData(imgData, 0, 0);
      return offscreen;
    } catch (e) {
      console.warn("Failed to process image frame background:", e);
      return img;
    }
  };

  useEffect(() => {
    processedFramesRef.current.clear();
    let active = true;
    let loaded = 0;
    const images = [];

    for (let i = 1; i <= totalFrames; i++) {
      const img = new Image();
      const formattedIndex = String(i).padStart(3, '0');
      img.src = `./${formattedIndex}.png`;

      img.onload = () => {
        if (!active) return;
        images[i - 1] = img;
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

    const processed = processedFramesRef.current;
    if (!processed.has(index)) {
      processed.set(index, processFrameImage(frameImagesRef.current[index]));
      // Keep a few adjacent frames warm without retaining 100 extra canvases.
      if (processed.size > 5) processed.delete(processed.keys().next().value);
    }
    const img = processed.get(index);
    const rect = canvas.getBoundingClientRect();
    const cWidth = rect.width;
    const cHeight = rect.height;

    const imgWidth = img.naturalWidth || img.width || 1920;
    const imgHeight = img.naturalHeight || img.height || 1080;

    const imgRatio = imgWidth / imgHeight;
    const canvasRatio = cWidth / cHeight;

    let drawWidth, drawHeight, drawX, drawY;

    if (canvasRatio < imgRatio) {
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

    const framingScale = .92 + .48 * Math.max(0, 1 - Math.min(index, totalFrames - 1 - index) / 20);
    drawWidth *= framingScale;
    drawHeight *= framingScale;
    drawX = (cWidth - drawWidth) / 2;
    drawY = (cHeight - drawHeight) / 2;
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

    const resizeObserver = new ResizeObserver(resizeCanvas);
    resizeObserver.observe(canvasRef.current);
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const scrollTriggerInstance = prefersReducedMotion ? null : ScrollTrigger.create({
      trigger: containerRef.current,
      start: () => `top ${document.querySelector('.site-header')?.offsetHeight || 0}px`,
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

    // Force ScrollTrigger calculations update
    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
      resizeCanvas();
    }, 400);

    return () => {
      clearTimeout(refreshTimer);
      scrollTriggerInstance?.kill();
      resizeObserver.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded]);

  return (
    <section ref={containerRef} id="sequence" className="sequence-container-wrapper" aria-label="Prototype walkthrough">
      <div ref={pinnedRef} className="sequence-pinned-section">
        <div className="sequence-stage-label"><span>INSIDE SURAKSHA ONE</span><span>PROTOTYPE WALKTHROUGH / SCROLL TO EXPLORE ↓</span></div>
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
        <div className="sequence-visual">
          <div className="sequence-orbit" aria-hidden="true" />
          <canvas ref={canvasRef} id="sequence-canvas" aria-label="Suraksha One prototype assembling and separating as you scroll" />
          <span className="sequence-visual-caption">THE REAL PROTOTYPE / COMPONENT VIEW</span>
        </div>

        {/* Pinned Telemetry HUD Overlay */}
        {isLoaded && <TelemetryHUD progress={scrollProgress} />}
      </div>
    </section>
  );
}
