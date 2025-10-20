import { forwardRef, useRef, useEffect, useImperativeHandle, useLayoutEffect, useState } from 'react';
import { FaTrash } from 'react-icons/fa';
import ImageTransformControl from './ImageTransformControl';
import { computeTextBounds } from '../utils/canvasUtils';
import './Slide.css';

const Slide = forwardRef(function Slide({
  slide,
  isActive,
  onSetActiveElement,
  drawSlide,
  editingLayer,
  onLayerUpdate,
  onLayerDelete,
}, ref) {
  const canvasRef = useRef(null);
  const canvasWrapperRef = useRef(null);
  const slideWrapperRef = useRef(null);
  const [canvasMeasureTick, setCanvasMeasureTick] = useState(0);

  useLayoutEffect(() => {
    const canvasEl = canvasRef.current;
    if (!canvasEl) return;
    const ro = new ResizeObserver(() => setCanvasMeasureTick((t) => t + 1));
    ro.observe(canvasEl);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      // Pass editingLayer to the main draw function. It will handle borders.
      drawSlide(canvas, slide, null, editingLayer);
    }
  }, [slide, drawSlide, canvasMeasureTick, editingLayer]);

  useImperativeHandle(ref, () => ({
    getCanvasRef: () => canvasRef,
  }));

  useLayoutEffect(() => {
    const raf = requestAnimationFrame(() => setCanvasMeasureTick((t) => t + 1));
    return () => cancelAnimationFrame(raf);
  }, [slide.imageLayer, slide.logoImage, slide.canvasSize]);

  const getControlBox = (imageLayer) => {
    const wrapper = canvasWrapperRef.current;
    const canvasEl = canvasRef.current;
    if (!imageLayer || !imageLayer.img || !wrapper || !canvasEl) return null;

    const { img, scale, fitMode, x = 0, y = 0 } = imageLayer;
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

    const leftWithinCanvas = (canvasCssWidth - renderWidth) / 2 + x;
    const topWithinCanvas = (canvasCssHeight - renderHeight) / 2 + y;
    const left = (canvasRect.left - wrapperRect.left) + leftWithinCanvas;
    const top = (canvasRect.top - wrapperRect.top) + topWithinCanvas;

    return {
      left: Math.round(left),
      top: Math.round(top),
      width: Math.round(renderWidth),
      height: Math.round(renderHeight)
    };
  };

  const getTextBounds = (which) => {
    return computeTextBounds(canvasRef.current, canvasWrapperRef.current, slide, which);
  };

  return (
    <div ref={slideWrapperRef} className="slide-wrapper">
      <div
        className={`canvas-wrapper ${isActive ? 'active' : ''}`}
        ref={canvasWrapperRef}
        data-canvas-measure={canvasMeasureTick}
      >
        <canvas ref={canvasRef} className="picflam-canvas" />
        {editingLayer && (
          <button
            className="delete-layer-button"
            onClick={(e) => {
              e.stopPropagation();
              onLayerDelete(editingLayer);
            }}
            title="Delete Image"
          >
            <FaTrash />
          </button>
        )}
        <ImageTransformControl
          slide={slide}
          getControlBox={getControlBox}
          getTextBounds={getTextBounds}
          onSetActiveElement={onSetActiveElement}
          onLayerUpdate={onLayerUpdate}
        />
      </div>
    </div>
  );
});

export default Slide;