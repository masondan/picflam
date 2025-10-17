import { useState, useEffect, useRef } from 'react';
import { FiPlus, FiArrowUp, FiArrowDown, FiArrowLeft, FiArrowRight, FiCheck } from 'react-icons/fi';
import { HexColorPicker } from 'react-colorful';
import './ColorDrawer.css';

function ColorPickerButton({ color, onChange, isActive, showRainbow = true }) {
  const [showPicker, setShowPicker] = useState(false);
  const pickerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setShowPicker(false);
      }
    };

    if (showPicker) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showPicker]);

  const buttonClass = showRainbow && !color ? 'rainbow-button' : 'color-button';
  const displayColor = color || '#8A2BE2';

  return (
    <div className="color-picker-wrapper" ref={pickerRef}>
      <div 
        className={`${buttonClass} ${isActive ? 'active' : ''}`}
        onClick={() => setShowPicker(!showPicker)}
        style={{ backgroundColor: displayColor }}
      >
        {!showPicker && <FiPlus className="plus-icon" />}
      </div>
      {showPicker && (
        <div className="color-picker-popover">
          <HexColorPicker color={displayColor} onChange={onChange} />
        </div>
      )}
    </div>
  );
}

const SOLID_COLORS = ['#FFFFFF', '#000000', '#007C1F', '#00679D', '#B20715'];
const GRADIENTS = [
  'linear-gradient(135deg, #8A2BE2 0%, #4B0082 100%)',
  'linear-gradient(135deg, #15509B 0%, #20244F 100%)',
  'linear-gradient(135deg, #A8076B 0%, #62045F 100%)',
  'linear-gradient(135deg, #EA5C56 0%, #3C0C40 100%)',
  'linear-gradient(135deg, #0A8F9D 0%, #202B54 100%)',
  'linear-gradient(135deg, #D17A29 0%, #41363C 100%)',
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
    start: '#8A2BE2',
    end: '#4B0082',
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
              <ColorPickerButton
                onChange={(color) => onBackgroundChange({ type: 'solid', value: color })}
                isActive={currentBackground.type === 'solid' && !SOLID_COLORS.includes(currentBackground.value.toUpperCase())}
                color={currentBackground.type === 'solid' && !SOLID_COLORS.includes(currentBackground.value.toUpperCase()) ? currentBackground.value : null}
                key={currentBackground.type === 'solid' ? currentBackground.value : 'rainbow'}
              />
            </div>

            {/* Gradient Colors */}
            <div className="color-row">
              {GRADIENTS.map(gradient => (
                <div
                  key={gradient}
                  className={`color-swatch gradient-swatch ${currentBackground.type === 'gradient' && currentBackground.value === gradient ? 'active' : ''}`}
                  onClick={() => onBackgroundChange({ type: 'gradient', value: gradient })}
                >
                  <div className="gradient-inner" style={{ backgroundImage: gradient }} />
                </div>
              ))}
            </div>

            {/* Custom Gradient Slider */}
            <div className="custom-gradient-row">
              <ColorPickerButton 
                color={customGradient.start}
                onChange={(color) => handleCustomColorChange('start', color)}
                showRainbow={false}
              />
              <div className="custom-gradient-bar" style={{ backgroundImage: `linear-gradient(90deg, ${customGradient.start}, ${customGradient.end})` }} />
              <ColorPickerButton 
                color={customGradient.end}
                onChange={(color) => handleCustomColorChange('end', color)}
                showRainbow={false}
              />
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