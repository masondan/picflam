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
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  FiMaximize,
  FiImage,
  FiType,
  FiBookmark,
  FiDownload,
  FiRotateCcw,
  FiInfo
} from 'react-icons/fi';
import BackgroundDrawer from './components/BackgroundDrawer';
import ColorDrawer from './components/ColorDrawer';
import SearchDrawer from './components/SearchDrawer';
import TextMenuDrawer from './components/TextMenuDrawer';
import SizeDrawer from './components/SizeDrawer.jsx';
import Text1InputDrawer from './components/Text1InputDrawer';
import AboutDrawer from './components/AboutDrawer';
import SaveDrawer from './components/SaveDrawer';
import ImageDrawer from './components/ImageDrawer';
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
  canvasSize: '9/16',
  background: { type: 'gradient', value: 'linear-gradient(135deg, #8A2BE2 0%, #4B0082 100%)' },
  imageLayer: null,
  logoImage: null,
  text1: '',
  text1Size: 4.5,
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
  text1QuoteSize: 5, // Centered default quote size
  text2: '',
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
  const [isColorDrawerOpen, setIsColorDrawerOpen] = useState(false);
  const [isSearchDrawerOpen, setIsSearchDrawerOpen] = useState(false);
  const [isTextMenuDrawerOpen, setIsTextMenuDrawerOpen] = useState(false);
  const [isSizeDrawerOpen, setIsSizeDrawerOpen] = useState(false);
  const [isText1InputDrawerOpen, setIsText1InputDrawerOpen] = useState(false);
  const [isAboutDrawerOpen, setIsAboutDrawerOpen] = useState(false);
  const [isSaveDrawerOpen, setIsSaveDrawerOpen] = useState(false);
  const [editingLayer, setEditingLayer] = useState(null);

  const [slides, setSlides] = useState([createDefaultSlide()]);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const activeSlide = slides[activeSlideIndex];

  const slideRefs = useRef([]);

  const updateActiveSlide = (updates) => {
    setSlides(currentSlides =>
      currentSlides.map((slide, index) =>
        index === activeSlideIndex ? { ...slide, ...updates } : slide
      )
    );
  };

  const [activeTextElement, setActiveTextElement] = useState('text1');
  const [originalSlideState, setOriginalSlideState] = useState(null);

  const backgroundImageInputRef = useRef(null);
  const logoImageInputRef = useRef(null);
  const imageDrawerRef = useRef(null);

  useEffect(() => {
    const activeSlideRef = slideRefs.current[activeSlideIndex];
    if (activeSlideRef) {
      activeSlideRef.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest'
      });
    }
  }, [activeSlideIndex]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!editingLayer) return;
      const activeCanvasWrapper = slideRefs.current[activeSlideIndex]?.getCanvasWrapperRef()?.current;
      const imageDrawer = imageDrawerRef.current;
      if (activeCanvasWrapper?.contains(event.target) || imageDrawer?.contains(event.target)) {
        return;
      }
      setEditingLayer(null);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [editingLayer, activeSlideIndex]);

  const sensors = useSensors(useSensor(PointerSensor));

  const handleSizeDrawerOpen = () => {
    setOriginalSlideState(activeSlide);
    setIsSizeDrawerOpen(true);
  };

  const handleSizeDrawerClose = (confirm) => {
    if (!confirm && originalSlideState) {
      updateActiveSlide({ canvasSize: originalSlideState.canvasSize });
    }
    setOriginalSlideState(null);
    setIsSizeDrawerOpen(false);
  };

  const handleImageUploadClick = () => backgroundImageInputRef.current.click();
  const handleLogoUploadClick = () => logoImageInputRef.current.click();

  const handleFileChange = (event, layer) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const newLayer = {
            img: img,
            scale: layer === 'logoImage' ? 0.5 : 1,
            opacity: 1,
            x: 0,
            y: 0,
            fitMode: 'fit',
          };
          updateActiveSlide({ [layer]: newLayer });
          setEditingLayer(layer);
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
      setIsBackgroundDrawerOpen(false);
    }
  };

  const handleRemoteImageSelect = (imageUrl) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      updateActiveSlide({
        imageLayer: { img: img, scale: 1, opacity: 1, x: 0, y: 0, fitMode: 'fit' }
      });
      setEditingLayer('imageLayer');
    };
    img.src = imageUrl;
    setIsSearchDrawerOpen(false);
  };

  const handleText1InputDrawerOpen = () => {
    setActiveTextElement('text1');
    setOriginalSlideState(activeSlide);
    setIsTextMenuDrawerOpen(false);
    setIsText1InputDrawerOpen(true);
  };

  const handleText2InputDrawerOpen = () => {
    setActiveTextElement('text2');
    setOriginalSlideState(activeSlide);
    setIsTextMenuDrawerOpen(false);
    setIsText1InputDrawerOpen(true);
  };

  const handleTextEditorClose = (confirm) => {
    if (!confirm && originalSlideState) {
      const oldTextState = {
        text1: originalSlideState.text1, text1Size: originalSlideState.text1Size, text1YPosition: originalSlideState.text1YPosition, text1Font: originalSlideState.text1Font, text1Color: originalSlideState.text1Color, text1HighlightColor: originalSlideState.text1HighlightColor, text1IsBold: originalSlideState.text1IsBold, text1IsItalic: originalSlideState.text1IsItalic, text1Align: originalSlideState.text1Align, text1LineSpacing: originalSlideState.text1LineSpacing, text1HasShadow: originalSlideState.text1HasShadow, text1HasOutline: originalSlideState.text1HasOutline, text1QuoteStyle: originalSlideState.text1QuoteStyle, text1QuoteSize: originalSlideState.text1QuoteSize,
        text2: originalSlideState.text2, text2Size: originalSlideState.text2Size, text2YPosition: originalSlideState.text2YPosition, text2Font: originalSlideState.text2Font, text2Color: originalSlideState.text2Color, text2IsBold: originalSlideState.text2IsBold, text2IsItalic: originalSlideState.text2IsItalic, text2Align: originalSlideState.text2Align, text2LineSpacing: originalSlideState.text2LineSpacing, text2LabelColor: originalSlideState.text2LabelColor, text2LabelTransparency: originalSlideState.text2LabelTransparency,
      };
      updateActiveSlide(oldTextState);
    }
    setOriginalSlideState(null);
    setIsText1InputDrawerOpen(false);
    if (confirm) setIsTextMenuDrawerOpen(true);
  };

  const handleFontChange = (fontFamily) => {
    const isBold = fontFamily === 'Inter';
    updateActiveSlide({ [`${activeTextElement}Font`]: fontFamily, [`${activeTextElement}IsBold`]: isBold });
  };

  const handleHasLabelChange = (hasLabel) => {
    if (activeTextElement === 'text2') {
      updateActiveSlide({
        text2LabelColor: hasLabel ? activeSlide.text2LabelColor === 'transparent' ? '#000000' : activeSlide.text2LabelColor : 'transparent'
      });
    }
  };

  const handleDownload = async () => {
    const activeCanvas = slideRefs.current[activeSlideIndex]?.getCanvasRef()?.current;
    if (!activeCanvas) {
      alert('Could not find the canvas to download.');
      return;
    }

    try {
      // Force a re-draw at high resolution and wait for it to complete
      await drawSlide(activeCanvas, activeSlide);

      // Now that the promise is resolved, the canvas should be ready.
      const link = document.createElement('a');
      link.download = 'picflam-export.png';
      link.href = activeCanvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error("Failed to draw slide for download:", error);
      alert("An error occurred while preparing the download. Please check the console for details.");
    }
  };

  const [savedProjects, setSavedProjects] = useState([null, null, null]);

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
    const activeCanvas = slideRefs.current[activeSlideIndex]?.getCanvasRef()?.current;
    if (!activeCanvas) {
      alert("Cannot save, active canvas not found.");
      return;
    }
    const thumbnail = activeCanvas.toDataURL('image/jpeg', 0.5);
    const projectData = { slides, thumbnail };

    const newSavedProjects = [...savedProjects];
    newSavedProjects[slotIndex] = projectData;
    setSavedProjects(newSavedProjects);
    localStorage.setItem('picflam_projects', JSON.stringify(newSavedProjects));
    alert(`Project saved to slot ${slotIndex + 1}.`);
  };

  const handleLoadProject = (slotIndex) => {
    const projectToLoad = savedProjects[slotIndex];
    if (projectToLoad && window.confirm('Load this project? Any unsaved changes will be lost.')) {
      // This is a simplified version. A full implementation would handle re-creating image objects.
      setSlides(projectToLoad.slides);
      setActiveSlideIndex(0);
      alert(`Project loaded from slot ${slotIndex + 1}.`);
    }
  };

  const handleDeleteProject = (slotIndex) => {
    if (window.confirm(`Are you sure you want to delete project in slot ${slotIndex + 1}?`)) {
      const newSavedProjects = [...savedProjects];
      newSavedProjects[slotIndex] = null;
      setSavedProjects(newSavedProjects);
      localStorage.setItem('picflam_projects', JSON.stringify(newSavedProjects));
    }
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to start over? This will delete all slides.')) {
      setSlides([createDefaultSlide()]);
      setActiveSlideIndex(0);
    }
  };

  const handleCanvasClick = (index, event) => {
    setActiveSlideIndex(index);
    const slide = slides[index];
    const canvasWrapper = slideRefs.current[index]?.getCanvasWrapperRef()?.current;
    if (!canvasWrapper) { setEditingLayer(null); return; }
    const rect = canvasWrapper.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;

    const getControlBox = (canvas, imageLayer) => {
      if (!imageLayer || !imageLayer.img) return null;
      const { img, scale, fitMode, x = 0, y = 0 } = imageLayer;
      const canvasWidth = canvas.offsetWidth;
      const canvasHeight = canvas.offsetHeight;
      const imgAspectRatio = img.naturalWidth / img.naturalHeight;
      const canvasAspectRatio = canvasWidth / canvasHeight;
      let renderWidth, renderHeight;
      if (fitMode === 'fill' ? (imgAspectRatio > canvasAspectRatio) : (imgAspectRatio < canvasAspectRatio)) {
        renderHeight = canvasHeight; renderWidth = renderHeight * imgAspectRatio;
      } else {
        renderWidth = canvasWidth; renderHeight = renderWidth / imgAspectRatio;
      }
      renderWidth *= scale; renderHeight *= scale;
      return { left: (canvasWidth - renderWidth) / 2 + x, top: (canvasHeight - renderHeight) / 2 + y, width: renderWidth, height: renderHeight };
    };

    if (slide.logoImage) {
      const box = getControlBox(canvasWrapper, slide.logoImage);
      if (box && clickX >= box.left && clickX <= box.left + box.width && clickY >= box.top && clickY <= box.top + box.height) {
        setEditingLayer('logoImage'); return;
      }
    }
    if (slide.imageLayer) {
      const box = getControlBox(canvasWrapper, slide.imageLayer);
      if (box && clickX >= box.left && clickX <= box.left + box.width && clickY >= box.top && clickY <= box.top + box.height) {
        setEditingLayer('imageLayer'); return;
      }
    }
    setEditingLayer(null);
  };

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
    if (slides.length <= 1) { alert("You can't delete the last slide."); return; }
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

  const drawSlide = (canvas, slideData) => new Promise((resolve, reject) => {
    if (!canvas) return reject(new Error('Canvas not found'));
    const ctx = canvas.getContext('2d');
    const { canvasSize, background, imageLayer, logoImage } = slideData;
    const baseResolution = 2048;
    const [aspectX, aspectY] = canvasSize.split('/').map(Number);
    const canvasWidth = aspectX > aspectY ? baseResolution : baseResolution * (aspectX / aspectY);
    const canvasHeight = aspectY > aspectX ? baseResolution : baseResolution * (aspectY / aspectX);
    canvas.width = canvasWidth; canvas.height = canvasHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (background.type === 'solid') {
      ctx.fillStyle = background.value;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else if (background.type === 'gradient') {
      const gradientRegex = /linear-gradient\((\d+)deg, (.*?) 0%, (.*?) 100%\)/;
      const match = background.value.match(gradientRegex);
      let gradient;
      if (match) {
        const angle = parseInt(match[1], 10) * (Math.PI / 180);
        const color1 = match[2]; const color2 = match[3];
        const x0 = canvas.width / 2 * (1 - Math.cos(angle)); const y0 = canvas.height / 2 * (1 - Math.sin(angle));
        const x1 = canvas.width / 2 * (1 + Math.cos(angle)); const y1 = canvas.height / 2 * (1 + Math.sin(angle));
        gradient = ctx.createLinearGradient(x0, y0, x1, y1);
        gradient.addColorStop(0, color1); gradient.addColorStop(1, color2);
      } else {
        gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, '#8A2BE2'); gradient.addColorStop(1, '#4B0082');
      }
      ctx.fillStyle = gradient; ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    const drawImageOnCanvas = (layer) => new Promise((resolveDraw) => {
      if (!layer || !layer.img) return resolveDraw();
      const { img, scale = 1, opacity = 1, fitMode = 'fit', x = 0, y = 0 } = layer;

      const doDrawing = () => {
        try {
          ctx.globalAlpha = opacity;
          const displayedCanvasWidth = canvas.offsetWidth;
          const displayedCanvasHeight = canvas.offsetHeight;
          if (displayedCanvasWidth === 0 || displayedCanvasHeight === 0) return resolveDraw();
          const imgAspectRatio = img.naturalWidth / img.naturalHeight;
          const canvasAspectRatio = displayedCanvasWidth / displayedCanvasHeight;
          let renderWidth, renderHeight;
          if (fitMode === 'fill' ? (imgAspectRatio > canvasAspectRatio) : (imgAspectRatio < canvasAspectRatio)) {
            renderHeight = displayedCanvasHeight; renderWidth = renderHeight * imgAspectRatio;
          } else {
            renderWidth = displayedCanvasWidth; renderHeight = renderWidth / imgAspectRatio;
          }
          renderWidth *= scale; renderHeight *= scale;
          const scaleToHighRes = displayedCanvasWidth > 0 ? canvas.width / displayedCanvasWidth : 0;
          const renderWidthHighRes = renderWidth * scaleToHighRes; const renderHeightHighRes = renderHeight * scaleToHighRes;
          const xHighRes = x * scaleToHighRes; const yHighRes = y * scaleToHighRes;
          ctx.drawImage(img, (canvas.width - renderWidthHighRes) / 2 + xHighRes, (canvas.height - renderHeightHighRes) / 2 + yHighRes, renderWidthHighRes, renderHeightHighRes);
          ctx.globalAlpha = 1.0;
          resolveDraw();
        } catch (e) {
          console.error("Error drawing image:", e);
          resolveDraw(); // Resolve anyway to not block the process
        }
      };

      if (img.complete && img.naturalWidth) {
        doDrawing();
      } else {
        img.onload = doDrawing;
        img.onerror = () => {
          console.error(`Failed to load image for drawing: ${img.src.slice(0, 100)}...`);
          resolveDraw(); // Resolve anyway
        };
      }
    });

    const drawText = (text, size, yPos, font, color, isBold, isItalic, align, lineSpacing, hasShadow, hasOutline, quoteStyle, quoteSize, hasLabel, labelColor, labelTransparency) => {
      const baseFontSize = Math.min(canvasWidth, canvasHeight) * 0.1;
      const fontSize = baseFontSize * (size / 5);
      const finalLineSpacing = 0.8 + (lineSpacing / 10) * (1.4 - 0.8); // Range from 0.8 to 1.4, 1.1 is center
      const lineHeight = fontSize * finalLineSpacing;
      const fontWeight = isBold ? 'bold' : 'normal';
      const fontStyle = isItalic ? 'italic' : 'normal';
      const finalFont = `${fontStyle} ${fontWeight} ${fontSize}px "${font}", sans-serif`;
      const maxWidth = canvasWidth * 0.8;
      const yPosition = canvasHeight * (yPos / 10);
      ctx.font = finalFont; ctx.textAlign = align; ctx.textBaseline = 'middle';
      const paragraphs = text.split('\n'); const lines = []; let widestLine = 0;
      paragraphs.forEach(paragraph => {
        const words = paragraph.split(' '); let line = '';
        for (let n = 0; n < words.length; n++) {
          const testLine = line + words[n] + ' '; const metrics = ctx.measureText(testLine); const testWidth = metrics.width;
          if (testWidth > maxWidth && n > 0) {
            lines.push(line); if (ctx.measureText(line).width > widestLine) { widestLine = ctx.measureText(line).width; }
            line = words[n] + ' ';
          } else { line = testLine; }
        }
        lines.push(line); if (ctx.measureText(line).width > widestLine) { widestLine = ctx.measureText(line).width; }
      });
      const totalTextHeight = lines.length * lineHeight; let currentY = yPosition - (totalTextHeight / 2) + (lineHeight / 2);
      if (quoteStyle !== 'none') {
        const quoteSizeVal = baseFontSize * 4 * (quoteSize / 5); let quoteFont = ''; // Doubled the multiplier from 2 to 4
        if (quoteStyle === 'serif') { quoteFont = `${quoteSizeVal}px "Saira Stencil One", sans-serif`; }
        else if (quoteStyle === 'slab') { quoteFont = `${quoteSizeVal}px "Ultra", serif`; }
        else if (quoteStyle === 'fancy') { quoteFont = `bold ${quoteSizeVal}px "Playfair Display SC", serif`; }
        ctx.font = quoteFont;
        ctx.fillStyle = color;
        const quoteY = yPosition - (totalTextHeight / 2) - (quoteSizeVal * 0.6); // Position relative to its own size
        const originalAlign = ctx.textAlign; // Save original alignment
        ctx.textAlign = 'center'; // Force center for the quote
        ctx.fillText('“', canvasWidth / 2, quoteY); // Always draw in the middle
        ctx.textAlign = originalAlign; // Restore original alignment
      }
      ctx.font = finalFont;
      if (hasLabel) {
        ctx.fillStyle = hexToRgba(labelColor, labelTransparency / 10); const padding = lineHeight * 0.4;
        const labelY = yPosition - (totalTextHeight / 2); const labelHeight = totalTextHeight + padding;
        const labelWidth = widestLine + padding * 2;
        ctx.fillRect(canvasWidth / 2 - labelWidth / 2, labelY - padding / 2, labelWidth, labelHeight);
      }
      for (let i = 0; i < lines.length; i++) {
        if (hasShadow) { ctx.shadowColor = 'rgba(0,0,0,0.5)'; ctx.shadowBlur = 5; ctx.shadowOffsetX = 5; ctx.shadowOffsetY = 5; }
        else { ctx.shadowColor = 'transparent'; ctx.shadowBlur = 0; ctx.shadowOffsetX = 0; ctx.shadowOffsetY = 0; }
        const lineText = lines[i].trim(); const lineParts = lineText.split(/(==[^=]+==)/g);
        let lineX;
        if (align === 'left') {
          lineX = (canvasWidth - maxWidth) / 2;
        } else if (align === 'right') {
          lineX = canvasWidth - ((canvasWidth - maxWidth) / 2);
        } else { // center
          lineX = canvasWidth / 2;
        }

        for (const part of lineParts) {
          if (part.startsWith('==') && part.endsWith('==')) {
            const highlightedText = part.substring(2, part.length - 2);
            ctx.fillStyle = slideData.text1HighlightColor;
            ctx.fillText(highlightedText, lineX, currentY);
          } else {
            ctx.fillStyle = color;
            ctx.fillText(part, lineX, currentY);
          }
        }
        if (hasOutline) {
          ctx.strokeStyle = 'black'; ctx.lineWidth = fontSize * 0.05; ctx.strokeText(lineText.replace(/==/g, ''), lineX, currentY);
        }
        currentY += lineHeight;
      }
    };
    const { text1, text1Size, text1YPosition, text1Font, text1Color, text1IsBold, text1IsItalic, text1Align, text1LineSpacing, text1HasShadow, text1HasOutline, text1QuoteStyle, text1QuoteSize, text2, text2Size, text2YPosition, text2Font, text2Color, text2IsBold, text2IsItalic, text2Align, text2LineSpacing, text2LabelColor, text2LabelTransparency } = slideData;

    // Chain the drawing promises
    drawImageOnCanvas(imageLayer)
      .then(() => {
        if (text1) { drawText(text1, text1Size, text1YPosition, text1Font, text1Color, text1IsBold, text1IsItalic, text1Align, text1LineSpacing, text1HasShadow, text1HasOutline, text1QuoteStyle, text1QuoteSize, false, 'transparent', 0); }
        if (text2) { drawText(text2, text2Size, text2YPosition, text2Font, text2Color, text2IsBold, text2IsItalic, text2Align, text2LineSpacing, false, false, 'none', 5, text2LabelColor !== 'transparent', text2LabelColor, text2LabelTransparency); }
        return drawImageOnCanvas(logoImage);
      })
      .then(() => {
        resolve(); // All drawing is complete
      })
      .catch(reject); // Catch any error from the drawing chain
  });

  return (
    <div className="app-container">
      <div className="canvas-container">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd} >
          <SortableContext items={slides.map(s => s.id)} strategy={horizontalListSortingStrategy}>
            {slides.map((slide, index) => (
              <Slide
                key={slide.id} id={slide.id} ref={el => slideRefs.current[index] = el}
                slide={slide} isActive={index === activeSlideIndex} onClick={(e) => handleCanvasClick(index, e)}
                onAdd={() => handleAddSlide(index)} onDuplicate={() => handleDuplicateSlide(index)}
                onDelete={() => handleDeleteSlide(index)} drawSlide={drawSlide}
                editingLayer={index === activeSlideIndex ? editingLayer : null}
                onImageUpdate={(updates) => updateActiveSlide({ imageLayer: { ...activeSlide.imageLayer, ...updates } })}
                onImageDelete={() => { updateActiveSlide({ imageLayer: null }); setEditingLayer(null); }}
                onLogoUpdate={(updates) => updateActiveSlide({ logoImage: { ...activeSlide.logoImage, ...updates } })}
                onLogoDelete={() => { updateActiveSlide({ logoImage: null }); setEditingLayer(null); }}
              />
            ))}
          </SortableContext>
        </DndContext>
      </div>

      <div className={`footer-menu ${isBackgroundDrawerOpen || isColorDrawerOpen || isSearchDrawerOpen || isTextMenuDrawerOpen || isSizeDrawerOpen || isText1InputDrawerOpen || isAboutDrawerOpen || isSaveDrawerOpen || editingLayer ? 'hidden' : ''}`}>
        <button className="footer-button" onClick={handleSizeDrawerOpen}><FiMaximize /></button>
        <button className="footer-button" onClick={() => setIsBackgroundDrawerOpen(true)}><FiImage /></button>
        <button className="footer-button" onClick={() => setIsTextMenuDrawerOpen(true)}><FiType /></button>
        <button className="footer-button" onClick={() => setIsSaveDrawerOpen(true)}><FiBookmark /></button>
        <button className="footer-button" onClick={handleDownload}><FiDownload /></button>
        <button className="footer-button" onClick={handleReset}><FiRotateCcw /></button>
        <button className="footer-button" onClick={() => setIsAboutDrawerOpen(true)}><FiInfo /></button>
      </div>

      <input type="file" ref={backgroundImageInputRef} onChange={(e) => handleFileChange(e, 'imageLayer')} accept="image/*" style={{ display: 'none' }} />
      <input type="file" ref={logoImageInputRef} onChange={(e) => handleFileChange(e, 'logoImage')} accept="image/*" style={{ display: 'none' }} />

      {isBackgroundDrawerOpen && (
        <BackgroundDrawer
          onClose={() => setIsBackgroundDrawerOpen(false)}
          onColorClick={() => { setIsBackgroundDrawerOpen(false); setIsColorDrawerOpen(true); }}
          onImageUpload={handleImageUploadClick}
          onSearchClick={() => { setIsBackgroundDrawerOpen(false); setIsSearchDrawerOpen(true); }}
          onLogoClick={handleLogoUploadClick}
          currentBackground={activeSlide.background}
        />
      )}

      {editingLayer && activeSlide[editingLayer] && (
        <ImageDrawer
          ref={imageDrawerRef}
          onClose={() => setEditingLayer(null)}
          imageLayer={activeSlide[editingLayer]}
          isLogo={editingLayer === 'logoImage'}
          onUpdate={(updates) => updateActiveSlide({ [editingLayer]: { ...activeSlide[editingLayer], ...updates } })}
          onImageDelete={() => { updateActiveSlide({ [editingLayer]: null }); setEditingLayer(null); }} />
      )}

      {isColorDrawerOpen && (
        <ColorDrawer onClose={() => setIsColorDrawerOpen(false)} onBackgroundChange={(bg) => updateActiveSlide({ background: bg })} currentBackground={activeSlide.background} />
      )}

      {isTextMenuDrawerOpen && (
        <TextMenuDrawer onClose={() => setIsTextMenuDrawerOpen(false)} onText1Click={handleText1InputDrawerOpen} onText2Click={handleText2InputDrawerOpen} />
      )}

      {isText1InputDrawerOpen && (
        <Text1InputDrawer
          onClose={() => handleTextEditorClose(false)} onConfirm={() => handleTextEditorClose(true)}
          activeTextElement={activeTextElement}
          text={activeTextElement === 'text1' ? activeSlide.text1 : activeSlide.text2}
          onTextChange={(value) => updateActiveSlide({ [activeTextElement]: value })}
          size={activeTextElement === 'text1' ? activeSlide.text1Size : activeSlide.text2Size}
          onSizeChange={(value) => updateActiveSlide({ [`${activeTextElement}Size`]: value })}
          yPosition={activeTextElement === 'text1' ? activeSlide.text1YPosition : activeSlide.text2YPosition}
          onYPositionChange={(value) => updateActiveSlide({ [`${activeTextElement}YPosition`]: value })}
          font={activeTextElement === 'text1' ? activeSlide.text1Font : activeSlide.text2Font}
          onFontChange={handleFontChange}
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
          hasLabel={activeTextElement === 'text2' && activeSlide.text2LabelColor !== 'transparent'}
          onHasLabelChange={handleHasLabelChange}
          labelColor={activeSlide.text2LabelColor}
          onLabelColorChange={(value) => updateActiveSlide({ text2LabelColor: value })}
          labelTransparency={activeSlide.text2LabelTransparency}
          onLabelTransparencyChange={(value) => updateActiveSlide({ text2LabelTransparency: value })}
        />
      )}

      {isSearchDrawerOpen && (
        <SearchDrawer onClose={() => setIsSearchDrawerOpen(false)} onImageSelect={handleRemoteImageSelect} />
      )}

      {isSizeDrawerOpen && (
        <SizeDrawer onClose={handleSizeDrawerClose} onCanvasSizeChange={(size) => updateActiveSlide({ canvasSize: size })} currentSize={activeSlide.canvasSize} />
      )}

      {isAboutDrawerOpen && (<AboutDrawer onClose={() => setIsAboutDrawerOpen(false)} />)}
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
