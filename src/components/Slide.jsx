import { forwardRef, useRef, useEffect, useImperativeHandle, useLayoutEffect, useState } from 'react';
import { FaTrash } from 'react-icons/fa';
import ImageTransformControl from './ImageTransformControl';
import './Slide.css';

const Slide = forwardRef(function Slide({
  slide,
  isActive,
  onClick,
  drawSlide,
  editingLayer, // 'imageLayer', 'logoImage', or null
  onLayerUpdate,
  onLayerDelete,
}, ref) {
  // Removed sortable functionality for single canvas

  const canvasRef = useRef(null);
  const canvasWrapperRef = useRef(null);
  const slideWrapperRef = useRef(null);

  // Re-measure canvas on layout changes to avoid initial overlay offset
  const [canvasMeasureTick, setCanvasMeasureTick] = useState(0);
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

  // Removed transform style for single canvas

  useEffect(() => {
    if (canvasRef.current) {
      drawSlide(canvasRef.current, slide);
    }
  }, [slide, drawSlide, canvasMeasureTick]);

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
            onDelete={() => onLayerDelete('imageLayer')}
          />
        )}
        {editingLayer === 'logoImage' && slide.logoImage && (
          <ImageTransformControl
            layer={slide.logoImage}
            bounds={getControlBox(slide.logoImage)}
            onUpdate={(updates) => onLayerUpdate('logoImage', updates)}
            onDelete={() => onLayerDelete('logoImage')}
          />
        )}
      </div>
    </div>
  );
});

export default Slide;