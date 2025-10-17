import React from 'react';
import { LuDrum } from 'react-icons/lu';
import './SplashScreen.css';

function SplashScreen({ onGetStarted }) {
  return (
    <div className="splash-screen">
      <div className="splash-content">
        <div className="splash-main-content">
          <img src="/picflam-logo.png" alt="PicFlam Logo" className="splash-logo" />
          <p className="splash-tagline">Add text to images for Stories and carousels. Create quotes. Free.</p>
          <button className="splash-button" onClick={onGetStarted}>
            Get Started
          </button>
        </div>
        <p className="splash-credit">Made with <LuDrum /> by Dan Mason</p>
      </div>
    </div>
  );
}

export default SplashScreen;
