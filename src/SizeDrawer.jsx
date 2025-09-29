import './SizeDrawer.css';
import { FiX, FiCheck, FiSmartphone, FiSquare, FiMonitor } from 'react-icons/fi';

function SizeDrawer({ onClose }) {
  return (
    <div className="drawer-overlay" onClick={onClose}>
      <div className="drawer-content" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-header">
          <button className="drawer-header-button" onClick={onClose}><FiX /></button>
          <span className="drawer-title">Canvas Size</span>
          <button className="drawer-header-button"><FiCheck /></button>
        </div>
        <div className="drawer-body">
          <button className="size-option-button"><FiSmartphone /><span>9:16</span></button>
          <button className="size-option-button"><FiSquare /><span>1:1</span></button>
          <button className="size-option-button"><FiMonitor /><span>16:9</span></button>
        </div>
      </div>
    </div>
  );
}

export default SizeDrawer;