import { useRef, useState } from 'react';
import './ImageTransformControl.css';

function ImageTransformControl({ bounds, onUpdate, layer }) {
  const hasDragged = useRef(false);
  const [dragState, setDragState] = useState({ dx: 0, dy: 0, isDragging: false });

  const handleDragStart = (e) => {
    e.preventDefault(); // Prevent default touch actions like scrolling
    // Prevent the main canvas click handler from firing and deselecting the layer
    e.stopPropagation();
    hasDragged.current = false;

    const startX = e.clientX || (e.touches && e.touches[0].clientX);
    const startY = e.clientY || (e.touches && e.touches[0].clientY);
    const initialX = layer.x || 0;
    const initialY = layer.y || 0;

    setDragState({ dx: 0, dy: 0, isDragging: true });

    const handleDragMove = (moveEvent) => {
      moveEvent.preventDefault(); // Ensure continued prevention during move
      const clientX = moveEvent.clientX || (moveEvent.touches && moveEvent.touches[0].clientX);
      const clientY = moveEvent.clientY || (moveEvent.touches && moveEvent.touches[0].clientY);
      const dx = clientX - startX;
      const dy = clientY - startY;
      if (Math.abs(dx) > 2 || Math.abs(dy) > 2) { // Threshold to detect a real drag
        hasDragged.current = true;
      }
      // Update local drag state for smooth transform, not React state
      setDragState({ dx, dy, isDragging: true });
    };

    const handleDragEnd = (endEvent) => {
      const finalClientX = endEvent.clientX || (endEvent.changedTouches && endEvent.changedTouches[0].clientX);
      const finalClientY = endEvent.clientY || (endEvent.changedTouches && endEvent.changedTouches[0].clientY);
      const finalDx = finalClientX - startX;
      const finalDy = finalClientY - startY;

      if (hasDragged.current) {
        endEvent.stopPropagation();
      }
      // Final update to commit the position to React state
      onUpdate({ x: initialX + finalDx, y: initialY + finalDy });

      document.removeEventListener('mousemove', handleDragMove);
      document.removeEventListener('mouseup', handleDragEnd);
      document.removeEventListener('touchmove', handleDragMove);
      document.removeEventListener('touchend', handleDragEnd);
      document.removeEventListener('touchcancel', handleDragEnd);

      setDragState({ dx: 0, dy: 0, isDragging: false });
    };

    document.addEventListener('mousemove', handleDragMove);
    document.addEventListener('mouseup', handleDragEnd);
    document.addEventListener('touchmove', handleDragMove, { passive: false }); // passive: false is required for preventDefault()
    document.addEventListener('touchcancel', handleDragEnd);
    document.addEventListener('touchend', handleDragEnd);
  };

  if (!bounds) return null;

  const transformStyle = dragState.isDragging
    ? { transform: `translate(${dragState.dx}px, ${dragState.dy}px)` }
    : {};

  return (
    <div
      className="image-transform-controls"
      style={{ ...bounds, cursor: 'move', ...transformStyle, touchAction: 'none' }}
      onMouseDown={handleDragStart}
      onTouchStart={handleDragStart}
      onClick={(e) => e.stopPropagation()}
    />
  );
}

export default ImageTransformControl;
