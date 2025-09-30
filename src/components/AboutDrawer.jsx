import { FiX } from 'react-icons/fi';
import './AboutDrawer.css';

function AboutDrawer({ onClose }) {
  return (
    <div className="drawer-overlay" onClick={onClose}>
      <div className="drawer-content about-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-header">
          <button className="drawer-header-button" onClick={onClose}>
            <FiX />
          </button>
          <span className="drawer-title">About PicFlam</span>
          <div className="drawer-header-button" />
        </div>
        <div className="drawer-body">
          <p className="about-text">Made with 🥁 by Dan Mason | 2025</p>
        </div>
      </div>
    </div>
  );
}

export default AboutDrawer;