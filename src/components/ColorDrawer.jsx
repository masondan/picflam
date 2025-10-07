import { useState, useEffect } from 'react';
import { FiPlus, FiArrowUp, FiArrowDown, FiArrowLeft, FiArrowRight, FiCheck } from 'react-icons/fi';
import './ColorDrawer.css';

const SOLID_COLORS = ['#FFFFFF', '#000000', '#007c1f', '#00679d', '#b20715'];
const GRADIENTS = [
  'linear-gradient(135deg, #8A2BE2 0%, #4B0082 100%)',
  'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
  'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',
  'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)',
  'linear-gradient(135deg, #d4fc79 0%, #96e6a1 100%)',
  'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)',
];

// Helper to parse a gradient string. Returns null if it doesn't match.
const parseGradient = (gradientString) => {
  const regex = /linear-gradient\((\d+)deg, (#[0-9a-f]{6}) 0%, (#[0-9a-f]{6}) 100%\)/i;
  const match = gradientString.match(regex);
  if (!match) return null;
  return {
    direction: parseInt(match[1], 10),
    start: match[2],
    end: match[3],
  };
};

function ColorDrawer({ onClose, onBackgroundChange, currentBackground }) {
  const [customGradient, setCustomGradient] = useState({
    start: '#FF6B6B',
    end: '#FFD700',
    direction: 135,
  });

  // When the component mounts, initialize its state from the current background
  useEffect(() => {
    if (currentBackground.type === 'gradient') {
      const parsed = parseGradient(currentBackground.value);
      if (parsed) {
        setCustomGradient(parsed);
      }
    }
  }, []); // Empty dependency array means this runs only once on mount

  // When the active background changes, update our controls
  useEffect(() => {
    if (currentBackground.type === 'gradient') {
      const parsed = parseGradient(currentBackground.value);
      if (parsed) {
        setCustomGradient(parsed);
      }
    }
  }, [currentBackground]);

  const handleCustomColorChange = (part, color) => {
    const newGradient = { ...customGradient, [part]: color };
    setCustomGradient(newGradient);
    onBackgroundChange({
      type: 'gradient',
      value: `linear-gradient(${newGradient.direction}deg, ${newGradient.start} 0%, ${newGradient.end} 100%)`,
    });
  };

  const handleDirectionChange = (newDirection) => {
    if (currentBackground.type !== 'gradient') return; // Do nothing if not a gradient

    const parsed = parseGradient(currentBackground.value);
    if (!parsed) return; // Can't parse the current gradient

    onBackgroundChange({
      type: 'gradient',
      value: `linear-gradient(${newDirection}deg, ${parsed.start} 0%, ${parsed.end} 100%)`,
    });
  };

  return (
    <div className="drawer-overlay" onClick={onClose}>
      <div className="drawer-content color-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-header">
          <div className="drawer-header-button" /> {/* Spacer */}
          <span className="drawer-title">Background</span>
          <button className="drawer-header-button" onClick={onClose}><FiCheck /></button>
        </div>
        <div className="drawer-body">
          <div className="color-controls-wrapper">
            {/* Solid Colors */}
            <div className="color-row">
              {SOLID_COLORS.map(color => (
                <div
                  key={color}
                  className={`color-swatch ${currentBackground.type === 'solid' && currentBackground.value.toLowerCase() === color.toLowerCase() ? 'active' : ''}`}
                  style={{ backgroundColor: color }}
                  onClick={() => onBackgroundChange({ type: 'solid', value: color })}
                />
              ))}
              <div className="rainbow-button">
                <input
                  type="color"
                  className="color-picker-input"
                  onChange={(e) => onBackgroundChange({ type: 'solid', value: e.target.value })}
                />
              </div>
            </div>

            {/* Gradient Colors */}
            <div className="color-row">
              {GRADIENTS.map(gradient => (
                <div
                  key={gradient}
                  className={`color-swatch ${currentBackground.type === 'gradient' && currentBackground.value === gradient ? 'active' : ''}`}
                  style={{ backgroundImage: gradient }}
                  onClick={() => onBackgroundChange({ type: 'gradient', value: gradient })}
                />
              ))}
            </div>

            {/* Custom Gradient Slider */}
            <div className="custom-gradient-row">
              <div className="custom-color-picker">
                <div className="custom-color-swatch" style={{ backgroundColor: customGradient.start }}>
                  <FiPlus />
                  <input type="color" className="color-picker-input" value={customGradient.start} onChange={(e) => handleCustomColorChange('start', e.target.value)} />
                </div>
              </div>
              <div className="custom-gradient-bar" style={{ backgroundImage: `linear-gradient(90deg, ${customGradient.start}, ${customGradient.end})` }} />
              <div className="custom-color-picker">
                <div className="custom-color-swatch" style={{ backgroundColor: customGradient.end }}>
                  <FiPlus />
                  <input type="color" className="color-picker-input" value={customGradient.end} onChange={(e) => handleCustomColorChange('end', e.target.value)} />
                </div>
              </div>
            </div>

            {/* Gradient Direction */}
            <div className="gradient-direction-row">
              <button onClick={() => handleDirectionChange(270)} title="Gradient Up"><FiArrowUp /></button>
              <button onClick={() => handleDirectionChange(90)} title="Gradient Down"><FiArrowDown /></button>
              <button onClick={() => handleDirectionChange(180)} title="Gradient Left"><FiArrowLeft /></button>
              <button onClick={() => handleDirectionChange(0)} title="Gradient Right"><FiArrowRight /></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ColorDrawer;