import { useRef } from 'react';
import './ImageTransformControl.css';

function ImageTransformControl({
  slide,
  getControlBox,
  getTextBounds,
  onSetActiveElement,
  onLayerUpdate,
}) {
  const hasDragged = useRef(false);
  const activeDragTarget = useRef(null);
  const rafRef = useRef(null); // ARTIFACT FIX: For requestAnimationFrame

  const handleMouseDown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    hasDragged.current = false;

    const wrapper = e.currentTarget; // The control div itself
    const rect = wrapper.getBoundingClientRect();
    const x = (e.clientX || e.touches[0].clientX) - rect.left;
    const y = (e.clientY || e.touches[0].clientY) - rect.top;

    // --- HIT DETECTION ---
    // The order is important: check for text, then logo, then image.
    const text1Bounds = slide.text1 ? getTextBounds('text1') : null;
    const text2Bounds = slide.text2 ? getTextBounds('text2') : null;
    const logoBounds = slide.logoImage ? getControlBox(slide.logoImage) : null;
    const imageBounds = slide.imageLayer ? getControlBox(slide.imageLayer) : null;

    let clickedElement = 'background'; // Default

    if (text1Bounds && x >= text1Bounds.left && x <= text1Bounds.left + text1Bounds.width && y >= text1Bounds.top && y <= text1Bounds.top + text1Bounds.height) {
      clickedElement = 'text1';
    } else if (text2Bounds && x >= text2Bounds.left && x <= text2Bounds.left + text2Bounds.width && y >= text2Bounds.top && y <= text2Bounds.top + text2Bounds.height) {
      clickedElement = 'text2';
    } else if (logoBounds && x >= logoBounds.left && x <= logoBounds.left + logoBounds.width && y >= logoBounds.top && y <= logoBounds.top + logoBounds.height) {
      clickedElement = 'logoImage';
    } else if (imageBounds && x >= imageBounds.left && x <= imageBounds.left + imageBounds.width && y >= imageBounds.top && y <= imageBounds.top + imageBounds.height) {
      clickedElement = 'imageLayer';
    }

    onSetActiveElement(clickedElement);
    activeDragTarget.current = (clickedElement === 'imageLayer' || clickedElement === 'logoImage') ? clickedElement : null;

    // --- DRAG LOGIC (only if an image was clicked) ---
    if (!activeDragTarget.current) return;

    const startX = e.clientX || (e.touches && e.touches[0].clientX);
    const startY = e.clientY || (e.touches && e.touches[0].clientY);
    const initialX = slide[activeDragTarget.current].x || 0;
    const initialY = slide[activeDragTarget.current].y || 0;

    const handleMouseMove = (moveEvent) => {
      moveEvent.preventDefault();
      const clientX = moveEvent.clientX || (moveEvent.touches && moveEvent.touches[0].clientX);
      const clientY = moveEvent.clientY || (moveEvent.touches && moveEvent.touches[0].clientY);
      const dx = clientX - startX;
      const dy = clientY - startY;

      if (!hasDragged.current && (Math.abs(dx) > 2 || Math.abs(dy) > 2)) {
        hasDragged.current = true;
      }

      if (hasDragged.current) {
        // ARTIFACT FIX: Cancel previous frame if still pending
        if (rafRef.current) {
          cancelAnimationFrame(rafRef.current);
        }

        // ARTIFACT FIX: Use requestAnimationFrame to sync with browser repaint
        rafRef.current = requestAnimationFrame(() => {
          const newX = initialX + dx;
          const newY = initialY + dy;
          
          // Debug logging for Android testing
          if (typeof window !== 'undefined' && /Android/i.test(navigator.userAgent)) {
            console.log('[Android Debug] Updating position:', { 
              layer: activeDragTarget.current,
              x: newX.toFixed(2), 
              y: newY.toFixed(2),
              dx: dx.toFixed(2),
              dy: dy.toFixed(2)
            });
          }
          
          onLayerUpdate(activeDragTarget.current, { x: newX, y: newY });
          rafRef.current = null;
        });
      }
    };

    const handleMouseUp = () => {
      // ARTIFACT FIX: Cancel any pending animation frame
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleMouseMove);
      document.removeEventListener('touchend', handleMouseUp);
      activeDragTarget.current = null;
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('touchmove', handleMouseMove, { passive: false });
    document.addEventListener('touchend', handleMouseUp);
  };

  // This component is now a full-overlay div that captures all canvas mouse events
  return (
    <div
      className="image-transform-controls-overlay"
      onMouseDown={handleMouseDown}
      onTouchStart={handleMouseDown}
    />
  );
}

export default ImageTransformControl;