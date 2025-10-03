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
  return (
    <div className="drawer-overlay" onClick={() => onClose(false)}>
      <div className="drawer-content size-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-body">
          {SIZE_OPTIONS.map((option) => (
            <div
              key={option.aspectRatio}
              className={`size-option-button ${currentSize === option.aspectRatio ? 'active' : ''}`}
              onClick={() => onCanvasSizeChange(option.aspectRatio)}
            >
              <div className="size-option-icon-wrapper">
                {option.icon}
              </div>
            </div>
          ))}
          <div className="drawer-button-divider" />
          <button className="drawer-confirm-button" onClick={() => onClose(true)}><FaCheck /></button>
        </div>
      </div>
    </div>
  );
}

export default SizeDrawer; // Correctly export the component