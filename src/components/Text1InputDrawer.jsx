import { useState } from 'react';
import {
  FiX,
  FiCheck,
  FiEdit2,
  FiMove,
  FiType,
  FiBold,
  FiItalic,
  FiAlignLeft,
  FiAlignCenter,
  FiAlignRight,
  FiUnderline,
  FiLayers,
  FiTag,
} from 'react-icons/fi';
import { ImQuotesLeft, ImFont } from 'react-icons/im';
import { CgColorPicker } from "react-icons/cg";
import './Text1InputDrawer.css';

const FONT_OPTIONS = [
  // Sans-serif
  { name: 'Inter', family: 'Inter, sans-serif' },
  { name: 'Roboto', family: 'Roboto, sans-serif' },
  { name: 'R. Mono', family: '"Roboto Mono", monospace' },
  // Serif
  { name: 'Lora', family: 'Lora, serif' },
  { name: 'Playfair', family: '"Playfair Display", serif' },
  { name: 'R. Slab', family: '"Roboto Slab", serif' },
  // Handwriting
  { name: 'Caveat', family: 'Caveat, cursive' },
  { name: 'D. Script', family: '"Dancing Script", cursive' },
  { name: 'Pacifico', family: 'Pacifico, cursive' },
];

const COLOR_SWATCHES = [
  '#FFFFFF', '#000000', '#FF3B30', '#FF9500', '#34C759', '#5856D6'
];

const HIGHLIGHT_SWATCHES = [
  '#FFD700', '#FF69B4', '#00FFFF', '#7FFF00', '#FF4500', '#9400D3'
];


function Text1InputDrawer({
  activeTextElement,
  onClose,
  onConfirm,
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
  const [activeTab, setActiveTab] = useState('edit');

  const handleConfirm = () => {
    onConfirm();
  };

  const handleLabelColorChange = (newColor) => {
    onLabelColorChange(newColor);
    if (newColor !== 'transparent' && !hasLabel) {
      onHasLabelChange(true);
    }
  };

  return (
    <div className="drawer-overlay" onClick={() => onClose(false)}>
      <div
        className="drawer-content text-input-drawer"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="drawer-header">
          <button className="drawer-header-button" onClick={() => onClose(false)}>
            <FiX />
          </button>
          <div className="style-icons-tab-row">
            <button className={`style-icon-button ${activeTab === 'edit' ? 'active' : ''}`} onClick={() => setActiveTab('edit')} title="Text Edit"><FiEdit2 /></button>
            <button className={`style-icon-button ${activeTab === 'font' ? 'active' : ''}`} onClick={() => setActiveTab('font')} title="Font"><ImFont /></button>
            <button className={`style-icon-button ${activeTab === 'position' ? 'active' : ''}`} onClick={() => setActiveTab('position')} title="Text Size and Position"><FiMove /></button>
            <button className={`style-icon-button ${activeTab === 'color' ? 'active' : ''}`} onClick={() => setActiveTab('color')} title="Text Colour"><CgColorPicker /></button>
            <button className={`style-icon-button ${activeTab === 'style' ? 'active' : ''}`} onClick={() => setActiveTab('style')} title="Style"><FiType /></button>
            {activeTextElement === 'text1' ? (
              <button className={`style-icon-button ${activeTab === 'quotes' ? 'active' : ''}`} onClick={() => setActiveTab('quotes')} title="Quotes"><ImQuotesLeft /></button>
            ) : (
              <button className={`style-icon-button ${activeTab === 'label' ? 'active' : ''}`} onClick={() => setActiveTab('label')} title="Label"><FiTag /></button>
            )}
          </div>
          <button className="drawer-header-button" onClick={handleConfirm}>
            <FiCheck />
          </button>
        </div>
        <div className="text-input-body">
          {activeTab === 'edit' && (
            <textarea
              className="text-input-area"
              value={text}
              onChange={(e) => onTextChange(e.target.value)}
              placeholder="Start typing..."
              autoFocus
            ></textarea>
          )}
          {activeTab === 'position' && (
            <div className="slider-controls">
              <div className="slider-group">
                <label>Size</label>
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="0.1"
                  value={size}
                  onChange={(e) => onSizeChange(parseFloat(e.target.value))}
                />
                <span>{size.toFixed(1)}</span>
              </div>
              <div className="slider-group">
                <label>Position</label>
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="0.1"
                  value={yPosition}
                  onChange={(e) => onYPositionChange(parseFloat(e.target.value))}
                />
                <span>{yPosition.toFixed(1)}</span>
              </div>
            </div>
          )}
          {activeTab === 'font' && (
            <div className="font-options">
              {FONT_OPTIONS.map((fontOption) => (
                <button
                  key={fontOption.name}
                  className={`font-option-button ${font === fontOption.name ? 'active' : ''}`}
                  style={{ fontFamily: fontOption.family }}
                  onClick={() => onFontChange(fontOption.name)}
                >
                  {fontOption.name}
                </button>
              ))}
            </div>
          )}
          {activeTab === 'color' && (
            <div className="color-controls">
              <div className="color-group">
                <label>Text Colour</label>
                <div className="swatch-list">
                  {COLOR_SWATCHES.map((swatchColor) => (
                    <button
                      key={swatchColor}
                      className="color-swatch"
                      style={{ backgroundColor: swatchColor }}
                      onClick={() => onColorChange(swatchColor)}
                    />
                  ))}
                  <div className="rainbow-button">
                    <input type="color" className="color-picker-input" value={color} onChange={(e) => onColorChange(e.target.value)} />
                  </div>
                </div>
              </div>
              <div className="color-group">
                <label>Highlight Colour</label>
                <div className="swatch-list">
                  {HIGHLIGHT_SWATCHES.map((swatchColor) => (
                    <button
                      key={swatchColor}
                      className="color-swatch"
                      style={{ backgroundColor: swatchColor }}
                      onClick={() => onHighlightColorChange(swatchColor)}
                    />
                  ))}
                  <div className="rainbow-button">
                    <input type="color" className="color-picker-input" value={highlightColor} onChange={(e) => onHighlightColorChange(e.target.value)} />
                  </div>
                </div>
              </div>
            </div>
          )}
          {activeTab === 'style' && (
            <div className="style-controls">
              <div className="style-button-row">
                <button className={`style-toggle-button ${isBold ? 'active' : ''}`} onClick={() => onIsBoldChange(!isBold)} title="Bold"><FiBold /></button>
                <button className={`style-toggle-button ${isItalic ? 'active' : ''}`} onClick={() => onIsItalicChange(!isItalic)} title="Italic"><FiItalic /></button>
                <button className={`style-toggle-button ${hasShadow ? 'active' : ''}`} onClick={() => onHasShadowChange(!hasShadow)} title="Shadow"><FiLayers /></button>
                <button className={`style-toggle-button ${hasOutline ? 'active' : ''}`} onClick={() => onHasOutlineChange(!hasOutline)} title="Outline"><FiUnderline /></button>
                <button className={`style-toggle-button ${textAlign === 'left' ? 'active' : ''}`} onClick={() => onTextAlignChange('left')}><FiAlignLeft /></button>
                <button className={`style-toggle-button ${textAlign === 'center' ? 'active' : ''}`} onClick={() => onTextAlignChange('center')}><FiAlignCenter /></button>
                <button className={`style-toggle-button ${textAlign === 'right' ? 'active' : ''}`} onClick={() => onTextAlignChange('right')}><FiAlignRight /></button>
              </div>
              <div className="slider-group single-line-slider">
                <label>Line Spacing</label>
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="0.1"
                  value={lineSpacing}
                  onChange={(e) => onLineSpacingChange(parseFloat(e.target.value))}
                />
                <span>{lineSpacing.toFixed(1)}</span>
              </div>
            </div>
          )}
          {activeTab === 'quotes' && (
            <div className="style-controls">
              <div className="style-button-row">
                <button className={`style-toggle-button ${quoteStyle === 'none' ? 'active' : ''}`} onClick={() => onQuoteStyleChange('none')} title="No Quote">None</button>
                <button className={`style-toggle-button quote-preview-serif ${quoteStyle === 'serif' ? 'active' : ''}`} onClick={() => onQuoteStyleChange('serif')} title="Saira Stencil One">“</button>
                <button className={`style-toggle-button quote-preview-slab ${quoteStyle === 'slab' ? 'active' : ''}`} onClick={() => onQuoteStyleChange('slab')} title="Ultra">“</button>
                <button className={`style-toggle-button quote-preview-fancy ${quoteStyle === 'fancy' ? 'active' : ''}`} onClick={() => onQuoteStyleChange('fancy')} title="Playfair Display SC">“</button>
              </div>
              <div className="slider-group single-line-slider">
                <label>Quote Size</label>
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="0.1"
                  value={quoteSize}
                  onChange={(e) => onQuoteSizeChange(parseFloat(e.target.value))}
                />
                <span>{quoteSize.toFixed(1)}</span>
              </div>
            </div>
          )}
          {activeTab === 'label' && (
            <div className="style-controls">
              <div className="color-group">
                <label>Label Colour</label>
                <div className="swatch-list">
                  <button className="chequered-button" onClick={() => onLabelColorChange('transparent')} title="No Label"></button>
                  {HIGHLIGHT_SWATCHES.map((swatchColor) => (
                    <button
                      key={swatchColor}
                      className="color-swatch"
                      style={{ backgroundColor: swatchColor }}
                      onClick={() => handleLabelColorChange(swatchColor)}
                    />
                  ))}
                  <div className="rainbow-button">
                    <input type="color" className="color-picker-input" value={labelColor} onChange={(e) => handleLabelColorChange(e.target.value)} />
                  </div>
                </div>
              </div>
              <div className="slider-group single-line-slider">
                <label>Transparency</label>
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="0.1"
                  value={labelTransparency}
                  onChange={(e) => onLabelTransparencyChange(parseFloat(e.target.value))}
                />
                <span>{labelTransparency.toFixed(1)}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Text1InputDrawer;
