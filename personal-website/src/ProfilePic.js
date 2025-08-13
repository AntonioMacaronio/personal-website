import React from 'react';
import { Github, Linkedin, Mail, FileText } from 'lucide-react';

const ProfilePic = () => {
  return (
    <div className="profile-pic-container">
      <img 
        src={process.env.PUBLIC_URL + '/profilepic.png'}
        alt="Anthony Zhang" 
        className="profile-pic"
      />
      <div className="social-links">
        <a href="https://github.com/AntonioMacaronio" target="_blank" rel="noopener noreferrer">
          <Github size={24} />
        </a>
        <a href="https://www.linkedin.com/in/antzhang" target="_blank" rel="noopener noreferrer">
          <Linkedin size={24} />
        </a>
        <a href="mailto:anthony_zhang1234@berkeley.edu">
          <Mail size={24} />
        </a>
        <a href={process.env.PUBLIC_URL + '/resume.pdf'} target="_blank" rel="noopener noreferrer">
          <FileText size={24} />
        </a>
      </div>
    </div>
  );
};

export default ProfilePic;