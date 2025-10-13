import { useRef } from 'react';
import './ImageTransformControl.css';

function ImageTransformControl({ bounds, onUpdate, layer }) {
  const hasDragged = useRef(false);

  const handleDragStart = (e) => {
    // Prevent the main canvas click handler from firing and deselecting the layer
    e.stopPropagation();
    hasDragged.current = false;

    const startX = e.clientX;
    const startY = e.clientY;
    const initialX = layer.x || 0;
    const initialY = layer.y || 0;

    const handleDragMove = (moveEvent) => {
      const dx = moveEvent.clientX - startX;
      const dy = moveEvent.clientY - startY;
      if (Math.abs(dx) > 2 || Math.abs(dy) > 2) { // Threshold to detect a real drag
        hasDragged.current = true;
      }
      onUpdate({ x: initialX + dx, y: initialY + dy });
    };

    const handleDragEnd = (endEvent) => {
      const finalDx = endEvent.clientX - startX;
      const finalDy = endEvent.clientY - startY;
      if (hasDragged.current) {
        endEvent.stopPropagation();
      }
      // Final update to lock in the position
      onUpdate({ x: initialX + finalDx, y: initialY + finalDy });

      document.removeEventListener('mousemove', handleDragMove);
      document.removeEventListener('mouseup', handleDragEnd);
    };

    document.addEventListener('mousemove', handleDragMove);
    document.addEventListener('mouseup', handleDragEnd);
  };

  if (!bounds) return null;

  return (
    <div
      className="image-transform-controls"
      style={{ ...bounds, cursor: 'move' }}
      onMouseDown={handleDragStart}
      onClick={(e) => e.stopPropagation()}
    />
  );
}

export default ImageTransformControl;