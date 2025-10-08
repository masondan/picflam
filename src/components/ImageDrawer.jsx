import { forwardRef, useState, useEffect } from 'react';
import './ImageDrawer.css';
import { FiCheck } from 'react-icons/fi';
import { LiaExpandSolid, LiaCompressArrowsAltSolid, LiaExpandArrowsAltSolid } from 'react-icons/lia';
import { PiResize } from 'react-icons/pi';
import { RxOpacity } from 'react-icons/rx';

const ImageDrawer = forwardRef(function ImageDrawer({
  onClose,
  imageLayer,
  isLogo,
  onUpdate,
}, ref) {
  // 'fit-fill', 'size', or 'opacity'
  const [activeControl, setActiveControl] = useState(isLogo ? 'size' : 'fit-fill');

  // When the layer changes (e.g. user clicks a different image), reset the active control.
  useEffect(() => {
    setActiveControl(isLogo ? 'size' : 'fit-fill');
  }, [imageLayer.img.src, isLogo]);

  if (!imageLayer) return null;

  return (
    <div className="drawer-content image-drawer single-row" onClick={(e) => e.stopPropagation()} ref={ref}>
      <div className="image-drawer-controls">
        <div className="control-toggles">
          {!isLogo && (
            <button
              className={`control-toggle-button ${activeControl === 'fit-fill' ? 'active' : ''}`}
              onClick={() => setActiveControl('fit-fill')}
              title="Fit/Fill"
            >
              <LiaExpandSolid />
            </button>
          )}
          <button
            className={`control-toggle-button ${activeControl === 'size' ? 'active' : ''}`}
            onClick={() => setActiveControl('size')}
            title="Size"
          >
            <PiResize />
          </button>
          <button
            className={`control-toggle-button ${activeControl === 'opacity' ? 'active' : ''}`}
            onClick={() => setActiveControl('opacity')}
            title="Opacity"
          >
            <RxOpacity />
          </button>
        </div>

        <div className="active-control-area">
          {activeControl === 'fit-fill' && !isLogo && (
            <div className="fit-fill-controls">
              <button
                className={`fit-fill-button ${imageLayer.fitMode === 'fit' ? 'active' : ''}`}
                onClick={() => onUpdate({ fitMode: 'fit' })}>
                <LiaCompressArrowsAltSolid /> Fit
              </button>
              <button
                className={`fit-fill-button ${imageLayer.fitMode === 'fill' ? 'active' : ''}`}
                onClick={() => onUpdate({ fitMode: 'fill' })}>
                <LiaExpandArrowsAltSolid /> Fill
              </button>
            </div>
          )}
          {activeControl === 'size' && (
            <input
              type="range"
              min="0.1"
              max="3"
              step="0.01"
              value={imageLayer.scale}
              onChange={(e) => onUpdate({ scale: parseFloat(e.target.value) })}
              className="slider"
            />
          )}
          {activeControl === 'opacity' && (
            <div className="opacity-slider-wrapper">
              <div className="opacity-slider-track" />
              <input
                type="range" min="0" max="1" step="0.01"
                value={imageLayer.opacity}
                onChange={(e) => onUpdate({ opacity: parseFloat(e.target.value) })}
                className="slider opacity-slider"
              />
            </div>
          )}
        </div>
        <button className="drawer-confirm-button" onClick={onClose}><FiCheck /></button>
      </div>
    </div>
  );
});

export default ImageDrawer;
