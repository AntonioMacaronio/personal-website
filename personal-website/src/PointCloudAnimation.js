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

    // Clean up
    return () => {
      mountRef.current.removeChild(renderer.domElement);
    };
  }, []);

  // Handle click events
  const handleClick = (event) => {
    if (!scene || !camera || !renderer || !points) return;

    // mouse: THREE.Vector2
    // Contains the normalized device coordinates of the mouse click
    // x and y range from -1 to 1, with (0,0) at the center of the screen
    const mouse = new THREE.Vector2();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // raycaster: THREE.Raycaster
    // Used for picking objects in the 3D scene
    // It casts a ray from the camera through the mouse position
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);

    // intersects: Array<THREE.Intersection>
    // Contains all objects intersected by the raycaster
    // Each intersection object includes:
    // - distance: distance from camera to intersection
    // - point: THREE.Vector3 of the intersection point
    // - object: the intersected object (in this case, our points object)
    const intersects = raycaster.intersectObject(points);

    if (intersects.length > 0) {
      // positions: Float32Array
      // Contains the positions of all points in the point cloud
      // Structure: [x1, y1, z1, x2, y2, z2, ...]
      const positions = points.geometry.attributes.position.array;

      // clickPoint: THREE.Vector3
      // The 3D coordinates of the point where the ray intersects the point cloud
      const clickPoint = intersects[0].point;

      for (let i = 0; i < positions.length; i += 3) {
        // distance: number
        // The Euclidean distance between the current point and the click point
        const distance = new THREE.Vector3(positions[i], positions[i+1], positions[i+2]).distanceTo(clickPoint);
        
        // maxDistance: number
        // The maximum distance at which a point will be affected by the click
        const maxDistance = 3;

        // forceFactor: number
        // A multiplier to control the strength of the force applied to points
        const forceFactor = 0.3;

        // force: number
        // The calculated force to apply to the current point
        // Decreases linearly with distance and is clamped to be non-negative
        const force = Math.max(0, 1 - distance / maxDistance) * forceFactor;

        // Apply the force to update the point's position
        positions[i] += (positions[i] - clickPoint.x) * force;
        positions[i+1] += (positions[i+1] - clickPoint.y) * force;
        positions[i+2] += (positions[i+2] - clickPoint.z) * force;
      }

      // Notify Three.js that the positions have been updated
      points.geometry.attributes.position.needsUpdate = true;
    }
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