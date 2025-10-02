import { useState } from 'react';
import './SizeDrawer.css';
import { FaCheck } from 'react-icons/fa';
import { LuRectangleVertical, LuSquare, LuRectangleHorizontal } from 'react-icons/lu';

const SIZE_OPTIONS = [
  {
    aspectRatio: '9/16',
    icon: <LuRectangleVertical />,
  },
  {
    aspectRatio: '1/1',
    icon: <LuSquare />,
  },
  {
    aspectRatio: '16/9',
    icon: <LuRectangleHorizontal />,
  },
];

function SizeDrawer({ onClose, onCanvasSizeChange, currentSize }) { // Renamed from sizedrawer
  const [selectedSize, setSelectedSize] = useState(currentSize);

  const handleConfirm = () => {
    onClose();
  };

  const handleSizeClick = (aspectRatio) => {
    setSelectedSize(aspectRatio);
    onCanvasSizeChange(aspectRatio); // Apply change immediately
  };

  return (
    <div className="drawer-overlay" onClick={handleConfirm}>
      <div className="drawer-content size-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-header">
          <div className="drawer-header-button" /> {/* Spacer */}
          <span className="drawer-title flex-grow">Format</span>
          <button className="drawer-header-button" onClick={handleConfirm}><FaCheck /></button>
        </div>
        <div className="drawer-body">
          {SIZE_OPTIONS.map((option) => (
            <div
              key={option.aspectRatio}
              className={`size-option-button ${selectedSize === option.aspectRatio ? 'active' : ''}`}
              onClick={() => handleSizeClick(option.aspectRatio)}
            >
              <div className="size-option-icon-wrapper">
                {option.icon}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SizeDrawer; // Correctly export the component