import './SolidColorDrawer.css';
import { FiX, FiCheck } from 'react-icons/fi';

const DEFAULT_COLORS = [
  '#FFFFFF',
  '#000000',
  '#FF3B30',
  '#FF9500',
  '#FFCC00',
  '#34C759',
  '#007AFF',
  '#5856D6',
];

function SolidColorDrawer({
  onClose,
  onColorChange,
  onConfirm,
  currentColor,
}) {
  return (
    <div className="drawer-overlay" onClick={() => onClose(false)}>
      <div className="drawer-content" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-header">
          <button className="drawer-header-button" onClick={() => onClose(false)}>
            <FiX />
          </button>
          <span className="drawer-title">Solid Color</span>
          <button className="drawer-header-button" onClick={() => onConfirm()}>
            <FiCheck />
          </button>
        </div>
        <div className="solid-color-body">
          <div className="color-swatches">
            {DEFAULT_COLORS.map((color) => (
              <button
                key={color}
                className="color-swatch"
                style={{ backgroundColor: color }}
                onClick={() => onColorChange(color)}
              />
            ))}
            <input
              type="color"
              className="color-picker-input"
              value={currentColor}
              onChange={(e) => onColorChange(e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default SolidColorDrawer;