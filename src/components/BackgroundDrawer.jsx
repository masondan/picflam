import './BackgroundDrawer.css';
import { FiUpload, FiSearch, FiChevronLeft } from 'react-icons/fi';
import { PiStar } from 'react-icons/pi';

function BackgroundDrawer({
  onClose,
  onColorClick,
  onImageUpload,
  onSearchClick,
  onLogoClick,
  currentBackground,
}) {
  const getBackgroundStyle = () => {
    if (currentBackground && currentBackground.type === 'solid') {
      return { backgroundColor: currentBackground.value };
    }
    if (currentBackground && currentBackground.type === 'gradient') {
      // Set a transparent background to prevent the default from flashing
      // before the gradient is rendered.
      return { backgroundImage: currentBackground.value, backgroundColor: 'transparent' };
    }
    // Default to transparent if no background is set to avoid showing the square
    return { backgroundColor: 'transparent', backgroundImage: 'none' };
  };

  return (
    <div className="drawer-overlay" onClick={onClose}>
      <div className="drawer-content background-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-body">
          <button className="background-option-button" onClick={onColorClick} title="Color">
            <div
              className="color-swatch-preview"
              style={{
                ...getBackgroundStyle(),
                // Force hardware acceleration to prevent flashing
                transform: 'translateZ(0)',
                willChange: 'background',
              }}
            />
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
          <button className="drawer-back-button" onClick={onClose}><FiChevronLeft /></button>
        </div>
      </div>
    </div>
  );
}

export default BackgroundDrawer;
