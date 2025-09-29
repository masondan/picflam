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


  return (
    <div className="app-container">
      {/* Canvas Area will go here */}
      <div className="canvas-container">
        <canvas className="picflam-canvas"></canvas>
      </div>

      {/* Footer Menu will go here */}
      <div className="footer-menu">
        <button className="footer-button" onClick={() => setIsSizeDrawerOpen(true)}><FiMaximize /></button>
        <button className="footer-button"><FiImage /></button>
        <button className="footer-button"><FiType /></button>
        <button className="footer-button"><FiBookmark /></button>
        <button className="footer-button"><FiDownload /></button>
        <button className="footer-button"><FiRotateCcw /></button>
        <button className="footer-button"><FiInfo /></button>
      </div>

      {isSizeDrawerOpen && <SizeDrawer onClose={() => setIsSizeDrawerOpen(false)} />}
    </div>
  )
}

export default App
