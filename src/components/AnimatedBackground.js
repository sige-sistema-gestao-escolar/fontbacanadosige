import React from 'react';
import './AnimatedBackground.css';

export default function AnimatedBackground({ variant = 'login' }) {
  return (
    <div className={`animated-background ${variant}`}>
      <div className="gradient-orb orb-1"></div>
      <div className="gradient-orb orb-2"></div>
      <div className="gradient-orb orb-3"></div>
      <div className="gradient-orb orb-4"></div>
    </div>
  );
}
