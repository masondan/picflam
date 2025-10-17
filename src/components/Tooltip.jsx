import React from 'react';
import { SlClose } from 'react-icons/sl';
import './Tooltip.css';

function Tooltip({ message, onClose }) {
  return (
    <div className="tooltip">
      <div className="tooltip-content">
        <p>{message}</p>
        <button className="tooltip-close" onClick={onClose}>
          <SlClose />
        </button>
      </div>
    </div>
  );
}

export default Tooltip;
