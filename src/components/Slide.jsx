import { forwardRef, useRef, useEffect, useImperativeHandle, useLayoutEffect, useState } from 'react';
import { FaTrash } from 'react-icons/fa';
import ImageTransformControl from './ImageTransformControl';
import './Slide.css';

const Slide = forwardRef(function Slide({
  slide,
  isActive,
  onClick,
  drawSlide,
  drawLayer, // New prop
  editingLayer, // 'imageLayer', 'logoImage', or null
  onLayerUpdate,
  onLayerDelete,
}, ref) {
  const canvasRef = useRef(null);
  const canvasWrapperRef = useRef(null);
  const slideWrapperRef = useRef(null);

  // Re-measure canvas on layout changes to avoid initial overlay offset
  const [canvasMeasureTick, setCanvasMeasureTick] = useState(0);

  // State for the dragging logic
  const [draggingLayer, setDraggingLayer] = useState(null);
  const canvasSnapshot = useRef(null);

  useLayoutEffect(() => {
    const canvasEl = canvasRef.current;
    if (!canvasEl) return;

    const handleWindowResize = () => setCanvasMeasureTick((t) => t + 1);
    const ro = new ResizeObserver(() => setCanvasMeasureTick((t) => t + 1));
    ro.observe(canvasEl);
    window.addEventListener('resize', handleWindowResize);

    return () => {
      ro.disconnect();
      window.removeEventListener('resize', handleWindowResize);
    };
  }, []);

  // Main drawing effect
  useEffect(() => {
    // Do not run the full drawSlide if we are in the middle of a drag.
    if (draggingLayer) return;
    
    const canvas = canvasRef.current;
    if (canvas) {
      drawSlide(canvas, slide);
    }
  }, [slide, drawSlide, canvasMeasureTick, draggingLayer]);

  // Effect for handling the optimized drag drawing
  useEffect(() => {
    // Only run this effect if we are dragging a layer and the snapshot is ready.
    if (!draggingLayer || !canvasSnapshot.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const imageToDraw = slide[draggingLayer];

    // This is an animation frame, so we request the browser to run this code
    // right before the next repaint. This is good practice for smooth animations.
    const animationFrameId = requestAnimationFrame(() => {
      // FIX for artifacts: Explicitly clear the canvas before drawing anything.
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // 1. Restore the snapshot (background, text, other images).
      ctx.putImageData(canvasSnapshot.current, 0, 0);

      // 2. Draw the currently dragged layer on top.
      if (imageToDraw) {
        drawLayer(canvas, imageToDraw);
      }
    });

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
    // This effect should run every time the slide data changes (i.e., the image position)
    // while we are in dragging mode.
  }, [slide, draggingLayer, drawLayer]);


  useImperativeHandle(ref, () => ({
    scrollIntoView: (opts) => {
      slideWrapperRef.current?.scrollIntoView(opts);
    },
    getCanvasWrapperRef: () => canvasWrapperRef,
    getCanvasRef: () => canvasRef,
    getSlideWrapperRef: () => slideWrapperRef,
  }));

  // After image layers change, schedule a re-measure on the next frame
  useLayoutEffect(() => {
    const raf = requestAnimationFrame(() => setCanvasMeasureTick((t) => t + 1));
    return () => cancelAnimationFrame(raf);
  }, [slide.imageLayer, slide.logoImage, slide.canvasSize]);

  const getControlBox = (imageLayer) => {
    const wrapper = canvasWrapperRef.current;
    const canvasEl = canvasRef.current;
    if (!imageLayer || !imageLayer.img || !wrapper || !canvasEl) return null;

    const { img, scale, fitMode, x = 0, y = 0 } = imageLayer;

    // Use the actual CSS size and on-screen position of the canvas to compute the overlay
    const wrapperRect = wrapper.getBoundingClientRect();
    const canvasRect = canvasEl.getBoundingClientRect();
    const canvasCssWidth = canvasRect.width;
    const canvasCssHeight = canvasRect.height;

    const imgAspectRatio = img.naturalWidth / img.naturalHeight;
    const canvasAspectRatio = canvasCssWidth / canvasCssHeight;

    let renderWidth, renderHeight;
    if (fitMode === 'fill' ? (imgAspectRatio > canvasAspectRatio) : (imgAspectRatio < canvasAspectRatio)) {
      renderHeight = canvasCssHeight;
      renderWidth = renderHeight * imgAspectRatio;
    } else {
      renderWidth = canvasCssWidth;
      renderHeight = renderWidth / imgAspectRatio;
    }

    renderWidth *= scale;
    renderHeight *= scale;

    // Position within the canvas (centered image area) plus user translation x/y
    const leftWithinCanvas = (canvasCssWidth - renderWidth) / 2 + x;
    const topWithinCanvas = (canvasCssHeight - renderHeight) / 2 + y;

    // Convert to wrapper-relative coordinates for absolutely positioned overlay
    const left = (canvasRect.left - wrapperRect.left) + leftWithinCanvas;
    const top = (canvasRect.top - wrapperRect.top) + topWithinCanvas;

    return {
      left: Math.round(left),
      top: Math.round(top),
      width: Math.round(renderWidth),
      height: Math.round(renderHeight)
    };
  };

  // Drag handlers
  const handleDragStart = (layerName) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Create an offscreen canvas for snapshotting
    const offscreenCanvas = document.createElement('canvas');
    offscreenCanvas.width = canvas.width;
    offscreenCanvas.height = canvas.height;
    
    // We need to trick drawSlide into using the correct dimensions
    // by temporarily giving the offscreen canvas the same offset dimensions.
    Object.defineProperty(offscreenCanvas, 'offsetWidth', { configurable: true, value: canvas.offsetWidth });
    Object.defineProperty(offscreenCanvas, 'offsetHeight', { configurable: true, value: canvas.offsetHeight });

    // Draw the slide without the layer we're about to drag
    drawSlide(offscreenCanvas, slide, layerName).then(() => {
      const offscreenCtx = offscreenCanvas.getContext('2d');
      canvasSnapshot.current = offscreenCtx.getImageData(0, 0, offscreenCanvas.width, offscreenCanvas.height);
      setDraggingLayer(layerName); // Set dragging state only after snapshot is ready
    });
  };

  const handleDragEnd = () => {
    setDraggingLayer(null);
    canvasSnapshot.current = null;
    // A full redraw will be triggered by the main useEffect when draggingLayer becomes null.
  };

  return (
    <div ref={slideWrapperRef} className="slide-wrapper">
      <div
        className={`canvas-wrapper ${isActive ? 'active' : ''}`}
        ref={canvasWrapperRef}
        onClick={onClick}
        data-canvas-measure={canvasMeasureTick}
      >
        <canvas ref={canvasRef} className="picflam-canvas" />
        {editingLayer && (
          <button
            className="delete-layer-button"
            onClick={(e) => {
              e.stopPropagation(); // Prevent the canvas click from firing
              onLayerDelete(editingLayer);
            }}
            title="Delete Image"
          >
            <FaTrash />
          </button>
        )}
        {editingLayer === 'imageLayer' && slide.imageLayer && (
          <ImageTransformControl
            layer={slide.imageLayer}
            bounds={getControlBox(slide.imageLayer)}
            onUpdate={(updates) => onLayerUpdate('imageLayer', updates)}
            onDragStart={() => handleDragStart('imageLayer')}
            onDragEnd={handleDragEnd}
            onDelete={() => onLayerDelete('imageLayer')}
          />
        )}
        {editingLayer === 'logoImage' && slide.logoImage && (
          <ImageTransformControl
            layer={slide.logoImage}
            bounds={getControlBox(slide.logoImage)}
            onUpdate={(updates) => onLayerUpdate('logoImage', updates)}
            onDragStart={() => handleDragStart('logoImage')}
            onDragEnd={handleDragEnd}
            onDelete={() => onLayerDelete('logoImage')}
          />
        )}
      </div>
    </div>
  );
});

export default Slide;