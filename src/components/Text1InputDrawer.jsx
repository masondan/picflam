import { useState } from 'react';
import './Text1InputDrawer.css';
import { FaCheck } from 'react-icons/fa';
import { FiChevronDown, FiChevronUp, FiEdit3, FiMove, FiCheck } from 'react-icons/fi';
import { RxFontFamily } from 'react-icons/rx';
import {
  RxFontBold,
  RxFontItalic,
  RxTextAlignLeft,
  RxTextAlignCenter,
  RxTextAlignRight,
} from 'react-icons/rx';
import { MdOutlineColorLens, MdFormatLineSpacing } from 'react-icons/md';
import { LuSettings2, LuTag } from 'react-icons/lu';
import { BsLayers } from 'react-icons/bs';
import { FaBan } from 'react-icons/fa';
import { ImQuotesLeft } from 'react-icons/im';
import { BiSolidQuoteLeft } from 'react-icons/bi';

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
  hasLabel, // This prop is now used for the toggle state
  onHasLabelChange,
  labelColor,
  onLabelColorChange,
  labelTransparency,
  onLabelTransparencyChange,
}) {
  const [activeTab, setActiveTab] = useState('edit'); // 'edit', 'font', 'size', 'color', 'style'
  const [colorTarget, setColorTarget] = useState('text'); // 'text', 'highlight', or 'label'
  const [isMinimized, setIsMinimized] = useState(false);

  const handleTabClick = (tab) => {
    if (isMinimized) {
      setIsMinimized(false);
    }
    setActiveTab(tab);
  };

  const handleConfirmClick = () => {
    onConfirm();
  };

  const fonts = [
    { name: 'Inter', family: 'Inter' },
    { name: 'Roboto', family: 'Roboto Slab' },
    { name: 'Saira', family: 'Saira Condensed' },
    { name: 'Lora', family: 'Lora' },
    { name: 'Playfair', family: 'Playfair Display' },
    { name: 'Elite', family: 'Special Elite' },
  ];

  const colorSwatches = [
    '#FFFFFF', '#000000', '#FFD700', '#8A2BE2', '#FF4500', '#1E90FF'
  ];

  const handleColorSwatchClick = (newColor) => {
    if (colorTarget === 'text') {
      onColorChange(newColor);
    } else {
      onHighlightColorChange(newColor);
    }

    if (colorTarget === 'label') {
      onLabelColorChange(newColor);
    }
  };

  return (
    <div className="drawer-overlay" onClick={handleConfirmClick}>
      <div className={`drawer-content text-editor-drawer ${isMinimized ? 'minimized' : ''}`} onClick={(e) => e.stopPropagation()}>
        <div className="text-editor-header">
          <button className="drawer-header-button" onClick={() => setIsMinimized(!isMinimized)}>
            {isMinimized ? <FiChevronUp /> : <FiChevronDown />}
          </button>
          <div className="text-editor-tabs">
            <button className={`style-icon-button ${activeTab === 'edit' ? 'active' : ''}`} onClick={() => handleTabClick('edit')}><FiEdit3 /></button>
            <button className={`style-icon-button ${activeTab === 'font' ? 'active' : ''}`} onClick={() => handleTabClick('font')}><RxFontFamily /></button>
            <button className={`style-icon-button ${activeTab === 'size' ? 'active' : ''}`} onClick={() => handleTabClick('size')}><FiMove /></button>
            <button className={`style-icon-button ${activeTab === 'color' ? 'active' : ''}`} onClick={() => handleTabClick('color')}><MdOutlineColorLens /></button>
            <button className={`style-icon-button ${activeTab === 'style' ? 'active' : ''}`} onClick={() => handleTabClick('style')}><LuSettings2 /></button>
          </div>
          <button className="drawer-header-button" onClick={handleConfirmClick}><FiCheck /></button>
        </div>
        <div className="text-editor-content">
            {activeTab === 'edit' && (
              <div className="edit-tab-content">
                <textarea
                  className="text-input-area"
                  value={text}
                  onChange={(e) => onTextChange(e.target.value)}
                  placeholder="How to ==highlight== text"
                />
                {activeTextElement === 'text1' && (
                  <div className="contextual-controls">
                    <div className="quote-controls">
                      <div className="style-button-row">
                        <button className={`style-toggle-button ${quoteStyle === 'none' ? 'active' : ''}`} onClick={() => onQuoteStyleChange('none')} title="No Quote"><FaBan /></button>
                        <button className={`style-toggle-button ${quoteStyle === 'serif' ? 'active' : ''}`} onClick={() => onQuoteStyleChange('serif')} title="Serif Quote"><ImQuotesLeft /></button>
                        <button className={`style-toggle-button ${quoteStyle === 'slab' ? 'active' : ''}`} onClick={() => onQuoteStyleChange('slab')} title="Slab Quote"><BiSolidQuoteLeft /></button>
                      </div>
                      <div className="slider-row quote-slider-row">
                        <input
                          type="range"
                          min="1"
                          max="10"
                          step="0.1"
                          value={quoteSize}
                          onChange={(e) => onQuoteSizeChange(parseFloat(e.target.value))}
                          className="slider"
                        />
                      </div>
                    </div>
                  </div>
                )}
                {/* Placeholder for Text 2's label controls */}
                {activeTextElement === 'text2' && (
                  <div className="contextual-controls">
                    <div className="label-controls">
                      <div className="style-button-row">
                        <button className={`style-toggle-button ${!hasLabel ? 'active' : ''}`} onClick={() => onHasLabelChange(false)} title="No Label"><FaBan /></button>
                        <button className={`style-toggle-button ${hasLabel ? 'active' : ''}`} onClick={() => onHasLabelChange(true)} title="Add Label"><LuTag /></button>
                      </div>
                      <div className="slider-row label-slider-row">
                         <div
                            className="opacity-slider-track"
                            style={{ '--label-color': hasLabel ? labelColor : 'transparent' }}
                          >
                          <input
                            type="range"
                            min="0"
                            max="10"
                            step="0.1"
                            value={labelTransparency}
                            onChange={(e) => onLabelTransparencyChange(parseFloat(e.target.value))}
                            className="slider opacity-slider"
                            disabled={!hasLabel}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
            {activeTab === 'font' && (
              <div className="font-grid">
                {fonts.map((fontItem) => (
                  <button
                    key={fontItem.family}
                    className={`font-button ${font === fontItem.family ? 'active' : ''}`}
                    style={{ fontFamily: `"${fontItem.family}", sans-serif` }}
                    onClick={() => onFontChange(fontItem.family)}
                  >
                    {fontItem.name}
                  </button>
                ))}
              </div>
            )}
            {activeTab === 'size' && (
              <div className="size-position-controls">
                <div className="slider-row">
                  <span className="slider-label">Font Size</span>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    step="0.1"
                    value={size}
                    onChange={(e) => onSizeChange(parseFloat(e.target.value))}
                    className="slider"
                  />
                </div>
                <div className="slider-row">
                  <span className="slider-label">Position</span>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    step="0.1"
                    value={yPosition}
                    onChange={(e) => onYPositionChange(parseFloat(e.target.value))}
                    className="slider"
                  />
                </div>
              </div>
            )}
            {activeTab === 'color' && (
              <div className="color-controls">
                <div className="color-target-toggle">
                  <button
                    className={`color-target-button ${colorTarget === 'text' ? 'active' : ''}`}
                    onClick={() => setColorTarget('text')}
                  >
                    Text
                  </button>
                  <button
                    className={`color-target-button ${colorTarget === 'highlight' ? 'active' : ''}`}
                    onClick={() => setColorTarget('highlight')}
                  >
                    Highlight
                  </button>
                  {activeTextElement === 'text2' && (
                    <button
                      className={`color-target-button ${colorTarget === 'label' ? 'active' : ''}`}
                      onClick={() => setColorTarget('label')}
                    >
                      Label
                    </button>
                  )}
                </div>
                <div className="color-swatches">
                  {colorSwatches.map((swatchColor) => (
                    <button
                      key={swatchColor}
                      className="color-swatch"
                      style={{ backgroundColor: swatchColor }}
                      onClick={() => handleColorSwatchClick(swatchColor)}
                    />
                  ))}
                  <div className="color-swatch rainbow-swatch" title="Custom Color">
                    <div className="rainbow-plus">+</div>
                    <input
                      type="color"
                      className="color-picker-input"
                      value={colorTarget === 'text' ? color : colorTarget === 'highlight' ? highlightColor : labelColor}
                      onChange={(e) => handleColorSwatchClick(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}
            {activeTab === 'style' && (
              <div className="style-controls">
                <div className="style-button-row">
                  <button
                    className={`style-toggle-button ${isBold ? 'active' : ''}`}
                    onClick={() => onIsBoldChange(!isBold)}
                  >
                    <RxFontBold />
                  </button>
                  <button
                    className={`style-toggle-button ${isItalic ? 'active' : ''}`}
                    onClick={() => onIsItalicChange(!isItalic)}
                  >
                    <RxFontItalic />
                  </button>
                  <button
                    className={`style-toggle-button ${hasShadow ? 'active' : ''}`}
                    onClick={() => onHasShadowChange(!hasShadow)}
                  >
                    <BsLayers />
                  </button>
                </div>
                <div className="style-button-row">
                  <button className={`style-toggle-button ${textAlign === 'left' ? 'active' : ''}`} onClick={() => onTextAlignChange('left')}><RxTextAlignLeft /></button>
                  <button className={`style-toggle-button ${textAlign === 'center' ? 'active' : ''}`} onClick={() => onTextAlignChange('center')}><RxTextAlignCenter /></button>
                  <button className={`style-toggle-button ${textAlign === 'right' ? 'active' : ''}`} onClick={() => onTextAlignChange('right')}><RxTextAlignRight /></button>
                </div>
                <div className="slider-row style-slider-row">
                  <span className="slider-label">Line Spacing</span>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    step="0.1"
                    value={lineSpacing}
                    onChange={(e) => onLineSpacingChange(parseFloat(e.target.value))}
                    className="slider"
                  />
                </div>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}

export default Text1InputDrawer;
