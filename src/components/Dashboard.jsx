import React, { useState, useEffect } from 'react';

const mockInitialWorkers = {
  'worker-1': {
    name: 'Rajesh Kumar',
    employeeId: 'EMP-2026-08',
    department: 'Zone 4 Maintenance',
    role: 'worker',
    sensorData: {
      heartRate: 74,
      spo2: 98,
      bodyTemp: 36.6,
      ambientTemp: 31.2,
      humidity: 62,
      methane: 120,
      lpgGas: 150,
      helmetOn: true,
      fallDetected: false,
      timestamp: Date.now(),
      lat: 28.6139,
      lng: 77.2090
    },
    alerts: [
      { message: 'System preloader active — Pre-entry check clear.', timestamp: Date.now() - 60000 }
    ]
  },
  'worker-2': {
    name: 'Amit Sharma',
    employeeId: 'EMP-2026-12',
    department: 'Zone 2 Sewer Crew',
    role: 'worker',
    sensorData: {
      heartRate: 98,
      spo2: 96,
      bodyTemp: 37.1,
      ambientTemp: 34.5,
      humidity: 68,
      methane: 1150, // Elevated!
      lpgGas: 450,
      helmetOn: true,
      fallDetected: false,
      timestamp: Date.now(),
      lat: 28.6120,
      lng: 77.2075
    },
    alerts: [
      { message: 'MQ4 Gas Warning: Elevated Methane Level (1,150 PPM) detected!', timestamp: Date.now() - 15000 }
    ]
  },
  'worker-3': {
    name: 'Sanjay Singh',
    employeeId: 'EMP-2026-15',
    department: 'Zone 7 Scaffolding',
    role: 'worker',
    sensorData: {
      heartRate: 110,
      spo2: 95,
      bodyTemp: 36.8,
      ambientTemp: 29.8,
      humidity: 55,
      methane: 80,
      lpgGas: 120,
      helmetOn: false, // Removed!
      fallDetected: true, // Fall detected!
      timestamp: Date.now(),
      lat: 28.6145,
      lng: 77.2110
    },
    alerts: [
      { message: 'FALL DETECTED — Acceleration threshold exceeded!', timestamp: Date.now() - 5000 },
      { message: 'HELMET WARNING: Helmet chin latch opened/removed!', timestamp: Date.now() - 4000 }
    ]
  }
};

const SENSOR_MAP = {
  heartRate:   { label: "Heart Rate",        unit: "bpm", min: 60,  max: 100, warnLow: 50, warnHigh: 120 },
  spo2:        { label: "Blood Oxygen",      unit: "%",   min: 95,  max: 100, warnLow: 90, warnHigh: 100 },
  bodyTemp:    { label: "Body Temperature",  unit: "°C",  min: 36,  max: 37.5, warnLow: 35, warnHigh: 38.5 },
  ambientTemp: { label: "Ambient Temperature", unit: "°C", min: 15, max: 35,  warnLow: 10, warnHigh: 45 },
  humidity:    { label: "Humidity",          unit: "%",   min: 20,  max: 70,  warnLow: 10, warnHigh: 85 },
  methane:     { label: "Methane Level",     unit: "ppm", min: 0,   max: 1000, warnLow: -1, warnHigh: 1500 },
  lpgGas:      { label: "LPG / Gas Level",   unit: "ppm", min: 0,   max: 1000, warnLow: -1, warnHigh: 1500 },
};

export default function Dashboard({ onGoBack, playHoverClick, playAlarmSound }) {
  const [role, setRole] = useState('admin'); // 'admin' or 'worker'
  const [workers, setWorkers] = useState(mockInitialWorkers);
  const [activeWorkerId, setActiveWorkerId] = useState('worker-1'); // for worker view
  const [selectedAdminUid, setSelectedAdminUid] = useState(null); // admin view drawer
  const [clockStr, setClockStr] = useState('');
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [commandInput, setCommandInput] = useState('');

  // Live Clock
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const timeStr = now.toTimeString().split(' ')[0] + '.' + String(now.getMilliseconds()).padStart(3, '0').slice(0, 2);
      setClockStr(`${now.toISOString().slice(0, 10)} ${timeStr} IST`);
    };
    const timer = setInterval(updateClock, 100);
    return () => clearInterval(timer);
  }, []);

  // Fluctuating Telemetry Simulation
  useEffect(() => {
    const simulateTelemetry = () => {
      setWorkers(prev => {
        const next = { ...prev };
        Object.keys(next).forEach(uid => {
          const w = next[uid];
          const sd = { ...w.sensorData };

          // Small fluctuations
          sd.heartRate = Math.max(50, Math.min(130, sd.heartRate + (Math.random() - 0.5) * 4));
          sd.spo2 = Math.max(88, Math.min(100, sd.spo2 + (Math.random() > 0.85 ? -1 : (Math.random() > 0.85 ? 1 : 0))));
          sd.bodyTemp = Math.max(35, Math.min(39.5, sd.bodyTemp + (Math.random() - 0.5) * 0.1));
          sd.ambientTemp = Math.max(25, Math.min(42, sd.ambientTemp + (Math.random() - 0.5) * 0.05));
          sd.humidity = Math.max(40, Math.min(90, sd.humidity + (Math.random() - 0.5) * 0.5));
          
          if (uid === 'worker-2') {
            sd.methane = Math.max(900, Math.min(2200, sd.methane + (Math.random() - 0.5) * 40));
          } else {
            sd.methane = Math.max(30, Math.min(250, sd.methane + (Math.random() - 0.5) * 8));
          }

          sd.timestamp = Date.now();
          w.sensorData = sd;

          // Trigger sound beeps on warning spikes
          const hasCrit = !sd.helmetOn || sd.fallDetected || sd.methane > 1500;
          if (hasCrit && !isAudioMuted && playAlarmSound) {
            playAlarmSound(1000, 0.1);
          }
        });
        return next;
      });
    };

    const timer = setInterval(simulateTelemetry, 1500);
    return () => clearInterval(timer);
  }, [isAudioMuted, playAlarmSound]);

  const rangeClass = (key, val) => {
    const s = SENSOR_MAP[key];
    if (!s || val === undefined || val === null) return '';
    if (val < s.warnLow || val > s.warnHigh) return 'range-crit';
    if (val < s.min || val > s.max) return 'range-warn';
    return 'range-ok';
  };

  const pct = (key, val) => {
    const s = SENSOR_MAP[key];
    if (!s) return 0;
    const lo = Math.min(s.warnLow, s.min);
    const hi = Math.max(s.warnHigh, s.max);
    return Math.max(4, Math.min(100, ((val - lo) / (hi - lo)) * 100));
  };

  const sendCommand = (uid, msg) => {
    if (!msg) return;
    if (playHoverClick) playHoverClick();
    
    // Add command to alerts log of worker
    setWorkers(prev => {
      const next = { ...prev };
      next[uid].alerts = [
        { message: `Supervisor Command: "${msg}"`, timestamp: Date.now() },
        ...next[uid].alerts
      ];
      return next;
    });

    setCommandInput('');
  };

  const handleMuteToggle = () => {
    if (playHoverClick) playHoverClick();
    setIsAudioMuted(!isAudioMuted);
  };

  const currentWorker = workers[activeWorkerId];

  return (
    <div className="dash-layout min-h-screen text-left font-sans flex flex-col justify-between">
      <div>
        <div className="hazard-bar h-[6px] w-full" style={{ background: 'repeating-linear-gradient(135deg, #ff8c1a 0 18px, #14181c 18px 36px)' }} />

        {/* Topbar navigation bar */}
        <header className="flex justify-between items-center p-6 bg-[#1b2126] border-b border-[#2c353d]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#ff8c1a] to-[#d9600a] flex items-center justify-center font-bold text-xl text-[#14181c] font-mono">
              SG
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-wide uppercase text-white font-mono leading-none m-0">SiteGuard</h2>
              <span className="text-[10px] uppercase text-[#9aa5b1] tracking-wider">Helmet Telemetry network</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm font-mono text-[#9aa5b1]">{clockStr}</span>
            <button
              onClick={handleMuteToggle}
              className={`btn btn-sm ${isAudioMuted ? 'btn-danger' : 'btn-ghost'}`}
            >
              <i className={`fa-solid ${isAudioMuted ? 'fa-volume-mute' : 'fa-volume-high'} mr-1`}></i>
              {isAudioMuted ? 'Muted' : 'Alarm Sound On'}
            </button>
            <div className="flex bg-[#212930] rounded-md border border-[#2c353d] p-1">
              <button
                onClick={() => setRole('admin')}
                className={`py-1 px-3 rounded-md text-xs uppercase font-semibold transition-all ${
                  role === 'admin' ? 'bg-[#ff8c1a] text-[#1a1206]' : 'text-[#9aa5b1] hover:text-white'
                }`}
              >
                Admin
              </button>
              <button
                onClick={() => setRole('worker')}
                className={`py-1 px-3 rounded-md text-xs uppercase font-semibold transition-all ${
                  role === 'worker' ? 'bg-[#ff8c1a] text-[#1a1206]' : 'text-[#9aa5b1] hover:text-white'
                }`}
              >
                Worker
              </button>
            </div>
            <button onClick={onGoBack} className="btn py-2 px-4 text-xs font-semibold hover:bg-[#262f37]">
              Exit Dashboard
            </button>
          </div>
        </header>

        {/* Content area */}
        <main className="max-w-[1240px] mx-auto p-6">
          {role === 'worker' ? (
            /* WORKER INDIVIDUAL DASHBOARD VIEW */
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Left Column: Worker Identity Card */}
              <div className="md:col-span-1 flex flex-col gap-6">
                <div className="card">
                  <div className="text-[#9aa5b1] text-xs uppercase tracking-wider mb-2 font-mono">Simulate Worker Profile</div>
                  <select
                    value={activeWorkerId}
                    onChange={(e) => setActiveWorkerId(e.target.value)}
                    className="w-full bg-[#212930] border border-[#2c353d] text-white p-3 rounded-md mb-4 outline-none font-mono text-sm"
                  >
                    {Object.entries(workers).map(([uid, w]) => (
                      <option key={uid} value={uid}>{w.name} ({w.employeeId})</option>
                    ))}
                  </select>

                  <div className="border-t border-[#2c353d] pt-4 mt-2">
                    <h3 className="text-2xl font-bold text-white mb-1 font-mono">{currentWorker.name}</h3>
                    <div className="text-sm text-[#4fb0e6] font-mono mb-2">{currentWorker.employeeId} &bull; {currentWorker.department}</div>
                    <div className="text-xs text-[#9aa5b1] font-mono select-all">UUID: {activeWorkerId}</div>
                  </div>
                </div>

                {/* Safety Tags */}
                <div className="card flex flex-col gap-4">
                  <h4 className="text-xs uppercase text-[#9aa5b1] tracking-wider font-mono m-0">Critical Latch Compliance</h4>
                  
                  {/* Helmet Latch */}
                  <div className="flex justify-between items-center bg-[#212930] p-3 rounded-md border border-[#2c353d]">
                    <span className="text-sm text-[#eef1f3]">Chin Harness:</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold font-mono ${
                      currentWorker.sensorData.helmetOn ? 'bg-[#134228] text-[#3ddc84]' : 'bg-[#4d1414] text-[#ff3b3b]'
                    }`}>
                      {currentWorker.sensorData.helmetOn ? 'LATCHED' : 'OPEN / COMPROMISED'}
                    </span>
                  </div>

                  {/* Fall Sensor */}
                  <div className="flex justify-between items-center bg-[#212930] p-3 rounded-md border border-[#2c353d]">
                    <span className="text-sm text-[#eef1f3]">G-force impact:</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold font-mono ${
                      !currentWorker.sensorData.fallDetected ? 'bg-[#134228] text-[#3ddc84]' : 'bg-[#4d1414] text-[#ff3b3b]'
                    }`}>
                      {!currentWorker.sensorData.fallDetected ? 'NORMAL' : 'FALL DETECTED'}
                    </span>
                  </div>

                  {/* Emergency SOS */}
                  <button
                    onClick={() => sendCommand(activeWorkerId, 'Manual Worker Emergency Dispatch SOS Triggered.')}
                    className="w-full btn-danger py-3 px-4 rounded-md font-bold text-sm tracking-wider uppercase text-center cursor-pointer hover:bg-[#ff5c5c]"
                  >
                    Trigger manual distress SOS
                  </button>
                </div>
              </div>

              {/* Right Column: Live Telemetry Grid */}
              <div className="md:col-span-2 flex flex-col gap-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {Object.entries(SENSOR_MAP).map(([key, s]) => {
                    const val = currentWorker.sensorData[key];
                    if (val === undefined) return null;
                    const cls = rangeClass(key, val);
                    return (
                      <div key={key} className={`card ${cls}`}>
                        <div className="text-xs text-[#9aa5b1] font-mono mb-2 uppercase">{s.label}</div>
                        <div className="text-3xl font-bold text-white font-mono">
                          {Number(val).toFixed(1)}
                          <span className="text-sm text-[#9aa5b1] ml-1">{s.unit}</span>
                        </div>
                        <div className="bar-track">
                          <div className="bar-fill" style={{ width: `${pct(key, val)}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Alerts Log */}
                <div className="card">
                  <h4 className="text-xs uppercase text-[#9aa5b1] tracking-wider font-mono mb-4">Worker Alerts Log</h4>
                  <div className="flex flex-col gap-2 max-h-[220px] overflow-y-auto pr-2">
                    {currentWorker.alerts.length === 0 ? (
                      <div className="text-sm text-[#9aa5b1] font-mono py-2">No alerts. System operating normally.</div>
                    ) : (
                      currentWorker.alerts.map((alt, idx) => (
                        <div key={idx} className="flex justify-between items-start bg-[#212930] p-3 rounded border border-[#2c353d]">
                          <span className="text-sm text-white font-mono">{alt.message}</span>
                          <span className="text-[10px] text-[#9aa5b1] font-mono ml-4 white-space-nowrap">
                            {new Date(alt.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* ADMIN SUPERVISOR ROSTER TABLE VIEW */
            <div className="flex flex-col gap-6">
              <div className="card p-0 overflow-hidden border border-[#2c353d]">
                <table className="w-full text-left border-collapse font-mono text-sm">
                  <thead>
                    <tr className="bg-[#212930] text-[#ff8c1a] border-b border-[#2c353d]">
                      <th className="p-4">Worker Profile</th>
                      <th className="p-4">Zone / Dept</th>
                      <th className="p-4">Chin Latch</th>
                      <th className="p-4">Heart Rate</th>
                      <th className="p-4">MQ4 Gas Level</th>
                      <th className="p-4">Fall / Strike</th>
                      <th className="p-4">Last Sync</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(workers).map(([uid, w]) => {
                      const d = w.sensorData;
                      const hasWarning = !d.helmetOn || d.fallDetected || d.methane > 1000;
                      return (
                        <tr
                          key={uid}
                          onClick={() => setSelectedAdminUid(uid)}
                          className={`border-b border-[#2c353d] cursor-pointer hover:bg-[#262f37] transition-all ${
                            hasWarning ? 'bg-[rgba(255,59,59,0.06)]' : ''
                          }`}
                        >
                          <td className="p-4">
                            <strong className="text-white">{w.name}</strong>
                            <div className="text-xs text-[#9aa5b1] mt-1">{w.employeeId}</div>
                          </td>
                          <td className="p-4 text-[#9aa5b1]">{w.department}</td>
                          <td className="p-4">
                            <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                              d.helmetOn ? 'bg-[#134228] text-[#3ddc84]' : 'bg-[#4d1414] text-[#ff3b3b]'
                            }`}>
                              {d.helmetOn ? 'Worn' : 'REMOVED'}
                            </span>
                          </td>
                          <td className="p-4 font-bold text-white">{Math.round(d.heartRate)} bpm</td>
                          <td className="p-4 font-bold" style={{ color: d.methane > 1000 ? '#ff3b3b' : '#3ddc84' }}>
                            {d.methane > 1000 ? 'Elevated' : 'Normal'}
                          </td>
                          <td className="p-4" style={{ color: d.fallDetected ? '#ff3b3b' : '#3ddc84' }}>
                            {d.fallDetected ? 'IMPACT FALL' : 'Normal'}
                          </td>
                          <td className="p-4 text-xs text-[#9aa5b1]">
                            {new Date(d.timestamp).toLocaleTimeString()}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Admin Overlay Drawer Drawer */}
              {selectedAdminUid && (
                <div
                  onClick={(e) => e.target === e.currentTarget && setSelectedAdminUid(null)}
                  className="fixed inset-0 bg-[rgba(0,0,0,0.8)] backdrop-blur-md z-50 flex justify-end"
                >
                  <div className="w-full max-w-[500px] h-full bg-[#1b2126] border-l border-[#2c353d] p-6 overflow-y-auto flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center mb-6 border-b border-[#2c353d] pb-4">
                        <div>
                          <h3 className="text-2xl font-bold text-white font-mono m-0">
                            {workers[selectedAdminUid].name}
                          </h3>
                          <span className="text-xs text-[#4fb0e6] font-mono">
                            {workers[selectedAdminUid].employeeId} &bull; {workers[selectedAdminUid].department}
                          </span>
                        </div>
                        <button
                          onClick={() => setSelectedAdminUid(null)}
                          className="bg-transparent border-none text-white text-3xl cursor-pointer"
                        >
                          &times;
                        </button>
                      </div>

                      {/* Live Data Grid inside Drawer */}
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        {Object.entries(SENSOR_MAP).map(([key, s]) => {
                          const val = workers[selectedAdminUid].sensorData[key];
                          const cls = rangeClass(key, val);
                          return (
                            <div key={key} className={`bg-[#212930] p-4 rounded-md border border-[#2c353d] ${cls}`}>
                              <div className="text-[10px] text-[#9aa5b1] uppercase font-mono mb-1">{s.label}</div>
                              <div className="text-lg font-bold text-white font-mono">
                                {Number(val).toFixed(1)}
                                <span className="text-xs text-[#9aa5b1] ml-1">{s.unit}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Map Location and Cam Links */}
                      <div className="flex gap-4 mb-6">
                        <a
                          href={`https://www.google.com/maps?q=${workers[selectedAdminUid].sensorData.lat},${workers[selectedAdminUid].sensorData.lng}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 btn text-center py-3 bg-[#212930] text-sm text-[#4fb0e6] border-[#4fb0e6] hover:bg-[#262f37]"
                        >
                          <i className="fa-solid fa-map-location mr-2"></i>Google Maps Position
                        </a>
                        <button
                          onClick={() => sendCommand(selectedAdminUid, 'Optical Vision Camera Stream Requested.')}
                          className="flex-1 btn text-center py-3 bg-[#212930] text-sm text-[#ff8c1a] border-[#ff8c1a] hover:bg-[#262f37]"
                        >
                          <i className="fa-solid fa-camera mr-2"></i>Request Camera feed
                        </button>
                      </div>

                      {/* Quick supervisor command inputs */}
                      <div className="card mb-6">
                        <h4 className="text-xs uppercase text-[#9aa5b1] tracking-wider font-mono mb-3">Dispatch Quick Command</h4>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {[
                            'EVACUATE AREA IMMEDIATELY!',
                            'Check Chin Harness Alignment.',
                            'Return to Zone Entry Point.',
                            'Flash RGB Beacon strobe.'
                          ].map((cmd) => (
                            <button
                              key={cmd}
                              onClick={() => sendCommand(selectedAdminUid, cmd)}
                              className="btn btn-sm text-xs bg-[#212930]"
                            >
                              {cmd.split(' ')[0]}...
                            </button>
                          ))}
                        </div>

                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Type custom directive..."
                            value={commandInput}
                            onChange={(e) => setCommandInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && sendCommand(selectedAdminUid, commandInput)}
                            className="flex-1 bg-[#212930] border border-[#2c353d] text-white p-2.5 rounded-md outline-none font-mono text-sm"
                          />
                          <button
                            onClick={() => sendCommand(selectedAdminUid, commandInput)}
                            className="btn btn-primary text-xs"
                          >
                            Send
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Alerts Log in drawer */}
                    <div className="card mt-auto max-h-[160px] overflow-y-auto">
                      <h4 className="text-[10px] uppercase text-[#9aa5b1] tracking-wider font-mono mb-3">Live Log Feed</h4>
                      <div className="flex flex-col gap-2">
                        {workers[selectedAdminUid].alerts.map((alt, idx) => (
                          <div key={idx} className="flex justify-between items-center text-xs font-mono">
                            <span className="text-white">{alt.message}</span>
                            <span className="text-[#9aa5b1] ml-4">{new Date(alt.timestamp).toLocaleTimeString()}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      <footer className="p-6 bg-[#14181c] border-t border-[#2c353d] text-center text-xs text-[#5f6b76] font-mono mt-auto">
        &copy; 2026 SiteGuard Network Operations Center. Compliant with IS 16588:2026 Standards.
      </footer>
    </div>
  );
}
