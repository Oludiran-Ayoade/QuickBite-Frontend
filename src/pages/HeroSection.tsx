import React from 'react';
import '../styles/Header.css';
import Hero1 from '../assets/hero1.jpg'
import Hero2 from '../assets/hero1.jpg'


interface HeroSectionProps {
    onExploreMenuClick: () => void;
  }
  
  const HeroSection: React.FC<HeroSectionProps> = ({ onExploreMenuClick }) => {
    return (
    <div className="hero-container">
      <div className="hero-content">
        <h1>Welcome to QuickBite</h1>
        <p>Discover a world of delicious food</p>
        <button className="btn btn-primary1 shadow-lg" onClick={onExploreMenuClick}>Explore Menu</button>
      </div>
      <div className="hero-image">
        <img src={Hero1} alt="Delicious Food" className='heroone shadow' />
        <img src={Hero2} alt="Delicious Food" className='shadow' />
      </div>
    </div>
  );
};

export default HeroSection;
