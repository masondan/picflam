import { useRef } from 'react';
import './ImageTransformControl.css';

function ImageTransformControl({ bounds, onUpdate, layer }) {
  const hasDragged = useRef(false);

  const handleDragStart = (e) => {
    // Prevent the main canvas click handler from firing and deselecting the layer
    e.stopPropagation();
    hasDragged.current = false;

    const startX = e.clientX || (e.touches && e.touches[0].clientX);
    const startY = e.clientY || (e.touches && e.touches[0].clientY);
    const initialX = layer.x || 0;
    const initialY = layer.y || 0;

    const handleDragMove = (moveEvent) => {
      moveEvent.preventDefault(); // Prevent scrolling or other default behaviors
      const clientX = moveEvent.clientX || (moveEvent.touches && moveEvent.touches[0].clientX);
      const clientY = moveEvent.clientY || (moveEvent.touches && moveEvent.touches[0].clientY);
      const dx = clientX - startX;
      const dy = clientY - startY;
      if (Math.abs(dx) > 2 || Math.abs(dy) > 2) { // Threshold to detect a real drag
        hasDragged.current = true;
      }
      // Throttle updates to reduce artifact trails
      requestAnimationFrame(() => {
        onUpdate({ x: initialX + dx, y: initialY + dy });
      });
    };

    const handleDragEnd = (endEvent) => {
      const finalClientX = endEvent.clientX || (endEvent.changedTouches && endEvent.changedTouches[0].clientX);
      const finalClientY = endEvent.clientY || (endEvent.changedTouches && endEvent.changedTouches[0].clientY);
      const finalDx = finalClientX - startX;
      const finalDy = finalClientY - startY;
      if (hasDragged.current) {
        endEvent.stopPropagation();
      }
      // Final update to lock in the position
      onUpdate({ x: initialX + finalDx, y: initialY + finalDy });

      document.removeEventListener('mousemove', handleDragMove);
      document.removeEventListener('mouseup', handleDragEnd);
      document.removeEventListener('touchmove', handleDragMove);
      document.removeEventListener('touchend', handleDragEnd);
      document.removeEventListener('touchcancel', handleDragEnd);
    };

    document.addEventListener('mousemove', handleDragMove);
    document.addEventListener('mouseup', handleDragEnd);
    document.addEventListener('touchmove', handleDragMove, { passive: false });
    document.addEventListener('touchcancel', handleDragEnd);
    document.addEventListener('touchend', handleDragEnd);
  };

  if (!bounds) return null;

  return (
    <div
      className="image-transform-controls"
      style={{
        width: bounds.width,
        height: bounds.height,
        transform: `translate(${bounds.left}px, ${bounds.top}px)`,
        cursor: 'move'
      }}
      onMouseDown={handleDragStart}
      onTouchStart={handleDragStart}
      onClick={(e) => e.stopPropagation()}
    />
  );
}

export default ImageTransformControl;