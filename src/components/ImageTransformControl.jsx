import { useState, useEffect, useRef } from 'react';
import { FiX } from 'react-icons/fi';
import './ImageTransformControl.css';

function ImageTransformControl({ canvasRef, imageLayer, onUpdate, onDelete }) {
  const [controlBox, setControlBox] = useState({ top: 0, left: 0, width: 0, height: 0 });
  const interactionRef = useRef(null); // Use a ref to avoid re-render issues during drag

  // This effect recalculates the position of the controls whenever the canvas or image changes
  useEffect(() => {
    if (!imageLayer || !imageLayer.img || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const { img, scale, fitMode, x = 0, y = 0 } = imageLayer;

    const displayedCanvasWidth = canvas.offsetWidth;
    const displayedCanvasHeight = canvas.offsetHeight;
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

  }, [imageLayer, canvasRef]);

  const handlePointerMove = (e) => {
    if (!interactionRef.current) return;

    const dx = e.clientX - interactionRef.current.startX;
    const dy = e.clientY - interactionRef.current.startY;

    if (interactionRef.current.action === 'move') {
      onUpdate({
        x: interactionRef.current.initialX + dx,
        y: interactionRef.current.initialY + dy,
      });
    } else if (interactionRef.current.action === 'resize') {
      const newWidth = interactionRef.current.initialWidth + dx;
      const scaleFactor = newWidth / interactionRef.current.initialWidth;
      let newScale = interactionRef.current.initialScale * scaleFactor;

      newScale = Math.max(0.1, Math.min(newScale, 5)); // Clamp scale
      onUpdate({ scale: newScale });
    }
  };

  const handlePointerUp = () => {
    interactionRef.current = null;
    window.removeEventListener('pointermove', handlePointerMove);
    window.removeEventListener('pointerup', handlePointerUp);
  };

  const handlePointerDown = (e, action) => {
    e.preventDefault();
    e.stopPropagation();
    interactionRef.current = {
      action,
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

  if (!imageLayer) return null;

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
      onClick={(e) => e.stopPropagation()} // Prevent drawer from closing
    >
      <button
        className="delete-image-button"
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        onPointerDown={(e) => e.stopPropagation()}
      >
        <FiX />
      </button>
      <div className="resize-handle top-left" onPointerDown={(e) => handlePointerDown(e, 'resize')}></div>
      <div className="resize-handle top-right" onPointerDown={(e) => handlePointerDown(e, 'resize')}></div>
      <div className="resize-handle bottom-left" onPointerDown={(e) => handlePointerDown(e, 'resize')}></div>
      <div className="resize-handle bottom-right" onPointerDown={(e) => handlePointerDown(e, 'resize')}></div>
    </div>
  );
}

export default ImageTransformControl;
