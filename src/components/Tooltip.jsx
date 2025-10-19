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
      const textContainer = tooltipRef.current.querySelector('.tooltip-text-area');
      if (!textContainer) return;

      const measurementNode = document.createElement('div');
      document.body.appendChild(measurementNode);

      const style = window.getComputedStyle(textContainer);
      const h3Style = window.getComputedStyle(textContainer.querySelector('h3'));
      const pStyle = window.getComputedStyle(textContainer.querySelector('p'));

      measurementNode.style.width = style.width;
      measurementNode.style.visibility = 'hidden';
      measurementNode.style.position = 'absolute';
      measurementNode.style.top = '-9999px';

      let maxHeight = 0;
      content.forEach(item => {
        measurementNode.innerHTML = `
          <h3 style="font-family: ${h3Style.fontFamily}; font-size:${h3Style.fontSize}; font-weight:${h3Style.fontWeight}; margin-top:${h3Style.marginTop}; margin-bottom:${h3Style.marginBottom}; text-align:center;">${item.title}</h3>
          <p style="font-family: ${pStyle.fontFamily}; font-size:${pStyle.fontSize}; font-weight:${pStyle.fontWeight}; line-height:${pStyle.lineHeight}; text-align:center;">${item.text}</p>
        `;
        if (measurementNode.scrollHeight > maxHeight) {
          maxHeight = measurementNode.scrollHeight;
        }
      });

      document.body.removeChild(measurementNode);

      if (maxHeight > 0) {
        setContentHeight(`${maxHeight}px`);
      }

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