import { useState } from 'react';
import './Text1InputDrawer.css';
import { FaCheck } from 'react-icons/fa';
import {
  FiType, FiSliders, FiDroplet, FiMoreHorizontal,
} from 'react-icons/fi';

function Text1InputDrawer({
  onClose,
  onConfirm,
  activeTextElement,
  text,
  onTextChange,
  size,
  onSizeChange,
  yPosition,
  onYPositionChange,
  font,
  onFontChange,
  color,
  onColorChange,
  highlightColor,
  onHighlightColorChange,
  isBold,
  onIsBoldChange,
  isItalic,
  onIsItalicChange,
  textAlign,
  onTextAlignChange,
  lineSpacing,
  onLineSpacingChange,
  hasShadow,
  onHasShadowChange,
  hasOutline,
  onHasOutlineChange,
  quoteStyle,
  onQuoteStyleChange,
  quoteSize,
  onQuoteSizeChange,
  hasLabel,
  onHasLabelChange,
  labelColor,
  onLabelColorChange,
  labelTransparency,
  onLabelTransparencyChange,
}) {
  const [activeTab, setActiveTab] = useState('input'); // 'input', 'size', 'color', 'style'

  const handleConfirmClick = () => {
    onConfirm();
  };

  return (
    <div className="drawer-overlay" onClick={handleConfirmClick}>
      <div className="drawer-content text1-input-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-header">
          <div className="drawer-header-button" />
          <span className="drawer-title flex-grow">{activeTextElement === 'text1' ? 'Text 1' : 'Text 2'}</span>
          <button className="drawer-header-button" onClick={handleConfirmClick}><FaCheck /></button>
        </div>

        <div className="text1-drawer-body">
          <div className="style-icons-tab-row">
            <button className={`style-icon-button ${activeTab === 'input' ? 'active' : ''}`} onClick={() => setActiveTab('input')}><FiType /></button>
            <button className={`style-icon-button ${activeTab === 'size' ? 'active' : ''}`} onClick={() => setActiveTab('size')}><FiSliders /></button>
            <button className={`style-icon-button ${activeTab === 'color' ? 'active' : ''}`} onClick={() => setActiveTab('color')}><FiDroplet /></button>
            <button className={`style-icon-button ${activeTab === 'style' ? 'active' : ''}`} onClick={() => setActiveTab('style')}><FiMoreHorizontal /></button>
          </div>

          {activeTab === 'input' && (
            <textarea
              className="text-input-area"
              value={text}
              onChange={(e) => onTextChange(e.target.value)}
              placeholder={`Enter ${activeTextElement === 'text1' ? 'Text 1' : 'Text 2'}...`}
            />
          )}
          {/* Add other tabs' content here in future steps */}
        </div>
      </div>
    </div>
  );
}

export default Text1InputDrawer;