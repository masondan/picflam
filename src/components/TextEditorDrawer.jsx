import { useState } from 'react';
import './TextEditorDrawer.css';
import { FaCheck } from 'react-icons/fa';
import {
  FiType, FiSliders, FiPalette, FiMoreHorizontal,
} from 'react-icons/fi';

function TextEditorDrawer({
  onClose,
  slide,
  onUpdate,
}) {
  const [activeTab, setActiveTab] = useState('input'); // 'input', 'size', 'color', 'style'
  const [localActiveTextElement, setLocalActiveTextElement] = useState('text1');

  const handleUpdate = (key, value) => {
    onUpdate({ [`${localActiveTextElement}${key}`]: value });
  };

  const activeTextProps = {
    text: slide[localActiveTextElement],
    size: slide[`${localActiveTextElement}Size`],
    yPosition: slide[`${localActiveTextElement}YPosition`],
    font: slide[`${localActiveTextElement}Font`],
    color: slide[`${localActiveTextElement}Color`],
    isBold: slide[`${localActiveTextElement}IsBold`],
    isItalic: slide[`${localActiveTextElement}IsItalic`],
    align: slide[`${localActiveTextElement}Align`],
    lineSpacing: slide[`${localActiveTextElement}LineSpacing`],
  };

  // Specific props for Text 1
  if (localActiveTextElement === 'text1') {
    activeTextProps.highlightColor = slide.text1HighlightColor;
    activeTextProps.hasShadow = slide.text1HasShadow;
    activeTextProps.hasOutline = slide.text1HasOutline;
    activeTextProps.quoteStyle = slide.text1QuoteStyle;
    activeTextProps.quoteSize = slide.text1QuoteSize;
  } else { // Specific props for Text 2
    activeTextProps.labelColor = slide.text2LabelColor;
    activeTextProps.labelTransparency = slide.text2LabelTransparency;
  }

  return (
    <div className="drawer-overlay" onClick={onClose}>
      <div className="drawer-content text-editor-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-header">
          <div className="text-toggle-buttons">
            <button
              className={`text-toggle-button ${localActiveTextElement === 'text1' ? 'active' : ''}`}
              onClick={() => setLocalActiveTextElement('text1')}
            >
              Text 1
            </button>
            <button
              className={`text-toggle-button ${localActiveTextElement === 'text2' ? 'active' : ''}`}
              onClick={() => setLocalActiveTextElement('text2')}
            >
              Text 2
            </button>
          </div>
          <button className="drawer-header-button" onClick={onClose}><FaCheck /></button>
        </div>

        <div className="text-editor-body">
          <div className="style-icons-tab-row">
            <button className={`style-icon-button ${activeTab === 'input' ? 'active' : ''}`} onClick={() => setActiveTab('input')}><FiType /></button>
            <button className={`style-icon-button ${activeTab === 'size' ? 'active' : ''}`} onClick={() => setActiveTab('size')}><FiSliders /></button>
            <button className={`style-icon-button ${activeTab === 'color' ? 'active' : ''}`} onClick={() => setActiveTab('color')}><FiPalette /></button>
            <button className={`style-icon-button ${activeTab === 'style' ? 'active' : ''}`} onClick={() => setActiveTab('style')}><FiMoreHorizontal /></button>
          </div>

          {activeTab === 'input' && (
            <textarea
              className="text-input-area"
              value={activeTextProps.text}
              onChange={(e) => handleUpdate('', e.target.value)}
              placeholder={`Enter ${localActiveTextElement === 'text1' ? 'Text 1' : 'Text 2'}...`}
            />
          )}
          {/* Add other tabs' content here in future steps */}
        </div>
      </div>
    </div>
  );
}

export default TextEditorDrawer;