import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { useNavigate } from 'react-router-dom';

const PointCloudAnimation = () => {
  const mountRef = useRef(null);
  const [scene, setScene] = useState(null);
  const [camera, setCamera] = useState(null);
  const [renderer, setRenderer] = useState(null);
  const [points, setPoints] = useState(null);
  const [originalPositions, setOriginalPositions] = useState(null);
  const [rayLine, setRayLine] = useState(null);
  const [sphere, setSphere] = useState(null);
  const hitCount = useRef(0);
  
  
  const [isOrbiting, setIsOrbiting] = useState(true); // State to track if we're in orbit mode
  const angleRef = useRef(0); // Track the current angle of orbit
  const controlsRef = useRef(null); // Store the orbit controls for reference

  const navigate = useNavigate();

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

    // Create clickable sphere
    const sphereGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.set(0, 0, 0);
    scene.add(sphere);

    // Set up camera and controls
    camera.position.z = 15;
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;  // Smooth camera movement
    controls.dampingFactor = 0.03;
    controlsRef.current = controls;

    // Create a line for the ray
    const rayGeometry = new THREE.BufferGeometry();
    const rayMaterial = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0,
      linewidth: 5,  // Note: linewidth > 1 only works in WebGL 2
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
    setSphere(sphere);

    // Clean up function that a useEffect function returns
    return () => {
        if (mountRef.current && renderer.domElement && mountRef.current.contains(renderer.domElement)) {
          mountRef.current.removeChild(renderer.domElement);
        }
        renderer.dispose();
        if (scene) {
          scene.clear();
        }
      };
    }, []);

  // Handle click events
  const handleClick = (event) => {
    if (!scene || !camera || !renderer || !points || !rayLine || !sphere) return;

    const mouse = new THREE.Vector2();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects([sphere, points]);

    if (intersects.length > 0) {
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
      rayLine.material.color.setHex(0xffff00);  // Bright yellow color
      fadeRay();

      // Apply force to points
      const positions = points.geometry.attributes.position.array;
      for (let i = 0; i < positions.length; i += 3) {
        const distance = new THREE.Vector3(positions[i], positions[i+1], positions[i+2]).distanceTo(clickPoint);
        
        const maxDistance = 4;
        const forceFactor = 1.7;
        const force = Math.max(0, 1 - distance / maxDistance) * forceFactor;

        positions[i] += (positions[i] - clickPoint.x) * force;
        positions[i+1] += (positions[i+1] - clickPoint.y) * force;
        positions[i+2] += (positions[i+2] - clickPoint.z) * force;
      }

      points.geometry.attributes.position.needsUpdate = true;

      // Change sphere color when clicked
      if (intersects[0].object === sphere) {
        hitCount.current = hitCount.current + 1;
        console.log(hitCount.current);
        sphere.material.color.setHex(Math.random() * 0xffffff);
        if (hitCount.current === 5) {
            console.log("Redirecting");
            navigate('/home');
        }
      }
    }
  };

  // Fade ray effect
  const fadeRay = () => {
    if (!rayLine) return;

    let opacity = 1;
    const fadeInterval = setInterval(() => {
      opacity -= 0.01;
      if (opacity <= 0) {
        clearInterval(fadeInterval);
        rayLine.material.opacity = 0;
      } else {
        rayLine.material.opacity = opacity;
        // Gradually change color from yellow to white as it fades
        const hue = opacity * 60 / 360;  // 60 degrees is yellow in HSL
        rayLine.material.color.setHSL(hue, 1, 0.5);
      }
    }, 50);
  };

  // Handle animation
  useEffect(() => {
    if (!points || !originalPositions) return;

    const animate = () => {
      const positions = points.geometry.attributes.position.array;

      for (let i = 0; i < positions.length; i += 3) {
        const speed = 0.005
        positions[i] += (originalPositions[i] - positions[i]) * speed;
        positions[i+1] += (originalPositions[i+1] - positions[i+1]) * speed;
        positions[i+2] += (originalPositions[i+2] - positions[i+2]) * speed;
      }

      points.geometry.attributes.position.needsUpdate = true;

      requestAnimationFrame(animate);
    };

    animate();
  }, [points, originalPositions]);

  return <div ref={mountRef} onClick={handleClick} style={{ width: '100%', height: '100vh' }} />;
};

export default PointCloudAnimation;