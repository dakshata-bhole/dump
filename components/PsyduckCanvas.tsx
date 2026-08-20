'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface PsyduckCanvasProps {
  currentPage?: 1 | 2 | 3;
}

export default function PsyduckCanvas({ currentPage = 1 }: PsyduckCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0xf8fafc, 0.025);

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.set(0, 0, 8.5);

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // Group for Psyduck
    const psyduckGroup = new THREE.Group();
    scene.add(psyduckGroup);

    // Vibrant PBR Materials tailored for clean light theme
    const bodyMaterial = new THREE.MeshStandardMaterial({
      color: 0xfacc15,
      roughness: 0.3,
      metalness: 0.1,
    });

    const billMaterial = new THREE.MeshStandardMaterial({
      color: 0xffedd5,
      roughness: 0.35,
      metalness: 0.05,
    });

    const eyeMaterial = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.1,
      metalness: 0.9,
    });

    const eyeWhiteMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.1,
    });

    const hairMaterial = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.4,
    });

    // 1. Head
    const headGeo = new THREE.SphereGeometry(1.2, 32, 32);
    headGeo.scale(1, 1.05, 0.95);
    const head = new THREE.Mesh(headGeo, bodyMaterial);
    head.position.set(0, 0.4, 0);
    head.castShadow = true;
    psyduckGroup.add(head);

    // 2. Bill
    const billGeo = new THREE.CylinderGeometry(0.55, 0.75, 0.4, 32);
    billGeo.scale(1.3, 0.5, 1.4);
    const bill = new THREE.Mesh(billGeo, billMaterial);
    bill.position.set(0, 0.1, 0.95);
    bill.rotation.x = 0.15;
    bill.castShadow = true;
    psyduckGroup.add(bill);

    // 3. Eyes
    const eyeWhiteGeo = new THREE.SphereGeometry(0.28, 24, 24);
    eyeWhiteGeo.scale(1, 1.1, 0.4);

    const pupilGeo = new THREE.SphereGeometry(0.08, 16, 16);
    pupilGeo.scale(1, 1, 0.5);

    // Left Eye
    const leftEyeWhite = new THREE.Mesh(eyeWhiteGeo, eyeWhiteMaterial);
    leftEyeWhite.position.set(-0.48, 0.62, 0.85);
    leftEyeWhite.rotation.y = -0.3;
    leftEyeWhite.rotation.x = -0.1;
    psyduckGroup.add(leftEyeWhite);

    const leftPupil = new THREE.Mesh(pupilGeo, eyeMaterial);
    leftPupil.position.set(-0.48, 0.62, 0.98);
    psyduckGroup.add(leftPupil);

    // Right Eye
    const rightEyeWhite = new THREE.Mesh(eyeWhiteGeo, eyeWhiteMaterial);
    rightEyeWhite.position.set(0.48, 0.62, 0.85);
    rightEyeWhite.rotation.y = 0.3;
    rightEyeWhite.rotation.x = -0.1;
    psyduckGroup.add(rightEyeWhite);

    const rightPupil = new THREE.Mesh(pupilGeo, eyeMaterial);
    rightPupil.position.set(0.48, 0.62, 0.98);
    psyduckGroup.add(rightPupil);

    // 4. Hair Strands
    const hairGeo = new THREE.CylinderGeometry(0.02, 0.05, 0.5, 8);
    for (let i = -1; i <= 1; i++) {
      const strand = new THREE.Mesh(hairGeo, hairMaterial);
      strand.position.set(i * 0.12, 1.7, -0.05);
      strand.rotation.z = i * 0.25;
      strand.rotation.x = -0.2;
      psyduckGroup.add(strand);
    }

    // 5. Body
    const bodyGeo = new THREE.SphereGeometry(1.35, 32, 32);
    bodyGeo.scale(1.1, 1.25, 1);
    const body = new THREE.Mesh(bodyGeo, bodyMaterial);
    body.position.set(0, -1.2, -0.1);
    body.castShadow = true;
    psyduckGroup.add(body);

    // 6. Arms holding head
    const armGeo = new THREE.CylinderGeometry(0.22, 0.3, 1.1, 16);
    
    const leftArm = new THREE.Mesh(armGeo, bodyMaterial);
    leftArm.position.set(-1.15, 0.25, 0.3);
    leftArm.rotation.z = 0.95;
    leftArm.rotation.y = 0.4;
    psyduckGroup.add(leftArm);

    const rightArm = new THREE.Mesh(armGeo, bodyMaterial);
    rightArm.position.set(1.15, 0.25, 0.3);
    rightArm.rotation.z = -0.95;
    rightArm.rotation.y = -0.4;
    psyduckGroup.add(rightArm);

    // Positioning depending on page
    if (currentPage === 3) {
      psyduckGroup.position.set(1.8, -0.6, -2.5);
      psyduckGroup.scale.set(0.85, 0.85, 0.85);
    } else if (currentPage === 2) {
      psyduckGroup.position.set(2.1, -0.4, -2.0);
      psyduckGroup.scale.set(0.95, 0.95, 0.95);
    } else {
      psyduckGroup.position.set(1.8, -0.2, -1.5);
      psyduckGroup.scale.set(1.05, 1.05, 1.05);
    }
    psyduckGroup.rotation.y = -0.35;

    // Floating particle field
    const particleCount = 160;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 18;
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 14;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 12 - 2;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    const particleMat = new THREE.PointsMaterial({
      color: 0x0284c7, // Vibrant sky blue particles
      size: 0.12,
      transparent: true,
      opacity: 0.65,
      blending: THREE.NormalBlending,
    });

    const particleSystem = new THREE.Points(particleGeo, particleMat);
    scene.add(particleSystem);

    // Lighting setup for crisp light theme
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.6);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.5);
    keyLight.position.set(-4, 7, 5);
    scene.add(keyLight);

    const skyRimLight = new THREE.PointLight(0x38bdf8, 6.0, 15);
    skyRimLight.position.set(3, 2, -2);
    scene.add(skyRimLight);

    const fillLight = new THREE.PointLight(0x0284c7, 3.0, 12);
    fillLight.position.set(-2, -3, 2);
    scene.add(fillLight);

    // Mouse parallax tracking
    let targetMouseX = 0;
    let targetMouseY = 0;
    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    window.addEventListener('mousemove', handleMouseMove);

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      const baseY = currentPage === 3 ? -0.6 : currentPage === 2 ? -0.4 : -0.2;
      psyduckGroup.position.y = baseY + Math.sin(elapsedTime * 1.3) * 0.14;
      psyduckGroup.rotation.y = -0.35 + mouseX * 0.3;
      psyduckGroup.rotation.x = mouseY * 0.18;

      const positions = particleGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        positions[i * 3 + 1] += Math.sin(elapsedTime + i) * 0.003;
        if (positions[i * 3 + 1] > 7) positions[i * 3 + 1] = -7;
      }
      particleGeo.attributes.position.needsUpdate = true;

      camera.position.x = mouseX * 0.45;
      camera.position.y = -mouseY * 0.35;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [currentPage]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-0 transition-opacity duration-1000"
      style={{ opacity: 0.9 }}
    />
  );
}
