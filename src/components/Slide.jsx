import { forwardRef, useRef, useEffect, useImperativeHandle } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FiPlus, FiCopy, FiTrash2 } from 'react-icons/fi';
import { FaTrash } from 'react-icons/fa';
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
  onLayerUpdate,
  onLayerDelete,
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

  const getControlBox = (imageLayer) => {
    const canvas = canvasWrapperRef.current;
    if (!imageLayer || !imageLayer.img || !canvas) return null;

    const { img, scale, fitMode, x = 0, y = 0 } = imageLayer;
    const canvasWidth = canvas.offsetWidth;
    const canvasHeight = canvas.offsetHeight;
    const imgAspectRatio = img.naturalWidth / img.naturalHeight;
    const canvasAspectRatio = canvasWidth / canvasHeight;

    let renderWidth, renderHeight;
    if (fitMode === 'fill' ? (imgAspectRatio > canvasAspectRatio) : (imgAspectRatio < canvasAspectRatio)) {
      renderHeight = canvasHeight;
      renderWidth = renderHeight * imgAspectRatio;
    } else {
      renderWidth = canvasWidth;
      renderHeight = renderWidth / imgAspectRatio;
    }
    renderWidth *= scale; renderHeight *= scale;
    return { left: (canvasWidth - renderWidth) / 2 + x, top: (canvasHeight - renderHeight) / 2 + y, width: renderWidth, height: renderHeight };
  };

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
        {editingLayer && (
          <button
            className="delete-layer-button"
            onClick={(e) => {
              e.stopPropagation(); // Prevent the canvas click from firing
              onLayerDelete(editingLayer);
            }}
            title="Delete Image"
          >
            <FaTrash />
          </button>
        )}
        {editingLayer === 'imageLayer' && slide.imageLayer && (
          <ImageTransformControl
            layer={slide.imageLayer}
            bounds={getControlBox(slide.imageLayer)}
            onUpdate={(updates) => onLayerUpdate('imageLayer', updates)}
            onDelete={() => onLayerDelete('imageLayer')}
          />
        )}
        {editingLayer === 'logoImage' && slide.logoImage && (
          <ImageTransformControl
            layer={slide.logoImage}
            bounds={getControlBox(slide.logoImage)}
            onUpdate={(updates) => onLayerUpdate('logoImage', updates)}
            onDelete={() => onLayerDelete('logoImage')}
          />
        )}
      </div>
    </div>
  );
});

export default Slide;