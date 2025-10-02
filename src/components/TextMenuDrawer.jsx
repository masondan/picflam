import './TextMenuDrawer.css';
import { FaCheck } from 'react-icons/fa';

function TextMenuDrawer({ onClose, onText1Click, onText2Click }) {
  return (
    <div className="drawer-overlay" onClick={onClose}>
      <div className="drawer-content text-menu-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-header">
          <div className="drawer-header-button" />
          <span className="drawer-title flex-grow">Text</span>
          <button className="drawer-header-button" onClick={onClose}><FaCheck /></button>
        </div>
        <div className="drawer-body">
          <button className="text-option-button" onClick={onText1Click}>
            <div className="text-icon">T1</div>
          </button>
          <button className="text-option-button" onClick={onText2Click}>
            <div className="text-icon">T2</div>
          </button>
        </div>
      </div>
    </div>
  );
}

export default TextMenuDrawer;
