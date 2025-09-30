import './GradientDrawer.css';
import { FiX, FiCheck } from 'react-icons/fi';

const DEFAULT_GRADIENTS = [
  { name: 'Sunrise', value: 'linear-gradient(to right, #ff9966, #ff5e62)' },
  { name: 'Ocean', value: 'linear-gradient(to right, #43c6ac, #191654)' },
  { name: 'Sunset', value: 'linear-gradient(to right, #ff512f, #dd2476)' },
  { name: 'Forest', value: 'linear-gradient(to right, #5a3f37, #2c7744)' },
  { name: 'Grape', value: 'linear-gradient(to right, #c31432, #240b36)' },
  { name: 'Sky', value: 'linear-gradient(to right, #0072ff, #00c6ff)' },
];

function GradientDrawer({ onClose, onConfirm, onGradientChange }) {
  return (
    <div className="drawer-overlay" onClick={() => onClose(false)}>
      <div className="drawer-content" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-header">
          <button
            className="drawer-header-button"
            onClick={() => onClose(false)}
          >
            <FiX />
          </button>
          <span className="drawer-title">Gradient</span>
          <button className="drawer-header-button" onClick={() => onConfirm()}>
            <FiCheck />
          </button>
        </div>
        <div className="gradient-drawer-body">
          <div className="gradient-swatches">
            {DEFAULT_GRADIENTS.map((gradient) => (
              <button
                key={gradient.name}
                className="gradient-swatch"
                style={{ background: gradient.value }}
                onClick={() => onGradientChange(gradient.value)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default GradientDrawer;