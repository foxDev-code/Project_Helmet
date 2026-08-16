import React from 'react';

export default function TelemetryHUD({ progress }) {
  let badgeText = 'SYSTEM OK — PRE-ENTRY MONITORING';
  let badgeClass = '';
  let gasVal = '120 PPM (SAFE)';
  let gasColor = 'var(--safe-bright)';
  let fallVal = '1.0G (STABLE)';
  let gpsVal = '28.6139° N, 77.2090° E';
  let activeStep = 0;

  if (progress < 0.2) {
    activeStep = 0;
    badgeText = 'SYSTEM OK — PRE-ENTRY MONITORING';
    badgeClass = '';
    gasVal = '120 PPM (SAFE)';
    gasColor = 'var(--safe-bright)';
    fallVal = '1.0G (STABLE)';
    gpsVal = '28.6139° N, 77.2090° E';
  } else if (progress < 0.45) {
    activeStep = 1;
    badgeText = 'CONFINED SPACE ENTRY DETECTED';
    badgeClass = '';
    gasVal = '480 PPM (ELEVATED)';
    gasColor = 'var(--amber-bright)';
    fallVal = '1.1G (DESCENT)';
    gpsVal = '28.6139° N, 77.2090° E';
  } else if (progress < 0.7) {
    activeStep = 2;
    badgeText = 'HAZARD WARNING: TOXIC GAS SPIKE';
    badgeClass = 'danger';
    gasVal = '1,850 PPM (CRITICAL)';
    gasColor = 'var(--danger-bright)';
    fallVal = '1.2G (IMPACT WARNING)';
    gpsVal = '28.6139° N, 77.2090° E';
  } else if (progress < 0.85) {
    activeStep = 3;
    badgeText = 'IMPACT DETECTED — AUTOMATIC ALERT';
    badgeClass = 'danger';
    gasVal = '1,920 PPM (CRITICAL)';
    gasColor = 'var(--danger-bright)';
    fallVal = '4.8G (FALL IMPACT)';
    gpsVal = '28.6139° N, 77.2090° E';
  } else {
    activeStep = 4;
    badgeText = 'EMERGENCY DISPATCH INITIATED';
    badgeClass = 'danger';
    gasVal = '1,890 PPM (ACTIVE ALARM)';
    gasColor = 'var(--danger-bright)';
    fallVal = '0.0G (WORKER DOWN)';
    gpsVal = '28.6139° N, 77.2090° E';
  }

  const storySteps = [
    {
      title: '1. Pre-Entry Gas Sampling',
      desc: 'MQ4 & MQ6 sensors sample manhole atmosphere before human entry'
    },
    {
      title: '2. Confined Space Monitoring',
      desc: 'Continuous internal atmosphere & vital telemetry streaming'
    },
    {
      title: '3. Methane Hazard Triggered',
      desc: 'Toxic gas spike immediately fires RGB ring & 85dB piezo alarm'
    },
    {
      title: '4. Free-Fall & Impact Alert',
      desc: 'MPU6050 detects 4.8G fall impact trajectory instantly'
    },
    {
      title: '5. Automated Emergency Dispatch',
      desc: 'GPS coordinates & worker identity broadcasted to supervisor'
    }
  ];

  return (
    <div className="canvas-hud-overlay absolute inset-0 z-10 pointer-events-none p-14 flex flex-col justify-between">
      {/* High-Tech Progress Tracker Bar */}
      <div className="hud-progress-bar-container w-full h-[2px] bg-white/5 mb-4 relative overflow-hidden rounded">
        <div 
          className="hud-progress-bar-fill h-full bg-amber-bright shadow-[0_0_8px_#ffb000] transition-all duration-100 ease-out" 
          style={{ width: `${progress * 100}%` }}
        />
      </div>

      <div className="hud-header flex justify-between items-start">
        <div className={`hud-badge ${badgeClass}`}>
          <span className="hud-badge-dot" />
          <span id="hud-badge-text">{badgeText}</span>
        </div>

        <div className="hud-telemetry-box">
          <div className="hud-row">
            <span className="hud-label">MQ4 METHANE:</span>
            <span id="hud-gas-val" className="hud-val" style={{ color: gasColor }}>
              {gasVal}
            </span>
          </div>
          <div className="hud-row">
            <span className="hud-label">MPU6050 IMPACT:</span>
            <span id="hud-fall-val" className="hud-val">
              {fallVal}
            </span>
          </div>
          <div className="hud-row">
            <span className="hud-label">GPS COORDS:</span>
            <span id="hud-gps-val" className="hud-val">
              {gpsVal}
            </span>
          </div>
        </div>
      </div>

      {/* Dynamic Fading Story Overlay Text */}
      <div className="hud-story-headline relative w-full flex justify-center items-center h-32">
        {storySteps.map((step, idx) => (
          <div
            key={idx}
            className={`story-step ${idx === activeStep ? 'active' : ''}`}
            style={{
              pointerEvents: 'none',
            }}
          >
            <h2>{step.title}</h2>
            <p>{step.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
