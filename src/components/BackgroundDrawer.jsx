import { FaCheck } from 'react-icons/fa';

import { FiUpload, FiSearch } from 'react-icons/fi';
import { PiStar } from 'react-icons/pi';
import './BackgroundDrawer.css';

function BackgroundDrawer({
  onClose,
  onColorClick,
  onImageUpload,
  onSearchClick,
  onLogoClick,
  currentBackground,
}) {
  const getBackgroundStyle = () => {
    if (currentBackground.type === 'solid') {
      return { backgroundColor: currentBackground.value };
    }
    if (currentBackground.type === 'gradient') {
      return { backgroundImage: currentBackground.value };
    }
    return { backgroundColor: '#ccc' }; // Fallback
  };

  return (
    <div className="drawer-overlay" onClick={onClose}>
      <div className="drawer-content background-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-header">
          <div className="drawer-header-button" /> {/* Spacer */}
          <span className="drawer-title flex-grow">Background and Image</span>
          <button className="drawer-header-button" onClick={onClose}><FaCheck /></button>
        </div>
        <div className="drawer-body">
          <button className="background-option-button" onClick={onColorClick} title="Color">
            <div className="color-swatch-preview" style={getBackgroundStyle()} />
          </button>
          <button className="background-option-button" onClick={onImageUpload} title="Upload Image">
            <FiUpload />
          </button>
          <button className="background-option-button" onClick={onSearchClick} title="Search Image">
            <FiSearch />
          </button>
          <button className="background-option-button" onClick={onLogoClick} title="Logo">
            <PiStar />
          </button>
        </div>
      </div>
    </div>
  );
}

export default BackgroundDrawer;
