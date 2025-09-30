import './App.css'
import { useState, useRef, useEffect } from 'react';
import {
  FiMaximize,
  FiImage,
  FiType,
  FiBookmark,
  FiDownload,
  FiRotateCcw,
  FiInfo
} from "react-icons/fi";
import BackgroundDrawer from './components/BackgroundDrawer';
import SolidColorDrawer from './components/SolidColorDrawer'; // prettier-ignore
import GradientDrawer from './components/GradientDrawer';
import SearchDrawer from './components/SearchDrawer';
import TextMenuDrawer from './components/TextMenuDrawer';
import SizeDrawer from './components/SizeDrawer.jsx';
import Text1InputDrawer from './components/Text1InputDrawer';

// Helper function to convert hex color and alpha to rgba
const hexToRgba = (hex, alpha = 1) => {
  if (!hex || hex === 'transparent') return 'transparent';
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

function App() {
  const [isBackgroundDrawerOpen, setIsBackgroundDrawerOpen] = useState(false);
  const [isSolidColorDrawerOpen, setIsSolidColorDrawerOpen] = useState(false);
  const [isGradientDrawerOpen, setIsGradientDrawerOpen] = useState(false);
  const [isSearchDrawerOpen, setIsSearchDrawerOpen] = useState(false);
  const [isTextMenuDrawerOpen, setIsTextMenuDrawerOpen] = useState(false);
  const [isSizeDrawerOpen, setIsSizeDrawerOpen] = useState(false);
  const [isText1InputDrawerOpen, setIsText1InputDrawerOpen] = useState(false);

  const [canvasSize, setCanvasSize] = useState('1/1'); // Default to square
  const [originalCanvasSize, setOriginalCanvasSize] = useState(canvasSize);

  const [background, setBackground] = useState({ type: 'solid', value: '#8A2BE2' });
  const [originalBackground, setOriginalBackground] = useState(background);
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [logoImage, setLogoImage] = useState(null);

  // --- Text 1 State ---
  const [text1, setText1] = useState('Default Text');
  const [originalText1, setOriginalText1] = useState(text1);
  const [text1Size, setText1Size] = useState(5);
  const [text1YPosition, setText1YPosition] = useState(5);
  const [text1Font, setText1Font] = useState('Inter');
  const [text1Color, setText1Color] = useState('#FFFFFF');
  const [text1HighlightColor, setText1HighlightColor] = useState('#FFD700');
  const [text1IsBold, setText1IsBold] = useState(true);
  const [text1IsItalic, setText1IsItalic] = useState(false);
  const [text1Align, setText1Align] = useState('center');
  const [text1LineSpacing, setText1LineSpacing] = useState(5);
  const [text1HasShadow, setText1HasShadow] = useState(false);
  const [text1HasOutline, setText1HasOutline] = useState(false);
  const [text1QuoteStyle, setText1QuoteStyle] = useState('none');
  const [text1QuoteSize, setText1QuoteSize] = useState(5);

  // --- Text 2 State ---
  const [text2, setText2] = useState('Smaller Bottom Text');
  const [originalText2, setOriginalText2] = useState(text2);
  const [text2Size, setText2Size] = useState(1.5); // Smaller default, as requested
  const [text2YPosition, setText2YPosition] = useState(8.5); // Lower default
  const [text2Font, setText2Font] = useState('Inter');
  const [text2Color, setText2Color] = useState('#FFFFFF');
  const [text2IsBold, setText2IsBold] = useState(false); // Not bold default
  const [text2IsItalic, setText2IsItalic] = useState(false);
  const [text2Align, setText2Align] = useState('center');
  const [text2LineSpacing, setText2LineSpacing] = useState(5);
  const [text2LabelColor, setText2LabelColor] = useState('transparent'); // Default off
  const [text2LabelTransparency, setText2LabelTransparency] = useState(5); // 50% default

  const [activeTextElement, setActiveTextElement] = useState('text1');

  const canvasRef = useRef(null);
  const backgroundImageInputRef = useRef(null);
  const logoImageInputRef = useRef(null);

  const handleSizeDrawerOpen = () => {
    setOriginalCanvasSize(canvasSize);
    setIsSizeDrawerOpen(true);
  };

  const handleSizeDrawerClose = (confirm) => {
    if (!confirm) {
      setCanvasSize(originalCanvasSize);
    }
    setIsSizeDrawerOpen(false);
  };

  const handleSolidColorDrawerOpen = () => {
    setOriginalBackground(background);
    setIsBackgroundDrawerOpen(false);
    setIsSolidColorDrawerOpen(true);
  };

  const handleSolidColorDrawerClose = (confirm) => {
    if (!confirm) {
      setBackground(originalBackground);
    }
    setIsSolidColorDrawerOpen(false);
  };

  const handleGradientDrawerOpen = () => {
    setOriginalBackground(background);
    setIsBackgroundDrawerOpen(false);
    setIsGradientDrawerOpen(true);
  };

  const handleGradientDrawerClose = (confirm) => {
    if (!confirm) {
      setBackground(originalBackground);
    }
    setIsGradientDrawerOpen(false);
  };

  const handleSearchDrawerOpen = () => {
    setIsBackgroundDrawerOpen(false);
    setIsSearchDrawerOpen(true);
  };

  const handleImageUploadClick = () => {
    backgroundImageInputRef.current.click();
  }

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.src = e.target.result;
        setBackgroundImage(img);
      };
      reader.readAsDataURL(file);
      setIsBackgroundDrawerOpen(false);
    }
  };

  const handleLogoUploadClick = () => {
    logoImageInputRef.current.click();
  };

  const handleLogoFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.src = e.target.result;
        setLogoImage(img);
      };
      reader.readAsDataURL(file);
      setIsBackgroundDrawerOpen(false);
    }
  };

  const handleRemoteImageSelect = (imageUrl) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = imageUrl;
    setBackgroundImage(img);
    setIsSearchDrawerOpen(false);
  }

  const handleText1InputDrawerOpen = () => {
    setActiveTextElement('text1');
    setOriginalText1(text1);
    // Also save original styles for Text 1 if needed for cancel
    setIsTextMenuDrawerOpen(false);
    setIsText1InputDrawerOpen(true);
  };

  const handleText2InputDrawerOpen = () => {
    setActiveTextElement('text2');
    setOriginalText2(text2);
    // Also save original styles for Text 2 if needed for cancel
    setIsTextMenuDrawerOpen(false);
    setIsText1InputDrawerOpen(true);
  };

  const handleText1InputDrawerClose = (confirm) => {
    if (!confirm) {
      if (activeTextElement === 'text1') {
        setText1(originalText1);
        // Revert styles for Text 1 here
      } else {
        setText2(originalText2);
        // Revert styles for Text 2 here
      }
    }
    setIsText1InputDrawerOpen(false);
  };

  const handleText1InputConfirm = () => {
    // No need to pass text up, App already has it from live updates
    setIsText1InputDrawerOpen(false);
  }

  // This effect will re-draw the canvas whenever the background or images change
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const canvasWidth = canvas.offsetWidth;
    const canvasHeight = canvas.offsetHeight;
    if (!canvasWidth || !canvasHeight) return;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (backgroundImage) {
      const draw = () => {
        const imgAspectRatio = backgroundImage.naturalWidth / backgroundImage.naturalHeight;
        const canvasAspectRatio = canvasWidth / canvasHeight;
        let renderWidth, renderHeight;

        if (imgAspectRatio > canvasAspectRatio) {
          renderWidth = canvasWidth;
          renderHeight = renderWidth / imgAspectRatio;
        } else {
          renderHeight = canvasHeight;
          renderWidth = renderHeight * imgAspectRatio;
        }
        ctx.drawImage(backgroundImage, (canvasWidth - renderWidth) / 2, (canvasHeight - renderHeight) / 2, renderWidth, renderHeight);
      }
      if (backgroundImage.complete) {
        draw();
      } else {
        backgroundImage.onload = draw;
      }
    }

    const drawText = (text, size, yPos, font, color, isBold, isItalic, align, lineSpacing, hasShadow, hasOutline, quoteStyle, quoteSize, hasLabel, labelColor, labelTransparency) => {
      const baseFontSize = Math.min(canvasWidth, canvasHeight) * 0.1;
      const fontSize = baseFontSize * (size / 5);
      const finalLineSpacing = (0.8 + (lineSpacing / 10) * (2.5 - 0.8));
      const lineHeight = fontSize * finalLineSpacing;
      const fontWeight = isBold ? 'bold' : 'normal';
      const fontStyle = isItalic ? 'italic' : 'normal';
      const finalFont = `${fontStyle} ${fontWeight} ${fontSize}px "${font}", sans-serif`;
      const maxWidth = canvasWidth * 0.8;
      const yPosition = canvasHeight * (yPos / 10);

      ctx.font = finalFont;
      ctx.textAlign = align;
      ctx.textBaseline = 'middle';

      // Handle both automatic wrapping and manual newlines
      const paragraphs = text.split('\n');
      const lines = [];
      let widestLine = 0;

      paragraphs.forEach(paragraph => {
        const words = paragraph.split(' ');
        let line = '';
        for (let n = 0; n < words.length; n++) {
          const testLine = line + words[n] + ' ';
          const metrics = ctx.measureText(testLine);
          const testWidth = metrics.width;
          if (testWidth > maxWidth && n > 0) {
            lines.push(line);
            if (ctx.measureText(line).width > widestLine) {
              widestLine = ctx.measureText(line).width;
            }
            line = words[n] + ' ';
          } else {
            line = testLine;
          }
        }
        lines.push(line);
        if (ctx.measureText(line).width > widestLine) {
          widestLine = ctx.measureText(line).width;
        }
      });

      const totalTextHeight = lines.length * lineHeight;
      let currentY = yPosition - (totalTextHeight / 2) + (lineHeight / 2);

      if (quoteStyle !== 'none') {
        const quoteSizeVal = baseFontSize * 2 * (quoteSize / 5);
        let quoteFont = '';
        if (quoteStyle === 'serif') {
          quoteFont = `${quoteSizeVal}px "Saira Stencil One", sans-serif`;
        } else if (quoteStyle === 'slab') {
          quoteFont = `${quoteSizeVal}px "Ultra", serif`;
        } else if (quoteStyle === 'fancy') {
          quoteFont = `bold ${quoteSizeVal}px "Playfair Display SC", serif`;
        }
        ctx.font = quoteFont;
        ctx.fillStyle = color;
        const quoteY = yPosition - (totalTextHeight / 2) - (lineHeight * 0.1);
        ctx.fillText('“', canvasWidth / 2, quoteY);
      }

      ctx.font = finalFont;

      if (hasLabel) {
        ctx.fillStyle = hexToRgba(labelColor, labelTransparency / 10);
        const padding = lineHeight * 0.4; // A bit more padding
        const labelY = yPosition - (totalTextHeight / 2);
        const labelHeight = totalTextHeight + padding;
        const labelWidth = widestLine + padding * 2; // Use calculated widest line
        ctx.fillRect(canvasWidth / 2 - labelWidth / 2, labelY - padding / 2, labelWidth, labelHeight);
      }

      for (let i = 0; i < lines.length; i++) {
        if (hasShadow) {
          ctx.shadowColor = 'rgba(0,0,0,0.5)';
          ctx.shadowBlur = 5;
          ctx.shadowOffsetX = 5;
          ctx.shadowOffsetY = 5;
        } else {
          ctx.shadowColor = 'transparent';
          ctx.shadowBlur = 0;
          ctx.shadowOffsetX = 0;
          ctx.shadowOffsetY = 0;
        }

        const lineText = lines[i].trim();
        const lineParts = lineText.split(/(==[^=]+==)/g);
        let lineX = canvasWidth / 2;
        if (align === 'left' && hasLabel) { // Adjust alignment only if there is a label
          lineX = (canvasWidth - widestLine) / 2;
        } else if (align === 'right') {
          lineX = canvasWidth - (canvasWidth - maxWidth) / 2;
        }
        let currentX = lineX;
        if (align === 'center') {
          currentX = lineX - (ctx.measureText(lineText).width / 2);
        }
        if (align !== 'center') {
          currentX = lineX;
        }

        lineParts.forEach(part => {
          if (part.startsWith('==') && part.endsWith('==')) {
            const highlightedText = part.substring(2, part.length - 2);
            ctx.fillStyle = text1HighlightColor;
            ctx.fillText(highlightedText, currentX + (ctx.measureText(highlightedText).width / 2), currentY);
            currentX += ctx.measureText(highlightedText).width;
          } else {
            ctx.fillStyle = color;
            ctx.fillText(part, currentX + (ctx.measureText(part).width / 2), currentY);
            currentX += ctx.measureText(part).width;
          }
        });

        if (hasOutline) {
          ctx.strokeStyle = 'black';
          ctx.lineWidth = fontSize * 0.05;
          ctx.strokeText(lineText, lineX, currentY);
        }

        currentY += lineHeight;
      }
    };

    if (text1) {
      drawText(text1, text1Size, text1YPosition, text1Font, text1Color, text1IsBold, text1IsItalic, text1Align, text1LineSpacing, text1HasShadow, text1HasOutline, text1QuoteStyle, text1QuoteSize, false, 'transparent', 0);
    }

    if (text2) {
      drawText(text2, text2Size, text2YPosition, text2Font, text2Color, text2IsBold, text2IsItalic, text2Align, text2LineSpacing, false, false, 'none', 5, text2LabelColor !== 'transparent', text2LabelColor, text2LabelTransparency);
    }

    if (logoImage) {
      const drawLogo = () => {
        const logoMaxWidth = canvasWidth * 0.25;
        const logoMaxHeight = canvasHeight * 0.25;
        const logoAspectRatio = logoImage.naturalWidth / logoImage.naturalHeight;
        let logoWidth = logoMaxWidth;
        let logoHeight = logoWidth / logoAspectRatio;
        if (logoHeight > logoMaxHeight) {
          logoHeight = logoMaxHeight;
          logoWidth = logoHeight * logoAspectRatio;
        }
        const padding = canvasWidth * 0.05;
        const x = canvasWidth - logoWidth - padding;
        const y = canvasHeight - logoHeight - padding;
        ctx.drawImage(logoImage, x, y, logoWidth, logoHeight);
      }
      if (logoImage.complete) {
        drawLogo();
      } else {
        logoImage.onload = drawLogo;
      }
    }
  }, [backgroundImage, logoImage, canvasSize, background, text1, text1Size, text1YPosition, text1Font, text1Color, text1HighlightColor, text1IsBold, text1IsItalic, text1Align, text1LineSpacing, text1HasShadow, text1HasOutline, text1QuoteStyle, text1QuoteSize, text2, text2Size, text2YPosition, text2Font, text2Color, text2IsBold, text2IsItalic, text2Align, text2LineSpacing, text2LabelColor, text2LabelTransparency]);

  const getCanvasStyle = () => {
    const style = { aspectRatio: canvasSize };
    if (backgroundImage) {
      style.backgroundColor = '#eeeeee';
    } else if (background.type === 'solid') {
      style.backgroundColor = background.value;
    } else if (background.type === 'gradient') {
      style.background = background.value;
    }
    return style;
  }

  return (
    <div className="app-container">
      <div className="canvas-container">
        <canvas
          ref={canvasRef}
          className="picflam-canvas"
          style={getCanvasStyle()}></canvas>
      </div>

      <div className="footer-menu">
        <button className="footer-button" onClick={handleSizeDrawerOpen}><FiMaximize /></button>
        <button className="footer-button" onClick={() => setIsBackgroundDrawerOpen(true)}><FiImage /></button>
        <button className="footer-button" onClick={() => setIsTextMenuDrawerOpen(true)}><FiType /></button>
        <button className="footer-button" onClick={() => alert('Save/Templates feature coming soon!')}><FiBookmark /></button>
        <button className="footer-button" onClick={() => alert('Download feature coming soon!')}><FiDownload /></button>
        <button className="footer-button" onClick={() => alert('Reset feature coming soon!')}><FiRotateCcw /></button>
        <button className="footer-button" onClick={() => alert('Info feature coming soon!')}><FiInfo /></button>
      </div>

      <input
        type="file"
        ref={backgroundImageInputRef}
        onChange={handleFileChange}
        accept="image/*"
        style={{ display: 'none' }}
      />

      <input
        type="file"
        ref={logoImageInputRef}
        onChange={handleLogoFileChange}
        accept="image/*"
        style={{ display: 'none' }}
      />

      {isBackgroundDrawerOpen && (
        <BackgroundDrawer
          onClose={() => setIsBackgroundDrawerOpen(false)}
          onImageUpload={handleImageUploadClick}
          onSolidColorClick={handleSolidColorDrawerOpen}
          onGradientClick={handleGradientDrawerOpen}
          onSearchClick={handleSearchDrawerOpen}
          onLogoClick={handleLogoUploadClick}
        />
      )}

      {isSolidColorDrawerOpen && (
        <SolidColorDrawer
          onClose={handleSolidColorDrawerClose}
          onColorChange={(color) => setBackground({ type: 'solid', value: color })}
          onConfirm={() => handleSolidColorDrawerClose(true)}
          currentColor={background.type === 'solid' ? background.value : '#ffffff'}
        />
      )}

      {isGradientDrawerOpen && (
        <GradientDrawer
          onClose={handleGradientDrawerClose}
          onConfirm={() => handleGradientDrawerClose(true)}
          onGradientChange={(gradient) =>
            setBackground({ type: 'gradient', value: gradient })}
        />
      )}

      {isTextMenuDrawerOpen && (
        <TextMenuDrawer
          onClose={() => setIsTextMenuDrawerOpen(false)}
          onText1Click={handleText1InputDrawerOpen}
          onText2Click={handleText2InputDrawerOpen}
          activeTextElement={activeTextElement}
        />
      )}

      {isText1InputDrawerOpen && (
        <Text1InputDrawer
          onClose={handleText1InputDrawerClose}
          onConfirm={handleText1InputConfirm}
          activeTextElement={activeTextElement}
          text={activeTextElement === 'text1' ? text1 : text2}
          onTextChange={activeTextElement === 'text1' ? setText1 : setText2}
          size={activeTextElement === 'text1' ? text1Size : text2Size}
          onSizeChange={activeTextElement === 'text1' ? setText1Size : setText2Size}
          yPosition={activeTextElement === 'text1' ? text1YPosition : text2YPosition}
          onYPositionChange={activeTextElement === 'text1' ? setText1YPosition : setText2YPosition}
          font={activeTextElement === 'text1' ? text1Font : text2Font}
          onFontChange={activeTextElement === 'text1' ? setText1Font : setText2Font}
          color={activeTextElement === 'text1' ? text1Color : text2Color}
          onColorChange={activeTextElement === 'text1' ? setText1Color : setText2Color}
          highlightColor={text1HighlightColor}
          onHighlightColorChange={setText1HighlightColor}
          isBold={activeTextElement === 'text1' ? text1IsBold : text2IsBold}
          onIsBoldChange={activeTextElement === 'text1' ? setText1IsBold : setText2IsBold}
          isItalic={activeTextElement === 'text1' ? text1IsItalic : text2IsItalic}
          onIsItalicChange={activeTextElement === 'text1' ? setText1IsItalic : setText2IsItalic}
          textAlign={activeTextElement === 'text1' ? text1Align : text2Align}
          onTextAlignChange={activeTextElement === 'text1' ? setText1Align : setText2Align}
          lineSpacing={activeTextElement === 'text1' ? text1LineSpacing : text2LineSpacing}
          onLineSpacingChange={activeTextElement === 'text1' ? setText1LineSpacing : setText2LineSpacing}
          hasShadow={text1HasShadow}
          onHasShadowChange={setText1HasShadow}
          hasOutline={text1HasOutline}
          onHasOutlineChange={setText1HasOutline}
          quoteStyle={text1QuoteStyle}
          onQuoteStyleChange={setText1QuoteStyle}
          quoteSize={text1QuoteSize}
          onQuoteSizeChange={setText1QuoteSize}
          hasLabel={text2LabelColor !== 'transparent'}
          onHasLabelChange={() => {}} // Placeholder
          labelColor={text2LabelColor}
          onLabelColorChange={setText2LabelColor}
          labelTransparency={text2LabelTransparency}
          onLabelTransparencyChange={setText2LabelTransparency}
        />
      )}
      {isSearchDrawerOpen && (
        <SearchDrawer
          onClose={() => setIsSearchDrawerOpen(false)}
          onImageSelect={handleRemoteImageSelect}
        />
      )}

      {isSizeDrawerOpen && (
        <SizeDrawer
          onClose={handleSizeDrawerClose}
          onCanvasSizeChange={(size) => setCanvasSize(size)}
          currentSize={canvasSize}
        />
      )}
    </div>
  )
}

export default App
