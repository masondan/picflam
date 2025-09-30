import './SizeDrawer.css';
import { FiX, FiCheck, FiSmartphone, FiSquare, FiMonitor } from 'react-icons/fi';
import { useState } from 'react';

const SIZE_OPTIONS = [
  {
    name: 'Portrait',
    aspectRatio: '9/16',
    icon: <FiSmartphone />,
  },
  {
    name: 'Square',
    aspectRatio: '1/1',
    icon: <FiSquare />,
  },
  {
    name: 'Landscape',
    aspectRatio: '16/9',
    icon: <FiMonitor />,
  },
];

function SizeDrawer({ onClose, onSizeSelect, currentSize, onCanvasSizeChange }) {
  const [selectedSize, setSelectedSize] = useState(currentSize);

  const handleConfirm = () => {
    onClose(true); // Just close the drawer, confirming the change
  };

  return (
    <div className="drawer-overlay" onClick={() => onClose(false)}>
      <div className="drawer-content" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-header">
          <button className="drawer-header-button" onClick={() => onClose(false)}><FiX /></button>
          <span className="drawer-title">Canvas Size</span>
          <button className="drawer-header-button" onClick={handleConfirm}><FiCheck /></button>
        </div>
        <div className="drawer-body">
          {SIZE_OPTIONS.map((option) => (
            <button
              key={option.name}
              className={`size-option-button ${selectedSize === option.aspectRatio ? 'active' : ''}`}
              onClick={() => {
                setSelectedSize(option.aspectRatio);
                onCanvasSizeChange(option.aspectRatio); // Live update the canvas
              }}
            >
              {option.icon}
              <span>{option.aspectRatio}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SizeDrawer;