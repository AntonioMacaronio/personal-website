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
        Hey y'all! I'm Anthony Zhang, a Computer Science and Applied Mathematics student at UC Berkeley. My interests include computer graphics, 3D reconstruction, photorealistic rendering, and software engineering.
      </p>
      <p>
        My experience ranges from undergraduate research at Berkeley AI Research to internships 
        at leading tech companies like Square. I love tackling complex problems and turning 
        innovative ideas into reality.
      </p>
      <p>
        When I'm not coding, you can find me exploring the latest advancements in AI, 
        collaborating on open-source projects, or mentoring fellow students in computer science.
      </p>
      <Link to="/">Back to Minigame</Link>
    </div>
  );
};

export default AboutMe;