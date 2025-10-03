import { FiCheck } from 'react-icons/fi';
import './AboutDrawer.css';

function AboutDrawer({ onClose }) {
  return (
    <div className="drawer-overlay" onClick={onClose}>
      <div className="drawer-content about-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-body">
          <p className="about-text">PicFlam. Made with 🥁 by Dan Mason</p>
          <button className="drawer-confirm-button" onClick={onClose}><FiCheck /></button>
        </div>
      </div>
    </div>
  );
}

export default AboutDrawer;