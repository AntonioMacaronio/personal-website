import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const WindowedPointCloudAnimation = () => {
  return (
    <div style={{
      width: '800px',
      height: '600px',
      margin: '20px auto',
      overflow: 'hidden',
      position: 'relative'
    }}>
      <PointCloudAnimation />
    </div>
  );
};

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
    const camera = new THREE.PerspectiveCamera(75, 800 / 568, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(800, 568);  // Adjusted to fit the window
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
    const rayMaterial = new THREE.LineBasicMaterial({
      color: 0xffff00,
      transparent: true,
      opacity: 0,
      linewidth: 2,
    });
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

  const handleClick = (event) => {
    if (!scene || !camera || !renderer || !points || !rayLine) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const mouse = new THREE.Vector2();
    mouse.x = ((event.clientX - rect.left) / 800) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / 568) * 2 + 1;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);

    const rayStart = camera.position.clone();
    const rayDirection = raycaster.ray.direction;

    const rayEnd = rayStart.clone().add(rayDirection.multiplyScalar(20));
    const rayGeometry = new THREE.BufferGeometry().setFromPoints([rayStart, rayEnd]);
    rayLine.geometry.dispose();
    rayLine.geometry = rayGeometry;

    rayLine.material.opacity = 1;
    rayLine.material.color.setHex(0xffff00);
    fadeRay();

    const positions = points.geometry.attributes.position.array;
    for (let i = 0; i < positions.length; i += 3) {
      const point = new THREE.Vector3(positions[i], positions[i+1], positions[i+2]);
      
      const closestPoint = new THREE.Vector3();
      closestPoint.subVectors(point, rayStart);
      const rayPointProjection = closestPoint.dot(rayDirection);
      closestPoint.copy(rayDirection).multiplyScalar(rayPointProjection).add(rayStart);
      
      const distance = point.distanceTo(closestPoint);
      
      const maxDistance = 0.5;
      const forceFactor = 0.3;
      
      const force = Math.max(0, 1 - distance / maxDistance) * forceFactor;

      const forceDirection = new THREE.Vector3().subVectors(point, closestPoint).normalize();

      positions[i] += forceDirection.x * force;
      positions[i+1] += forceDirection.y * force;
      positions[i+2] += forceDirection.z * force;
    }

    points.geometry.attributes.position.needsUpdate = true;
  };

  const fadeRay = () => {
    if (!rayLine) return;

    let opacity = 1;
    const fadeInterval = setInterval(() => {
      opacity -= 0.05;
      if (opacity <= 0) {
        clearInterval(fadeInterval);
        rayLine.material.opacity = 0;
      } else {
        rayLine.material.opacity = opacity;
      }
    }, 50);
  };

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

  return (
    <div 
      ref={mountRef} 
      onClick={handleClick} 
      style={{ width: '100%', height: '568px', cursor: 'pointer' }}
    />
  );
};

export default WindowedPointCloudAnimation;