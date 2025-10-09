import './TextMenuDrawer.css';
import { FiCheck } from 'react-icons/fi';

function TextMenuDrawer({ onClose, onText1Click, onText2Click }) {
  return (
    <div className="drawer-overlay" onClick={onClose}>
      <div className="drawer-content text-menu-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-body">
          <div className="text-menu-buttons-wrapper">
            <button className="text-menu-button" onClick={onText1Click}>Text 1</button>
            <button className="text-menu-button" onClick={onText2Click}>Text 2</button>
          </div>
          <button className="drawer-confirm-button" onClick={onClose}><FiCheck /></button>
        </div>
      </div>
    </div>
  );
}

export default TextMenuDrawer;