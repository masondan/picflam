import './App.css'
import { useState, useRef, useEffect, useCallback } from 'react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
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
import { useSlides } from './hooks/useSlides';
import { useLocalStorage } from './hooks/useLocalStorage';
import { drawSlide, computeTextBounds } from './utils/canvasUtils';

function App() {
  const [isBackgroundDrawerOpen, setIsBackgroundDrawerOpen] = useState(false);
  const [isColorDrawerOpen, setIsColorDrawerOpen] = useState(false);
  const [isSearchDrawerOpen, setIsSearchDrawerOpen] = useState(false);
  const [isSizeDrawerOpen, setIsSizeDrawerOpen] = useState(false);
  const [showFooter, setShowFooter] = useState(true);
  const [isSaveDrawerOpen, setIsSaveDrawerOpen] = useState(false);
  const [editingLayer, setEditingLayer] = useState(null);
  const [textEditMode, setTextEditMode] = useState(null); // null | 'text1' | 'text2'
  const [textToolbarTab, setTextToolbarTab] = useState('edit');

  const {
    slides,
    activeSlideIndex,
    activeSlide,
    setActiveSlideIndex,
    updateActiveSlide,
    addSlide,
    duplicateSlide,
    deleteSlide,
    reorderSlides,
    resetSlides,
  } = useSlides();

  const [savedProjects, setSavedProjects] = useLocalStorage('picflam_projects', [null, null, null]);

  const slideRefs = useRef([]);
  const isNavScrolling = useRef(false);

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
    setShowFooter(false);
  };

  const handleSizeDrawerClose = (confirm) => {
    if (!confirm && originalSlideState) {
      updateActiveSlide({ canvasSize: originalSlideState.canvasSize });
    }
    setOriginalSlideState(null);
    setIsSizeDrawerOpen(false);
    setShowFooter(true);
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
    } catch (error) {
      // Ignore font loading errors
    }
  }, [activeSlide.text1QuoteStyle, activeSlide.text1QuoteSize, activeSlideIndex, activeSlide]);

  
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

  const handleSaveProject = useCallback((slotIndex) => {
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
    // Remove save pop-up
  }, [slides, activeSlideIndex, savedProjects, setSavedProjects, setActiveSlideIndex]);

  const handleLoadProject = useCallback((slotIndex) => {
    const projectToLoad = savedProjects[slotIndex];
    if (projectToLoad) {
      // This is a simplified version. A full implementation would handle re-creating image objects.
      resetSlides(projectToLoad.slides);
      setActiveSlideIndex(0);
      // Remove load pop-up
    }
  }, [savedProjects, resetSlides]);

  const handleDeleteProject = useCallback((slotIndex) => {
    // Replace confirm with overlay button
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    overlay.style.display = 'flex';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';
    overlay.style.zIndex = '1000';

    const button = document.createElement('button');
    button.textContent = 'Delete';
    button.style.padding = '1rem 2rem';
    button.style.fontSize = '1.2rem';
    button.style.backgroundColor = '#555555';
    button.style.color = '#fff';
    button.style.border = 'none';
    button.style.borderRadius = '8px';
    button.style.cursor = 'pointer';

    button.onclick = () => {
      const newSavedProjects = [...savedProjects];
      newSavedProjects[slotIndex] = null;
      setSavedProjects(newSavedProjects);
      document.body.removeChild(overlay);
    };

    overlay.onclick = () => document.body.removeChild(overlay);

    overlay.appendChild(button);
    document.body.appendChild(overlay);
  }, [savedProjects, setSavedProjects]);



  const handleImageDrawerClose = () => {
    // Always return to the background/image import drawer on confirm
    setIsBackgroundDrawerOpen(true);
    setEditingLayer(null);
  };

  const handleReset = useCallback(() => {
    // Replace confirm with overlay button
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    overlay.style.display = 'flex';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';
    overlay.style.zIndex = '1000';

    const button = document.createElement('button');
    button.textContent = 'Start Again';
    button.style.padding = '1rem 2rem';
    button.style.fontSize = '1.2rem';
    button.style.backgroundColor = '#555555';
    button.style.color = '#fff';
    button.style.border = 'none';
    button.style.borderRadius = '8px';
    button.style.cursor = 'pointer';

    button.onclick = () => {
      resetSlides();
      document.body.removeChild(overlay);
    };

    overlay.onclick = () => document.body.removeChild(overlay);

    overlay.appendChild(button);
    document.body.appendChild(overlay);
  }, [resetSlides]);



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


  const handleAddSlide = useCallback((index) => addSlide(index), [addSlide]);
  const handleDuplicateSlide = useCallback((index) => duplicateSlide(index), [duplicateSlide]);
  const handleDeleteSlide = useCallback((index) => deleteSlide(index), [deleteSlide]);

  const handleReorderSlides = useCallback((oldIndex, newIndex) => reorderSlides(oldIndex, newIndex), [reorderSlides]);

  const handleDragEnd = useCallback((event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = slides.findIndex(item => item.id === active.id);
      const newIndex = slides.findIndex(item => item.id === over.id);
      handleReorderSlides(oldIndex, newIndex);
    }
  }, [slides, handleReorderSlides]);



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
  }, [slides.length, activeSlideIndex, setActiveSlideIndex]);

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

      <div className={`footer-menu ${!showFooter ? 'hidden' : ''}`}>
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