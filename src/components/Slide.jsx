import { useRef, useEffect } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FiCopy, FiTrash2, FiPlus, FiMenu } from 'react-icons/fi';
import './Slide.css';

function Slide({
  slide,
  id,
  isActive,
  onClick,
  onAdd,
  onDuplicate,
  onDelete,
  drawSlide,
}) {
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
    <div className="slide-wrapper" ref={setNodeRef} style={style}>
      <div className="slide-container">
        {isActive && (
          <div className="slide-actions">
            <button {...attributes} {...listeners} title="Drag to reorder">
              <FiMenu />
            </button>
            <button onClick={() => onDuplicate()} title="Duplicate Slide">
              <FiCopy />
            </button>
            <button onClick={() => onDelete()} title="Delete Slide">
              <FiTrash2 />
            </button>
            <button className="add-slide-button" onClick={onAdd} title="Add New Slide">
              <FiPlus />
            </button>
          </div>
        )}
        <div className={`canvas-wrapper ${isActive ? 'active' : ''}`} onClick={onClick}>
          <canvas ref={canvasRef} className="picflam-canvas" style={getCanvasStyle()} />
        </div>
      </div>
    </div>
  );
}

export default Slide;