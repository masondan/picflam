import './App.css'
import { useState, useRef, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
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
import AboutDrawer from './components/AboutDrawer';
import SaveDrawer from './components/SaveDrawer';
import Slide from './components/Slide';

// Helper function to convert hex color and alpha to rgba
const hexToRgba = (hex, alpha = 1) => {
  if (!hex || hex === 'transparent') return 'transparent';
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const createDefaultSlide = () => ({
  id: Date.now() + Math.random(), // Unique ID for dnd-kit
  canvasSize: '1/1',
  background: { type: 'solid', value: '#8A2BE2' },
  backgroundImage: null,
  logoImage: null,
  // Text 1
  text1: 'Default Text',
  text1Size: 5,
  text1YPosition: 5,
  text1Font: 'Inter',
  text1Color: '#FFFFFF',
  text1HighlightColor: '#FFD700',
  text1IsBold: true,
  text1IsItalic: false,
  text1Align: 'center',
  text1LineSpacing: 5,
  text1HasShadow: false,
  text1HasOutline: false,
  text1QuoteStyle: 'none',
  text1QuoteSize: 5,
  // Text 2
  text2: 'Smaller Bottom Text',
  text2Size: 1.5,
  text2YPosition: 8.5,
  text2Font: 'Inter',
  text2Color: '#FFFFFF',
  text2IsBold: false,
  text2IsItalic: false,
  text2Align: 'center',
  text2LineSpacing: 5,
  text2LabelColor: 'transparent',
  text2LabelTransparency: 5,
});

function App() {
  const [isBackgroundDrawerOpen, setIsBackgroundDrawerOpen] = useState(false);
  const [isSolidColorDrawerOpen, setIsSolidColorDrawerOpen] = useState(false);
  const [isGradientDrawerOpen, setIsGradientDrawerOpen] = useState(false);
  const [isSearchDrawerOpen, setIsSearchDrawerOpen] = useState(false);
  const [isTextMenuDrawerOpen, setIsTextMenuDrawerOpen] = useState(false);
  const [isSizeDrawerOpen, setIsSizeDrawerOpen] = useState(false);
  const [isText1InputDrawerOpen, setIsText1InputDrawerOpen] = useState(false);
  const [isAboutDrawerOpen, setIsAboutDrawerOpen] = useState(false);
  const [isSaveDrawerOpen, setIsSaveDrawerOpen] = useState(false);

  // --- Carousel State ---
  const [slides, setSlides] = useState([createDefaultSlide()]);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const activeSlide = slides[activeSlideIndex];

  // Helper to update properties of the active slide immutably
  const updateActiveSlide = (updates) => {
    setSlides(currentSlides =>
      currentSlides.map((slide, index) =>
        index === activeSlideIndex ? { ...slide, ...updates } : slide
      )
    );
  };
  // --- Saved Projects State ---
  const [savedProjects, setSavedProjects] = useState([null, null, null]);

  const [activeTextElement, setActiveTextElement] = useState('text1');

  const backgroundImageInputRef = useRef(null);
  const logoImageInputRef = useRef(null);

  const sensors = useSensors(useSensor(PointerSensor));

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
        img.onload = () => updateActiveSlide({ backgroundImage: img });
        img.src = e.target.result; // This is a data URL
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
        img.onload = () => updateActiveSlide({ logoImage: img });
        img.src = e.target.result; // This is a data URL
      };
      reader.readAsDataURL(file);
      setIsBackgroundDrawerOpen(false);
    }
  };

  const handleRemoteImageSelect = (imageUrl) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => updateActiveSlide({ backgroundImage: img });
    img.src = imageUrl;
    setIsSearchDrawerOpen(false);
  }

  const handleText1InputDrawerOpen = () => {
    setActiveTextElement('text1');
    // TODO: Re-implement cancel functionality
    setIsTextMenuDrawerOpen(false);
    setIsText1InputDrawerOpen(true);
  };

  const handleText2InputDrawerOpen = () => {
    setActiveTextElement('text2');
    // TODO: Re-implement cancel functionality
    setIsTextMenuDrawerOpen(false);
    setIsText1InputDrawerOpen(true);
  };

  const handleText1InputDrawerClose = (confirm) => {
    if (!confirm) {
      // TODO: Re-implement cancel functionality
    }
    setIsText1InputDrawerOpen(false);
  };

  const handleText1InputConfirm = () => {
    // No need to pass text up, App already has it from live updates
    setIsText1InputDrawerOpen(false);
  }

  const handleDownload = () => {
    // TODO: This needs to be updated to get the ref of the active canvas
    alert('Download will be re-implemented in a future step.');
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to start over? This will delete all slides.')) {
      setSlides([createDefaultSlide()]);
      setActiveSlideIndex(0);
    }
  };

  // --- Carousel Logic ---
  const handleAddSlide = (index) => {
    const newSlide = createDefaultSlide();
    const newSlides = [...slides];
    newSlides.splice(index + 1, 0, newSlide);
    setSlides(newSlides);
    setActiveSlideIndex(index + 1);
  };

  const handleDuplicateSlide = (index) => {
    const slideToDuplicate = slides[index];
    const newSlide = { ...slideToDuplicate, id: Date.now() + Math.random() };
    const newSlides = [...slides];
    newSlides.splice(index + 1, 0, newSlide);
    setSlides(newSlides);
    setActiveSlideIndex(index + 1);
  };

  const handleDeleteSlide = (index) => {
    if (slides.length <= 1) {
      alert("You can't delete the last slide.");
      return;
    }
    if (window.confirm('Are you sure you want to delete this slide?')) {
      const newSlides = slides.filter((_, i) => i !== index);
      setSlides(newSlides);
      setActiveSlideIndex(Math.max(0, index - 1));
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setSlides((items) => {
        const oldIndex = items.findIndex(item => item.id === active.id);
        const newIndex = items.findIndex(item => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  // --- Project Save/Load Logic ---

  // Load projects from localStorage on initial render
  useEffect(() => {
    try {
      const storedProjects = localStorage.getItem('picflam_projects');
      if (storedProjects) {
        setSavedProjects(JSON.parse(storedProjects));
      }
    } catch (e) {
      console.error("Failed to load projects from localStorage", e);
    }
  }, []);

  const handleSaveProject = (slotIndex) => {
    alert('Save/Load will be re-implemented in a future step.');
  };

  const handleLoadProject = (slotIndex) => {
    alert('Save/Load will be re-implemented in a future step.');
  };

  const handleDeleteProject = (slotIndex) => {
    if (window.confirm('Delete project? This cannot be undone.')) {
      const newSavedProjects = [...savedProjects];
      newSavedProjects[slotIndex] = null;
      setSavedProjects(newSavedProjects);
      localStorage.setItem('picflam_projects', JSON.stringify(newSavedProjects));
    }
  };

  // This function is now passed to each Slide to draw itself
  const drawSlide = (canvas, slideData) => {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const { canvasSize, background, backgroundImage, logoImage } = slideData;

    // --- High-Resolution Canvas Setup ---
    const baseResolution = 2048; // Use a fixed high resolution for the canvas bitmap
    const [aspectX, aspectY] = canvasSize.split('/').map(Number);
    const canvasWidth = aspectX > aspectY ? baseResolution : baseResolution * (aspectX / aspectY);
    const canvasHeight = aspectY > aspectX ? baseResolution : baseResolution * (aspectY / aspectX);

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // --- Draw Background ---
    if (background.type === 'solid' && !backgroundImage) {
      ctx.fillStyle = background.value;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else if (background.type === 'gradient' && !backgroundImage) {
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      // This is a simplified version. You might need to parse the gradient string for more complex gradients.
      const colors = background.value.match(/#[0-9a-fA-F]{6}/g) || [];
      colors.forEach((color, index) => gradient.addColorStop(index / (colors.length - 1 || 1), color));
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    const drawImageOnCanvas = (img, isLogo = false) => {
      if (!img) return;
      const draw = () => {
        if (isLogo) {
          const logoMaxWidth = canvasWidth * 0.25;
          const logoMaxHeight = canvasHeight * 0.25;
          const logoAspectRatio = img.naturalWidth / img.naturalHeight;
          let logoWidth = logoMaxWidth;
          let logoHeight = logoWidth / logoAspectRatio;
          if (logoHeight > logoMaxHeight) {
            logoHeight = logoMaxHeight;
            logoWidth = logoHeight * logoAspectRatio;
          }
          const padding = canvasWidth * 0.05;
          const x = canvasWidth - logoWidth - padding;
          const y = canvasHeight - logoHeight - padding;
          ctx.drawImage(img, x, y, logoWidth, logoHeight);
        } else {
          // Background image logic
          const imgAspectRatio = img.naturalWidth / img.naturalHeight;
          const canvasAspectRatio = canvasWidth / canvasHeight;
          let renderWidth, renderHeight;
          if (imgAspectRatio > canvasAspectRatio) {
            renderWidth = canvasWidth;
            renderHeight = renderWidth / imgAspectRatio;
          } else {
            renderHeight = canvasHeight;
            renderWidth = renderHeight * imgAspectRatio;
          }
          ctx.drawImage(img, (canvasWidth - renderWidth) / 2, (canvasHeight - renderHeight) / 2, renderWidth, renderHeight);
        }
      };
      if (img.complete) {
        draw();
      } else {
        img.onload = draw;
      }
    };

    drawImageOnCanvas(backgroundImage);

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
            ctx.fillStyle = slideData.text1HighlightColor; // Use from slideData
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

    const {
      text1, text1Size, text1YPosition, text1Font, text1Color, text1IsBold, text1IsItalic, text1Align, text1LineSpacing, text1HasShadow, text1HasOutline, text1QuoteStyle, text1QuoteSize,
      text2, text2Size, text2YPosition, text2Font, text2Color, text2IsBold, text2IsItalic, text2Align, text2LineSpacing, text2LabelColor, text2LabelTransparency
    } = slideData;

    if (text1) {
      drawText(text1, text1Size, text1YPosition, text1Font, text1Color, text1IsBold, text1IsItalic, text1Align, text1LineSpacing, text1HasShadow, text1HasOutline, text1QuoteStyle, text1QuoteSize, false, 'transparent', 0);
    }

    if (text2) {
      drawText(text2, text2Size, text2YPosition, text2Font, text2Color, text2IsBold, text2IsItalic, text2Align, text2LineSpacing, false, false, 'none', 5, text2LabelColor !== 'transparent', text2LabelColor, text2LabelTransparency);
    }

    drawImageOnCanvas(logoImage, true);
  };

  return (
    <div className="app-container">
      <div className="canvas-container">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={slides.map(s => s.id)} strategy={verticalListSortingStrategy}>
            {slides.map((slide, index) => (
              <Slide
                key={slide.id}
                id={slide.id}
                slide={slide}
                isActive={index === activeSlideIndex}
                onClick={() => setActiveSlideIndex(index)}
                onAdd={() => handleAddSlide(index)}
                onDuplicate={() => handleDuplicateSlide(index)}
                onDelete={() => handleDeleteSlide(index)}
                drawSlide={drawSlide}
              />
            ))}
          </SortableContext>
        </DndContext>
      </div>

      <div className="footer-menu">
        <button className="footer-button" onClick={() => setIsSizeDrawerOpen(true)}><FiMaximize /></button>
        <button className="footer-button" onClick={() => setIsBackgroundDrawerOpen(true)}><FiImage /></button>
        <button className="footer-button" onClick={() => setIsTextMenuDrawerOpen(true)}><FiType /></button>
        <button className="footer-button" onClick={() => setIsSaveDrawerOpen(true)}><FiBookmark /></button>
        <button className="footer-button" onClick={handleDownload}><FiDownload /></button>
        <button className="footer-button" onClick={handleReset}><FiRotateCcw /></button>
        <button className="footer-button" onClick={() => setIsAboutDrawerOpen(true)}><FiInfo /></button>
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
          onSolidColorClick={() => setIsSolidColorDrawerOpen(true)}
          onGradientClick={() => setIsGradientDrawerOpen(true)}
          onSearchClick={handleSearchDrawerOpen}
          onLogoClick={handleLogoUploadClick}
        />
      )}

      {isSolidColorDrawerOpen && (
        <SolidColorDrawer
          onClose={() => setIsSolidColorDrawerOpen(false)}
          onColorChange={(color) => updateActiveSlide({ background: { type: 'solid', value: color } })}
          onConfirm={() => setIsSolidColorDrawerOpen(false)}
          currentColor={activeSlide.background.type === 'solid' ? activeSlide.background.value : '#ffffff'}
        />
      )}

      {isGradientDrawerOpen && (
        <GradientDrawer
          onClose={() => setIsGradientDrawerOpen(false)}
          onConfirm={() => setIsGradientDrawerOpen(false)}
          onGradientChange={(gradient) =>
            updateActiveSlide({ background: { type: 'gradient', value: gradient } })}
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
          text={activeTextElement === 'text1' ? activeSlide.text1 : activeSlide.text2}
          onTextChange={(value) => updateActiveSlide({ [activeTextElement]: value })}
          size={activeTextElement === 'text1' ? activeSlide.text1Size : activeSlide.text2Size}
          onSizeChange={(value) => updateActiveSlide({ [`${activeTextElement}Size`]: value })}
          yPosition={activeTextElement === 'text1' ? activeSlide.text1YPosition : activeSlide.text2YPosition}
          onYPositionChange={(value) => updateActiveSlide({ [`${activeTextElement}YPosition`]: value })}
          font={activeTextElement === 'text1' ? activeSlide.text1Font : activeSlide.text2Font}
          onFontChange={(value) => updateActiveSlide({ [`${activeTextElement}Font`]: value })}
          color={activeTextElement === 'text1' ? activeSlide.text1Color : activeSlide.text2Color}
          onColorChange={(value) => updateActiveSlide({ [`${activeTextElement}Color`]: value })}
          highlightColor={activeSlide.text1HighlightColor}
          onHighlightColorChange={(value) => updateActiveSlide({ text1HighlightColor: value })}
          isBold={activeTextElement === 'text1' ? activeSlide.text1IsBold : activeSlide.text2IsBold}
          onIsBoldChange={(value) => updateActiveSlide({ [`${activeTextElement}IsBold`]: value })}
          isItalic={activeTextElement === 'text1' ? activeSlide.text1IsItalic : activeSlide.text2IsItalic}
          onIsItalicChange={(value) => updateActiveSlide({ [`${activeTextElement}IsItalic`]: value })}
          textAlign={activeTextElement === 'text1' ? activeSlide.text1Align : activeSlide.text2Align}
          onTextAlignChange={(value) => updateActiveSlide({ [`${activeTextElement}Align`]: value })}
          lineSpacing={activeTextElement === 'text1' ? activeSlide.text1LineSpacing : activeSlide.text2LineSpacing}
          onLineSpacingChange={(value) => updateActiveSlide({ [`${activeTextElement}LineSpacing`]: value })}
          hasShadow={activeSlide.text1HasShadow}
          onHasShadowChange={(value) => updateActiveSlide({ text1HasShadow: value })}
          hasOutline={activeSlide.text1HasOutline}
          onHasOutlineChange={(value) => updateActiveSlide({ text1HasOutline: value })}
          quoteStyle={activeSlide.text1QuoteStyle}
          onQuoteStyleChange={(value) => updateActiveSlide({ text1QuoteStyle: value })}
          quoteSize={activeSlide.text1QuoteSize}
          onQuoteSizeChange={(value) => updateActiveSlide({ text1QuoteSize: value })}
          hasLabel={activeSlide.text2LabelColor !== 'transparent'}
          onHasLabelChange={() => {}} // Placeholder
          labelColor={activeSlide.text2LabelColor}
          onLabelColorChange={(value) => updateActiveSlide({ text2LabelColor: value })}
          labelTransparency={activeSlide.text2LabelTransparency}
          onLabelTransparencyChange={(value) => updateActiveSlide({ text2LabelTransparency: value })}
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
          onClose={() => setIsSizeDrawerOpen(false)}
          onCanvasSizeChange={(size) => updateActiveSlide({ canvasSize: size })}
          currentSize={activeSlide.canvasSize}
        />
      )}

      {isAboutDrawerOpen && (
        <AboutDrawer onClose={() => setIsAboutDrawerOpen(false)} />
      )}

      {isSaveDrawerOpen && (
        <SaveDrawer
          onClose={() => setIsSaveDrawerOpen(false)}
          savedProjects={savedProjects}
          onSave={handleSaveProject}
          onLoad={handleLoadProject}
          onDelete={handleDeleteProject}
        />
      )}
    </div>
  )
}

export default App
