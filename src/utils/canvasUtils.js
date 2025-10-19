// Helper function to convert hex color and alpha to rgba
export const hexToRgba = (hex, alpha = 1) => {
  if (!hex || hex === 'transparent') return 'transparent';
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

// Compress an image to reduce file size for storage
export const compressImage = (img, maxDimension = 800, quality = 0.8) => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // Calculate new dimensions maintaining aspect ratio
    const aspectRatio = img.naturalWidth / img.naturalHeight;
    let newWidth, newHeight;

    if (img.naturalWidth > img.naturalHeight) {
      newWidth = Math.min(img.naturalWidth, maxDimension);
      newHeight = newWidth / aspectRatio;
    } else {
      newHeight = Math.min(img.naturalHeight, maxDimension);
      newWidth = newHeight * aspectRatio;
    }

    canvas.width = newWidth;
    canvas.height = newHeight;

    // Draw and compress
    ctx.drawImage(img, 0, 0, newWidth, newHeight);
    const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);

    resolve(compressedDataUrl);
  });
};

// Compute the CSS-pixel bounding box of a text block relative to the canvas, then convert to wrapper-relative coords
export const computeTextBounds = (canvasEl, wrapperEl, slideData, which) => {
  if (!canvasEl || !wrapperEl) return null;
  const canvasRect = canvasEl.getBoundingClientRect();
  const wrapperRect = wrapperEl.getBoundingClientRect();
  const canvasCssWidth = canvasRect.width;
  const canvasCssHeight = canvasRect.height;

  const isText1 = which === 'text1';
  const text = isText1 ? slideData.text1 : slideData.text2;
  if (!text) return null;

  const size = isText1 ? slideData.text1Size : slideData.text2Size;
  const yPos = isText1 ? slideData.text1YPosition : slideData.text2YPosition;
  const font = isText1 ? slideData.text1Font : slideData.text2Font;
  const isBold = isText1 ? slideData.text1IsBold : slideData.text2IsBold;
  const isItalic = isText1 ? slideData.text1IsItalic : slideData.text2IsItalic;
  const align = isText1 ? slideData.text1Align : slideData.text2Align;
  const lineSpacing = isText1 ? slideData.text1LineSpacing : slideData.text2LineSpacing;

  // CSS pixel font metrics parallel to drawText
  const baseFontSize = Math.min(canvasCssWidth, canvasCssHeight) * 0.1;
  const fontSize = baseFontSize * (size / 5);
  const finalLineSpacing = 0.8 + (lineSpacing / 10) * (1.4 - 0.8);
  const lineHeight = fontSize * finalLineSpacing;
  const maxWidth = canvasCssWidth * 0.8;
  const yPosition = canvasCssHeight * (yPos / 10);

  // Measure wrapped lines using the same algorithm
  const ctx = canvasEl.getContext('2d');
  ctx.save();
  const fontWeight = isBold ? 'bold' : 'normal';
  const fontStyle = isItalic ? 'italic' : 'normal';
  ctx.font = `${fontStyle} ${fontWeight} ${fontSize}px "${font}", sans-serif`;
  ctx.textBaseline = 'middle';
  const paragraphs = text.split('\n');
  const lines = [];
  let widestLine = 0;

  for (const paragraph of paragraphs) {
    const words = paragraph.split(' ');
    let line = '';
    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const testWidth = ctx.measureText(testLine).width;
      if (testWidth > maxWidth && n > 0) {
        lines.push(line);
        const widthLine = ctx.measureText(line).width;
        if (widthLine > widestLine) widestLine = widthLine;
        line = words[n] + ' ';
      } else {
        line = testLine;
      }
    }
    lines.push(line);
    const widthLine = ctx.measureText(line).width;
    if (widthLine > widestLine) widestLine = widthLine;
  }
  ctx.restore();

  const totalTextHeight = lines.length * lineHeight;
  const textTop = yPosition - (totalTextHeight / 2);
  let left;
  if (align === 'left') {
    left = canvasCssWidth * 0.1;
  } else if (align === 'right') {
    left = canvasCssWidth * 0.9 - widestLine;
  } else {
    left = Math.max(canvasCssWidth * 0.1, Math.min(canvasCssWidth * 0.9 - widestLine, (canvasCssWidth / 2) - (widestLine / 2)));
  }
  let top = textTop;
  let width = widestLine;
  let height = totalTextHeight;

  // Include label background for text2 if present (centered rectangle)
  if (!isText1 && slideData.text2LabelColor !== 'transparent') {
    const paddingHorizontal = lineHeight * 0.6;
    const paddingTop = lineHeight * 0.5;
    const paddingBottom = lineHeight * 0.3;
    const labelWidth = widestLine + paddingHorizontal * 2;
    const labelHeight = totalTextHeight + paddingTop + paddingBottom;
    let labelX;
    if (align === 'left') {
      labelX = (canvasCssWidth - maxWidth) / 2 - paddingHorizontal;
    } else if (align === 'right') {
      labelX = canvasCssWidth - ((canvasCssWidth - maxWidth) / 2) - widestLine - paddingHorizontal;
    } else {
      labelX = (canvasCssWidth / 2) - (widestLine / 2) - paddingHorizontal;
    }
    const labelY = yPosition - (totalTextHeight / 2) - paddingTop;

    left = labelX;
    top = labelY;
    width = labelWidth;
    height = labelHeight;
  }

  // Optionally include leading quote for text1 (match draw positioning)
  if (isText1 && slideData.text1QuoteStyle && slideData.text1QuoteStyle !== 'none') {
    const quoteStyle = slideData.text1QuoteStyle;
    const quoteSize = slideData.text1QuoteSize;
    const quoteSizeVal = (Math.min(canvasCssWidth, canvasCssHeight) * 0.1) * 4 * (quoteSize / 5);
    const ctx2 = canvasEl.getContext('2d');
    ctx2.save();
    if (quoteStyle === 'serif') {
      ctx2.font = `bold ${quoteSizeVal}px "Playfair Display", serif`;
    } else if (quoteStyle === 'slab') {
      ctx2.font = `${quoteSizeVal}px "Alfa Slab One", cursive`;
    } else {
      ctx2.font = `${quoteSizeVal}px "Saira Stencil One", sans-serif`;
    }
    const m = ctx2.measureText('“');
    const quoteHeight = ((m.actualBoundingBoxAscent || 0) + (m.actualBoundingBoxDescent || 0)) || quoteSizeVal;
    ctx2.restore();
    const gap = (quoteStyle === 'slab' ? lineHeight * 0.35 : lineHeight * 0.4); // match drawText gap
    const quoteBottom = textTop - gap;
    const quoteTop = quoteBottom - quoteHeight;
    const newTop = Math.min(top, quoteTop);
    height = (top + height) - newTop;
    top = newTop;
  }

  // Convert to wrapper-relative coordinates
  const absLeft = (canvasRect.left - wrapperRect.left) + left;
  const absTop = (canvasRect.top - wrapperRect.top) + top;

  return {
    left: Math.round(absLeft),
    top: Math.round(absTop),
    width: Math.round(width),
    height: Math.round(height),
  };
};

export const drawLayer = (canvas, layer) => new Promise((resolveDraw) => {
  if (!layer || !layer.img) return resolveDraw();
  const ctx = canvas.getContext('2d');
  const { img, scale = 1, opacity = 1, fitMode = 'fit', x = 0, y = 0 } = layer;

  const doDrawing = () => {
    try {
      ctx.globalAlpha = opacity;
      const displayedCanvasWidth = canvas.offsetWidth;
      const displayedCanvasHeight = canvas.offsetHeight;
      if (displayedCanvasWidth === 0 || displayedCanvasHeight === 0) return resolveDraw();
      const imgAspectRatio = img.naturalWidth / img.naturalHeight;
      const canvasAspectRatio = displayedCanvasWidth / displayedCanvasHeight;
      let renderWidth, renderHeight;
      if (fitMode === 'fill' ? (imgAspectRatio > canvasAspectRatio) : (imgAspectRatio < canvasAspectRatio)) {
        renderHeight = displayedCanvasHeight; renderWidth = renderHeight * imgAspectRatio;
      } else {
        renderWidth = displayedCanvasWidth; renderHeight = renderWidth / imgAspectRatio;
      }
      renderWidth *= scale; renderHeight *= scale;
      const scaleToHighRes = displayedCanvasWidth > 0 ? canvas.width / displayedCanvasWidth : 0;
      const renderWidthHighRes = renderWidth * scaleToHighRes; const renderHeightHighRes = renderHeight * scaleToHighRes;
      const xHighRes = x * scaleToHighRes; const yHighRes = y * scaleToHighRes;
      ctx.drawImage(img, (canvas.width - renderWidthHighRes) / 2 + xHighRes, (canvas.height - renderHeightHighRes) / 2 + yHighRes, renderWidthHighRes, renderHeightHighRes);
      ctx.globalAlpha = 1.0;
      resolveDraw();
    } catch (e) {
      console.error("Error drawing image:", e);
      resolveDraw(); // Resolve anyway to not block the process
    }
  };

  if (img.complete && img.naturalWidth) {
    doDrawing();
  } else {
    img.onload = doDrawing;
    img.onerror = () => {
      console.error(`Failed to load image for drawing: ${img.src.slice(0, 100)}...`);
      resolveDraw(); // Resolve anyway
    };
  }
});

export const drawSlide = (canvas, slideData, layerToSkip = null) => new Promise((resolve, reject) => {
  if (!canvas) return reject(new Error('Canvas not found'));
  const ctx = canvas.getContext('2d');
  const { canvasSize, background, imageLayer, logoImage } = slideData;
  const baseResolution = 2048;
  const [aspectX, aspectY] = canvasSize.split('/').map(Number);
  const canvasWidth = aspectX > aspectY ? baseResolution : baseResolution * (aspectX / aspectY);
  const canvasHeight = aspectY > aspectX ? baseResolution : baseResolution * (aspectY / aspectX);
  canvas.width = canvasWidth; canvas.height = canvasHeight;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (background.type === 'solid') {
    ctx.fillStyle = background.value;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  } else if (background.type === 'gradient') {
    const gradientRegex = /linear-gradient\((\d+)deg, (.*?) 0%, (.*?) 100%\)/;
    const match = background.value.match(gradientRegex);
    let gradient;
    if (match) {
      const angle = parseInt(match[1], 10) * (Math.PI / 180);
      const color1 = match[2]; const color2 = match[3];
      const x0 = canvas.width / 2 * (1 - Math.cos(angle)); const y0 = canvas.height / 2 * (1 - Math.sin(angle));
      const x1 = canvas.width / 2 * (1 + Math.cos(angle)); const y1 = canvas.height / 2 * (1 + Math.sin(angle));
      gradient = ctx.createLinearGradient(x0, y0, x1, y1);
      gradient.addColorStop(0, color1); gradient.addColorStop(1, color2);
    } else {
      gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, '#8A2BE2'); gradient.addColorStop(1, '#4B0082');
    }
    ctx.fillStyle = gradient; ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  const drawImageOnCanvas = (layer, layerName) => {
    if (layerName === layerToSkip) {
      return Promise.resolve();
    }
    return drawLayer(canvas, layer);
  };

  const drawText = (text, size, yPos, font, color, isBold, isItalic, align, lineSpacing, hasShadow, hasOutline, quoteStyle, quoteSize, hasLabel, labelColor, labelTransparency) => {
    const baseFontSize = Math.min(canvasWidth, canvasHeight) * 0.1;
    const fontSize = baseFontSize * (size / 5);
    const finalLineSpacing = 0.8 + (lineSpacing / 10) * (1.4 - 0.8); // Range from 0.8 to 1.4, 1.1 is center
    const lineHeight = fontSize * finalLineSpacing;
    const fontWeight = isBold ? 'bold' : 'normal';
    const fontStyle = isItalic ? 'italic' : 'normal';
    const finalFont = `${fontStyle} ${fontWeight} ${fontSize}px "${font}", sans-serif`;
    const maxWidth = canvasWidth * 0.8;
    const yPosition = canvasHeight * (yPos / 10);
    ctx.font = finalFont; ctx.textAlign = align; ctx.textBaseline = 'middle';

    // Process highlighting at paragraph level before line wrapping
    const paragraphs = text.split('\n');
    const processedLines = [];
    let widestLine = 0;

    paragraphs.forEach(paragraph => {
      const words = paragraph.split(' ');
      let currentLine = '';

      for (let n = 0; n < words.length; n++) {
        const word = words[n];
        // If the word itself is wider than the max width, it needs to be on its own line.
        const wordWidth = ctx.measureText(word).width;
        const testLine = currentLine ? `${currentLine} ${word}` : word;
        const testWidth = ctx.measureText(testLine).width;

        if (testWidth > maxWidth && currentLine) {
          // The current line is full, process it for highlighting
          const lineParts = currentLine.split(/(==[^=]*==)/g).filter(p => p).map(part => ({
            text: part.startsWith('==') && part.endsWith('==') ? part.substring(2, part.length - 2) : part,
            isHighlight: part.startsWith('==') && part.endsWith('==')
          }));
          const lineWidth = ctx.measureText(currentLine).width;
          processedLines.push({ parts: lineParts, width: lineWidth });
          if (lineWidth > widestLine) widestLine = lineWidth;

          // Start a new line with the current word
          currentLine = word;
        } else {
          // Add the word to the current line
          currentLine = testLine;
        }
      }

      // Add the last line of the paragraph
      if (currentLine) {
        const lineParts = currentLine.split(/(==[^=]*==)/g).filter(p => p).map(part => ({
          text: part.startsWith('==') && part.endsWith('==') ? part.substring(2, part.length - 2) : part,
          isHighlight: part.startsWith('==') && part.endsWith('==')
        }));
        const lineWidth = ctx.measureText(currentLine).width;
        processedLines.push({ parts: lineParts, width: lineWidth });
        if (lineWidth > widestLine) widestLine = lineWidth;
      }
    });

    const totalTextHeight = processedLines.length * lineHeight;
    let currentY = yPosition - (totalTextHeight / 2) + (lineHeight / 2);
    if (quoteStyle !== 'none') {
      const quoteSizeVal = baseFontSize * 4 * (quoteSize / 5);
      let quoteFont = '';
      if (quoteStyle === 'serif') { quoteFont = `bold ${quoteSizeVal}px "Playfair Display", serif`; }
      else if (quoteStyle === 'slab') { quoteFont = `${quoteSizeVal}px "Alfa Slab One", cursive`; }
      else if (quoteStyle === 'fancy') { quoteFont = `${quoteSizeVal}px "Saira Stencil One", sans-serif`; }
      ctx.font = quoteFont;
      ctx.fillStyle = color;

      // Anchor the visible bottom of the glyph to a fixed gap above the text block
      const textTop = yPosition - (totalTextHeight / 2);
      const gap = (quoteStyle === 'slab' ? lineHeight * 0.35 : lineHeight * 0.4);
      const quoteBottom = textTop - gap;
      const m = ctx.measureText('“');

      const originalAlign = ctx.textAlign;
      const originalBaseline = ctx.textBaseline;

      // Set quote alignment to follow text alignment
      let quoteX;
      if (align === 'left') {
        ctx.textAlign = 'left';
        quoteX = (canvasWidth - maxWidth) / 2;
      } else if (align === 'right') {
        ctx.textAlign = 'right';
        quoteX = canvasWidth - ((canvasWidth - maxWidth) / 2);
      } else {
        ctx.textAlign = 'center';
        quoteX = canvasWidth / 2;
      }

      if (quoteStyle === 'slab') {
        // For slab, anchor bottom exactly using full glyph height from top baseline
        const height = ((m.actualBoundingBoxAscent || 0) + (m.actualBoundingBoxDescent || 0)) || quoteSizeVal;
        const quoteTop = quoteBottom - height;
        ctx.textBaseline = 'top';
        ctx.fillText('“', quoteX, quoteTop);
      } else {
        // Serif/fancy: current behavior (works well for serif); anchor by top using ascent
        const ascent = (m.actualBoundingBoxAscent || 0) || (quoteSizeVal * 0.8);
        const quoteTop = quoteBottom - ascent;
        ctx.textBaseline = 'top';
        ctx.fillText('“', quoteX, quoteTop);
      }

      ctx.textAlign = originalAlign;
      ctx.textBaseline = originalBaseline;
    }
    ctx.font = finalFont;
    if (hasLabel) {
      ctx.fillStyle = hexToRgba(labelColor, labelTransparency / 10);
      const paddingHorizontal = lineHeight * 0.6;
      const paddingTop = lineHeight * 0.5;
      const paddingBottom = lineHeight * 0.3;
      const cornerRadius = lineHeight * 0.3;

      const labelWidth = widestLine + paddingHorizontal * 2;
      const labelHeight = totalTextHeight + paddingTop + paddingBottom;
      const labelY = yPosition - (totalTextHeight / 2) - paddingTop;
      let labelX;
      if (align === 'left') {
        labelX = (canvasWidth - maxWidth) / 2 - paddingHorizontal;
      } else if (align === 'right') {
        labelX = canvasWidth - ((canvasWidth - maxWidth) / 2) - widestLine - paddingHorizontal;
      } else {
        // center
        labelX = (canvasWidth / 2) - (widestLine / 2) - paddingHorizontal;
      }

      ctx.beginPath();
      ctx.roundRect(labelX, labelY, labelWidth, labelHeight, cornerRadius);
      ctx.fill();
    }

    for (let i = 0; i < processedLines.length; i++) {
      const lineData = processedLines[i];
      const totalLineWidth = lineData.parts.reduce((sum, part) => sum + ctx.measureText(part.text).width, 0);

      // Determine initial X coordinate
      let currentX;
      if (align === 'left') {
          currentX = canvasWidth * 0.1;
      } else if (align === 'right') {
          currentX = canvasWidth * 0.9 - totalLineWidth;
      } else { // center
          currentX = Math.max(canvasWidth * 0.1, Math.min(canvasWidth * 0.9 - totalLineWidth, (canvasWidth / 2) - (totalLineWidth / 2)));
      }

      // Draw the parts sequentially
      ctx.textAlign = 'left'; // We are manually positioning, so always draw from the left.

      for (const part of lineData.parts) {
          // Set styles for this part
          ctx.fillStyle = part.isHighlight ? slideData.text1HighlightColor : color;
          if (hasShadow) {
              ctx.shadowColor = 'rgba(0,0,0,0.5)';
              ctx.shadowBlur = 5;
              ctx.shadowOffsetX = 5;
              ctx.shadowOffsetY = 5;
          }

          // Draw the text part
          ctx.fillText(part.text, currentX, currentY);

          // Draw outline for this part if needed
          if (hasOutline) {
              // Temporarily remove shadow for outline drawing, then re-apply if needed
              if (hasShadow) {
                  ctx.shadowColor = 'transparent';
              }
              ctx.strokeStyle = 'black';
              ctx.lineWidth = fontSize * 0.05;
              ctx.strokeText(part.text, currentX, currentY);
              if (hasShadow) {
                  ctx.shadowColor = 'rgba(0,0,0,0.5)';
              }
          }

          // Advance the X position for the next part
          currentX += ctx.measureText(part.text).width;
      }

      // Reset shadow for next line
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;

      currentY += lineHeight;
    }
    // Restore original text align after the loop
    ctx.textAlign = align;
  };
  const { text1, text1Size, text1YPosition, text1Font, text1Color, text1IsBold, text1IsItalic, text1Align, text1LineSpacing, text1HasShadow, text1HasOutline, text1QuoteStyle, text1QuoteSize, text2, text2Size, text2YPosition, text2Font, text2Color, text2IsBold, text2IsItalic, text2Align, text2LineSpacing, text2LabelColor, text2LabelTransparency } = slideData;

  // Chain the drawing promises - draw text after logo so text appears above logo
  drawImageOnCanvas(imageLayer, 'imageLayer')
    .then(() => drawImageOnCanvas(logoImage, 'logoImage'))
    .then(() => {
      if (text1) { drawText(text1, text1Size, text1YPosition, text1Font, text1Color, text1IsBold, text1IsItalic, text1Align, text1LineSpacing, text1HasShadow, text1HasOutline, text1QuoteStyle, text1QuoteSize, false, 'transparent', 0); }
      if (text2) { drawText(text2, text2Size, text2YPosition, text2Font, text2Color, text2IsBold, text2IsItalic, text2Align, text2LineSpacing, false, false, 'none', 5, text2LabelColor !== 'transparent', text2LabelColor, text2LabelTransparency); }
    })
    .then(() => {
      resolve(); // All drawing is complete
    })
    .catch(reject); // Catch any error from the drawing chain
});
