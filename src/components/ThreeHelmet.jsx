import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';

const componentDetailsMap = {
  max: {
    title: 'WS2812B 12-LED RGB Ring & ESP32-CAM Vision Module',
    desc: 'Front-mounted optical vision camera surrounded by 12 high-intensity WS2812B RGB hazard LEDs. Streams live optical video telemetry to supervisor console and illuminates dark manhole shafts.',
    voltage: '5.0V DC / 600mA',
    protocol: 'I2S / GPIO PWM / Wi-Fi Stream',
    rate: '30 FPS / 100ms LED Refresh',
    status: 'ONLINE ACTIVE'
  },
  mpu: {
    title: '1602 LCD / 0.96" OLED Diagnostic Display Module',
    desc: 'Top-mounted backlit diagnostic screen displaying real-time atmospheric gas concentration, worker heart rate, battery reserve, and system compliance status.',
    voltage: '3.3V DC / 80mA',
    protocol: 'I2C (0x3C)',
    rate: '10Hz Refresh Rate',
    status: 'BACKLIT ACTIVE'
  },
  mq4: {
    title: 'MQ4 Methane & MQ6 Toxic Gas Sampling Probes',
    desc: 'Dual chemical gas sampling probes calibrated for Methane (CH4), Hydrogen Sulfide (H2S), and LPG. Samples atmospheric safety baseline prior to human descent.',
    voltage: '5.0V DC / 150mA',
    protocol: 'Analog (ADC0 / ADC1)',
    rate: '100ms Continuous Sampling',
    status: '120 PPM (SAFE)'
  },
  gps: {
    title: 'NEO-6M Satellite GPS Positioning Module',
    desc: 'Precision GPS satellite receiver providing real-time latitude, longitude, and altitude tracking for open trench and outdoor construction crews.',
    voltage: '3.3V DC / 45mA',
    protocol: 'UART (9600 Baud)',
    rate: '1Hz Fix Rate',
    status: '9 SAT LOCKS'
  },
  comms: {
    title: 'ESP32 Dual-Core 240MHz & Li-ion Power Enclosure',
    desc: 'High-speed dual-core micro-controller managing real-time sensor loops, Wi-Fi/Bluetooth telemetry transmission, and emergency alarm dispatches.',
    voltage: '3.7V Li-ion (2600mAh)',
    protocol: 'Dual 240MHz Xtensa LX6',
    rate: '8 Hours Battery Endurance',
    status: '240MHz ACTIVE'
  },
  hall: {
    title: 'Hall Sensor Wear Compliance & Safety Chin Harness',
    desc: 'Magnetic proximity sensor paired with neodymium latches on chin harness. Continuously verifies helmet wear compliance on worker head.',
    voltage: '3.3V DC / 10mA',
    protocol: 'Digital GPIO Interrupt',
    rate: 'Instantaneous Trigger',
    status: 'LATCHED SECURE'
  }
};

export default function ThreeHelmet({ playHoverClick, playExplodeHiss }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  
  const [isExploded, setIsExploded] = useState(false);
  const [selectedComp, setSelectedComp] = useState(null);

  // Keep references to group and camera for animate & GSAP tweens
  const helmetGroupRef = useRef(null);
  const cameraRef = useRef(null);
  
  // Levitated groups for exploded animations
  const ledRingGroupRef = useRef(null);
  const lcdGroupRef = useRef(null);
  const mq4SensorRef = useRef(null);
  const mq6SensorRef = useRef(null);
  const sideBoxMeshRef = useRef(null);
  const strapMeshRef = useRef(null);

  const toggleExploded3D = (explode) => {
    setIsExploded(explode);
    if (!playHoverClick) return;

    if (explode) {
      if (playExplodeHiss) playExplodeHiss();
    } else {
      playHoverClick();
    }
  };

  useEffect(() => {
    const helmetCanvas = canvasRef.current;
    if (!helmetCanvas) return;

    const hScene = new THREE.Scene();
    const hCamera = new THREE.PerspectiveCamera(45, helmetCanvas.clientWidth / helmetCanvas.clientHeight, 0.1, 1000);
    cameraRef.current = hCamera;

    const hRenderer = new THREE.WebGLRenderer({ canvas: helmetCanvas, alpha: true, antialias: true });
    hRenderer.setSize(helmetCanvas.clientWidth, helmetCanvas.clientHeight);
    hRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Studio Lighting Setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    hScene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffb000, 1.8);
    dirLight1.position.set(6, 12, 8);
    hScene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x00f0ff, 1.2);
    dirLight2.position.set(-6, -4, -6);
    hScene.add(dirLight2);

    const frontSpotLight = new THREE.PointLight(0x67e8f9, 2.5, 12);
    frontSpotLight.position.set(0, 0, 4.5);
    hScene.add(frontSpotLight);

    const helmetGroup = new THREE.Group();
    helmetGroupRef.current = helmetGroup;

    // 1. Deep Metallic Maroon Glossy Helmet Shell
    const shellGeo = new THREE.SphereGeometry(3.5, 64, 48, 0, Math.PI * 2, 0, Math.PI * 0.52);
    const shellMat = new THREE.MeshStandardMaterial({
      color: 0x58141e,
      roughness: 0.18,
      metalness: 0.35,
      wireframe: false
    });
    const shellMesh = new THREE.Mesh(shellGeo, shellMat);
    shellMesh.name = 'shell';
    helmetGroup.add(shellMesh);

    // Subtle Wireframe Blueprint Overlay Mesh
    const wireGeo = new THREE.SphereGeometry(3.52, 32, 24, 0, Math.PI * 2, 0, Math.PI * 0.52);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0xffb000,
      wireframe: true,
      transparent: true,
      opacity: 0.15
    });
    const wireMesh = new THREE.Mesh(wireGeo, wireMat);
    helmetGroup.add(wireMesh);

    // 2. Front Visor Brim with Rubber Trim
    const visorGeo = new THREE.CylinderGeometry(3.6, 4.2, 0.35, 64, 1, true, -Math.PI * 0.36, Math.PI * 0.72);
    const visorMat = new THREE.MeshStandardMaterial({ color: 0x420f17, roughness: 0.2, metalness: 0.3, side: THREE.DoubleSide });
    const visorMesh = new THREE.Mesh(visorGeo, visorMat);
    visorMesh.position.set(0, -0.15, 0.1);
    helmetGroup.add(visorMesh);

    const brimTrimGeo = new THREE.TorusGeometry(3.9, 0.08, 16, 64);
    const brimTrimMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.8 });
    const brimTrimMesh = new THREE.Mesh(brimTrimGeo, brimTrimMat);
    brimTrimMesh.rotation.x = Math.PI / 2;
    brimTrimMesh.position.y = -0.18;
    helmetGroup.add(brimTrimMesh);

    // 3. Top Crest Ridge
    const ridgeGeo = new THREE.BoxGeometry(0.42, 3.8, 0.7);
    const ridgeMat = new THREE.MeshStandardMaterial({ color: 0x3d0b12, roughness: 0.25 });
    const ridgeMesh = new THREE.Mesh(ridgeGeo, ridgeMat);
    ridgeMesh.position.set(0, 1.75, 0);
    helmetGroup.add(ridgeMesh);

    // 4. FRONT CENTERPIECE: WS2812B 12-LED RGB RING + ESP32-CAM
    const ledRingGroup = new THREE.Group();
    ledRingGroup.name = 'ledRing';
    ledRingGroup.position.set(0, 0.2, 3.45);
    ledRingGroupRef.current = ledRingGroup;

    const boardRingGeo = new THREE.RingGeometry(0.9, 1.4, 32);
    const boardRingMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.5, side: THREE.DoubleSide });
    const boardRingMesh = new THREE.Mesh(boardRingGeo, boardRingMat);
    ledRingGroup.add(boardRingMesh);

    const ledCount = 12;
    const ledRadius = 1.15;
    for (let i = 0; i < ledCount; i++) {
      const angle = (i / ledCount) * Math.PI * 2;
      const lx = Math.cos(angle) * ledRadius;
      const ly = Math.sin(angle) * ledRadius;

      const ledGeo = new THREE.SphereGeometry(0.12, 16, 16);
      const ledMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0x67e8f9,
        emissiveIntensity: 3.5,
        roughness: 0.1
      });
      const ledMesh = new THREE.Mesh(ledGeo, ledMat);
      ledMesh.position.set(lx, ly, 0.08);
      ledRingGroup.add(ledMesh);
    }

    const camLensGeo = new THREE.CylinderGeometry(0.42, 0.42, 0.35, 32);
    const camLensMat = new THREE.MeshStandardMaterial({ color: 0x0a0a0a, metalness: 0.9, roughness: 0.1 });
    const camLensMesh = new THREE.Mesh(camLensGeo, camLensMat);
    camLensMesh.rotation.x = Math.PI / 2;
    camLensMesh.position.z = 0.15;
    ledRingGroup.add(camLensMesh);

    const pupilGeo = new THREE.SphereGeometry(0.18, 16, 16);
    const pupilMat = new THREE.MeshStandardMaterial({ color: 0x00f0ff, emissive: 0x00f0ff, emissiveIntensity: 1.5 });
    const pupilMesh = new THREE.Mesh(pupilGeo, pupilMat);
    pupilMesh.position.z = 0.32;
    ledRingGroup.add(pupilMesh);

    helmetGroup.add(ledRingGroup);

    // 5. TOP MOUNTED LCD DISPLAY
    const lcdGroup = new THREE.Group();
    lcdGroup.name = 'lcd';
    lcdGroup.position.set(0, 2.2, 2.7);
    lcdGroup.rotation.x = -Math.PI * 0.15;
    lcdGroupRef.current = lcdGroup;

    const lcdCaseGeo = new THREE.BoxGeometry(1.6, 0.75, 0.25);
    const lcdCaseMat = new THREE.MeshStandardMaterial({ color: 0x121724, roughness: 0.4, metalness: 0.6 });
    const lcdCaseMesh = new THREE.Mesh(lcdCaseGeo, lcdCaseMat);
    lcdGroup.add(lcdCaseMesh);

    const lcdScreenGeo = new THREE.PlaneGeometry(1.35, 0.52);
    const lcdScreenMat = new THREE.MeshStandardMaterial({
      color: 0x00f0ff,
      emissive: 0x00f0ff,
      emissiveIntensity: 2.0,
      roughness: 0.2
    });
    const lcdScreenMesh = new THREE.Mesh(lcdScreenGeo, lcdScreenMat);
    lcdScreenMesh.position.z = 0.14;
    lcdGroup.add(lcdScreenMesh);

    helmetGroup.add(lcdGroup);

    // 6. MQ4 & MQ6 GAS SENSORS
    const createGasSensor = (name, x, y, z) => {
      const sensorGroup = new THREE.Group();
      sensorGroup.name = name;
      sensorGroup.position.set(x, y, z);

      const baseGeo = new THREE.CylinderGeometry(0.35, 0.38, 0.4, 24);
      const baseMat = new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.8 });
      const baseMesh = new THREE.Mesh(baseGeo, baseMat);
      sensorGroup.add(baseMesh);

      const capGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.25, 24);
      const capMat = new THREE.MeshStandardMaterial({ color: 0xd1d5db, metalness: 0.95, roughness: 0.1, wireframe: true });
      const capMesh = new THREE.Mesh(capGeo, capMat);
      capMesh.position.y = 0.25;
      sensorGroup.add(capMesh);

      return sensorGroup;
    };

    const mq4Sensor = createGasSensor('mq4', -2.1, 1.6, 2.2);
    const mq6Sensor = createGasSensor('mq6', 2.1, 1.6, 2.2);
    mq4SensorRef.current = mq4Sensor;
    mq6SensorRef.current = mq6Sensor;
    helmetGroup.add(mq4Sensor);
    helmetGroup.add(mq6Sensor);

    // 7. CABLES
    const createCable = (points, colorHex) => {
      const curve = new THREE.CatmullRomCurve3(points);
      const tubeGeo = new THREE.TubeGeometry(curve, 32, 0.045, 8, false);
      const tubeMat = new THREE.MeshStandardMaterial({ color: colorHex, roughness: 0.5, metalness: 0.2 });
      return new THREE.Mesh(tubeGeo, tubeMat);
    };

    const cable1 = createCable([
      new THREE.Vector3(0, 2.1, 2.7),
      new THREE.Vector3(-1.2, 2.3, 2.3),
      new THREE.Vector3(-2.2, 1.4, 2.1),
      new THREE.Vector3(-2.8, 0.2, 1.5)
    ], 0xef4444);

    const cable2 = createCable([
      new THREE.Vector3(0, 0.2, 3.4),
      new THREE.Vector3(1.2, 0.8, 3.0),
      new THREE.Vector3(2.2, 1.4, 2.1),
      new THREE.Vector3(2.7, 0.2, 1.2)
    ], 0x00f0ff);

    const cable3 = createCable([
      new THREE.Vector3(0, 2.1, 2.7),
      new THREE.Vector3(1.2, 2.3, 2.3),
      new THREE.Vector3(2.1, 1.6, 2.1)
    ], 0xffb000);

    helmetGroup.add(cable1);
    helmetGroup.add(cable2);
    helmetGroup.add(cable3);

    // 8. SIDE MOUNTED ESP32 BOX
    const boxGeo = new THREE.BoxGeometry(0.8, 1.6, 0.6);
    const boxMat = new THREE.MeshStandardMaterial({ color: 0x182030, roughness: 0.4, metalness: 0.5 });
    const sideBoxMesh = new THREE.Mesh(boxGeo, boxMat);
    sideBoxMesh.name = 'sideBox';
    sideBoxMesh.position.set(-3.2, 0.3, 0.5);
    sideBoxMesh.rotation.y = Math.PI * 0.25;
    sideBoxMeshRef.current = sideBoxMesh;
    helmetGroup.add(sideBoxMesh);

    // 9. CHIN STRAP
    const strapCurve1 = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-3.2, -0.1, 0),
      new THREE.Vector3(-2.8, -1.8, 0.5),
      new THREE.Vector3(0, -3.2, 0.8),
      new THREE.Vector3(2.8, -1.8, 0.5),
      new THREE.Vector3(3.2, -0.1, 0)
    ]);
    const strapGeo = new THREE.TubeGeometry(strapCurve1, 40, 0.09, 8, false);
    const strapMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.9 });
    const strapMesh = new THREE.Mesh(strapGeo, strapMat);
    strapMesh.name = 'strap';
    strapMeshRef.current = strapMesh;
    helmetGroup.add(strapMesh);

    // 10. HOTSPOT BEACONS
    const nodeData = [
      { id: 'mq4', pos: [-2.1, 1.9, 2.4], color: 0xffb000 },
      { id: 'mpu', pos: [0, 2.5, 2.8], color: 0x00f0ff },
      { id: 'max', pos: [0, 0.2, 3.8], color: 0xef4444 },
      { id: 'hall', pos: [0, -3.2, 0.8], color: 0x10b981 },
      { id: 'gps', pos: [2.1, 1.9, 2.4], color: 0x00f0ff },
      { id: 'comms', pos: [-3.3, 0.3, 0.9], color: 0xffb000 }
    ];

    const beaconMeshes = [];
    nodeData.forEach(node => {
      const nodeGeo = new THREE.SphereGeometry(0.24, 16, 16);
      const nodeMat = new THREE.MeshBasicMaterial({ color: node.color });
      const nodeMesh = new THREE.Mesh(nodeGeo, nodeMat);
      nodeMesh.name = node.id;
      nodeMesh.position.set(...node.pos);
      helmetGroup.add(nodeMesh);
      beaconMeshes.push(nodeMesh);
    });

    // Shadow
    const shadowGeo = new THREE.RingGeometry(0.1, 4.5, 32);
    const shadowMat = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.6, side: THREE.DoubleSide });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = Math.PI / 2;
    shadowMesh.position.y = -3.4;
    hScene.add(shadowMesh);

    hScene.add(helmetGroup);
    hCamera.position.set(0, 1.5, 10.5);
    hCamera.lookAt(0, 0, 0);

    // Mouse rotation & raycasting logic
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    let mouseStartX = 0;
    let mouseStartY = 0;
    let isDragging = false;
    let previousMouseX = 0;
    let previousMouseY = 0;

    const handleMouseDown = (e) => {
      isDragging = false;
      mouseStartX = e.clientX;
      mouseStartY = e.clientY;
      previousMouseX = e.clientX;
      previousMouseY = e.clientY;
    };

    const handleMouseMove = (e) => {
      const dist = Math.hypot(e.clientX - mouseStartX, e.clientY - mouseStartY);
      if (dist > 5) {
        isDragging = true;
      }
      if (e.buttons === 1) {
        helmetGroup.rotation.y += (e.clientX - previousMouseX) * 0.01;
        helmetGroup.rotation.x += (e.clientY - previousMouseY) * 0.01;
      }
      previousMouseX = e.clientX;
      previousMouseY = e.clientY;
    };

    const handleClick = (e) => {
      if (isDragging) return;

      const rect = helmetCanvas.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, hCamera);
      const intersects = raycaster.intersectObjects(helmetGroup.children, true);

      if (intersects.length > 0) {
        const hitObj = intersects[0].object;
        let parentKey = 'max';

        if (hitObj.name === 'mq4' || hitObj.parent?.name === 'mq4') parentKey = 'mq4';
        else if (hitObj.name === 'mpu' || hitObj.parent?.name === 'lcd') parentKey = 'mpu';
        else if (hitObj.name === 'gps' || hitObj.parent?.name === 'mq6') parentKey = 'gps';
        else if (hitObj.name === 'comms' || hitObj.name === 'sideBox') parentKey = 'comms';
        else if (hitObj.name === 'hall' || hitObj.name === 'strap') parentKey = 'hall';

        toggleExploded3D(true);
        setSelectedComp(parentKey);
      }
    };

    helmetCanvas.addEventListener('mousedown', handleMouseDown);
    helmetCanvas.addEventListener('mousemove', handleMouseMove);
    helmetCanvas.addEventListener('click', handleClick);

    let rafId = null;
    function animateHelmet() {
      rafId = requestAnimationFrame(animateHelmet);
      
      // Auto-rotation when not dragging and not exploded
      if (!isDragging && !isExploded) {
        helmetGroup.rotation.y += 0.004;
      }

      // Pulse front point light intensity
      const time = Date.now() * 0.003;
      frontSpotLight.intensity = 2.2 + Math.sin(time) * 0.6;

      // Pulse beacon glow
      const pulseScale = 1.0 + Math.sin(Date.now() * 0.006) * 0.12;
      beaconMeshes.forEach(mesh => {
        mesh.scale.set(pulseScale, pulseScale, pulseScale);
      });

      hRenderer.render(hScene, hCamera);
    }
    animateHelmet();

    const handleResize = () => {
      if (!helmetCanvas) return;
      hCamera.aspect = helmetCanvas.clientWidth / helmetCanvas.clientHeight;
      hCamera.updateProjectionMatrix();
      hRenderer.setSize(helmetCanvas.clientWidth, helmetCanvas.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      helmetCanvas.removeEventListener('mousedown', handleMouseDown);
      helmetCanvas.removeEventListener('mousemove', handleMouseMove);
      helmetCanvas.removeEventListener('click', handleClick);
      window.removeEventListener('resize', handleResize);
      if (rafId) cancelAnimationFrame(rafId);
      
      // Disposing geometries and materials
      shellGeo.dispose();
      shellMat.dispose();
      wireGeo.dispose();
      wireMat.dispose();
      visorGeo.dispose();
      visorMat.dispose();
      brimTrimGeo.dispose();
      brimTrimMat.dispose();
      ridgeGeo.dispose();
      ridgeMat.dispose();
      boardRingGeo.dispose();
      boardRingMat.dispose();
      camLensGeo.dispose();
      camLensMat.dispose();
      pupilGeo.dispose();
      pupilMat.dispose();
      lcdCaseGeo.dispose();
      lcdCaseMat.dispose();
      lcdScreenGeo.dispose();
      lcdScreenMat.dispose();
      boxGeo.dispose();
      boxMat.dispose();
      strapGeo.dispose();
      strapMat.dispose();
      shadowGeo.dispose();
      shadowMat.dispose();
      hRenderer.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isExploded]);

  // GSAP animation triggers based on React state changes
  useEffect(() => {
    if (!ledRingGroupRef.current) return;

    const explode = isExploded;
    gsap.to(ledRingGroupRef.current.position, { z: explode ? 5.4 : 3.45, duration: 0.9, ease: 'back.out(1.4)' });
    gsap.to(lcdGroupRef.current.position, { y: explode ? 4.2 : 2.2, z: explode ? 3.6 : 2.7, duration: 0.9, ease: 'back.out(1.4)' });
    gsap.to(mq4SensorRef.current.position, { x: explode ? -4.2 : -2.1, z: explode ? 3.6 : 2.2, duration: 0.9, ease: 'back.out(1.4)' });
    gsap.to(mq6SensorRef.current.position, { x: explode ? 4.2 : 2.1, z: explode ? 3.6 : 2.2, duration: 0.9, ease: 'back.out(1.4)' });
    gsap.to(sideBoxMeshRef.current.position, { x: explode ? -5.4 : -3.2, duration: 0.9, ease: 'back.out(1.4)' });
    gsap.to(strapMeshRef.current.position, { y: explode ? -1.2 : 0, duration: 0.9, ease: 'back.out(1.4)' });

    if (cameraRef.current) {
      if (explode) {
        gsap.to(cameraRef.current.position, { z: 12.5, y: 2.2, duration: 1.0, ease: 'power2.out' });
      } else {
        gsap.to(cameraRef.current.position, { z: 10.5, y: 1.5, duration: 1.0, ease: 'power2.out' });
      }
    }
  }, [isExploded]);

  const handleExplodeClick = () => {
    const nextState = !isExploded;
    toggleExploded3D(nextState);
    if (nextState) {
      setSelectedComp('max');
    }
  };

  const handleResetClick = () => {
    toggleExploded3D(false);
    if (helmetGroupRef.current) {
      gsap.to(helmetGroupRef.current.rotation, { x: 0, y: 0, z: 0, duration: 0.8, ease: 'power2.out' });
    }
    setSelectedComp(null);
  };

  return (
    <div ref={containerRef} className="schematic-wrapper">
      <div className="schematic-3d-viewport relative">
        <canvas ref={canvasRef} id="three-helmet-canvas" />
        <div className="viewport-hud-hint">
          <i className="fa-solid fa-arrows-spin mr-2"></i>Drag to Rotate &bull; Click Nodes to Inspect
        </div>
        <div className="viewport-controls-overlay">
          <button 
            onClick={handleExplodeClick}
            id="btn-explode-3d" 
            className="btn-3d-action"
          >
            {isExploded ? (
              <>
                <i className="fa-solid fa-compress mr-1"></i> Assemble Helmet View
              </>
            ) : (
              <>
                <i className="fa-solid fa-layer-group mr-1"></i> Explode 3D Component Callouts
              </>
            )}
          </button>
          <button 
            onClick={handleResetClick}
            id="btn-reset-3d" 
            className="btn-3d-action secondary"
          >
            <i className="fa-solid fa-arrows-rotate mr-1"></i> Reset View
          </button>
        </div>

        {/* 3D Component Callouts Detail Popover Panel */}
        <div className={`component-popover-modal ${selectedComp ? 'active' : ''}`}>
          {selectedComp && (
            <div className="popover-content">
              <button 
                onClick={() => setSelectedComp(null)}
                className="popover-close-btn"
              >
                &times;
              </button>
              <div className="popover-badge">HELMET NODE ACTIVE</div>
              <h3 className="popover-title">{componentDetailsMap[selectedComp].title}</h3>
              <p className="popover-desc">{componentDetailsMap[selectedComp].desc}</p>
              <div className="popover-stats-grid">
                <div className="pstat-item">
                  <span className="pstat-label">OPERATING VOLTAGE</span>
                  <span className="pstat-val">{componentDetailsMap[selectedComp].voltage}</span>
                </div>
                <div className="pstat-item">
                  <span className="pstat-label">BUS PROTOCOL</span>
                  <span className="pstat-val">{componentDetailsMap[selectedComp].protocol}</span>
                </div>
                <div className="pstat-item">
                  <span className="pstat-label">REFRESH FREQ</span>
                  <span className="pstat-val">{componentDetailsMap[selectedComp].rate}</span>
                </div>
                <div className="pstat-item">
                  <span className="pstat-label">CALIBRATED STATUS</span>
                  <span className="pstat-val">{componentDetailsMap[selectedComp].status}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="schematic-info-panel">
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.2rem' }}>
          {[
            { id: 'mq4', label: 'MQ4 Gas' },
            { id: 'mpu', label: 'MPU6050' },
            { id: 'max', label: 'ESP32-CAM' },
            { id: 'hall', label: 'Hall Sensor' },
            { id: 'gps', label: 'GPS' },
            { id: 'comms', label: 'OLED & Audio' }
          ].map(sensor => (
            <button
              key={sensor.id}
              onClick={() => {
                if (playHoverClick) playHoverClick();
                setSelectedComp(sensor.id);
                toggleExploded3D(true);
              }}
              className={`hero-badge cursor-pointer ${selectedComp === sensor.id ? 'active' : ''}`}
              style={{ margin: 0 }}
            >
              {sensor.label}
            </button>
          ))}
        </div>

        <div className="schematic-chip-name" id="schematic-chip-name">
          {selectedComp ? componentDetailsMap[selectedComp].chip : 'SURAKSHA V1 CORE MODULE'}
        </div>
        <h2 className="schematic-sensor-title text-left" id="schematic-sensor-title">
          {selectedComp ? componentDetailsMap[selectedComp].title : 'Interactive 3D Helmet schematic'}
        </h2>
        <p className="schematic-desc text-left" id="schematic-desc">
          {selectedComp 
            ? componentDetailsMap[selectedComp].desc 
            : 'Click on any highlighted glowing hotspot node in the viewport or trigger the exploded view to inspect individual safety components, signal buses, and calibrated sensor telemetry.'}
        </p>
        <div className="schematic-specs-grid">
          <div className="spec-item">
            <span className="spec-key">SIGNAL BUS</span>
            <span className="spec-val" id="spec-bus">
              {selectedComp ? componentDetailsMap[selectedComp].protocol : 'XTENSA DUAL-CORE / I2C / SPI / UART'}
            </span>
          </div>
          <div className="spec-item">
            <span className="spec-key">RATED RANGE</span>
            <span className="spec-val" id="spec-range">
              {selectedComp ? componentDetailsMap[selectedComp].rate : '8 Hours Continuous Stream'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
