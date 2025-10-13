import { useState } from 'react';
import './Text1Drawer.css';
import {
  FiChevronLeft,
  FiEdit2,
  FiMove,
  FiDroplet,
  FiBold,
} from 'react-icons/fi';
import { ImQuotesLeft, ImFont } from 'react-icons/im';

function Text1Drawer({ onClose, onConfirm, initialText }) {
  const [text, setText] = useState(initialText);

  const handleConfirm = () => {
    onConfirm(text);
  };

  return (
    <div className="drawer-overlay" onClick={() => onClose(false)}>
      <div
        className="drawer-content text-input-drawer"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="drawer-header">
          <button className="drawer-header-button" onClick={() => onClose(false)}>
            <FiChevronLeft />
          </button>
          <span className="drawer-title">Text 1</span>
        </div>
        <div className="text1-drawer-body">
          <div className="style-icons">
            <button className="style-icon-button active"><FiEdit2 /></button>
            <button className="style-icon-button"><ImFont /></button>
            <button className="style-icon-button"><FiMove /></button>
            <button className="style-icon-button"><FiDroplet /></button>
            <button className="style-icon-button"><FiBold /></button>
            <button className="style-icon-button"><ImQuotesLeft /></button>
          </div>
          <textarea
            className="text-input-area"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Start typing..."
            autoFocus
          ></textarea>
        </div>
      </div>
    </div>
  );
}

export default Text1Drawer;