import React, { useEffect, useMemo, useRef, useState } from 'react';
import './TextToolbar.css';

// Menu icons
import { FiEdit3, FiCheck, FiMic, FiChevronLeft } from 'react-icons/fi';
import { RxFontFamily, RxTextAlignLeft, RxTextAlignCenter, RxTextAlignRight } from 'react-icons/rx';
import { MdOutlineColorLens, MdOutlineFormatLineSpacing } from 'react-icons/md';
import { ImQuotesLeft } from 'react-icons/im';
import { BiSolidQuoteLeft, BiExpandVertical, BiFontSize } from 'react-icons/bi';
import { IoTextOutline } from 'react-icons/io5';
import { PiHighlighter, PiTag } from 'react-icons/pi';
import { TbCancel, TbTextResize } from 'react-icons/tb';
import { BsSliders } from 'react-icons/bs';

function SizeIcon() {
  // Prefer BiFontSize; VscTextSize as fallback
  return <TbTextResize />;
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
    mode === 'text1' ? ['#000000', '#FFFFFF', '#FFD700', '#5EAFE5'] : ['#000000', '#FFFFFF', '#FFD700']
  ), [mode]);

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
        <button className="chevron-btn" onClick={onClose} title="Back"><FiChevronLeft/></button>
        <CenterGroup>
          <button className="icon-btn" onClick={() => setTab('edit')} title="Edit"><FiEdit3/></button>
          <button className="icon-btn" onClick={() => setTab('font')} title="Font"><RxFontFamily/></button>
          <button className="icon-btn" onClick={() => setTab('position')} title="Size"><TbTextResize/></button>
          {mode==='text1' ? (
            <button className="icon-btn" onClick={() => setTab('quote')} title="Quotes"><ImQuotesLeft/></button>
          ) : (
            <button className="icon-btn" onClick={() => setTab('label')} title="Label"><PiTag/></button>
          )}
          <button className="icon-btn" onClick={() => setTab('color')} title="Colour"><MdOutlineColorLens/></button>
          <button className="icon-btn" onClick={() => setTab('style')} title="Style"><BsSliders/></button>
        </CenterGroup>
      </div>
    );
  };

  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef(null);

  const startRecording = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition not supported in this browser.');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = false;
    recognitionRef.current.lang = 'en-US';

    recognitionRef.current.onstart = () => setIsRecording(true);
    recognitionRef.current.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      onChangeValue(value + transcript);
    };
    recognitionRef.current.onend = () => setIsRecording(false);
    recognitionRef.current.onerror = () => setIsRecording(false);

    recognitionRef.current.start();
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  const renderEditRow = () => {
    return (
      <div className="toolbar-inner">
        <button className="mic-btn" onClick={isRecording ? stopRecording : startRecording} title={isRecording ? "Stop Recording" : "Start Voice Input"}>
          <FiMic style={{ color: isRecording ? 'red' : 'inherit' }} />
        </button>
        <div className="edit-container">
          <textarea
            ref={inputRef}
            className="edit-textarea"
            rows={2}
            value={value}
            onChange={(e)=>onChangeValue(e.target.value)}
            placeholder="To ==highlight== text"
          />
        </div>
        <button className="check-btn" onClick={() => setTab('menu')} title="Done"><FiCheck/></button>
      </div>
    );
  };

  const renderFontRow = () => (
    <div className="toolbar-inner">
      <button className="chevron-btn" onClick={() => setTab('menu')} title="Back"><FiChevronLeft/></button>
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
    </div>
  );

  const renderPositionRow = () => (
    <div className="toolbar-inner">
      <button className="chevron-btn" onClick={() => setTab('menu')} title="Back"><FiChevronLeft/></button>
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
    </div>
  );

  const renderColorRow = () => {
    const currentColor = colorTarget === 'text' ? color : colorTarget === 'highlight' ? highlightColor : labelColor;
    return (
      <div className="toolbar-inner">
        <button className="chevron-btn" onClick={() => setTab('menu')} title="Back"><FiChevronLeft/></button>
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
            <button key={c} className={`swatch ${currentColor === c ? 'active' : ''}`} style={{ background: c }} onClick={()=>applyColor(c)} />
          ))}
          <button className="swatch rainbow" onClick={openPicker} />
          <input ref={colorInputRef} type="color" className="hidden-color-input" onChange={(e)=>applyColor(e.target.value)} />
        </div>
      </div>
    );
  };

  const renderQuoteRow = () => (
    <div className="toolbar-inner">
      <button className="chevron-btn" onClick={() => setTab('menu')} title="Back"><FiChevronLeft/></button>
      <div className="toggle-group">
        <button className={`toggle-btn ${quoteStyle==='none'?'active':''}`} onClick={()=>onChangeQuoteStyle('none')} title="No quote"><TbCancel/></button>
        <button className={`toggle-btn ${quoteStyle==='serif'?'active':''}`} onClick={()=>onChangeQuoteStyle('serif')} title="Serif"><ImQuotesLeft/></button>
        <button className={`toggle-btn ${quoteStyle==='slab'?'active':''}`} onClick={()=>onChangeQuoteStyle('slab')} title="Slab"><BiSolidQuoteLeft/></button>
      </div>
      <div className="slider-wrap">
        <input className="range" type="range" min="1" max="10" step="0.1" value={quoteSize} onChange={(e)=>{ const v=parseFloat(e.target.value); schedule(()=>onChangeQuoteSize(v)); }} />
      </div>
    </div>
  );

  const renderLabelRow = () => (
    <div className="toolbar-inner">
      <button className="chevron-btn" onClick={() => setTab('menu')} title="Back"><FiChevronLeft/></button>
      <div className="toggle-group">
        <button className={`toggle-btn ${!labelEnabled?'active':''}`} onClick={()=>onToggleLabel(false)} title="No label"><TbCancel/></button>
        <button className={`toggle-btn ${labelEnabled?'active':''}`} onClick={()=>onToggleLabel(true)} title="Label"><PiTag/></button>
      </div>
      <div className="slider-wrap">
        <input className="range gradient" type="range" min="0" max="10" step="0.1" value={labelOpacity} onChange={(e)=>{ const v=parseFloat(e.target.value); schedule(()=>onChangeLabelOpacity(v)); }} />
      </div>
    </div>
  );

  const handleCycleAlign = () => {
    onCycleAlign();
  };

  const renderStyleRow = () => (
    <div className="toolbar-inner">
      <button className="chevron-btn" onClick={() => setTab('menu')} title="Back"><FiChevronLeft/></button>
      <div className="style-group">
        <button className={`toggle-btn ${isBold?'active':''}`} onClick={onToggleBold} title="Bold"><strong>B</strong></button>
        <button className={`toggle-btn ${isItalic?'active':''}`} onClick={onToggleItalic} title="Italic"><em>I</em></button>
        <button className={`toggle-btn`} onClick={handleCycleAlign} title="Align">
          {align === 'left' ? <RxTextAlignLeft /> : align === 'center' ? <RxTextAlignCenter /> : <RxTextAlignRight />}
        </button>
      </div>
      <div className="slider-wrap">
        <input className="range" type="range" min="0" max="10" step="0.1" value={lineSpacing} onChange={(e)=>{ const v=parseFloat(e.target.value); schedule(()=>onChangeLineSpacing(v)); }} />
        <div className="big-icon"><MdOutlineFormatLineSpacing/></div>
      </div>
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
