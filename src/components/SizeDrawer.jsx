import { FiChevronLeft } from 'react-icons/fi';
import { LuRectangleVertical, LuSquare, LuRectangleHorizontal } from 'react-icons/lu';
import './SizeDrawer.css';

function SizeDrawer({ onClose, onCanvasSizeChange, currentSize }) {
  const sizes = [
    { id: '9/16', icon: <LuRectangleVertical />, label: 'Portrait' },
    { id: '1/1', icon: <LuSquare />, label: 'Square' },
    { id: '16/9', icon: <LuRectangleHorizontal />, label: 'Landscape' },
  ];

  return (
    <div className="drawer-overlay" onClick={() => onClose(false)}>
      <div className="drawer-content size-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-body">
          <button className="drawer-back-button" onClick={() => onClose(false)}>
            <FiChevronLeft />
          </button>
          <div className="size-options-wrapper">
            {sizes.map((size) => (
              <button
                key={size.id}
                className={`size-option-button ${currentSize === size.id ? 'active' : ''}`}
                onClick={() => onCanvasSizeChange(size.id)}
                title={size.label}
              >
                <div className="size-option-icon-wrapper">{size.icon}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SizeDrawer;