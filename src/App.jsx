import './App.css'
import { useState, useRef, useEffect, useCallback } from 'react';
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
import SplashScreen from './components/SplashScreen';
import Tooltip from './components/Tooltip';
import { useSlides } from './hooks/useSlides';
import { useLocalStorage } from './hooks/useLocalStorage';
import { drawSlide, computeTextBounds, compressImage } from './utils/canvasUtils';

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [isBackgroundDrawerOpen, setIsBackgroundDrawerOpen] = useState(false);
  const [isColorDrawerOpen, setIsColorDrawerOpen] = useState(false);
  const [isSearchDrawerOpen, setIsSearchDrawerOpen] = useState(false);
  const [isSizeDrawerOpen, setIsSizeDrawerOpen] = useState(false);
  const [showFooter, setShowFooter] = useState(true);
  const [isSaveDrawerOpen, setIsSaveDrawerOpen] = useState(false);
  const [editingLayer, setEditingLayer] = useState(null);
  const [textEditMode, setTextEditMode] = useState(null); // null | 'text1' | 'text2'
  const [textToolbarTab, setTextToolbarTab] = useState('edit');
  const [isKeyboardActive, setIsKeyboardActive] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  const {
    slide,
    updateSlide,
    resetSlide,
  } = useSlides();

  const [savedProjects, setSavedProjects] = useLocalStorage('picflam_projects', [null, null, null]);
  const [showTooltip, setShowTooltip] = useLocalStorage('picflam_tooltip_shown', true); // true = hide tooltip (shown once), false = show
  const [showBackgroundTooltip, setShowBackgroundTooltip] = useLocalStorage('picflam_background_tooltip_shown', true); // true = hide tooltip (shown once), false = show
  const [hasSelectedSize, setHasSelectedSize] = useState(false); // Track if user has selected canvas size

  const slideRef = useRef(null);

  const [originalSlideState, setOriginalSlideState] = useState(null);

  const backgroundImageInputRef = useRef(null);
  const logoImageInputRef = useRef(null);
  const imageDrawerRef = useRef(null);
  const canvasContainerRef = useRef(null);

  useEffect(() => {
    if (textEditMode) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';

      // Detect keyboard height on mobile
      const handleResize = () => {
        const viewportHeight = window.visualViewport ? window.visualViewport.height : window.innerHeight;
        const windowHeight = window.innerHeight;
        const keyboardHeight = windowHeight - viewportHeight;
        setKeyboardHeight(keyboardHeight);
      };

      if (window.visualViewport) {
        window.visualViewport.addEventListener('resize', handleResize);
        handleResize(); // Initial call
      }

      return () => {
        if (window.visualViewport) {
          window.visualViewport.removeEventListener('resize', handleResize);
        }
      };
    } else {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      setKeyboardHeight(0);
    }
  }, [textEditMode]);

  const handleSizeDrawerOpen = () => {
    setOriginalSlideState({ ...slide }); // Store a copy to prevent reference issues
    setShowFooter(false);
    setIsSizeDrawerOpen(true);
    // Wait for footer to hide, then redraw canvas
    setTimeout(() => {
      const canvas = slideRef.current?.getCanvasRef()?.current;
      if (canvas) {
        drawSlide(canvas, slide);
      }
    }, 300); // Match the CSS transition duration
  };

  const handleSizeDrawerClose = (confirm) => {
    setOriginalSlideState(null);
    setShowFooter(true);
    if (confirm) {
      setHasSelectedSize(true); // Mark that user has selected a size
    }
    // Delay closing the drawer to match the slide-down animation (0.3s)
    setTimeout(() => {
      setIsSizeDrawerOpen(false);
    }, 300);
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
          updateSlide({ [layer]: newLayer });
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
      updateSlide({
        imageLayer: { img: img, scale: 1, opacity: 1, x: 0, y: 0, fitMode: 'fit' }
      });
      setEditingLayer('imageLayer');
    };
    img.src = imageUrl;
    setIsSearchDrawerOpen(false);
    setIsBackgroundDrawerOpen(true);
  };

  
  
  
  
  // Ensure quote fonts are loaded before drawing, so first tap uses the correct font
  useEffect(() => {
    const style = slide.text1QuoteStyle;
    if (!style || style === 'none') return;
    const fontSpec = style === 'serif'
      ? `bold 100px "Playfair Display"`
      : style === 'slab'
        ? `100px "Alfa Slab One"`
        : `100px "Saira Stencil One"`;
    try {
      if (document.fonts && document.fonts.load) {
        document.fonts.load(fontSpec, '“').then(() => {
          const canvas = slideRef.current?.getCanvasRef()?.current;
          if (canvas) {
            // Redraw with the loaded font
            drawSlide(canvas, slide).catch(() => {});
          }
        });
      }
    } catch (error) {
      // Ignore font loading errors
    }
  }, [slide.text1QuoteStyle, slide.text1QuoteSize, slide]);

  
  const handleDownload = async () => {
    const canvas = slideRef.current?.getCanvasRef()?.current;
    if (!canvas) {
      alert('Could not find the canvas to download.');
      return;
    }

    try {
      // Force a re-draw at high resolution and wait for it to complete
      await drawSlide(canvas, slide);

      // Now that the promise is resolved, the canvas should be ready.
      const link = document.createElement('a');
      link.download = 'picflam-export.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error("Failed to draw slide for download:", error);
      alert("An error occurred while preparing the download. Please check the console for details.");
    }
  };

  const handleSaveProject = useCallback(async (slotIndex) => {
    const canvas = slideRef.current?.getCanvasRef()?.current;
    if (!canvas) {
      alert("Cannot save, canvas not found.");
      return;
    }
    const thumbnail = canvas.toDataURL('image/jpeg', 0.5);

    // Compress images for storage
    const slideWithCompressedImages = { ...slide };

    const compressImageLayer = async (layerKey) => {
      const layer = slide[layerKey];
      if (layer && layer.img) {
        try {
          const compressedDataUrl = await compressImage(layer.img);
          slideWithCompressedImages[layerKey] = {
            ...layer,
            compressedDataUrl
          };
        } catch (error) {
          console.error(`Failed to compress ${layerKey}:`, error);
          // Keep original if compression fails
        }
      }
    };

    await Promise.all([
      compressImageLayer('imageLayer'),
      compressImageLayer('logoImage')
    ]);

    const projectData = { slide: slideWithCompressedImages, thumbnail };

    const newSavedProjects = [...savedProjects];
    newSavedProjects[slotIndex] = projectData;
    setSavedProjects(newSavedProjects);
    // Remove save pop-up
  }, [slide, savedProjects, setSavedProjects]);

  const handleLoadProject = useCallback(async (slotIndex) => {
    const projectToLoad = savedProjects[slotIndex];
    if (projectToLoad) {
      const { slide: savedSlide } = projectToLoad;

      // Recreate Image objects from compressed data URLs
      const slideWithImages = { ...savedSlide };

      const loadImageLayer = async (layerKey) => {
        const layer = savedSlide[layerKey];
        if (layer && layer.compressedDataUrl) {
          try {
            const img = new Image();
            await new Promise((resolve, reject) => {
              img.onload = resolve;
              img.onerror = reject;
              img.src = layer.compressedDataUrl;
            });
            slideWithImages[layerKey] = {
              ...layer,
              img
            };
          } catch (error) {
            console.error(`Failed to load ${layerKey}:`, error);
            // Remove the layer if image fails to load
            delete slideWithImages[layerKey];
          }
        }
      };

      await Promise.all([
        loadImageLayer('imageLayer'),
        loadImageLayer('logoImage')
      ]);

      // Update slide with loaded images
      resetSlide();
      updateSlide(slideWithImages);

      // Remove load pop-up
    }
  }, [savedProjects, resetSlide, updateSlide]);

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
    button.textContent = 'Delete?';
    button.style.padding = '0.75rem 1.5rem';
    button.style.fontSize = '1rem';
    button.style.backgroundColor = '#e50000';
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
    setShowFooter(true);
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
    button.textContent = 'Start Again?';
    button.style.padding = '0.75rem 1.5rem';
    button.style.fontSize = '1rem';
    button.style.backgroundColor = '#e50000';
    button.style.color = '#fff';
    button.style.border = 'none';
    button.style.borderRadius = '8px';
    button.style.cursor = 'pointer';

    button.onclick = () => {
      resetSlide();
      document.body.removeChild(overlay);
    };

    overlay.onclick = () => document.body.removeChild(overlay);

    overlay.appendChild(button);
    document.body.appendChild(overlay);
  }, [resetSlide]);



  const handleCanvasClick = (event) => {
    // If the click is on an existing transform control, do nothing. This prevents
    // an active image from being deselected when trying to drag it.
    if (event.target.closest('.image-transform-controls')) {
      return;
    }

    const canvasWrapper = slideRef.current?.getCanvasWrapperRef()?.current;
    if (!canvasWrapper) {
      setEditingLayer(null);
      return;
    }
    const rect = canvasWrapper.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;

    // Hit test text blocks first (Text2 on top of Text1 by typical visual order)
    const canvasEl = slideRef.current?.getCanvasRef()?.current;
    const text2Box = computeTextBounds(canvasEl, canvasWrapper, slide, 'text2');
    if (text2Box && clickX >= text2Box.left && clickX <= text2Box.left + text2Box.width && clickY >= text2Box.top && clickY <= text2Box.top + text2Box.height) {
      setEditingLayer(null);
      setTextEditMode('text2');
      setTextToolbarTab('menu');
      setIsKeyboardActive(true);
      return;
    }
    const text1Box = computeTextBounds(canvasEl, canvasWrapper, slide, 'text1');
    if (text1Box && clickX >= text1Box.left && clickX <= text1Box.left + text1Box.width && clickY >= text1Box.top && clickY <= text1Box.top + text1Box.height) {
      setEditingLayer(null);
      setTextEditMode('text1');
      setTextToolbarTab('menu');
      setIsKeyboardActive(true);
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
        setTextEditMode(null);
        setIsKeyboardActive(false);
        return;
      }
    }
    if (slide.imageLayer) {
      const box = getControlBox(canvasWrapper, slide.imageLayer);
      if (box && clickX >= box.left && clickX <= box.left + box.width && clickY >= box.top && clickY <= box.top + box.height) {
        setEditingLayer('imageLayer');
        setTextEditMode(null);
        setIsKeyboardActive(false);
        return;
      }
    }

    // If we get here, the click was on the canvas background, not on any image layer. Open background drawer.
    setEditingLayer(null);
    setTextEditMode(null);
    setIsKeyboardActive(false);
    setIsBackgroundDrawerOpen(true);
  };


  // Removed slide management functions for single canvas



  // Removed carousel scrolling and navigation logic for single canvas

  if (showSplash) {
    return <SplashScreen onGetStarted={() => setShowSplash(false)} />;
  }

  const handleTooltipClose = () => {
    setShowTooltip(true);
  };

  const handleBackgroundTooltipClose = () => {
    setShowBackgroundTooltip(true);
  };

  return (
    <div className="app-container">
      <div className="canvas-container" ref={canvasContainerRef} style={{ touchAction: 'pan-y', overflowX: 'auto', overflowY: 'hidden', height: textEditMode ? 'calc(100dvh - 100px)' : '100dvh', alignItems: textEditMode ? 'flex-end' : 'center', paddingBottom: textEditMode ? '30px' : '0', justifyContent: textEditMode ? 'flex-start' : 'center' }}>
        <Slide
          ref={slideRef}
          slide={slide}
          isActive={true}
          onClick={handleCanvasClick}
          drawSlide={drawSlide}
          editingLayer={editingLayer}
          onLayerUpdate={(layer, updates) => updateSlide({ [layer]: { ...slide[layer], ...updates } })}
          onLayerDelete={(layer) => {
            updateSlide({ [layer]: null });
            setEditingLayer(null);
            if (layer === 'imageLayer' || layer === 'logoImage') {
              setIsBackgroundDrawerOpen(true);
            }
          }}
        />
      </div>

      <div className="footer-container">
        <div className={`footer-menu ${!showFooter ? 'hidden' : ''}`}>
          <button className="footer-button" onClick={handleSizeDrawerOpen}><FiMaximize /></button>
          <button className="footer-button" onClick={() => setIsBackgroundDrawerOpen(true)}><FiImage /></button>
          <button className="footer-button t-button" onClick={() => { setTextEditMode('text1'); setTextToolbarTab('edit'); setIsKeyboardActive(true); }}>T1</button>
          <button className="footer-button t-button" onClick={() => { setTextEditMode('text2'); setTextToolbarTab('edit'); setIsKeyboardActive(true); }}>T2</button>
          <button className="footer-button" onClick={() => setIsSaveDrawerOpen(true)}><FiBookmark /></button>
          <button className="footer-button" onClick={handleDownload}><FiDownload /></button>
          <button className="footer-button" onClick={handleReset}><FiRotateCcw /></button>
        </div>
      </div>

      <input type="file" ref={backgroundImageInputRef} onChange={(e) => handleFileChange(e, 'imageLayer')} accept="image/*" style={{ display: 'none' }} />
      <input type="file" ref={logoImageInputRef} onChange={(e) => handleFileChange(e, 'logoImage')} accept="image/*" style={{ display: 'none' }} />

      {isBackgroundDrawerOpen && (
        <>
          <BackgroundDrawer
            onClose={() => { setIsBackgroundDrawerOpen(false); setShowFooter(true); setShowBackgroundTooltip(true); }}
            onColorClick={() => { setIsColorDrawerOpen(true); setShowBackgroundTooltip(true); }}
            onImageUpload={() => { handleImageUploadClick(); setShowBackgroundTooltip(true); }}
            onSearchClick={() => { setIsSearchDrawerOpen(true); setShowFooter(false); setShowBackgroundTooltip(true); }}
            onLogoClick={() => { handleLogoUploadClick(); setShowBackgroundTooltip(true); }}
            currentBackground={slide.background}
          />
          {showBackgroundTooltip === false && hasSelectedSize && (
            <Tooltip
              message="Now choose your background, upload or search for an image, and add a logo"
              onClose={handleBackgroundTooltipClose}
            />
          )}
        </>
      )}

      {isColorDrawerOpen && (
        <ColorDrawer
          onClose={() => setIsColorDrawerOpen(false)} // This will now reveal the BackgroundDrawer
          onBackgroundChange={(bg) => updateSlide({ background: bg })}
          currentBackground={slide.background}
        />
      )}

      {isSearchDrawerOpen && (
        <SearchDrawer onClose={() => { setIsSearchDrawerOpen(false); setIsBackgroundDrawerOpen(true); }} onImageSelect={handleRemoteImageSelect} />
      )}

      {editingLayer && slide[editingLayer] && (
        <ImageDrawer
          ref={imageDrawerRef}
          onClose={handleImageDrawerClose}
          imageLayer={slide[editingLayer]}
          isLogo={editingLayer === 'logoImage'}
          onUpdate={(updates) => updateSlide({ [editingLayer]: { ...slide[editingLayer], ...updates } }) }
          onOpen={() => setShowFooter(false)} />
      )}

      {isSizeDrawerOpen && (
        <SizeDrawer onClose={handleSizeDrawerClose} onCanvasSizeChange={(size) => {
          updateSlide({ canvasSize: size });
        }} currentSize={slide.canvasSize} />
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
          value={textEditMode==='text1' ? slide.text1 : slide.text2}
          onChangeValue={(val) => updateSlide({ [textEditMode]: val })}
          font={textEditMode==='text1' ? slide.text1Font : slide.text2Font}
          onChangeFont={(f) => {
            const key = textEditMode==='text1' ? 'text1Font' : 'text2Font';
            const boldKey = textEditMode==='text1' ? 'text1IsBold' : 'text2IsBold';
            updateSlide({ [key]: f, [boldKey]: (f==='Inter') });
          }}
          size={textEditMode==='text1' ? slide.text1Size : slide.text2Size}
          onChangeSize={(v) => {
            const key = textEditMode==='text1' ? 'text1Size' : 'text2Size';
            updateSlide({ [key]: v });
          }}
          yPosition={textEditMode==='text1' ? slide.text1YPosition : slide.text2YPosition}
          onChangeY={(v) => {
            const key = textEditMode==='text1' ? 'text1YPosition' : 'text2YPosition';
            updateSlide({ [key]: v });
          }}
          color={textEditMode==='text1' ? slide.text1Color : slide.text2Color}
          onChangeColor={(c) => {
            const key = textEditMode==='text1' ? 'text1Color' : 'text2Color';
            updateSlide({ [key]: c });
          }}
          highlightColor={slide.text1HighlightColor}
          onChangeHighlightColor={(c) => updateSlide({ text1HighlightColor: c })}
          labelColor={slide.text2LabelColor}
          onChangeLabelColor={(c) => updateSlide({ text2LabelColor: c })}
          labelEnabled={slide.text2LabelColor !== 'transparent'}
          onToggleLabel={(on) => updateSlide({ text2LabelColor: on ? (slide.text2LabelColor==='transparent' ? '#000000' : slide.text2LabelColor) : 'transparent' })}
          labelOpacity={slide.text2LabelTransparency}
          onChangeLabelOpacity={(v) => updateSlide({ text2LabelTransparency: v })}
          isBold={textEditMode==='text1' ? slide.text1IsBold : slide.text2IsBold}
          onToggleBold={() => {
            const key = textEditMode==='text1' ? 'text1IsBold' : 'text2IsBold';
            updateSlide({ [key]: !(textEditMode==='text1' ? slide.text1IsBold : slide.text2IsBold) });
          }}
          isItalic={textEditMode==='text1' ? slide.text1IsItalic : slide.text2IsItalic}
          onToggleItalic={() => {
            const key = textEditMode==='text1' ? 'text1IsItalic' : 'text2IsItalic';
            updateSlide({ [key]: !(textEditMode==='text1' ? slide.text1IsItalic : slide.text2IsItalic) });
          }}
          align={textEditMode==='text1' ? slide.text1Align : slide.text2Align}
          onCycleAlign={() => {
            const cur = textEditMode==='text1' ? slide.text1Align : slide.text2Align;
            const next = cur==='left' ? 'center' : cur==='center' ? 'right' : 'left';
            const key = textEditMode==='text1' ? 'text1Align' : 'text2Align';
            updateSlide({ [key]: next });
          }}
          lineSpacing={textEditMode==='text1' ? slide.text1LineSpacing : slide.text2LineSpacing}
          onChangeLineSpacing={(v) => {
            const key = textEditMode==='text1' ? 'text1LineSpacing' : 'text2LineSpacing';
            updateSlide({ [key]: v });
          }}
          quoteStyle={slide.text1QuoteStyle}
          onChangeQuoteStyle={(s) => updateSlide({ text1QuoteStyle: s })}
          quoteSize={slide.text1QuoteSize}
          onChangeQuoteSize={(v) => updateSlide({ text1QuoteSize: v })}
          keyboardHeight={keyboardHeight}
          onClose={() => { setTextEditMode(null); setIsKeyboardActive(false); }}
        />
      )}

      {showTooltip === false && (
        <Tooltip
          message="Welcome! Choose your canvas size then add images and text"
          onClose={() => { handleTooltipClose(); setShowBackgroundTooltip(false); }}
        />
      )}
    </div>
  )
}

export default App