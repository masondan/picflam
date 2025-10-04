import { FiSquare, FiSmartphone, FiFilm, FiCheck } from 'react-icons/fi';
import './SizeDrawer.css';

function SizeDrawer({ onClose, onCanvasSizeChange, currentSize }) {
  const sizes = [
    { id: '1/1', icon: <FiSquare />, label: 'Square' },
    { id: '9/16', icon: <FiSmartphone />, label: 'Portrait' },
    { id: '16/9', icon: <FiFilm />, label: 'Landscape' },
  ];

  return (
    <div className="drawer-overlay" onClick={() => onClose(false)}>
      <div className="drawer-content size-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-body">
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
          <button className="drawer-confirm-button" onClick={() => onClose(true)}>
            <FiCheck />
          </button>
        </div>
      </div>
    </div>
  );
}

export default SizeDrawer;
