import React, { useState, useEffect, useRef } from 'react';
import { SlClose } from 'react-icons/sl';
import { IoArrowBackCircle, IoArrowForwardCircle } from 'react-icons/io5';
import './Tooltip.css';

function Tooltip({ content, show, onClose }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [contentHeight, setContentHeight] = useState('auto');
  const tooltipRef = useRef(null);

  useEffect(() => {
    if (show && content && content.length > 0 && tooltipRef.current) {
      // On show, calculate the max height required by any step
      let maxHeight = 0;
      const measurementNode = document.createElement('div');
      // Apply key styles that affect height
      measurementNode.style.width = tooltipRef.current.offsetWidth + 'px';
      measurementNode.style.padding = '0 1.5rem'; // Match tooltip content padding
      measurementNode.style.visibility = 'hidden';
      measurementNode.style.position = 'absolute';
      measurementNode.style.top = '-9999px';
      document.body.appendChild(measurementNode);

      content.forEach(item => {
        // Render the content into the measurement node
        measurementNode.innerHTML = `
          <div class="tooltip-content">
            <h3>${item.title}</h3>
            <p>${item.text}</p>
          </div>
        `;
        if (measurementNode.scrollHeight > maxHeight) {
          maxHeight = measurementNode.scrollHeight;
        }
      });

      document.body.removeChild(measurementNode);

      if (maxHeight > 0) {
        setContentHeight(`${maxHeight}px`);
      }

      // Reset to the first step whenever the tooltip is re-opened
      setCurrentStep(0);
    }
  }, [show, content]);

  if (!show || !content || content.length === 0) {
    return null;
  }

  const handleNext = () => {
    if (currentStep < content.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose(); // Finish on the last step
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const { title, text } = content[currentStep];

  return (
    <div className="tooltip" ref={tooltipRef}>
      <div className="tooltip-content-wrapper">
        <button className="tooltip-close" onClick={onClose}>
          <SlClose />
        </button>
        <div className="tooltip-text-area" style={{ minHeight: contentHeight }}>
          <h3>{title}</h3>
          <p>{text}</p>
        </div>
        <div className="tooltip-footer">
            <button className={`tooltip-arrow-btn ${currentStep === 0 ? 'inactive' : ''}`} onClick={handlePrev}>
                <IoArrowBackCircle />
            </button>
            <div className="tooltip-progress-dots">
                {content.map((_, index) => (
                <span
                    key={index}
                    className={`dot ${currentStep === index ? 'active' : ''}`}
                ></span>
                ))}
            </div>
            <button className={`tooltip-arrow-btn ${currentStep === content.length - 1 ? 'inactive' : ''}`} onClick={handleNext}>
                <IoArrowForwardCircle />
            </button>
        </div>
      </div>
    </div>
  );
}

export default Tooltip;