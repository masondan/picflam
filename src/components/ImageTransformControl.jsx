import { useState, useEffect, useRef } from 'react';
import './ImageTransformControl.css';

function ImageTransformControl({ canvasRef, imageLayer, onUpdate, onDelete }) {
  const [controlBox, setControlBox] = useState({ top: 0, left: 0, width: 0, height: 0 });
  const interactionRef = useRef(null);
  const [showGuides, setShowGuides] = useState({ h: false, v: false });

  // This effect recalculates the position of the controls whenever the image or canvas changes
  useEffect(() => {
    if (!imageLayer || !imageLayer.img || !canvasRef.current) {
      return;
    }

    const canvas = canvasRef.current;
    const { img, scale, fitMode, x = 0, y = 0 } = imageLayer;

    const displayedCanvasWidth = canvas.offsetWidth;
    const displayedCanvasHeight = canvas.offsetHeight;

    // Guard against a 0-sized canvas on first render
    if (displayedCanvasWidth === 0 || displayedCanvasHeight === 0) {
      return;
    }

    const canvasAspectRatio = displayedCanvasWidth / displayedCanvasHeight;
    const imgAspectRatio = img.naturalWidth / img.naturalHeight;

    let renderWidth, renderHeight;

    if (fitMode === 'fill') {
      if (imgAspectRatio > canvasAspectRatio) {
        renderHeight = displayedCanvasHeight;
        renderWidth = renderHeight * imgAspectRatio;
      } else {
        renderWidth = displayedCanvasWidth;
        renderHeight = renderWidth / imgAspectRatio;
      }
    } else { // 'fit'
      if (imgAspectRatio > canvasAspectRatio) {
        renderWidth = displayedCanvasWidth;
        renderHeight = renderWidth / imgAspectRatio;
      } else {
        renderHeight = displayedCanvasHeight;
        renderWidth = renderHeight * imgAspectRatio;
      }
    }

    renderWidth *= scale;
    renderHeight *= scale;

    const imageTopRelativeToCanvas = (displayedCanvasHeight - renderHeight) / 2;
    const imageLeftRelativeToCanvas = (displayedCanvasWidth - renderWidth) / 2;

    setControlBox({
      width: renderWidth,
      height: renderHeight,
      top: canvas.offsetTop + imageTopRelativeToCanvas + y,
      left: canvas.offsetLeft + imageLeftRelativeToCanvas + x,
    });

  }, [imageLayer, canvasRef, canvasRef.current]);

  const handlePointerMove = (e) => {
    if (!interactionRef.current) return;

    const dx = e.clientX - interactionRef.current.startX;
    const dy = e.clientY - interactionRef.current.startY;

    if (interactionRef.current.action === 'move') {
      let newX = interactionRef.current.initialX + dx;
      let newY = interactionRef.current.initialY + dy;

      const snapThreshold = 5;
      const showH = Math.abs(newY) < snapThreshold;
      const showV = Math.abs(newX) < snapThreshold;

      if (showH) newY = 0;
      if (showV) newX = 0;

      setShowGuides({ h: showH, v: showV });

      onUpdate({ x: newX, y: newY });
    }
  };

  const handlePointerUp = () => {
    interactionRef.current = null;
    window.removeEventListener('pointermove', handlePointerMove);
    window.removeEventListener('pointerup', handlePointerUp);
    setShowGuides({ h: false, v: false });
  };

  const handlePointerDown = (e, action) => {
    e.stopPropagation();
    e.preventDefault(); // Prevent text selection, etc.

    interactionRef.current = {
      action: action,
      startX: e.clientX,
      startY: e.clientY,
      initialX: imageLayer.x || 0,
      initialY: imageLayer.y || 0,
      initialScale: imageLayer.scale,
      initialWidth: controlBox.width,
      initialHeight: controlBox.height,
    };
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
  };

  // This component should not render if the canvas isn't ready.
  if (!imageLayer || !canvasRef.current) return null;

  return (
    <div
      className="image-transform-control"
      style={{
        top: `${controlBox.top}px`,
        left: `${controlBox.left}px`,
        width: `${controlBox.width}px`,
        height: `${controlBox.height}px`,
      }}
      onPointerDown={(e) => handlePointerDown(e, 'move')}
    >
      {showGuides.v && <div className="guide vertical-guide" style={{ left: '50%' }}></div>}
      {showGuides.h && <div className="guide horizontal-guide" style={{ top: '50%' }}></div>}
    </div>
  );
}

export default ImageTransformControl;
