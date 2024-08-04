import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './AboutMe.css';  // We'll create this CSS file next

const AboutMe = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Set a small delay before setting isVisible to true to ensure the CSS transition works
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`about-me ${isVisible ? 'visible' : ''}`}>
      <h1>About Me</h1>
      <p>
        Hey y'all! I'm Anthony Zhang, a Computer Science and Applied Mathematics student at UC Berkeley. My interests include computer graphics, 3D reconstruction, photorealistic rendering, machine learning, and making software fast.
      </p>
      <p>
        Currently, I'm a contributor and developer for Nerfstudio, an open source project for developing and researching Neural Radiance Fields and Gaussian Splatting. Nerfstudio is maintained by KAIR under Berkeley AI Research (BAIR) and other community contributors!
      </p>
      <p>
        Previously, I was a software engineer intern at Square where I worked on customer platform infrastructure and internal microservices. 
      </p>
      <p>
        Before that, I was a software engineer intern at Collective Health developing backend APIs and a research assistant and Shanghai J.T University working on medical imaging.
      </p>
      <Link to="/">Back to Minigame</Link>
    </div>
  );
};

export default AboutMe;