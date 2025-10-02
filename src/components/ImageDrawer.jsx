import { forwardRef } from 'react';
import { FaCheck } from 'react-icons/fa';
import './ImageDrawer.css';
import { RiFullscreenFill, RiFullscreenExitLine } from "react-icons/ri";

const ImageDrawer = forwardRef(function ImageDrawer({
  onClose,
  imageLayer,
  isLogo,
  onUpdate,
}, ref) {

  if (!imageLayer) return null;

  return (
    <div className="image-drawer-overlay">
      <div className="drawer-content image-drawer" ref={ref}>
        <div className="drawer-header">
          <div className="drawer-header-button" /> {/* Spacer */}
          <span className="drawer-title flex-grow">{isLogo ? 'Logo' : 'Image'}</span>
          <button className="drawer-header-button" onClick={onClose}><FaCheck /></button>
        </div>
        <div className="drawer-body image-drawer">
          <div className="image-controls-wrapper">
            <div className="slider-row">
              <label htmlFor="size">Size</label>
              <input type="range" id="size" min="0.1" max="3" step="0.01" value={imageLayer.scale} onChange={(e) => onUpdate({ scale: parseFloat(e.target.value) })} />
              {!isLogo ? (
                <div className="fit-mode-icons">
                  <RiFullscreenExitLine
                    style={{ opacity: imageLayer.fitMode === 'fit' ? 1 : 0.5, cursor: 'pointer' }}
                    onClick={() => onUpdate({ fitMode: 'fit' })}
                  />
                  <RiFullscreenFill
                    style={{ opacity: imageLayer.fitMode === 'fill' ? 1 : 0.5, cursor: 'pointer' }}
                    onClick={() => onUpdate({ fitMode: 'fill' })}
                  />
                </div>
              ) : (
                <div className="fit-mode-icons-placeholder" /> /* Reserve space */
              )}
            </div>
            <div className="slider-row">
              <label htmlFor="opacity">Opacity</label>
              <input type="range" id="opacity" min="0" max="1" step="0.01" value={imageLayer.opacity} onChange={(e) => onUpdate({ opacity: parseFloat(e.target.value) })} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default ImageDrawer;
