import './BackgroundDrawer.css';
import { FiX, FiDroplet, FiGrid, FiImage, FiSearch, FiStar } from 'react-icons/fi';

function BackgroundDrawer({ onClose, onImageUpload, onSolidColorClick, onGradientClick, onSearchClick, onLogoClick }) {
  return (
    <div className="drawer-overlay" onClick={onClose}>
      <div className="drawer-content" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-header">
          <span className="drawer-title">Background</span>
          <button className="drawer-header-button" onClick={onClose}><FiX /></button>
        </div>
        <div className="drawer-body background-options-grid">
          <button className="background-option-button" onClick={onSolidColorClick}>
            <FiDroplet />
            <span>Solid</span>
          </button>
          <button className="background-option-button" onClick={onGradientClick}>
            <FiGrid />
            <span>Gradient</span>
          </button>
          <button className="background-option-button" onClick={onImageUpload}>
            <FiImage />
            <span>Image</span>
          </button>
          <button className="background-option-button" onClick={onSearchClick}>
            <FiSearch />
            <span>Search</span>
          </button>
          <button className="background-option-button" onClick={onLogoClick}>
            <FiStar />
            <span>Logo</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default BackgroundDrawer;
