import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const PointCloudAnimation = () => {
  const mountRef = useRef(null);
  const [scene, setScene] = useState(null);
  const [camera, setCamera] = useState(null);
  const [renderer, setRenderer] = useState(null);
  const [points, setPoints] = useState(null);
  const [originalPositions, setOriginalPositions] = useState(null);
  const [rayLine, setRayLine] = useState(null);

  useEffect(() => {
    // Set up the scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    // Create point cloud
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(10000 * 3);
    const colors = new Float32Array(10000 * 3);

    for (let i = 0; i < positions.length; i += 3) {
      positions[i] = Math.random() * 10 - 5;
      positions[i + 1] = Math.random() * 10 - 5;
      positions[i + 2] = Math.random() * 10 - 5;

      colors[i] = Math.random();
      colors[i + 1] = Math.random();
      colors[i + 2] = Math.random();
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({ size: 0.1, vertexColors: true });
    const points = new THREE.Points(geometry, material);
    scene.add(points);

    // Set up camera and controls
    camera.position.z = 10;
    const controls = new OrbitControls(camera, renderer.domElement);

    // Create a line for the ray
    const rayGeometry = new THREE.BufferGeometry();
    const rayMaterial = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0 });
    const rayLine = new THREE.Line(rayGeometry, rayMaterial);
    scene.add(rayLine);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Store the original positions
    setOriginalPositions(positions.slice());

    // Set state
    setScene(scene);
    setCamera(camera);
    setRenderer(renderer);
    setPoints(points);
    setRayLine(rayLine);

    // Clean up
    return () => {
      mountRef.current.removeChild(renderer.domElement);
    };
  }, []);

  // Handle click events
  const handleClick = (event) => {
    if (!scene || !camera || !renderer || !points || !rayLine) return;

    const mouse = new THREE.Vector2();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObject(points);

    if (intersects.length > 0) {
      const positions = points.geometry.attributes.position.array;
      const clickPoint = intersects[0].point;

      // Update ray line
      const rayGeometry = new THREE.BufferGeometry().setFromPoints([
        camera.position,
        clickPoint
      ]);
      rayLine.geometry.dispose();
      rayLine.geometry = rayGeometry;

      // Make ray visible and start fading
      rayLine.material.opacity = 1;
      fadeRay();

      // Apply force to points
      for (let i = 0; i < positions.length; i += 3) {
        const distance = new THREE.Vector3(positions[i], positions[i+1], positions[i+2]).distanceTo(clickPoint);
        
        const maxDistance = 3;
        const forceFactor = 1.3;
        const force = Math.max(0, 1 - distance / maxDistance) * forceFactor;

        positions[i] += (positions[i] - clickPoint.x) * force;
        positions[i+1] += (positions[i+1] - clickPoint.y) * force;
        positions[i+2] += (positions[i+2] - clickPoint.z) * force;
      }

      points.geometry.attributes.position.needsUpdate = true;
    }
  };

  // Fade ray effect
  const fadeRay = () => {
    if (!rayLine) return;

    let opacity = 1;
    const fadeInterval = setInterval(() => {
      opacity -= 0.02;
      if (opacity <= 0) {
        clearInterval(fadeInterval);
        rayLine.material.opacity = 0;
      } else {
        rayLine.material.opacity = opacity;
      }
    }, 50);
  };

  // Handle animation
  useEffect(() => {
    if (!points || !originalPositions) return;

    const animate = () => {
      const positions = points.geometry.attributes.position.array;

      for (let i = 0; i < positions.length; i += 3) {
        positions[i] += (originalPositions[i] - positions[i]) * 0.02;
        positions[i+1] += (originalPositions[i+1] - positions[i+1]) * 0.02;
        positions[i+2] += (originalPositions[i+2] - positions[i+2]) * 0.02;
      }

      points.geometry.attributes.position.needsUpdate = true;

      requestAnimationFrame(animate);
    };

    animate();
  }, [points, originalPositions]);

  return <div ref={mountRef} onClick={handleClick} style={{ width: '100%', height: '100vh' }} />;
};

export default PointCloudAnimation;