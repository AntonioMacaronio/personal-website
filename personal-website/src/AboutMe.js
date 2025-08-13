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
        <div className="about-me-text">
          <h1>Anthony Zhang</h1>
          <p>
            I'm an EECS Master's student at UC Berkeley advised by  <a href="https://people.eecs.berkeley.edu/~kanazawa/">Angjoo Kanazawa</a>. My interests include computer graphics, 3D computer vision, scene reconstruction, human motion/humanoid robotics, and machine learning.
          </p>
          <p>
            Currently, I'm a contributor and developer for <a href="https://docs.nerf.studio/">Nerfstudio</a>, an open source project in the Berkeley AI Research (BAIR) lab for developing and  3D reconstruction methods such as Neural Radiance Fields and Gaussian Splatting. 
          </p>
          <p>
            Previously, I was a software engineer intern at Square where I worked on customer platform infrastructure and internal microservices. 
          </p>
        </div>
        <div className="about-me-sidebar">
          <ProfilePic />
          <Link className="back-link" to="/">Back to Minigame</Link>
        </div>
      </div>
      
      <div className="research-container">
        <h2>Research <span style={{fontSize: '0.6em', opacity: 0.7}}>⚙️ under construction ⚙️</span></h2>
        <div className="research-section">
          <div className="publication-block">
            <div className="publication-thumbnail">
              <img src={process.env.PUBLIC_URL + '/VideoMimicThumbnail.png'} alt="VideoMimic thumbnail" />
            </div>
            <div className="publication-content">
              <h3 className="publication-title">
                VideoMimic: Visual Imitation Enables Contextual Humanoid Control
              </h3>
              <div className="publication-authors">
              Arthur Allshire*, Hongsuk Choi*, Junyi Zhang*, David McAllister*, <b>Anthony Zhang</b>, Chung Min Kim,
              Trevor Darrell, Pieter Abbeel, Jitendra Malik, Angjoo Kanazawa
              </div>
              <div className="publication-links">
                <a href="https://arxiv.org/abs/2505.03729" target="_blank" rel="noopener noreferrer">Paper - ArXiv 2025</a>
                <span className="link-separator">|</span>
                <a href="https://videomimic.net/" target="_blank" rel="noopener noreferrer">Website</a>
              </div>
              <p className="publication-description">
                A Real2Sim2Real pipeline for learning humanoid control from video demonstrations using visual imitation learning.
              </p>
            </div>
          </div>

          <div className="publication-block">
            <div className="publication-thumbnail">
              <img src={process.env.PUBLIC_URL + '/PodThumbnail.png'} alt="Predict-Optimize-Distill thumbnail" />
            </div>
            <div className="publication-content">
              <h3 className="publication-title">
                Predict-Optimize-Distill: Self-Improving Cycle for 4D Object Understanding
              </h3>
              <div className="publication-authors">
              Mingxuan Wu*, Huang Huang*,  Justin Kerr,  Chung Min Kim, <b>Anthony Zhang</b>, Brent Yi, Angjoo Kanazawa
              </div>
              <div className="publication-links">
                <a href="https://arxiv.org/abs/2504.17441" target="_blank" rel="noopener noreferrer">Paper - ICCV 2025</a>
                <span className="link-separator">|</span>
                <a href="https://predict-optimize-distill.github.io/pod.github.io/" target="_blank" rel="noopener noreferrer">Website</a>
              </div>
              <p className="publication-description">
                A self-improving framework for 4D object understanding through prediction, optimization, and distillation cycles.
              </p>
            </div>
          </div>

          <div className="publication-block">
            <div className="publication-thumbnail">
              <img src={process.env.PUBLIC_URL + '/HSfMThumbnail.png'} alt="HSfM thumbnail" />
            </div>
            <div className="publication-content">
              <h3 className="publication-title">
                HSfM: Reconstructing People, Places, and Cameras
              </h3>
              <div className="publication-authors">
              Lea Müller*, Hongsuk Choi*, <b>Anthony Zhang</b>, Brent Yi, Jitendra Malik, Angjoo Kanazawa
              </div>
              <div className="publication-links">
                <a href="https://arxiv.org/abs/2412.17806" target="_blank" rel="noopener noreferrer">Paper - CVPR 2025 (Highlight)</a>
                <span className="link-separator">|</span>
                <a href="https://muelea.github.io/hsfm/" target="_blank" rel="noopener noreferrer">Website</a>
              </div>
              <p className="publication-description">
                A joint optimization framework to estimate 3D human poses and their shape, scene pointmaps, and camera poses from multiview image captures.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutMe;