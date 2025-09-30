import './App.css'
import { useState } from 'react';
import {
  FiMaximize,
  FiImage,
  FiType,
  FiBookmark,
  FiDownload,
  FiRotateCcw,
  FiInfo
} from 'react-icons/fi';
import SizeDrawer from './components/SizeDrawer';

function App() {
  const [isSizeDrawerOpen, setIsSizeDrawerOpen] = useState(false);
  const [canvasSize, setCanvasSize] = useState('1/1'); // Default to square
  const [originalSize, setOriginalSize] = useState(canvasSize);

  const handleSizeSelect = (newSize) => {
    setCanvasSize(newSize);
  };

  const handleDrawerClose = (confirm) => {
    if (!confirm) {
      setCanvasSize(originalSize); // Revert on cancel
    }
    setIsSizeDrawerOpen(false);
  };

  return (
    <div className="app-container">
      {/* Canvas Area */}
      <div className="canvas-container">
        <canvas className="picflam-canvas" style={{ aspectRatio: canvasSize }}></canvas>
      </div>

      {/* Footer Menu */}
      <div className="footer-menu">
        <button className="footer-button" onClick={() => {
          setOriginalSize(canvasSize);
          setIsSizeDrawerOpen(true);
        }}><FiMaximize /></button>
        <button className="footer-button"><FiImage /></button>
        <button className="footer-button"><FiType /></button>
        <button className="footer-button"><FiBookmark /></button>
        <button className="footer-button"><FiDownload /></button>
        <button className="footer-button"><FiRotateCcw /></button>
        <button className="footer-button"><FiInfo /></button>
      </div>

      {isSizeDrawerOpen && (
        <SizeDrawer
          onClose={(confirm) => handleDrawerClose(confirm)}
          onSizeSelect={handleSizeSelect}
          currentSize={canvasSize}
          onCanvasSizeChange={setCanvasSize} // Pass the setter for live preview
        />
      )}
    </div>
  )
}

export default App
