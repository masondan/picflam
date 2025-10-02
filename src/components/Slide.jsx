import { forwardRef, useRef, useEffect, useImperativeHandle } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FiPlus, FiCopy, FiTrash2 } from 'react-icons/fi';
import { LuUndo2, LuRedo2 } from 'react-icons/lu';
import { RxDragHandleDots2 } from 'react-icons/rx';
import ImageTransformControl from './ImageTransformControl';
import './Slide.css';

const Slide = forwardRef(function Slide({
  id,
  slide,
  isActive,
  onClick,
  onAdd,
  onDuplicate,
  onDelete,
  onUndo,
  onRedo,
  drawSlide,
  editingLayer, // 'imageLayer', 'logoImage', or null
  onImageUpdate,
  onImageDelete,
  onLogoUpdate,
  onLogoDelete,
}, ref) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const canvasRef = useRef(null);
  const canvasWrapperRef = useRef(null);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  useEffect(() => {
    if (canvasRef.current) {
      drawSlide(canvasRef.current, slide);
    }
  }, [slide, drawSlide]);

  useImperativeHandle(ref, () => ({
    scrollIntoView: (opts) => {
      canvasRef.current?.parentElement.scrollIntoView(opts);
    },
    getCanvasWrapperRef: () => canvasWrapperRef,
    getCanvasRef: () => canvasRef,
  }));

  return (
    <div ref={setNodeRef} style={style} className="slide-wrapper" {...attributes}>
      <div className={`slide-actions-top ${isActive ? 'visible' : ''}`} onClick={(e) => e.stopPropagation()}>
        <button onClick={onDelete} title="Delete Slide"><FiTrash2 /></button>
        <button onClick={onUndo} title="Undo"><LuUndo2 /></button>
        <button onClick={onRedo} title="Redo"><LuRedo2 /></button>
        <button onClick={onAdd} title="Add Slide"><FiPlus /></button>
        <button onClick={onDuplicate} title="Duplicate Slide"><FiCopy /></button>
        <button {...listeners} title="Drag to Reorder" className="drag-handle"><RxDragHandleDots2 /></button>
      </div>
      <div
        className={`canvas-wrapper ${isActive ? 'active' : ''}`}
        ref={canvasWrapperRef}
        onClick={onClick}
      >
        <canvas ref={canvasRef} className="picflam-canvas" />
        {editingLayer === 'imageLayer' && slide.imageLayer && (
          <ImageTransformControl
            canvasRef={canvasRef}
            imageLayer={slide.imageLayer}
            onUpdate={onImageUpdate}
            onDelete={onImageDelete}
          />
        )}
        {editingLayer === 'logoImage' && slide.logoImage && (
          <ImageTransformControl
            canvasRef={canvasRef}
            imageLayer={slide.logoImage}
            onUpdate={onLogoUpdate}
            onDelete={onLogoDelete}
          />
        )}
      </div>
    </div>
  );
});

export default Slide;
