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
  FiBookmark,
  FiDownload,
  FiRotateCcw
} from 'react-icons/fi';
import BackgroundDrawer from './components/BackgroundDrawer';
import ColorDrawer from './components/ColorDrawer';
import SearchDrawer from './components/SearchDrawer';
import SizeDrawer from './components/SizeDrawer.jsx';
import SaveDrawer from './components/SaveDrawer';
import ImageDrawer from './components/ImageDrawer';
import Slide from './components/Slide';
import TextToolbar from './components/TextToolbar';

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
  const [isSizeDrawerOpen, setIsSizeDrawerOpen] = useState(false);
  const [isSaveDrawerOpen, setIsSaveDrawerOpen] = useState(false);
  const [editingLayer, setEditingLayer] = useState(null);
  const [textEditMode, setTextEditMode] = useState(null); // null | 'text1' | 'text2'
  const [textToolbarTab, setTextToolbarTab] = useState('edit');

  const [slides, setSlides] = useState([createDefaultSlide()]);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const activeSlide = slides[activeSlideIndex];

  const slideRefs = useRef([]);
  const isNavScrolling = useRef(false);

  const updateActiveSlide = (updates) => {
    setSlides(currentSlides =>
      currentSlides.map((slide, index) =>
        index === activeSlideIndex ? { ...slide, ...updates } : slide
      )
    );
  };

    const [originalSlideState, setOriginalSlideState] = useState(null);

  const backgroundImageInputRef = useRef(null);
  const logoImageInputRef = useRef(null);
  const imageDrawerRef = useRef(null);

  useEffect(() => {
    const activeSlideRef = slideRefs.current[activeSlideIndex];
    if (activeSlideRef) {
      isNavScrolling.current = true;
      requestAnimationFrame(() => {
        activeSlideRef.scrollIntoView({
          behavior: 'smooth',
          inline: 'center',
          block: 'nearest'
        });
      });
    }
  }, [activeSlideIndex]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10, // small movement required to start a drag; allows casual swipe to scroll
      },
    })
  );

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
    setIsBackgroundDrawerOpen(false);
  };

  
  
  
  
  // Ensure quote fonts are loaded before drawing, so first tap uses the correct font
  useEffect(() => {
    const style = activeSlide.text1QuoteStyle;
    if (!style || style === 'none') return;
    const fontSpec = style === 'serif'
      ? `bold 100px "Playfair Display"`
      : style === 'slab'
        ? `100px "Alfa Slab One"`
        : `100px "Saira Stencil One"`;
    try {
      if (document.fonts && document.fonts.load) {
        document.fonts.load(fontSpec, '“').then(() => {
          const canvas = slideRefs.current[activeSlideIndex]?.getCanvasRef()?.current;
          if (canvas) {
            // Redraw with the loaded font
            drawSlide(canvas, activeSlide).catch(() => {});
          }
        });
      }
    } catch {}
  }, [activeSlide.text1QuoteStyle, activeSlide.text1QuoteSize, activeSlideIndex]);

  
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

  const handleImageDrawerClose = () => {
    // Always return to the background/image import drawer on confirm
    setIsBackgroundDrawerOpen(true);
    setEditingLayer(null);
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to start over? This will delete all slides.')) {
      setSlides([createDefaultSlide()]);
      setActiveSlideIndex(0);
    }
  };

  // Compute the CSS-pixel bounding box of a text block relative to the canvas, then convert to wrapper-relative coords
  const computeTextBounds = (canvasEl, wrapperEl, slideData, which) => {
    if (!canvasEl || !wrapperEl) return null;
    const canvasRect = canvasEl.getBoundingClientRect();
    const wrapperRect = wrapperEl.getBoundingClientRect();
    const canvasCssWidth = canvasRect.width;
    const canvasCssHeight = canvasRect.height;

    const isText1 = which === 'text1';
    const text = isText1 ? slideData.text1 : slideData.text2;
    if (!text) return null;

    const size = isText1 ? slideData.text1Size : slideData.text2Size;
    const yPos = isText1 ? slideData.text1YPosition : slideData.text2YPosition;
    const font = isText1 ? slideData.text1Font : slideData.text2Font;
    const isBold = isText1 ? slideData.text1IsBold : slideData.text2IsBold;
    const isItalic = isText1 ? slideData.text1IsItalic : slideData.text2IsItalic;
    const align = isText1 ? slideData.text1Align : slideData.text2Align;
    const lineSpacing = isText1 ? slideData.text1LineSpacing : slideData.text2LineSpacing;

    // CSS pixel font metrics parallel to drawText
    const baseFontSize = Math.min(canvasCssWidth, canvasCssHeight) * 0.1;
    const fontSize = baseFontSize * (size / 5);
    const finalLineSpacing = 0.8 + (lineSpacing / 10) * (1.4 - 0.8);
    const lineHeight = fontSize * finalLineSpacing;
    const maxWidth = canvasCssWidth * 0.8;
    const yPosition = canvasCssHeight * (yPos / 10);

    // Measure wrapped lines using the same algorithm
    const ctx = canvasEl.getContext('2d');
    ctx.save();
    const fontWeight = isBold ? 'bold' : 'normal';
    const fontStyle = isItalic ? 'italic' : 'normal';
    ctx.font = `${fontStyle} ${fontWeight} ${fontSize}px "${font}", sans-serif`;
    ctx.textBaseline = 'middle';
    const paragraphs = text.split('\n');
    const lines = [];
    let widestLine = 0;

    for (const paragraph of paragraphs) {
      const words = paragraph.split(' ');
      let line = '';
      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const testWidth = ctx.measureText(testLine).width;
        if (testWidth > maxWidth && n > 0) {
          lines.push(line);
          const widthLine = ctx.measureText(line).width;
          if (widthLine > widestLine) widestLine = widthLine;
          line = words[n] + ' ';
        } else {
          line = testLine;
        }
      }
      lines.push(line);
      const widthLine = ctx.measureText(line).width;
      if (widthLine > widestLine) widestLine = widthLine;
    }
    ctx.restore();

    const totalTextHeight = lines.length * lineHeight;
    const textTop = yPosition - (totalTextHeight / 2);
    let left;
    if (align === 'left') {
      left = (canvasCssWidth - maxWidth) / 2;
    } else if (align === 'right') {
      left = canvasCssWidth - ((canvasCssWidth - maxWidth) / 2) - widestLine;
    } else {
      left = (canvasCssWidth / 2) - (widestLine / 2);
    }
    let top = textTop;
    let width = widestLine;
    let height = totalTextHeight;

    // Include label background for text2 if present (centered rectangle)
    if (!isText1 && slideData.text2LabelColor !== 'transparent') {
      const paddingHorizontal = lineHeight * 0.6;
      const paddingTop = lineHeight * 0.5;
      const paddingBottom = lineHeight * 0.3;
      const labelWidth = widestLine + paddingHorizontal * 2;
      const labelHeight = totalTextHeight + paddingTop + paddingBottom;
      let labelX;
      if (align === 'left') {
        labelX = (canvasCssWidth - maxWidth) / 2 - paddingHorizontal;
      } else if (align === 'right') {
        labelX = canvasCssWidth - ((canvasCssWidth - maxWidth) / 2) - widestLine - paddingHorizontal;
      } else {
        labelX = (canvasCssWidth / 2) - (widestLine / 2) - paddingHorizontal;
      }
      const labelY = yPosition - (totalTextHeight / 2) - paddingTop;

      left = labelX;
      top = labelY;
      width = labelWidth;
      height = labelHeight;
    }

    // Optionally include leading quote for text1 (match draw positioning)
    if (isText1 && slideData.text1QuoteStyle && slideData.text1QuoteStyle !== 'none') {
      const quoteStyle = slideData.text1QuoteStyle;
      const quoteSize = slideData.text1QuoteSize;
      const quoteSizeVal = (Math.min(canvasCssWidth, canvasCssHeight) * 0.1) * 4 * (quoteSize / 5);
      const ctx2 = canvasEl.getContext('2d');
      ctx2.save();
      if (quoteStyle === 'serif') {
        ctx2.font = `bold ${quoteSizeVal}px "Playfair Display", serif`;
      } else if (quoteStyle === 'slab') {
        ctx2.font = `${quoteSizeVal}px "Alfa Slab One", cursive`;
      } else {
        ctx2.font = `${quoteSizeVal}px "Saira Stencil One", sans-serif`;
      }
      const m = ctx2.measureText('“');
      const quoteHeight = ((m.actualBoundingBoxAscent || 0) + (m.actualBoundingBoxDescent || 0)) || quoteSizeVal;
      ctx2.restore();
      const gap = (quoteStyle === 'slab' ? lineHeight * 0.35 : lineHeight * 0.4); // match drawText gap
      const quoteBottom = textTop - gap;
      const quoteTop = quoteBottom - quoteHeight;
      const newTop = Math.min(top, quoteTop);
      height = (top + height) - newTop;
      top = newTop;
    }

    // Convert to wrapper-relative coordinates
    const absLeft = (canvasRect.left - wrapperRect.left) + left;
    const absTop = (canvasRect.top - wrapperRect.top) + top;

    return {
      left: Math.round(absLeft),
      top: Math.round(absTop),
      width: Math.round(width),
      height: Math.round(height),
    };
  };

  const handleCanvasClick = (index, event) => {
    setActiveSlideIndex(index);

    // If the click is on an existing transform control, do nothing. This prevents
    // an active image from being deselected when trying to drag it.
    if (event.target.closest('.image-transform-controls')) {
      return;
    }

    const slide = slides[index];
    const canvasWrapper = slideRefs.current[index]?.getCanvasWrapperRef()?.current;
    if (!canvasWrapper) {
      setEditingLayer(null);
      return;
    }
    const rect = canvasWrapper.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;

    // Hit test text blocks first (Text2 on top of Text1 by typical visual order)
    const canvasEl = slideRefs.current[index]?.getCanvasRef()?.current;
    const text2Box = computeTextBounds(canvasEl, canvasWrapper, slide, 'text2');
    if (text2Box && clickX >= text2Box.left && clickX <= text2Box.left + text2Box.width && clickY >= text2Box.top && clickY <= text2Box.top + text2Box.height) {
      setEditingLayer(null);
      setTextEditMode('text2');
      setTextToolbarTab('menu');
      return;
    }
    const text1Box = computeTextBounds(canvasEl, canvasWrapper, slide, 'text1');
    if (text1Box && clickX >= text1Box.left && clickX <= text1Box.left + text1Box.width && clickY >= text1Box.top && clickY <= text1Box.top + text1Box.height) {
      setEditingLayer(null);
      setTextEditMode('text1');
      setTextToolbarTab('menu');
      return;
    }

    const getControlBox = (canvas, imageLayer) => {
      if (!imageLayer || !imageLayer.img) return null;
      const { img, scale, fitMode, x = 0, y = 0 } = imageLayer;
      const canvasWidth = canvas.offsetWidth;
      const canvasHeight = canvas.offsetHeight;
      const imgAspectRatio = img.naturalWidth / img.naturalHeight;
      const canvasAspectRatio = canvasWidth / canvasHeight;
      let renderWidth, renderHeight;
      if (fitMode === 'fill' ? (imgAspectRatio > canvasAspectRatio) : (imgAspectRatio < canvasAspectRatio)) {
        renderHeight = canvasHeight;
        renderWidth = renderHeight * imgAspectRatio;
      } else {
        renderWidth = canvasWidth;
        renderHeight = renderWidth / imgAspectRatio;
      }
      renderWidth *= scale; renderHeight *= scale;
      return {
        left: (canvasWidth - renderWidth) / 2 + x,
        top: (canvasHeight - renderHeight) / 2 + y,
        width: renderWidth,
        height: renderHeight
      };
    };

    if (slide.logoImage) {
      const box = getControlBox(canvasWrapper, slide.logoImage);
      if (box && clickX >= box.left && clickX <= box.left + box.width && clickY >= box.top && clickY <= box.top + box.height) {
        setEditingLayer('logoImage');
        return;
      }
    }
    if (slide.imageLayer) {
      const box = getControlBox(canvasWrapper, slide.imageLayer);
      if (box && clickX >= box.left && clickX <= box.left + box.width && clickY >= box.top && clickY <= box.top + box.height) {
        setEditingLayer('imageLayer');
        return;
      }
    }

    // If we get here, the click was on the canvas background, not on any image layer. Deselect.
    setEditingLayer(null);
  };


  const handleAddSlide = (index) => {
    const baseAspect = slides[0]?.canvasSize || '9/16';
    const newSlide = { ...createDefaultSlide(), canvasSize: baseAspect };
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
        const quoteSizeVal = baseFontSize * 4 * (quoteSize / 5);
        let quoteFont = '';
        if (quoteStyle === 'serif') { quoteFont = `bold ${quoteSizeVal}px "Playfair Display", serif`; }
        else if (quoteStyle === 'slab') { quoteFont = `${quoteSizeVal}px "Alfa Slab One", cursive`; }
        else if (quoteStyle === 'fancy') { quoteFont = `${quoteSizeVal}px "Saira Stencil One", sans-serif`; }
        ctx.font = quoteFont;
        ctx.fillStyle = color;

        // Anchor the visible bottom of the glyph to a fixed gap above the text block
        const textTop = yPosition - (totalTextHeight / 2);
        const gap = (quoteStyle === 'slab' ? lineHeight * 0.35 : lineHeight * 0.4);
        const quoteBottom = textTop - gap;
        const m = ctx.measureText('“');

        const originalAlign = ctx.textAlign;
        const originalBaseline = ctx.textBaseline;
        ctx.textAlign = 'center';

        if (quoteStyle === 'slab') {
          // For slab, anchor bottom exactly using full glyph height from top baseline
          const height = ((m.actualBoundingBoxAscent || 0) + (m.actualBoundingBoxDescent || 0)) || quoteSizeVal;
          const quoteTop = quoteBottom - height;
          ctx.textBaseline = 'top';
          ctx.fillText('“', canvasWidth / 2, quoteTop);
        } else {
          // Serif/fancy: current behavior (works well for serif); anchor by top using ascent
          const ascent = (m.actualBoundingBoxAscent || 0) || (quoteSizeVal * 0.8);
          const quoteTop = quoteBottom - ascent;
          ctx.textBaseline = 'top';
          ctx.fillText('“', canvasWidth / 2, quoteTop);
        }

        ctx.textAlign = originalAlign;
        ctx.textBaseline = originalBaseline;
      }
      ctx.font = finalFont;
      if (hasLabel) {
        ctx.fillStyle = hexToRgba(labelColor, labelTransparency / 10);
        const paddingHorizontal = lineHeight * 0.6;
        const paddingTop = lineHeight * 0.5;
        const paddingBottom = lineHeight * 0.3;
        const cornerRadius = lineHeight * 0.3;

        const labelWidth = widestLine + paddingHorizontal * 2;
        const labelHeight = totalTextHeight + paddingTop + paddingBottom;
        const labelY = yPosition - (totalTextHeight / 2) - paddingTop;
        let labelX;
        if (align === 'left') {
          labelX = (canvasWidth - maxWidth) / 2 - paddingHorizontal;
        } else if (align === 'right') {
          labelX = canvasWidth - ((canvasWidth - maxWidth) / 2) - widestLine - paddingHorizontal;
        } else {
          // center
          labelX = (canvasWidth / 2) - (widestLine / 2) - paddingHorizontal;
        }

        ctx.beginPath();
        ctx.roundRect(labelX, labelY, labelWidth, labelHeight, cornerRadius);
        ctx.fill();
      }

      for (let i = 0; i < lines.length; i++) {
        const lineText = lines[i].trim();
        const lineParts = lineText.split(/(==[^=]+==)/g).filter(p => p); // Filter out empty strings

        if (lineParts.length === 0) {
          currentY += lineHeight;
          continue;
        }

        // 1. Prepare measured parts
        const measuredParts = lineParts.map(part => {
            const isHighlight = part.startsWith('==') && part.endsWith('==');
            const text = isHighlight ? part.substring(2, part.length - 2) : part;
            const width = ctx.measureText(text).width;
            return { text, width, isHighlight };
        });
        const totalLineWidth = measuredParts.reduce((sum, part) => sum + part.width, 0);

        // 2. Determine initial X coordinate
        let currentX;
        if (align === 'left') {
            currentX = (canvasWidth - maxWidth) / 2;
        } else if (align === 'right') {
            currentX = canvasWidth - ((canvasWidth - maxWidth) / 2) - totalLineWidth;
        } else { // center
            currentX = (canvasWidth / 2) - (totalLineWidth / 2);
        }

        // 3. Draw the parts sequentially
        ctx.textAlign = 'left'; // We are manually positioning, so always draw from the left.

        for (const part of measuredParts) {
            // Set styles for this part
            ctx.fillStyle = part.isHighlight ? slideData.text1HighlightColor : color;
            if (hasShadow) {
                ctx.shadowColor = 'rgba(0,0,0,0.5)';
                ctx.shadowBlur = 5;
                ctx.shadowOffsetX = 5;
                ctx.shadowOffsetY = 5;
            }

            // Draw the text part
            ctx.fillText(part.text, currentX, currentY);

            // Draw outline for this part if needed
            if (hasOutline) {
                // Temporarily remove shadow for outline drawing, then re-apply if needed
                if (hasShadow) {
                    ctx.shadowColor = 'transparent';
                }
                ctx.strokeStyle = 'black';
                ctx.lineWidth = fontSize * 0.05;
                ctx.strokeText(part.text, currentX, currentY);
                if (hasShadow) {
                    ctx.shadowColor = 'rgba(0,0,0,0.5)';
                }
            }

            // Advance the X position for the next part
            currentX += part.width;
        }

        // Reset shadow for next line
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;

        currentY += lineHeight;
      }
      // Restore original text align after the loop
      ctx.textAlign = align;
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

  // Keep active slide in sync with scroll via IntersectionObserver
  useEffect(() => {
    const container = document.querySelector('.canvas-container');
    if (!container) return;
    const entriesMap = new Map();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => entriesMap.set(entry.target, entry.intersectionRatio));
        if (isNavScrolling.current) return;
        // Pick the slide with the highest intersection ratio
        let bestIndex = activeSlideIndex;
        let bestRatio = -1;
        slideRefs.current.forEach((ref, i) => {
          const el = ref?.getSlideWrapperRef?.()?.current; // slide-wrapper
          const ratio = el ? (entriesMap.get(el) ?? 0) : 0;
          if (ratio > bestRatio) {
            bestRatio = ratio;
            bestIndex = i;
          }
        });
        if (bestIndex !== activeSlideIndex) setActiveSlideIndex(bestIndex);
      },
      { root: container, threshold: [0, 0.25, 0.5, 0.75, 1] }
    );

    // Observe each slide wrapper
    slideRefs.current.forEach((ref) => {
      const wrapper = ref?.getSlideWrapperRef?.()?.current;
      if (wrapper) observer.observe(wrapper);
    });

    return () => observer.disconnect();
  }, [slides.length]);

  // Clear programmatic-scroll guard after scroll settles
  useEffect(() => {
    const container = document.querySelector('.canvas-container');
    if (!container) return;
    let t;
    const onScroll = () => {
      if (!isNavScrolling.current) return;
      clearTimeout(t);
      t = setTimeout(() => { isNavScrolling.current = false; }, 220);
    };
    container.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      container.removeEventListener('scroll', onScroll);
      clearTimeout(t);
    };
  }, []);

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
                onLayerUpdate={(layer, updates) => updateActiveSlide({ [layer]: { ...activeSlide[layer], ...updates } })}
                onLayerDelete={(layer) => {
                  updateActiveSlide({ [layer]: null });
                  setEditingLayer(null);
                  if (layer === 'imageLayer') {
                    setIsBackgroundDrawerOpen(true);
                  }
                }}
                hasPrev={index > 0}
                hasNext={index < slides.length - 1}
                onPrev={() => {
                  if (index > 0) {
                    isNavScrolling.current = true;
                    setActiveSlideIndex(index - 1);
                    requestAnimationFrame(() => {
                      slideRefs.current[index - 1]?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
                    });
                  }
                }}
                onNext={() => {
                  if (index < slides.length - 1) {
                    isNavScrolling.current = true;
                    setActiveSlideIndex(index + 1);
                    requestAnimationFrame(() => {
                      slideRefs.current[index + 1]?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
                    });
                  }
                }}
              />

            ))}
          </SortableContext>
        </DndContext>
      </div>

      <div className={`footer-menu ${isBackgroundDrawerOpen || isColorDrawerOpen || isSearchDrawerOpen || isSizeDrawerOpen || isSaveDrawerOpen || editingLayer || textEditMode ? 'hidden' : ''}`}>
        <button className="footer-button" onClick={handleSizeDrawerOpen}><FiMaximize /></button>
        <button className="footer-button" onClick={() => setIsBackgroundDrawerOpen(true)}><FiImage /></button>
        <button className="footer-button t-button" onClick={() => { setTextEditMode('text1'); setTextToolbarTab('menu'); }}>T1</button>
        <button className="footer-button t-button" onClick={() => { setTextEditMode('text2'); setTextToolbarTab('menu'); }}>T2</button>
        <button className="footer-button" onClick={() => setIsSaveDrawerOpen(true)}><FiBookmark /></button>
        <button className="footer-button" onClick={handleDownload}><FiDownload /></button>
        <button className="footer-button" onClick={handleReset}><FiRotateCcw /></button>
      </div>

      <input type="file" ref={backgroundImageInputRef} onChange={(e) => handleFileChange(e, 'imageLayer')} accept="image/*" style={{ display: 'none' }} />
      <input type="file" ref={logoImageInputRef} onChange={(e) => handleFileChange(e, 'logoImage')} accept="image/*" style={{ display: 'none' }} />

      {isBackgroundDrawerOpen && (
        <BackgroundDrawer
          onClose={() => setIsBackgroundDrawerOpen(false)}
          onColorClick={() => setIsColorDrawerOpen(true)}
          onImageUpload={handleImageUploadClick}
          onSearchClick={() => setIsSearchDrawerOpen(true)}
          onLogoClick={handleLogoUploadClick}
          currentBackground={activeSlide.background}
        />
      )}

      {isColorDrawerOpen && (
        <ColorDrawer
          onClose={() => setIsColorDrawerOpen(false)} // This will now reveal the BackgroundDrawer
          onBackgroundChange={(bg) => updateActiveSlide({ background: bg })}
          currentBackground={activeSlide.background}
        />
      )}

      {isSearchDrawerOpen && (
        <SearchDrawer onClose={() => setIsSearchDrawerOpen(false)} onImageSelect={handleRemoteImageSelect} />
      )}

      {editingLayer && activeSlide[editingLayer] && (
        <ImageDrawer
          ref={imageDrawerRef}
          onClose={handleImageDrawerClose}
          imageLayer={activeSlide[editingLayer]}
          isLogo={editingLayer === 'logoImage'}
          onUpdate={(updates) => updateActiveSlide({ [editingLayer]: { ...activeSlide[editingLayer], ...updates } }) } />
      )}

      {isSizeDrawerOpen && (
        <SizeDrawer onClose={handleSizeDrawerClose} onCanvasSizeChange={(size) => updateActiveSlide({ canvasSize: size })} currentSize={activeSlide.canvasSize} />
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

      {textEditMode && (
        <TextToolbar
          mode={textEditMode}
          tab={textToolbarTab}
          setTab={setTextToolbarTab}
          value={textEditMode==='text1' ? activeSlide.text1 : activeSlide.text2}
          onChangeValue={(val) => updateActiveSlide({ [textEditMode]: val })}
          font={textEditMode==='text1' ? activeSlide.text1Font : activeSlide.text2Font}
          onChangeFont={(f) => {
            const key = textEditMode==='text1' ? 'text1Font' : 'text2Font';
            const boldKey = textEditMode==='text1' ? 'text1IsBold' : 'text2IsBold';
            updateActiveSlide({ [key]: f, [boldKey]: (f==='Inter') });
          }}
          size={textEditMode==='text1' ? activeSlide.text1Size : activeSlide.text2Size}
          onChangeSize={(v) => {
            const key = textEditMode==='text1' ? 'text1Size' : 'text2Size';
            updateActiveSlide({ [key]: v });
          }}
          yPosition={textEditMode==='text1' ? activeSlide.text1YPosition : activeSlide.text2YPosition}
          onChangeY={(v) => {
            const key = textEditMode==='text1' ? 'text1YPosition' : 'text2YPosition';
            updateActiveSlide({ [key]: v });
          }}
          color={textEditMode==='text1' ? activeSlide.text1Color : activeSlide.text2Color}
          onChangeColor={(c) => {
            const key = textEditMode==='text1' ? 'text1Color' : 'text2Color';
            updateActiveSlide({ [key]: c });
          }}
          highlightColor={activeSlide.text1HighlightColor}
          onChangeHighlightColor={(c) => updateActiveSlide({ text1HighlightColor: c })}
          labelColor={activeSlide.text2LabelColor}
          onChangeLabelColor={(c) => updateActiveSlide({ text2LabelColor: c })}
          labelEnabled={activeSlide.text2LabelColor !== 'transparent'}
          onToggleLabel={(on) => updateActiveSlide({ text2LabelColor: on ? (activeSlide.text2LabelColor==='transparent' ? '#000000' : activeSlide.text2LabelColor) : 'transparent' })}
          labelOpacity={activeSlide.text2LabelTransparency}
          onChangeLabelOpacity={(v) => updateActiveSlide({ text2LabelTransparency: v })}
          isBold={textEditMode==='text1' ? activeSlide.text1IsBold : activeSlide.text2IsBold}
          onToggleBold={() => {
            const key = textEditMode==='text1' ? 'text1IsBold' : 'text2IsBold';
            updateActiveSlide({ [key]: !(textEditMode==='text1' ? activeSlide.text1IsBold : activeSlide.text2IsBold) });
          }}
          isItalic={textEditMode==='text1' ? activeSlide.text1IsItalic : activeSlide.text2IsItalic}
          onToggleItalic={() => {
            const key = textEditMode==='text1' ? 'text1IsItalic' : 'text2IsItalic';
            updateActiveSlide({ [key]: !(textEditMode==='text1' ? activeSlide.text1IsItalic : activeSlide.text2IsItalic) });
          }}
          align={textEditMode==='text1' ? activeSlide.text1Align : activeSlide.text2Align}
          onCycleAlign={() => {
            const cur = textEditMode==='text1' ? activeSlide.text1Align : activeSlide.text2Align;
            const next = cur==='left' ? 'center' : cur==='center' ? 'right' : 'left';
            const key = textEditMode==='text1' ? 'text1Align' : 'text2Align';
            updateActiveSlide({ [key]: next });
          }}
          lineSpacing={textEditMode==='text1' ? activeSlide.text1LineSpacing : activeSlide.text2LineSpacing}
          onChangeLineSpacing={(v) => {
            const key = textEditMode==='text1' ? 'text1LineSpacing' : 'text2LineSpacing';
            updateActiveSlide({ [key]: v });
          }}
          quoteStyle={activeSlide.text1QuoteStyle}
          onChangeQuoteStyle={(s) => updateActiveSlide({ text1QuoteStyle: s })}
          quoteSize={activeSlide.text1QuoteSize}
          onChangeQuoteSize={(v) => updateActiveSlide({ text1QuoteSize: v })}
          onClose={() => setTextEditMode(null)}
        />
      )}
    </div>
  )
}

export default App