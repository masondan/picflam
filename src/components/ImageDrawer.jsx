import { TiTick } from 'react-icons/ti';
import './ImageDrawer.css';

function ImageDrawer({
  onClose,
  imageLayer,
  onUpdate,
}) {

  if (!imageLayer) return null;

  return (
    <div className="drawer-overlay" onClick={onClose}>
      <div className="drawer-content image-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-header">
          <div className="drawer-header-button" /> {/* Spacer */}
          <span className="drawer-title">Image</span>
          <button className="drawer-header-button" onClick={onClose}><TiTick /></button>
        </div>
        <div className="drawer-body">
          <div className="image-controls-wrapper">
            <div className="image-control-row">
              <button
                className={`image-mode-button ${imageLayer.fitMode === 'fit' ? 'active' : ''}`}
                onClick={() => onUpdate({ fitMode: 'fit' })}
              >
                Fit
              </button>
              <button
                className={`image-mode-button ${imageLayer.fitMode === 'fill' ? 'active' : ''}`}
                onClick={() => onUpdate({ fitMode: 'fill' })}
              >
                Fill
              </button>
            </div>
            <div className="image-control-row slider-row">
              <label>Size</label>
              <input type="range" min="0.1" max="3" step="0.05" value={imageLayer.scale} onChange={(e) => onUpdate({ scale: parseFloat(e.target.value) })} />
            </div>
            <div className="image-control-row slider-row">
              <label>Opacity</label>
              <input type="range" min="0" max="1" step="0.05" value={imageLayer.opacity} onChange={(e) => onUpdate({ opacity: parseFloat(e.target.value) })} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ImageDrawer;