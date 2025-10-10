import React, { useEffect, useMemo, useRef, useState } from 'react';
import './TextToolbar.css';

// Menu icons
import { FiEdit3, FiCheck } from 'react-icons/fi';
import { RxFontFamily } from 'react-icons/rx';
import { MdOutlineColorLens, MdOutlineFormatLineSpacing } from 'react-icons/md';
import { ImQuotesLeft } from 'react-icons/im';
import { BiSolidQuoteLeft, BiExpandVertical, BiFontSize } from 'react-icons/bi';
import { VscTextSize } from 'react-icons/vsc';
import { IoTextOutline } from 'react-icons/io5';
import { PiHighlighter, PiTag } from 'react-icons/pi';
import { TbCancel } from 'react-icons/tb';

function SizeIcon() {
  // Prefer BiFontSize; VscTextSize as fallback
  return <BiFontSize />;
}

function CenterGroup({ children }) {
  return <div className="center-group">{children}</div>;
}

export default function TextToolbar({
  mode, // 'text1' | 'text2'
  tab, setTab,
  value, onChangeValue,
  font, onChangeFont,
  size, onChangeSize,
  yPosition, onChangeY,
  color, onChangeColor,
  highlightColor, onChangeHighlightColor,
  labelColor, onChangeLabelColor,
  labelEnabled, onToggleLabel,
  labelOpacity, onChangeLabelOpacity,
  isBold, onToggleBold,
  isItalic, onToggleItalic,
  align, onCycleAlign,
  lineSpacing, onChangeLineSpacing,
  quoteStyle, onChangeQuoteStyle,
  quoteSize, onChangeQuoteSize,
  onClose,
}) {
  // local state for position/size toggle and color target
  const [posMode, setPosMode] = useState('size'); // 'size' | 'position'
  const [colorTarget, setColorTarget] = useState('text'); // 'text' | 'highlight' | 'label'

  useEffect(() => {
    // reset on mode change
    setColorTarget('text');
    setPosMode('size');
  }, [mode]);

  // Slider update scheduling
  const rafRef = useRef(0);
  const schedule = (fn) => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(fn);
  };
  useEffect(() => () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); }, []);

  // Fonts and swatches
  const fonts = useMemo(() => ([
    { name: 'Inter', family: 'Inter' },
    { name: 'Roboto', family: 'Roboto Slab' },
    { name: 'Saira', family: 'Saira Condensed' },
    { name: 'Lora', family: 'Lora' },
    { name: 'Playfair', family: 'Playfair Display' },
    { name: 'Elite', family: 'Special Elite' },
  ]), []);

  const swatches = useMemo(() => (
    ['#000000', '#FFFFFF', '#FFD700', '#5EAFE5', '#C60000']
  ), []);

  // Color picker hidden input
  const colorInputRef = useRef(null);
  const openPicker = () => colorInputRef.current && colorInputRef.current.click();
  const applyColor = (c) => {
    if (colorTarget === 'text') return onChangeColor(c);
    if (colorTarget === 'highlight' && mode === 'text1') return onChangeHighlightColor(c);
    if (colorTarget === 'label' && mode === 'text2') return onChangeLabelColor(c);
    onChangeColor(c);
  };

  // Edit input
  const inputRef = useRef(null);
  useEffect(() => {
    if (tab === 'edit' && inputRef.current) {
      setTimeout(() => inputRef.current && inputRef.current.focus(), 0);
    }
  }, [tab]);

  // Rows
  const renderMenuRow = () => {
    return (
      <div className="toolbar-inner">
        <CenterGroup>
          <button className="icon-btn" onClick={() => setTab('edit')} title="Edit"><FiEdit3/></button>
          <button className="icon-btn" onClick={() => setTab('font')} title="Font"><RxFontFamily/></button>
          <button className="icon-btn" onClick={() => setTab('position')} title="Position"><BiExpandVertical/></button>
          {mode==='text1' ? (
            <button className="icon-btn" onClick={() => setTab('quote')} title="Quotes"><ImQuotesLeft/></button>
          ) : (
            <button className="icon-btn" onClick={() => setTab('label')} title="Label"><PiTag/></button>
          )}
          <button className="icon-btn" onClick={() => setTab('color')} title="Colour"><MdOutlineColorLens/></button>
          <button className="icon-btn" onClick={() => setTab('style')} title="Style"><MdOutlineFormatLineSpacing/></button>
        </CenterGroup>
        <button className="check-btn" onClick={onClose} title="Close"><FiCheck/></button>
      </div>
    );
  };

  const renderEditRow = () => {
    return (
      <div className="toolbar-inner">
        <div className="edit-container">
          <textarea
            ref={inputRef}
            className="edit-textarea"
            rows={2}
            value={value}
            onChange={(e)=>onChangeValue(e.target.value)}
            placeholder="Add equals signs to ==highlight== text"
          />
        </div>
        <button className="check-btn" onClick={() => setTab('menu')} title="Done"><FiCheck/></button>
      </div>
    );
  };

  const renderFontRow = () => (
    <div className="toolbar-inner">
      <CenterGroup>
        <div className="font-chips">
          {fonts.map(f => (
            <button
              key={f.family}
              className={`font-chip ${font===f.family?'active':''}`}
              style={{ fontFamily: `"${f.family}", sans-serif` }}
              onClick={() => onChangeFont(f.family)}
            >Ag</button>
          ))}
        </div>
      </CenterGroup>
      <button className="check-btn" onClick={() => setTab('menu')} title="Done"><FiCheck/></button>
    </div>
  );

  const renderPositionRow = () => (
    <div className="toolbar-inner">
      <div className="toggle-group">
        <button className={`toggle-btn ${posMode==='size'?'active':''}`} onClick={()=>setPosMode('size')} title="Size"><SizeIcon/></button>
        <button className={`toggle-btn ${posMode==='position'?'active':''}`} onClick={()=>setPosMode('position')} title="Position"><BiExpandVertical/></button>
      </div>
      <div className="slider-wrap">
        {posMode==='size' ? (
          <input className="range" type="range" min="1" max="10" step="0.1" value={size} onChange={(e)=>{ const v=parseFloat(e.target.value); schedule(()=>onChangeSize(v)); }} />
        ) : (
          <input className="range" type="range" min="0" max="10" step="0.1" value={yPosition} onChange={(e)=>{ const v=parseFloat(e.target.value); schedule(()=>onChangeY(v)); }} />
        )}
      </div>
      <button className="check-btn" onClick={() => setTab('menu')} title="Done"><FiCheck/></button>
    </div>
  );

  const renderColorRow = () => (
    <div className="toolbar-inner">
      <div className="toggle-group">
        <button className={`toggle-btn ${colorTarget==='text'?'active':''}`} onClick={()=>setColorTarget('text')} title="Text"><IoTextOutline/></button>
        {mode==='text1' && (
          <button className={`toggle-btn ${colorTarget==='highlight'?'active':''}`} onClick={()=>setColorTarget('highlight')} title="Highlight"><PiHighlighter/></button>
        )}
        {mode==='text2' && (
          <button className={`toggle-btn ${colorTarget==='highlight'?'active':''}`} onClick={()=>setColorTarget('highlight')} title="Highlight"><PiHighlighter/></button>
        )}
        {mode==='text2' && (
          <button className={`toggle-btn ${colorTarget==='label'?'active':''}`} onClick={()=>setColorTarget('label')} title="Label"><PiTag/></button>
        )}
      </div>
      <div className="swatch-wrap">
        {swatches.map(c => (
          <button key={c} className="swatch" style={{ background: c }} onClick={()=>applyColor(c)} />
        ))}
        <button className="swatch rainbow" onClick={openPicker}>
          <span className="cross" />
        </button>
        <input ref={colorInputRef} type="color" className="hidden-color-input" onChange={(e)=>applyColor(e.target.value)} />
      </div>
      <button className="check-btn" onClick={() => setTab('menu')} title="Done"><FiCheck/></button>
    </div>
  );

  const renderQuoteRow = () => (
    <div className="toolbar-inner">
      <div className="toggle-group">
        <button className={`toggle-btn ${quoteStyle==='none'?'active':''}`} onClick={()=>onChangeQuoteStyle('none')} title="No quote"><TbCancel/></button>
        <button className={`toggle-btn ${quoteStyle==='serif'?'active':''}`} onClick={()=>onChangeQuoteStyle('serif')} title="Serif"><ImQuotesLeft/></button>
        <button className={`toggle-btn ${quoteStyle==='slab'?'active':''}`} onClick={()=>onChangeQuoteStyle('slab')} title="Slab"><BiSolidQuoteLeft/></button>
      </div>
      <div className="slider-wrap">
        <input className="range" type="range" min="1" max="10" step="0.1" value={quoteSize} onChange={(e)=>{ const v=parseFloat(e.target.value); schedule(()=>onChangeQuoteSize(v)); }} />
      </div>
      <button className="check-btn" onClick={() => setTab('menu')} title="Done"><FiCheck/></button>
    </div>
  );

  const renderLabelRow = () => (
    <div className="toolbar-inner">
      <div className="toggle-group">
        <button className={`toggle-btn ${!labelEnabled?'active':''}`} onClick={()=>onToggleLabel(false)} title="No label"><TbCancel/></button>
        <button className={`toggle-btn ${labelEnabled?'active':''}`} onClick={()=>onToggleLabel(true)} title="Label"><PiTag/></button>
      </div>
      <div className="slider-wrap">
        <input className="range gradient" type="range" min="0" max="10" step="0.1" value={labelOpacity} onChange={(e)=>{ const v=parseFloat(e.target.value); schedule(()=>onChangeLabelOpacity(v)); }} />
      </div>
      <button className="check-btn" onClick={() => setTab('menu')} title="Done"><FiCheck/></button>
    </div>
  );

  const renderStyleRow = () => (
    <div className="toolbar-inner">
      <div className="style-group">
        <button className={`toggle-btn ${isBold?'active':''}`} onClick={onToggleBold} title="Bold"><strong>B</strong></button>
        <button className={`toggle-btn ${isItalic?'active':''}`} onClick={onToggleItalic} title="Italic"><em>I</em></button>
        <button className={`toggle-btn`} onClick={onCycleAlign} title="Align">↔</button>
      </div>
      <div className="slider-wrap">
        <div className="big-icon"><MdOutlineFormatLineSpacing/></div>
        <input className="range" type="range" min="0" max="10" step="0.1" value={lineSpacing} onChange={(e)=>{ const v=parseFloat(e.target.value); schedule(()=>onChangeLineSpacing(v)); }} />
      </div>
      <button className="check-btn" onClick={() => setTab('menu')} title="Done"><FiCheck/></button>
    </div>
  );

  return (
    <div className="text-toolbar" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      {tab==='menu' && renderMenuRow()}
      {tab==='edit' && renderEditRow()}
      {tab==='font' && renderFontRow()}
      {tab==='position' && renderPositionRow()}
      {tab==='color' && renderColorRow()}
      {tab==='quote' && mode==='text1' && renderQuoteRow()}
      {tab==='label' && mode==='text2' && renderLabelRow()}
      {tab==='style' && renderStyleRow()}
    </div>
  );
}
