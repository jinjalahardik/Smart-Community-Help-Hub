import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import FallbackNetwork from './FallbackNetwork';

/**
 * CommunityNetwork3D - Interactive 3D Connected Ecosystem
 * 
 * Concept:
 * Central Community Core with glowing connections radiating to
 * People, NGOs, Hospitals, Volunteers, Donations, and Requests.
 * 
 * Performance & Graceful Degradation:
 * - Automatically throttles particle counts based on device/screen width (120 for mobile, 450 for desktop).
 * - Pauses rendering when scrolled offscreen via IntersectionObserver.
 * - Gentle mouse/touch parallax and subtle hover node reactivity.
 */
export default function CommunityNetwork3D({ className }) {
  const mountRef = useRef(null);
  const [hasWebGLError, setHasWebGLError] = useState(false);

  useEffect(() => {
    // Check WebGL availability
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) {
      setHasWebGLError(true);
      return;
    }

    const container = mountRef.current;
    if (!container) return;

    let width = container.clientWidth || 500;
    let height = container.clientHeight || 450;
    let isVisible = true;
    let reqId = null;

    // SCENE, CAMERA, RENDERER
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.z = 18;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setClearColor(0x000000, 0);
      container.appendChild(renderer.domElement);
    } catch {
      setHasWebGLError(true);
      return;
    }

    // INTERSECTION OBSERVER - PAUSE WHEN OFFSCREEN
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    // ROOT OBJECT GROUP (for rotation & mouse parallax)
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // 1. CENTRAL COMMUNITY CORE
    const coreGeo = new THREE.IcosahedronGeometry(2.2, 2);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0x14b8a6,
      wireframe: true,
      transparent: true,
      opacity: 0.75,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    rootGroup.add(coreMesh);

    // Inner glowing sphere
    const innerGeo = new THREE.SphereGeometry(1.4, 24, 24);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0x2dd4bf,
      transparent: true,
      opacity: 0.9,
    });
    const innerSphere = new THREE.Mesh(innerGeo, innerMat);
    rootGroup.add(innerSphere);

    // Outer faint pulse ring
    const ringGeo = new THREE.RingGeometry(2.6, 2.75, 48);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.4,
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = Math.PI / 2.5;
    rootGroup.add(ringMesh);

    // 2. SATELLITE ECOSYSTEM NODES
    // People, NGOs, Hospitals, Volunteers, Donations, Requests
    const nodeDefinitions = [
      { name: 'People', color: 0x38bdf8, angle: 0, distance: 7.2, y: 1.2 },
      { name: 'NGOs', color: 0x06b6d4, angle: (Math.PI / 3) * 1, distance: 7.8, y: -1.0 },
      { name: 'Volunteers', color: 0x10b981, angle: (Math.PI / 3) * 2, distance: 7.0, y: 2.1 },
      { name: 'Donations', color: 0xf59e0b, angle: (Math.PI / 3) * 3, distance: 7.6, y: -1.8 },
      { name: 'Hospitals', color: 0xf43f5e, angle: (Math.PI / 3) * 4, distance: 7.4, y: 1.5 },
      { name: 'Requests', color: 0x2dd4bf, angle: (Math.PI / 3) * 5, distance: 7.1, y: -0.5 },
    ];

    const nodeMeshes = [];
    const lineMeshes = [];

    nodeDefinitions.forEach((def) => {
      const x = Math.cos(def.angle) * def.distance;
      const z = Math.sin(def.angle) * def.distance;
      const y = def.y;

      // Node mesh
      const nodeGeo = new THREE.SphereGeometry(0.7, 20, 20);
      const nodeMat = new THREE.MeshBasicMaterial({ color: def.color });
      const node = new THREE.Mesh(nodeGeo, nodeMat);
      node.position.set(x, y, z);
      node.userData = { initialY: y, def };
      rootGroup.add(node);
      nodeMeshes.push(node);

      // Node subtle halo
      const haloGeo = new THREE.RingGeometry(0.85, 0.95, 24);
      const haloMat = new THREE.MeshBasicMaterial({
        color: def.color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.6,
      });
      const halo = new THREE.Mesh(haloGeo, haloMat);
      halo.position.set(x, y, z);
      halo.lookAt(0, 0, 0);
      rootGroup.add(halo);

      // Curved or straight connection line to center
      const points = [
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(x * 0.5, y * 0.6 + 0.5, z * 0.5),
        new THREE.Vector3(x, y, z),
      ];
      const curve = new THREE.QuadraticBezierCurve3(points[0], points[1], points[2]);
      const curvePoints = curve.getPoints(24);
      const lineGeo = new THREE.BufferGeometry().setFromPoints(curvePoints);
      const lineMat = new THREE.LineBasicMaterial({
        color: def.color,
        transparent: true,
        opacity: 0.35,
        linewidth: 1.5,
      });
      const line = new THREE.Line(lineGeo, lineMat);
      rootGroup.add(line);
      lineMeshes.push({ line, curve });
    });

    // Outer interconnects between adjacent nodes to form a network web
    for (let i = 0; i < nodeMeshes.length; i++) {
      const nextIdx = (i + 1) % nodeMeshes.length;
      const pts = [nodeMeshes[i].position, nodeMeshes[nextIdx].position];
      const geo = new THREE.BufferGeometry().setFromPoints(pts);
      const mat = new THREE.LineBasicMaterial({
        color: 0x14b8a6,
        transparent: true,
        opacity: 0.2,
      });
      const interLine = new THREE.Line(geo, mat);
      rootGroup.add(interLine);
    }

    // 3. AMBIENT PARTICLE FIELD
    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 120 : 380;
    const particleGeo = new THREE.BufferGeometry();
    const posArray = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      posArray[i] = (Math.random() - 0.5) * 26;
      posArray[i + 1] = (Math.random() - 0.5) * 20;
      posArray[i + 2] = (Math.random() - 0.5) * 20;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particleMat = new THREE.PointsMaterial({
      size: isMobile ? 0.08 : 0.12,
      color: 0x5eead4,
      transparent: true,
      opacity: 0.6,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    rootGroup.add(particles);

    // MOUSE PARALLAX TRACKING
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      targetX = x * 0.4;
      targetY = y * 0.3;
    };

    container.addEventListener('mousemove', handleMouseMove);

    // RESIZE LISTENER
    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth;
      height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    // ANIMATION LOOP
    let clock = new THREE.Clock();

    const animate = () => {
      reqId = requestAnimationFrame(animate);

      if (!isVisible) return;

      const elapsed = clock.getElapsedTime();

      // Smooth mouse follow
      mouseX += (targetX - mouseX) * 0.05;
      mouseY += (targetY - mouseY) * 0.05;

      rootGroup.rotation.y = elapsed * 0.12 + mouseX;
      rootGroup.rotation.x = mouseY + Math.sin(elapsed * 0.3) * 0.08;

      // Central core breathing & spin
      coreMesh.rotation.x = elapsed * 0.4;
      coreMesh.rotation.y = elapsed * 0.3;
      const coreScale = 1 + Math.sin(elapsed * 2) * 0.04;
      innerSphere.scale.set(coreScale, coreScale, coreScale);
      ringMesh.rotation.z = elapsed * 0.15;

      // Gentle floating motion on outer nodes
      nodeMeshes.forEach((node, i) => {
        node.position.y = node.userData.initialY + Math.sin(elapsed * 1.5 + i) * 0.25;
      });

      // Ambient particle slow rotation
      particles.rotation.y = -elapsed * 0.03;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(reqId);
      observer.disconnect();
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousemove', handleMouseMove);
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  if (hasWebGLError) {
    return <FallbackNetwork className={className} />;
  }

  return (
    <div
      ref={mountRef}
      className={`relative w-full h-[380px] sm:h-[460px] lg:h-[520px] flex items-center justify-center cursor-grab active:cursor-grabbing ${className || ''}`}
      aria-label="Interactive 3D Community Help Hub Network"
    >
      {/* Soft luminous background halo */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(45,212,191,0.14)_0%,transparent_65%)]" />
    </div>
  );
}
