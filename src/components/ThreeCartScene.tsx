import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import {
  RotateCcw,
  Sun,
  Shield,
  Volume2,
  Maximize2,
  Layers,
  Sparkles,
  Play,
  Pause,
  Box,
  Sliders,
  Eye,
  Moon,
} from 'lucide-react';

interface ThreeCartSceneProps {
  initialExploded?: boolean;
  defaultTimeOfDay?: 'noon' | 'sunset' | 'night';
  activeStep?: number;
  onStepChange?: (step: number) => void;
}

export const ThreeCartScene: React.FC<ThreeCartSceneProps> = ({
  initialExploded = false,
  defaultTimeOfDay = 'night',
  activeStep,
  onStepChange,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isExploded, setIsExploded] = useState(initialExploded);
  const [explodeDistance, setExplodeDistance] = useState(initialExploded ? 65 : 0);
  const [autoRotate, setAutoRotate] = useState(true);
  const [wireframe, setWireframe] = useState(false);
  const [timeOfDay, setTimeOfDay] = useState<'noon' | 'sunset' | 'night'>(defaultTimeOfDay);
  const [cameraView, setCameraView] = useState<'isometric' | 'solar_roof' | 'prep_bay' | 'soundbox' | 'battery_unit'>('isometric');
  const [activePart, setActivePart] = useState<string | null>(null);

  // References to 3D groups for animation and explode transformations
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const cartGroupRef = useRef<THREE.Group | null>(null);
  const roofGroupRef = useRef<THREE.Group | null>(null);
  const bulbsGroupRef = useRef<THREE.Group | null>(null);
  const prepGroupRef = useRef<THREE.Group | null>(null);
  const chillerGroupRef = useRef<THREE.Group | null>(null);
  const batteryGroupRef = useRef<THREE.Group | null>(null);
  const wheelsGroupRef = useRef<THREE.Group | null>(null);
  const paGroupRef = useRef<THREE.Group | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);

  // Light and material refs for dynamic time-of-day solar transitions
  const ambientLightRef = useRef<THREE.AmbientLight | null>(null);
  const sunDirLightRef = useRef<THREE.DirectionalLight | null>(null);
  const fillLightRef = useRef<THREE.DirectionalLight | null>(null);
  const pointLightsRef = useRef<THREE.PointLight[]>([]);
  const bulbGlowMatRef = useRef<THREE.MeshStandardMaterial | null>(null);

  // Smooth camera position and lookAt glide targets
  const targetCameraPos = useRef(new THREE.Vector3(4.5, 3.2, 5.5));
  const targetLookAt = useRef(new THREE.Vector3(0, 0.6, 0));

  // Mouse interaction state
  const isMouseDown = useRef(false);
  const mousePos = useRef({ x: 0, y: 0 });
  const targetRotation = useRef({ x: 0.15, y: 0.6 });
  const currentRotation = useRef({ x: 0.15, y: 0.6 });

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 540;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(4.5, 3.2, 5.5);
    camera.lookAt(0, 0.6, 0);
    cameraRef.current = camera;

    // 3. Renderer with antialiasing & tone mapping
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    rendererRef.current = renderer;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 4. Lighting Setup
    const ambientLight = new THREE.AmbientLight(0xfff5e6, 0.9);
    ambientLightRef.current = ambientLight;
    scene.add(ambientLight);

    const sunDirLight = new THREE.DirectionalLight(0xfffaed, 2.2);
    sunDirLight.position.set(6, 9, 5);
    sunDirLight.castShadow = true;
    sunDirLight.shadow.mapSize.width = 1024;
    sunDirLight.shadow.mapSize.height = 1024;
    sunDirLight.shadow.bias = -0.0005;
    sunDirLightRef.current = sunDirLight;
    scene.add(sunDirLight);

    const fillLight = new THREE.DirectionalLight(0x8fcbff, 0.6);
    fillLight.position.set(-6, 4, -4);
    fillLightRef.current = fillLight;
    scene.add(fillLight);

    // 5. Materials
    const yellowMat = new THREE.MeshStandardMaterial({
      color: 0xffb800,
      roughness: 0.35,
      metalness: 0.2,
    });

    const redMat = new THREE.MeshStandardMaterial({
      color: 0xe63946,
      roughness: 0.4,
      metalness: 0.1,
    });

    const solarCellMat = new THREE.MeshStandardMaterial({
      color: 0x112238,
      roughness: 0.15,
      metalness: 0.75,
    });

    const stainlessMat = new THREE.MeshStandardMaterial({
      color: 0xd8dde3,
      roughness: 0.2,
      metalness: 0.85,
    });

    const whiteMat = new THREE.MeshStandardMaterial({
      color: 0xfdfdfd,
      roughness: 0.4,
      metalness: 0.05,
    });

    const darkMat = new THREE.MeshStandardMaterial({
      color: 0x1e1e24,
      roughness: 0.7,
      metalness: 0.3,
    });

    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.45,
      roughness: 0.1,
      metalness: 0.1,
      transmission: 0.8,
      thickness: 0.5,
    });

    const bulbGlowMat = new THREE.MeshStandardMaterial({
      color: 0xffe58f,
      emissive: 0xffb800,
      emissiveIntensity: 1.8,
      roughness: 0.2,
    });
    bulbGlowMatRef.current = bulbGlowMat;

    // 6. Build Accurate Cartwala Model Structure (Matching Image 3.png)
    const cartMasterGroup = new THREE.Group();
    cartGroupRef.current = cartMasterGroup;
    scene.add(cartMasterGroup);

    // ----------------------------------------------------
    // Sub-Group 1: ROOF & SOLAR CANOPY
    // ----------------------------------------------------
    const roofGroup = new THREE.Group();
    roofGroupRef.current = roofGroup;
    cartMasterGroup.add(roofGroup);

    // Solar Canopy Box (Angled forward slightly)
    const canopyBoxGeo = new THREE.BoxGeometry(2.4, 0.12, 1.6);
    const canopyBox = new THREE.Mesh(canopyBoxGeo, yellowMat);
    canopyBox.position.set(0, 2.3, 0);
    canopyBox.rotation.x = -0.05; // slight forward slant like Image 3
    canopyBox.castShadow = true;
    roofGroup.add(canopyBox);

    // Dark Blue Solar Panel Surface with cells
    const panelGeo = new THREE.PlaneGeometry(2.2, 1.4);
    const solarPanel = new THREE.Mesh(panelGeo, solarCellMat);
    solarPanel.position.set(0, 2.37, 0);
    solarPanel.rotation.x = -Math.PI / 2 - 0.05;
    roofGroup.add(solarPanel);

    // Solar Panel Grid Lines
    const gridHelper = new THREE.GridHelper(2.1, 8, 0x8fcbff, 0x4a7a96);
    gridHelper.position.set(0, 2.375, 0);
    gridHelper.rotation.x = -0.05;
    roofGroup.add(gridHelper);

    // Red Decorative Banner Trim on the canopy
    const redTrimGeo = new THREE.BoxGeometry(2.42, 0.06, 0.04);
    const redTrimFront = new THREE.Mesh(redTrimGeo, redMat);
    redTrimFront.position.set(0, 2.28, 0.8);
    roofGroup.add(redTrimFront);

    // 4 Corner Yellow Support Pillars
    const pillarGeo = new THREE.CylinderGeometry(0.035, 0.035, 1.2, 12);
    const p1 = new THREE.Mesh(pillarGeo, yellowMat);
    p1.position.set(-1.05, 1.7, -0.65);
    p1.castShadow = true;
    roofGroup.add(p1);

    const p2 = new THREE.Mesh(pillarGeo, yellowMat);
    p2.position.set(1.05, 1.7, -0.65);
    p2.castShadow = true;
    roofGroup.add(p2);

    const p3 = new THREE.Mesh(pillarGeo, yellowMat);
    p3.position.set(-1.05, 1.7, 0.65);
    p3.castShadow = true;
    roofGroup.add(p3);

    const p4 = new THREE.Mesh(pillarGeo, yellowMat);
    p4.position.set(1.05, 1.7, 0.65);
    p4.castShadow = true;
    roofGroup.add(p4);

    // ----------------------------------------------------
    // Sub-Group 2: HANGING EDISON BULBS (3000K WARM LEDS)
    // ----------------------------------------------------
    const bulbsGroup = new THREE.Group();
    bulbsGroupRef.current = bulbsGroup;
    cartMasterGroup.add(bulbsGroup);

    const bulbPositions = [-0.75, -0.25, 0.25, 0.75];
    pointLightsRef.current = [];
    bulbPositions.forEach((posX) => {
      const bulbCordGeo = new THREE.CylinderGeometry(0.005, 0.005, 0.18);
      const cord = new THREE.Mesh(bulbCordGeo, darkMat);
      cord.position.set(posX, 2.15, 0.55);
      bulbsGroup.add(cord);

      const bulbGeo = new THREE.SphereGeometry(0.05, 16, 16);
      const bulb = new THREE.Mesh(bulbGeo, bulbGlowMat);
      bulb.position.set(posX, 2.05, 0.55);
      bulbsGroup.add(bulb);

      const pointLight = new THREE.PointLight(0xffba20, 0.85, 3);
      pointLight.position.set(posX, 2.02, 0.55);
      bulbsGroup.add(pointLight);
      pointLightsRef.current.push(pointLight);
    });

    // ----------------------------------------------------
    // Sub-Group 3: CHALKBOARD MENU & VINES (Matching Image 3)
    // ----------------------------------------------------
    const menuBoardGeo = new THREE.BoxGeometry(0.04, 0.75, 0.5);
    const menuBoard = new THREE.Mesh(menuBoardGeo, darkMat);
    menuBoard.position.set(-1.1, 1.6, 0.1);
    menuBoard.castShadow = true;
    roofGroup.add(menuBoard);

    // Green Money Plant on Corner Pillar
    const planterGeo = new THREE.BoxGeometry(0.12, 0.12, 0.12);
    const planter = new THREE.Mesh(planterGeo, yellowMat);
    planter.position.set(-1.05, 2.0, -0.65);
    roofGroup.add(planter);

    const vineMat = new THREE.MeshStandardMaterial({ color: 0x2e7d32, roughness: 0.6 });
    for (let v = 0; v < 6; v++) {
      const leafGeo = new THREE.SphereGeometry(0.035, 8, 8);
      const leaf = new THREE.Mesh(leafGeo, vineMat);
      leaf.position.set(-1.05 + (Math.random() - 0.5) * 0.1, 1.95 - v * 0.08, -0.65 + (Math.random() - 0.5) * 0.1);
      roofGroup.add(leaf);
    }

    // ----------------------------------------------------
    // Sub-Group 4: STAINLESS STEEL PREP TABLE & GN TRAYS
    // ----------------------------------------------------
    const prepGroup = new THREE.Group();
    prepGroupRef.current = prepGroup;
    cartMasterGroup.add(prepGroup);

    // Shiny 304 Stainless Steel Counter
    const counterGeo = new THREE.BoxGeometry(2.3, 0.08, 1.45);
    const counter = new THREE.Mesh(counterGeo, stainlessMat);
    counter.position.set(0, 1.1, 0);
    counter.castShadow = true;
    counter.receiveShadow = true;
    prepGroup.add(counter);

    // Transparent Glass Sneeze Guard Display
    const glassFrontGeo = new THREE.BoxGeometry(1.6, 0.35, 0.03);
    const glassFront = new THREE.Mesh(glassFrontGeo, glassMat);
    glassFront.position.set(0, 1.3, 0.5);
    prepGroup.add(glassFront);

    const glassTopGeo = new THREE.BoxGeometry(1.6, 0.03, 0.45);
    const glassTop = new THREE.Mesh(glassTopGeo, glassMat);
    glassTop.position.set(0, 1.48, 0.3);
    prepGroup.add(glassTop);

    // 4 Modular Gastronorm Food Trays with Colorful Ingredients
    const trayColors = [0xd97706, 0xdc2626, 0x16a34a, 0xf59e0b]; // Sev, Tomato, Chutney, Samosa
    const trayNames = ['Bhel / Sev', 'Diced Tomatoes', 'Mint Chutney', 'Roasted Masala'];
    [-0.55, -0.18, 0.18, 0.55].forEach((tx, idx) => {
      // Metal insert rim
      const trayRimGeo = new THREE.BoxGeometry(0.32, 0.12, 0.36);
      const trayRim = new THREE.Mesh(trayRimGeo, stainlessMat);
      trayRim.position.set(tx, 1.18, 0.3);
      prepGroup.add(trayRim);

      // Colorful food contents
      const foodGeo = new THREE.BoxGeometry(0.28, 0.08, 0.32);
      const foodMat = new THREE.MeshStandardMaterial({ color: trayColors[idx], roughness: 0.6 });
      const food = new THREE.Mesh(foodGeo, foodMat);
      food.position.set(tx, 1.2, 0.3);
      prepGroup.add(food);
    });

    // Stainless Beverage Thermos / Chai Dispenser
    const thermosGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.38, 16);
    const thermos = new THREE.Mesh(thermosGeo, stainlessMat);
    thermos.position.set(-0.85, 1.32, 0.2);
    prepGroup.add(thermos);

    // Glass ingredient canisters
    const jarGeo = new THREE.CylinderGeometry(0.07, 0.07, 0.2, 12);
    const jar1 = new THREE.Mesh(jarGeo, glassMat);
    jar1.position.set(0.9, 1.22, 0.35);
    prepGroup.add(jar1);

    const jar2 = new THREE.Mesh(jarGeo, glassMat);
    jar2.position.set(0.9, 1.22, 0.12);
    prepGroup.add(jar2);

    // ----------------------------------------------------
    // Sub-Group 5: SMART SOUNDBOX & UPI QR MAST
    // ----------------------------------------------------
    const paGroup = new THREE.Group();
    paGroupRef.current = paGroup;
    cartMasterGroup.add(paGroup);

    // Cylindrical 10W PA Soundbox
    const speakerGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.2, 16);
    speakerGeo.rotateZ(Math.PI / 2);
    const speaker = new THREE.Mesh(speakerGeo, darkMat);
    speaker.position.set(0.15, 1.22, -0.15);
    speaker.castShadow = true;
    paGroup.add(speaker);

    // UPI Illuminated QR Stand
    const qrMastGeo = new THREE.BoxGeometry(0.02, 0.22, 0.02);
    const qrMast = new THREE.Mesh(qrMastGeo, stainlessMat);
    qrMast.position.set(-0.7, 1.22, 0.55);
    paGroup.add(qrMast);

    const qrPlateGeo = new THREE.BoxGeometry(0.14, 0.14, 0.015);
    const qrMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, emissive: 0x002244, roughness: 0.3 });
    const qrPlate = new THREE.Mesh(qrPlateGeo, qrMat);
    qrPlate.position.set(-0.7, 1.32, 0.55);
    qrPlate.rotation.x = -0.2;
    paGroup.add(qrPlate);

    // ----------------------------------------------------
    // Sub-Group 6: MAIN CART TRAILER BODY & GRAPHICS
    // ----------------------------------------------------
    const bodyGroup = new THREE.Group();
    cartMasterGroup.add(bodyGroup);

    // White Main Cart Box Body
    const bodyGeo = new THREE.BoxGeometry(2.1, 0.72, 1.35);
    const cartBody = new THREE.Mesh(bodyGeo, whiteMat);
    cartBody.position.set(0, 0.7, 0);
    cartBody.castShadow = true;
    cartBody.receiveShadow = true;
    bodyGroup.add(cartBody);

    // Joyful Festive Yellow & Red Swoosh Graphic Panels (Matching Image 3.png)
    const redSwooshGeo = new THREE.BoxGeometry(2.11, 0.24, 1.36);
    const redSwoosh = new THREE.Mesh(redSwooshGeo, redMat);
    redSwoosh.position.set(0, 0.48, 0);
    bodyGroup.add(redSwoosh);

    const yellowSwooshGeo = new THREE.BoxGeometry(2.115, 0.14, 1.365);
    const yellowSwoosh = new THREE.Mesh(yellowSwooshGeo, yellowMat);
    yellowSwoosh.position.set(0, 0.65, 0);
    bodyGroup.add(yellowSwoosh);

    // Ergonomic Push Handlebar (Waist Level)
    const handleBarStemGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.6, 8);
    const h1 = new THREE.Mesh(handleBarStemGeo, yellowMat);
    h1.position.set(1.15, 0.9, -0.4);
    h1.rotation.z = -0.6;
    bodyGroup.add(h1);

    const h2 = new THREE.Mesh(handleBarStemGeo, yellowMat);
    h2.position.set(1.15, 0.9, 0.4);
    h2.rotation.z = -0.6;
    bodyGroup.add(h2);

    const handleGripGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.9, 8);
    handleGripGeo.rotateX(Math.PI / 2);
    const handleBar = new THREE.Mesh(handleGripGeo, darkMat);
    handleBar.position.set(1.35, 1.05, 0);
    bodyGroup.add(handleBar);

    // ----------------------------------------------------
    // Sub-Group 7: ACTIVE COLD BAY CHILLER BOX (Slides OUT in Explode)
    // ----------------------------------------------------
    const chillerGroup = new THREE.Group();
    chillerGroupRef.current = chillerGroup;
    cartMasterGroup.add(chillerGroup);

    const chillerGeo = new THREE.BoxGeometry(0.3, 0.45, 0.45);
    const chiller = new THREE.Mesh(chillerGeo, whiteMat);
    chiller.position.set(0.7, 0.65, 0.68);
    chiller.castShadow = true;
    chillerGroup.add(chiller);

    const chillerLatchGeo = new THREE.BoxGeometry(0.08, 0.08, 0.04);
    const latch = new THREE.Mesh(chillerLatchGeo, yellowMat);
    latch.position.set(0.7, 0.75, 0.91);
    chillerGroup.add(latch);

    // ----------------------------------------------------
    // Sub-Group 8: 1.2 kWh LiFePO4 BATTERY & SAFE (Drops in Explode)
    // ----------------------------------------------------
    const batteryGroup = new THREE.Group();
    batteryGroupRef.current = batteryGroup;
    cartMasterGroup.add(batteryGroup);

    const battGeo = new THREE.BoxGeometry(1.2, 0.22, 0.8);
    const battMat = new THREE.MeshStandardMaterial({ color: 0x0f766e, roughness: 0.3, metalness: 0.6 });
    const batteryPack = new THREE.Mesh(battGeo, battMat);
    batteryPack.position.set(0, 0.3, 0);
    batteryPack.castShadow = true;
    batteryGroup.add(batteryPack);

    // ----------------------------------------------------
    // Sub-Group 9: WHEELS & CHASSIS (Detaches Outward in Explode)
    // ----------------------------------------------------
    const wheelsGroup = new THREE.Group();
    wheelsGroupRef.current = wheelsGroup;
    cartMasterGroup.add(wheelsGroup);

    // Left Main Large Drive Wheel with Yellow Fender
    const fenderGeo = new THREE.CylinderGeometry(0.48, 0.48, 0.22, 16, 1, false, 0, Math.PI);
    fenderGeo.rotateZ(Math.PI / 2);
    const fender = new THREE.Mesh(fenderGeo, yellowMat);
    fender.position.set(-0.65, 0.45, 0.72);
    wheelsGroup.add(fender);

    // Wheel Tire (Black Rubber)
    const tireGeo = new THREE.TorusGeometry(0.4, 0.09, 16, 32);
    const tire = new THREE.Mesh(tireGeo, darkMat);
    tire.position.set(-0.65, 0.4, 0.72);
    tire.castShadow = true;
    wheelsGroup.add(tire);

    // Wheel Spokes & Hub
    const hubGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.1, 16);
    hubGeo.rotateX(Math.PI / 2);
    const hub = new THREE.Mesh(hubGeo, stainlessMat);
    hub.position.set(-0.65, 0.4, 0.72);
    wheelsGroup.add(hub);

    for (let s = 0; s < 8; s++) {
      const spokeGeo = new THREE.CylinderGeometry(0.008, 0.008, 0.75);
      spokeGeo.rotateZ((s * Math.PI) / 8);
      const spoke = new THREE.Mesh(spokeGeo, stainlessMat);
      spoke.position.set(-0.65, 0.4, 0.72);
      wheelsGroup.add(spoke);
    }

    // Rear Small Wheel on other side
    const rearTireGeo = new THREE.TorusGeometry(0.4, 0.09, 16, 32);
    const rearTire = new THREE.Mesh(rearTireGeo, darkMat);
    rearTire.position.set(-0.65, 0.4, -0.72);
    rearTire.castShadow = true;
    wheelsGroup.add(rearTire);

    // Front Swiveling Caster Wheel
    const casterGeo = new THREE.CylinderGeometry(0.14, 0.14, 0.1, 16);
    casterGeo.rotateX(Math.PI / 2);
    const caster = new THREE.Mesh(casterGeo, darkMat);
    caster.position.set(0.8, 0.16, 0);
    caster.castShadow = true;
    wheelsGroup.add(caster);

    const casterForkGeo = new THREE.BoxGeometry(0.08, 0.22, 0.15);
    const casterFork = new THREE.Mesh(casterForkGeo, yellowMat);
    casterFork.position.set(0.8, 0.26, 0);
    wheelsGroup.add(casterFork);

    // Ground Shadow Plane
    const groundGeo = new THREE.PlaneGeometry(12, 12);
    const groundMat = new THREE.ShadowMaterial({ opacity: 0.18 });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = 0.01;
    ground.receiveShadow = true;
    scene.add(ground);

    // ----------------------------------------------------
    // 7. Sun Animation & Particle Field (Animation #62, #76)
    // ----------------------------------------------------
    const particleCount = 180;
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 4.5;
      particlePositions[i + 1] = 2.2 + Math.random() * 2.8;
      particlePositions[i + 2] = (Math.random() - 0.5) * 3.5;
    }

    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xffb800,
      size: 0.055,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    particlesRef.current = particles;
    scene.add(particles);

    // 8. Event Listeners for Smooth 3D Drag & Orbit
    const onMouseDown = (e: MouseEvent) => {
      isMouseDown.current = true;
      mousePos.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isMouseDown.current) return;
      const dx = e.clientX - mousePos.current.x;
      const dy = e.clientY - mousePos.current.y;
      targetRotation.current.y += dx * 0.009;
      targetRotation.current.x = Math.max(-0.4, Math.min(0.8, targetRotation.current.x + dy * 0.007));
      mousePos.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isMouseDown.current = false;
    };

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isMouseDown.current = true;
        mousePos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!isMouseDown.current || e.touches.length !== 1) return;
      const dx = e.touches[0].clientX - mousePos.current.x;
      const dy = e.touches[0].clientY - mousePos.current.y;
      targetRotation.current.y += dx * 0.009;
      targetRotation.current.x = Math.max(-0.4, Math.min(0.8, targetRotation.current.x + dy * 0.007));
      mousePos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    const onTouchEnd = () => {
      isMouseDown.current = false;
    };

    const domElement = renderer.domElement;
    domElement.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    domElement.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);

    // 9. Main Animation Loop
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // Smooth camera / cart rotation interpolation
      currentRotation.current.y += (targetRotation.current.y - currentRotation.current.y) * 0.1;
      currentRotation.current.x += (targetRotation.current.x - currentRotation.current.x) * 0.1;

      if (autoRotate && !isMouseDown.current) {
        targetRotation.current.y += delta * 0.45;
      }

      if (cartGroupRef.current) {
        cartGroupRef.current.rotation.y = currentRotation.current.y;
        cartGroupRef.current.rotation.x = currentRotation.current.x;
      }

      // Animate solar particles descending toward the rooftop panel
      if (particlesRef.current) {
        const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
        for (let i = 1; i < positions.length; i += 3) {
          positions[i] -= delta * 0.8;
          if (positions[i] < 2.3) {
            positions[i] = 4.5 + Math.random() * 0.5;
          }
        }
        particlesRef.current.geometry.attributes.position.needsUpdate = true;
      }

      // Smooth camera position and lookAt interpolation for angle presets
      if (cameraRef.current) {
        cameraRef.current.position.lerp(targetCameraPos.current, 0.08);
        cameraRef.current.lookAt(targetLookAt.current);
      }

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container || !rendererRef.current || !cameraRef.current) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      cameraRef.current.aspect = newWidth / newHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      domElement.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      domElement.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      renderer.dispose();
    };
  }, [autoRotate]);

  // Handle dynamic solar lighting and night transitions
  useEffect(() => {
    if (!sceneRef.current) return;
    if (timeOfDay === 'noon') {
      ambientLightRef.current?.color.setHex(0xfff5e6);
      if (ambientLightRef.current) ambientLightRef.current.intensity = 0.95;
      if (sunDirLightRef.current) {
        sunDirLightRef.current.color.setHex(0xfffaed);
        sunDirLightRef.current.intensity = 2.2;
        sunDirLightRef.current.position.set(6, 9, 5);
      }
      fillLightRef.current?.color.setHex(0x8fcbff);
      if (fillLightRef.current) fillLightRef.current.intensity = 0.6;
      pointLightsRef.current.forEach((pl) => (pl.intensity = 0.5));
      if (bulbGlowMatRef.current) bulbGlowMatRef.current.emissiveIntensity = 1.2;
      if (particlesRef.current) particlesRef.current.visible = true;
    } else if (timeOfDay === 'sunset') {
      ambientLightRef.current?.color.setHex(0xffb57d);
      if (ambientLightRef.current) ambientLightRef.current.intensity = 0.7;
      if (sunDirLightRef.current) {
        sunDirLightRef.current.color.setHex(0xff6622);
        sunDirLightRef.current.intensity = 2.6;
        sunDirLightRef.current.position.set(8, 3.5, 6);
      }
      fillLightRef.current?.color.setHex(0xaa4422);
      if (fillLightRef.current) fillLightRef.current.intensity = 0.4;
      pointLightsRef.current.forEach((pl) => (pl.intensity = 1.3));
      if (bulbGlowMatRef.current) bulbGlowMatRef.current.emissiveIntensity = 2.4;
      if (particlesRef.current) particlesRef.current.visible = true;
    } else if (timeOfDay === 'night') {
      ambientLightRef.current?.color.setHex(0x0f1c3f);
      if (ambientLightRef.current) ambientLightRef.current.intensity = 0.25;
      if (sunDirLightRef.current) {
        sunDirLightRef.current.color.setHex(0x1e293b);
        sunDirLightRef.current.intensity = 0.35;
        sunDirLightRef.current.position.set(4, 6, 4);
      }
      fillLightRef.current?.color.setHex(0x090e1a);
      if (fillLightRef.current) fillLightRef.current.intensity = 0.15;
      pointLightsRef.current.forEach((pl) => (pl.intensity = 2.8));
      if (bulbGlowMatRef.current) bulbGlowMatRef.current.emissiveIntensity = 3.6;
      if (particlesRef.current) particlesRef.current.visible = false;
    }
  }, [timeOfDay]);

  const handleSelectView = (view: 'isometric' | 'solar_roof' | 'prep_bay' | 'soundbox' | 'battery_unit') => {
    setCameraView(view);
    setAutoRotate(false);
    if (view === 'isometric') {
      targetCameraPos.current.set(4.5, 3.2, 5.5);
      targetLookAt.current.set(0, 0.6, 0);
      targetRotation.current = { x: 0.15, y: 0.6 };
    } else if (view === 'solar_roof') {
      targetCameraPos.current.set(0.1, 4.4, 3.0);
      targetLookAt.current.set(0, 2.2, 0);
      targetRotation.current = { x: 0.5, y: 0.05 };
    } else if (view === 'prep_bay') {
      targetCameraPos.current.set(0.0, 2.0, 2.8);
      targetLookAt.current.set(0, 1.15, 0.25);
      targetRotation.current = { x: 0.22, y: 0.0 };
    } else if (view === 'soundbox') {
      targetCameraPos.current.set(-1.2, 2.2, 1.8);
      targetLookAt.current.set(-0.3, 1.3, 0.3);
      targetRotation.current = { x: 0.25, y: -0.4 };
    } else if (view === 'battery_unit') {
      targetCameraPos.current.set(2.8, 0.9, 2.5);
      targetLookAt.current.set(0, 0.35, 0);
      targetRotation.current = { x: -0.05, y: 1.1 };
    }
  };

  // Sync external activeStep from ScrollTrigger or user interaction
  useEffect(() => {
    if (activeStep === undefined) return;
    if (activeStep === 0) {
      handleSelectView('isometric');
      setExplodeDistance(0);
      setIsExploded(false);
    } else if (activeStep === 1) {
      handleSelectView('solar_roof');
      setExplodeDistance(0);
      setIsExploded(false);
    } else if (activeStep === 2) {
      handleSelectView('prep_bay');
      setExplodeDistance(0);
      setIsExploded(false);
    } else if (activeStep === 3) {
      handleSelectView('soundbox');
      setExplodeDistance(0);
      setIsExploded(false);
    } else if (activeStep === 4) {
      handleSelectView('battery_unit');
      setExplodeDistance(65);
      setIsExploded(true);
    }
  }, [activeStep]);

  // Handle Explode Animation Transformations across 3D coordinates
  useEffect(() => {
    const factor = explodeDistance / 100;

    if (roofGroupRef.current) {
      roofGroupRef.current.position.y = factor * 1.4;
    }
    if (bulbsGroupRef.current) {
      bulbsGroupRef.current.position.y = factor * 0.8;
    }
    if (prepGroupRef.current) {
      prepGroupRef.current.position.z = factor * 0.85;
      prepGroupRef.current.position.y = factor * 0.2;
    }
    if (chillerGroupRef.current) {
      chillerGroupRef.current.position.x = factor * 0.9;
      chillerGroupRef.current.position.z = factor * 0.4;
    }
    if (paGroupRef.current) {
      paGroupRef.current.position.x = -factor * 0.7;
      paGroupRef.current.position.y = factor * 0.5;
    }
    if (batteryGroupRef.current) {
      batteryGroupRef.current.position.y = -factor * 0.7;
    }
    if (wheelsGroupRef.current) {
      wheelsGroupRef.current.position.y = -factor * 0.25;
    }
  }, [explodeDistance]);

  const toggleExplode = () => {
    const next = !isExploded;
    setIsExploded(next);
    setExplodeDistance(next ? 75 : 0);
  };

  const resetCamera = () => {
    targetRotation.current = { x: 0.15, y: 0.6 };
    setIsExploded(false);
    setExplodeDistance(0);
  };

  return (
    <div className="relative w-full rounded-3xl overflow-hidden bg-gradient-to-b from-[#FFFDF9] via-[#FAF7F2] to-[#F5F2FB] border border-[#F2EAE0]">
      {/* Top 3D Control Ribbon */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-2.5 pointer-events-auto">
        <div className="flex items-center space-x-2 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-[#F2EAE0] shadow-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-bold text-[#1E1E24]">
            Three.js WebGL Engine • Model S-24 Pro
          </span>
        </div>

        {/* Time of Day Sun Cycle Switcher (Sun Animation #62) */}
        <div className="flex items-center space-x-1 bg-white/90 backdrop-blur-md p-1 rounded-full border border-[#F2EAE0] shadow-sm text-xs font-bold">
          <button
            onClick={() => setTimeOfDay('noon')}
            className={`px-2.5 py-1 rounded-full transition-all flex items-center space-x-1 ${
              timeOfDay === 'noon'
                ? 'bg-[#FFB800] text-[#1E1E24] shadow-xs'
                : 'text-[#514532] hover:bg-neutral-100'
            }`}
            title="12:00 PM Peak Sun (400W Maximum Solar Yield)"
          >
            <Sun className="w-3.5 h-3.5 text-amber-800" />
            <span className="hidden sm:inline">Noon (400W)</span>
          </button>

          <button
            onClick={() => setTimeOfDay('sunset')}
            className={`px-2.5 py-1 rounded-full transition-all flex items-center space-x-1 ${
              timeOfDay === 'sunset'
                ? 'bg-[#E63946] text-white shadow-xs'
                : 'text-[#514532] hover:bg-neutral-100'
            }`}
            title="5:30 PM Golden Sunset (220W Dusk Float)"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sunset (220W)</span>
          </button>

          <button
            onClick={() => setTimeOfDay('night')}
            className={`px-2.5 py-1 rounded-full transition-all flex items-center space-x-1 ${
              timeOfDay === 'night'
                ? 'bg-[#1E1E24] text-[#FFB800] shadow-xs'
                : 'text-[#514532] hover:bg-neutral-100'
            }`}
            title="8:30 PM Night Bazaar (Edison Bulbs Illuminated)"
          >
            <Moon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Night Bazaar</span>
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-1.5 bg-white/90 backdrop-blur-md p-1 rounded-full border border-[#F2EAE0] shadow-sm">
          {/* Explode View Toggle */}
          <button
            onClick={toggleExplode}
            className={`px-3 py-1.5 rounded-full text-xs font-black transition-all flex items-center space-x-1.5 shadow-sm ${
              isExploded
                ? 'bg-[#E63946] text-white'
                : 'bg-[#FAF7F2] text-[#E63946] border border-[#E63946]/40 hover:bg-red-50'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{isExploded ? 'Collapse' : '💥 Explode View'}</span>
          </button>

          {/* Auto Rotation */}
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`p-1.5 rounded-full border transition-colors ${
              autoRotate ? 'bg-[#FFB800] text-[#1E1E24] border-[#FFB800]' : 'bg-[#FAF7F2] text-[#514532]'
            }`}
            title={autoRotate ? 'Pause Auto-Rotate' : 'Start Auto-Rotate'}
          >
            {autoRotate ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>

          {/* Reset Camera */}
          <button
            onClick={resetCamera}
            className="p-1.5 rounded-full bg-[#FAF7F2] hover:bg-neutral-200 text-[#1E1E24] border border-[#F2EAE0]"
            title="Reset View"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Camera View Angle Presets Ribbon */}
      <div className="absolute top-16 left-4 right-4 z-20 flex flex-wrap items-center justify-center gap-1.5 pointer-events-auto">
        <div className="bg-white/85 backdrop-blur-md p-1 rounded-full border border-[#F2EAE0] shadow-xs flex items-center space-x-1 text-[11px] font-bold">
          <button
            onClick={() => handleSelectView('isometric')}
            className={`px-3 py-1 rounded-full transition-all ${
              cameraView === 'isometric'
                ? 'bg-[#FFB800] text-[#1E1E24]'
                : 'text-[#514532] hover:bg-neutral-100'
            }`}
          >
            📐 360° All
          </button>
          <button
            onClick={() => handleSelectView('solar_roof')}
            className={`px-3 py-1 rounded-full transition-all ${
              cameraView === 'solar_roof'
                ? 'bg-[#FFB800] text-[#1E1E24]'
                : 'text-[#514532] hover:bg-neutral-100'
            }`}
          >
            ☀️ Solar Roof
          </button>
          <button
            onClick={() => handleSelectView('prep_bay')}
            className={`px-3 py-1 rounded-full transition-all ${
              cameraView === 'prep_bay'
                ? 'bg-[#FFB800] text-[#1E1E24]'
                : 'text-[#514532] hover:bg-neutral-100'
            }`}
          >
            🍉 Prep Counter & Trays
          </button>
          <button
            onClick={() => handleSelectView('soundbox')}
            className={`px-3 py-1 rounded-full transition-all ${
              cameraView === 'soundbox'
                ? 'bg-[#FFB800] text-[#1E1E24]'
                : 'text-[#514532] hover:bg-neutral-100'
            }`}
          >
            📢 Soundbox & UPI
          </button>
          <button
            onClick={() => handleSelectView('battery_unit')}
            className={`px-3 py-1 rounded-full transition-all ${
              cameraView === 'battery_unit'
                ? 'bg-[#FFB800] text-[#1E1E24]'
                : 'text-[#514532] hover:bg-neutral-100'
            }`}
          >
            🔋 LiFePO4 Power Core
          </button>
        </div>
      </div>

      {/* Explode Distance Slider (When Exploded) */}
      {isExploded && (
        <div className="absolute top-16 left-4 right-4 z-20 max-w-md mx-auto bg-amber-50/90 backdrop-blur-md border border-[#FFB800] rounded-2xl p-3 shadow-md flex items-center justify-between gap-3 pointer-events-auto">
          <div className="flex items-center space-x-1.5 text-xs font-bold text-[#1E1E24]">
            <Sliders className="w-4 h-4 text-[#E63946]" />
            <span>Explode: {Math.round(explodeDistance)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={explodeDistance}
            onChange={(e) => setExplodeDistance(Number(e.target.value))}
            className="w-48 sm:w-60 accent-[#E63946]"
          />
        </div>
      )}

      {/* 3D WebGL Canvas Mount */}
      <div
        ref={mountRef}
        className="w-full h-[520px] sm:h-[600px] cursor-grab active:cursor-grabbing"
      />

      {/* Exploded Part Callout Tags */}
      {isExploded && (
        <div className="absolute bottom-14 left-4 right-4 z-20 flex flex-wrap items-center justify-center gap-2 pointer-events-none">
          <span className="bg-[#1E1E24]/85 text-white px-3 py-1 rounded-full text-[10px] font-bold shadow-md">
            ▲ 400W Mono Solar Canopy
          </span>
          <span className="bg-amber-500/90 text-neutral-900 px-3 py-1 rounded-full text-[10px] font-bold shadow-md">
            💡 4x 3000K Edison Bulbs
          </span>
          <span className="bg-emerald-600/90 text-white px-3 py-1 rounded-full text-[10px] font-bold shadow-md">
            ★ 304 Stainless Prep Trays
          </span>
          <span className="bg-blue-600/90 text-white px-3 py-1 rounded-full text-[10px] font-bold shadow-md">
            ❄ 4°C Active Chiller Box
          </span>
          <span className="bg-teal-700/90 text-white px-3 py-1 rounded-full text-[10px] font-bold shadow-md">
            🔋 1.2kWh LiFePO4 Core
          </span>
        </div>
      )}

      {/* Dynamic Telemetry Status Indicator for Time of Day */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold text-[#1E1E24] border border-[#F2EAE0] shadow-sm flex items-center space-x-2 z-20 pointer-events-none">
        {timeOfDay === 'noon' && (
          <>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>☀️ 396W Solar Output • Chiller Active (4°C) • LiFePO4 Fast Charging</span>
          </>
        )}
        {timeOfDay === 'sunset' && (
          <>
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span>🌅 218W Sunset Rays • Eco Float Mode • Soundbox Active</span>
          </>
        )}
        {timeOfDay === 'night' && (
          <>
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <span>🌙 0W Solar • 4x Warm Edison Bulbs Glowing • 1.2kWh Core (94%)</span>
          </>
        )}
      </div>

      {/* Bottom Hint */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-[#1E1E24]/80 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-xs font-semibold flex items-center space-x-2 pointer-events-none z-20">
        <Sparkles className="w-3.5 h-3.5 text-[#FFB800]" />
        <span>Click & drag to orbit 360° • Toggle Explode View to inspect internals</span>
      </div>
    </div>
  );
};
