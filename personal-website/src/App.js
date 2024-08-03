import React from 'react';
import PointCloudAnimation from './PointCloudAnimation';
import './App.css';
import AboutMe from './AboutMe';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function Minigame() {
  return (
    <div className="Minigame">
      <div className="objective-text">
        <h1>Shoot the center sphere 5 times!</h1>
      </div>
      <div className="point-cloud-container">
        <PointCloudAnimation />
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Minigame />} />
          <Route path="/home" element={<AboutMe />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;