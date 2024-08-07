import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProfilePic from './ProfilePic';
import './AboutMe.css';

const AboutMe = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`about-me ${isVisible ? 'visible' : ''}`}>
      <div className="about-me-content">
        <ProfilePic />
        <div className="about-me-text">
          <h1>About Me</h1>
          <p>
            Hey y'all! I'm Anthony Zhang, a Computer Science and Applied Mathematics student at UC Berkeley. My interests include computer graphics, 3D reconstruction, photorealistic rendering, machine learning, and making software fast.
          </p>
          <p>
            Currently, I'm a contributor and developer for <a href="https://docs.nerf.studio/">Nerfstudio</a>, an open source project for developing and researching Neural Radiance Fields and Gaussian Splatting. <a href="https://docs.nerf.studio/">Nerfstudio</a> is maintained by KAIR under Berkeley AI Research (BAIR) and other community contributors!
          </p>
          <p>
            Previously, I was a software engineer intern at Square where I worked on customer platform infrastructure and internal microservices. 
          </p>
          <p>
            Before that, I was a software engineer intern at Collective Health developing backend APIs and a research assistant at Shanghai Jiao Tong University working on medical imaging.
          </p>
          
          <Link className="back-link" to="/">Back to Minigame</Link>
        </div>
      </div>
    </div>
  );
};

export default AboutMe;