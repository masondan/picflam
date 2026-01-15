import React from 'react';
import './SplashScreen.css';

function SplashScreen({ onGetStarted }) {
  return (
    <div className="splash-screen">
      <div className="splash-content">
        <div className="splash-main-content">
          <img src="/picflam-logo.png" alt="PicFlam Logo" className="splash-logo" />
          <p className="splash-tagline">Add text to images for Stories<br />and carousels. Create quotes</p>
          <button className="splash-button" onClick={onGetStarted}>
            Get Started
          </button>
        </div>

      </div>
    </div>
  );
}

export default SplashScreen;
