import { useRef } from 'react';
import './ImageTransformControl.css';

function ImageTransformControl({ bounds, onUpdate, onDragStart, onDragEnd, layer }) {
  const hasDragged = useRef(false);

  const handleDragStart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    hasDragged.current = false;

    if (onDragStart) {
      onDragStart();
    }

    const startX = e.clientX || (e.touches && e.touches[0].clientX);
    const startY = e.clientY || (e.touches && e.touches[0].clientY);
    const initialX = layer.x || 0;
    const initialY = layer.y || 0;

    const handleDragMove = (moveEvent) => {
      moveEvent.preventDefault();
      const clientX = moveEvent.clientX || (moveEvent.touches && moveEvent.touches[0].clientX);
      const clientY = moveEvent.clientY || (moveEvent.touches && moveEvent.touches[0].clientY);
      const dx = clientX - startX;
      const dy = clientY - startY;

      if (!hasDragged.current && (Math.abs(dx) > 2 || Math.abs(dy) > 2)) {
        hasDragged.current = true;
      }

      // Continuously update the parent component during the drag
      if (hasDragged.current) {
        onUpdate({ x: initialX + dx, y: initialY + dy });
      }
    };

    const handleDragEnd = (endEvent) => {
      if (hasDragged.current) {
        endEvent.stopPropagation();
        // Ensure the final position is set correctly
        const finalClientX = endEvent.clientX || (endEvent.changedTouches && endEvent.changedTouches[0].clientX);
        const finalClientY = endEvent.clientY || (endEvent.changedTouches && endEvent.changedTouches[0].clientY);
        const finalDx = finalClientX - startX;
        const finalDy = finalClientY - startY;
        onUpdate({ x: initialX + finalDx, y: initialY + finalDy });
      }

      if (onDragEnd) {
        onDragEnd();
      }

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
      style={{ ...bounds, cursor: 'move', touchAction: 'none' }}
      onMouseDown={handleDragStart}
      onTouchStart={handleDragStart}
      onClick={(e) => e.stopPropagation()}
    />
  );
}

export default ImageTransformControl;
