import './TextMenuDrawer.css';
import { FiChevronLeft, FiType } from 'react-icons/fi';

function TextMenuDrawer({ onClose, onText1Click, onText2Click, activeTextElement }) {
  return (
    <div className="drawer-overlay" onClick={onClose}>
      <div className="drawer-content dark-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-header">
          <button className="drawer-header-button" onClick={onClose}><FiChevronLeft /></button>
          <div className="text-menu-buttons">
            <button className={`text-menu-button ${activeTextElement === 'text1' ? 'active' : ''}`} onClick={onText1Click}>
              <FiType />
              <span>Text 1</span>
            </button>
            <button className={`text-menu-button ${activeTextElement === 'text2' ? 'active' : ''}`} onClick={onText2Click}>
              <FiType />
              <span>Text 2</span>
            </button>
          </div>
          {/* Placeholder for a right-side button if needed */}
          <div style={{ width: '40px' }}></div>
        </div>
      </div>
    </div>
  );
}

export default TextMenuDrawer;