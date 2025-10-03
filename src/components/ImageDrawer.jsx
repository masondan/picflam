import { forwardRef } from 'react';
import './ImageDrawer.css';
import { FaCheck, FaTrash } from 'react-icons/fa';
import { RiFullscreenFill, RiFullscreenExitLine } from 'react-icons/ri';
import { FiChevronDown } from 'react-icons/fi';
import { MdOutlineZoomOutMap } from 'react-icons/md';

const ImageDrawer = forwardRef(function ImageDrawer({
  onClose,
  imageLayer,
  isLogo,
  onUpdate,
  onImageDelete,
}, ref) {
  if (!imageLayer) return null;

  return (
    <div className="drawer-overlay" onClick={onClose}>
      <div className="drawer-content image-drawer" onClick={(e) => e.stopPropagation()} ref={ref}>
        <div className="image-drawer-header">
          <button className="drawer-header-button"><FiChevronDown /></button>
          <div className="image-editor-tabs">
            <button className="style-icon-button active"><MdOutlineZoomOutMap /></button>
          </div>
          <button className="drawer-header-button" onClick={onClose}><FaCheck /></button>
        </div>
        <div className="image-drawer-body">
          <div className="control-row">
            <span className="slider-label">Size</span>
            <input
              type="range"
              min="0.1"
              max="3"
              step="0.01"
              value={imageLayer.scale}
              onChange={(e) => onUpdate({ scale: parseFloat(e.target.value) })}
              className="slider"
            />
            {!isLogo && (
              <div className="fit-mode-icons">
                <button
                  className={`fit-mode-button ${imageLayer.fitMode === 'fit' ? 'active' : ''}`}
                  onClick={() => onUpdate({ fitMode: 'fit' })}
                  title="Fit"
                >
                  <RiFullscreenExitLine />
                </button>
                <button
                  className={`fit-mode-button ${imageLayer.fitMode === 'fill' ? 'active' : ''}`}
                  onClick={() => onUpdate({ fitMode: 'fill' })}
                  title="Fill"
                >
                  <RiFullscreenFill />
                </button>
              </div>
            )}
          </div>
          <div className="control-row">
            <span className="slider-label">Opacity</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={imageLayer.opacity}
              onChange={(e) => onUpdate({ opacity: parseFloat(e.target.value) })}
              className="slider"
            />
            <button className="delete-button" onClick={onImageDelete} title="Delete">
              <FaTrash />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

export default ImageDrawer;
