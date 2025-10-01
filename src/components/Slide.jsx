import { useRef, useEffect, forwardRef } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FiCopy, FiTrash2, FiPlus, FiRotateCcw, FiRotateCw } from 'react-icons/fi';
import { RxDragHandleDots2 } from 'react-icons/rx';
import ImageTransformControl from './ImageTransformControl';
import './Slide.css';

const Slide = forwardRef(({
  slide,
  id,
  isActive,
  onClick,
  onAdd,
  onDuplicate,
  onDelete,
  drawSlide,
  onImageUpdate,
  onImageDelete,
}, ref) => {
  const canvasRef = useRef(null);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  // This effect will redraw the canvas whenever the slide's data changes.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      drawSlide(canvas, slide);
    }
  }, [slide, drawSlide]);

  const getCanvasStyle = () => {
    const [aspectX, aspectY] = slide.canvasSize.split('/').map(Number);
    return {
      aspectRatio: `${aspectX} / ${aspectY}`,
      backgroundColor: '#eeeeee',
    };
  };

  return (
    <div className="slide-wrapper" ref={ref}>
      <div className="slide-container" ref={setNodeRef} style={style}>
        <div className={`slide-actions-top ${isActive ? 'visible' : ''}`}>
          <button onClick={() => onDelete()} title="Delete Slide"><FiTrash2 /></button>
          <button onClick={() => alert('Undo coming soon!')} title="Undo"><FiRotateCcw /></button>
          <button onClick={() => alert('Redo coming soon!')} title="Redo"><FiRotateCw /></button>
          <button onClick={onAdd} title="Add New Slide"><FiPlus /></button>
          <button onClick={() => onDuplicate()} title="Duplicate Slide"><FiCopy /></button>
          <button {...attributes} {...listeners} title="Drag to reorder"><RxDragHandleDots2 /></button>
        </div>
        <div className="canvas-wrapper" onClick={onClick}>
          <canvas
            ref={canvasRef}
            className="picflam-canvas"
            style={getCanvasStyle()}
          />
          {isActive && slide.imageLayer && (
            <ImageTransformControl
              canvasRef={canvasRef}
              imageLayer={slide.imageLayer}
              onUpdate={onImageUpdate}
              onDelete={onImageDelete}
            />
          )}
        </div>
      </div>
    </div>
  );
});

Slide.displayName = 'Slide';
export default Slide;