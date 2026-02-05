import { a as attr_class, b as bind_props, c as attr, e as ensure_array_like, d as attr_style, f as stringify, g as store_get, u as unsubscribe_stores } from "../../chunks/index2.js";
import { a1 as ssr_context, a2 as fallback, a0 as escape_html } from "../../chunks/context.js";
import { d as derived, w as writable } from "../../chunks/index.js";
import "clsx";
function html(value) {
  var html2 = String(value ?? "");
  var open = "<!---->";
  return open + html2 + "<!---->";
}
function onDestroy(fn) {
  /** @type {SSRContext} */
  ssr_context.r.on_destroy(fn);
}
function Header($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let activeTab2 = fallback($$props["activeTab"], "crop");
    let onTabChange = $$props["onTabChange"];
    $$renderer2.push(`<header class="header svelte-hv3zzy"><img src="/logos/logo-picflam-logotype.png" alt="PicFlam" class="header-logo svelte-hv3zzy"/> <nav class="header-nav svelte-hv3zzy"><button${attr_class("nav-btn svelte-hv3zzy", void 0, { "active": activeTab2 === "crop" })} aria-label="Crop tab"><img src="/icons/icon-crop.svg" alt="" class="nav-icon svelte-hv3zzy"/></button> <button${attr_class("nav-btn svelte-hv3zzy", void 0, { "active": activeTab2 === "ai" })} aria-label="AI tab"><img src="/icons/icon-ai.svg" alt="" class="nav-icon svelte-hv3zzy"/></button> <button${attr_class("nav-btn svelte-hv3zzy", void 0, { "active": activeTab2 === "design" })} aria-label="Design tab"><img src="/icons/icon-design.svg" alt="" class="nav-icon svelte-hv3zzy"/></button></nav></header>`);
    bind_props($$props, { activeTab: activeTab2, onTabChange });
  });
}
function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}
async function getImageDimensions(dataUrl) {
  const img = await loadImage(dataUrl);
  return { width: img.naturalWidth, height: img.naturalHeight };
}
async function copyImageToClipboard(dataUrl) {
  try {
    const response = await fetch(dataUrl);
    const blob = await response.blob();
    await navigator.clipboard.write([
      new ClipboardItem({ [blob.type]: blob })
    ]);
    return true;
  } catch (err) {
    console.error("Failed to copy to clipboard:", err);
    return false;
  }
}
function downloadImage(dataUrl, filename = "picflam-export.png") {
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
async function applyCrop(dataUrl, cropBox, imageWidth, imageHeight) {
  const img = await loadImage(dataUrl);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  const sx = cropBox.x / 100 * imageWidth;
  const sy = cropBox.y / 100 * imageHeight;
  const sw = cropBox.width / 100 * imageWidth;
  const sh = cropBox.height / 100 * imageHeight;
  canvas.width = sw;
  canvas.height = sh;
  ctx.drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh);
  return canvas.toDataURL("image/png");
}
async function rotateImage(dataUrl, degrees) {
  const img = await loadImage(dataUrl);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = img.naturalHeight;
  canvas.height = img.naturalWidth;
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate(degrees * Math.PI / 180);
  ctx.drawImage(img, -img.naturalWidth / 2, -img.naturalHeight / 2);
  return canvas.toDataURL("image/png");
}
async function flipImage(dataUrl, horizontal) {
  const img = await loadImage(dataUrl);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  {
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
  }
  ctx.drawImage(img, 0, 0);
  return canvas.toDataURL("image/png");
}
async function renderFinalImage(dataUrl, editFilterCss, blurMask) {
  const img = await loadImage(dataUrl);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  if (editFilterCss && editFilterCss !== "none") {
    ctx.filter = editFilterCss;
  }
  ctx.drawImage(img, 0, 0);
  ctx.filter = "none";
  if (blurMask && Array.isArray(blurMask) && blurMask.length > 0) {
    const hasInvert = blurMask.some((p) => p.invert);
    if (hasInvert) {
      const avgStrength = blurMask.reduce((sum, p) => sum + (p.strength || 50), 0) / blurMask.length;
      const blurAmount = 0.5 + avgStrength / 100 * 9.5;
      const blurCanvas = document.createElement("canvas");
      blurCanvas.width = canvas.width;
      blurCanvas.height = canvas.height;
      const blurCtx = blurCanvas.getContext("2d");
      blurCtx.filter = `blur(${blurAmount}px)`;
      if (editFilterCss && editFilterCss !== "none") {
        blurCtx.filter = `blur(${blurAmount}px) ${editFilterCss}`;
      }
      blurCtx.drawImage(img, 0, 0);
      const maskCanvas = document.createElement("canvas");
      maskCanvas.width = canvas.width;
      maskCanvas.height = canvas.height;
      const maskCtx = maskCanvas.getContext("2d");
      maskCtx.fillStyle = "white";
      maskCtx.fillRect(0, 0, maskCanvas.width, maskCanvas.height);
      for (const point of blurMask) {
        if (!point.invert) continue;
        const soften = (point.soften || 50) / 100;
        const gradient = maskCtx.createRadialGradient(point.x, point.y, 0, point.x, point.y, point.radius);
        gradient.addColorStop(0, "rgba(0,0,0,1)");
        gradient.addColorStop(0.5 + soften * 0.3, "rgba(0,0,0,0.5)");
        gradient.addColorStop(1, "rgba(0,0,0,0)");
        maskCtx.fillStyle = gradient;
        maskCtx.beginPath();
        maskCtx.arc(point.x, point.y, point.radius, 0, Math.PI * 2);
        maskCtx.fill();
      }
      const originalData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const blurredData = blurCtx.getImageData(0, 0, canvas.width, canvas.height);
      const maskData = maskCtx.getImageData(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < originalData.data.length; i += 4) {
        const maskValue = maskData.data[i] / 255;
        originalData.data[i] = originalData.data[i] * maskValue + blurredData.data[i] * (1 - maskValue);
        originalData.data[i + 1] = originalData.data[i + 1] * maskValue + blurredData.data[i + 1] * (1 - maskValue);
        originalData.data[i + 2] = originalData.data[i + 2] * maskValue + blurredData.data[i + 2] * (1 - maskValue);
      }
      ctx.putImageData(originalData, 0, 0);
    } else {
      for (const point of blurMask) {
        const strength = point.strength || 50;
        const soften = (point.soften || 50) / 100;
        const blurAmount = 0.5 + strength / 100 * 9.5;
        const blurCanvas = document.createElement("canvas");
        blurCanvas.width = canvas.width;
        blurCanvas.height = canvas.height;
        const blurCtx = blurCanvas.getContext("2d");
        blurCtx.filter = `blur(${blurAmount}px)`;
        if (editFilterCss && editFilterCss !== "none") {
          blurCtx.filter = `blur(${blurAmount}px) ${editFilterCss}`;
        }
        blurCtx.drawImage(img, 0, 0);
        const maskCanvas = document.createElement("canvas");
        maskCanvas.width = canvas.width;
        maskCanvas.height = canvas.height;
        const maskCtx = maskCanvas.getContext("2d");
        const gradient = maskCtx.createRadialGradient(point.x, point.y, 0, point.x, point.y, point.radius);
        gradient.addColorStop(0, "rgba(255,255,255,1)");
        gradient.addColorStop(0.5 + soften * 0.3, "rgba(255,255,255,0.5)");
        gradient.addColorStop(1, "rgba(255,255,255,0)");
        maskCtx.fillStyle = gradient;
        maskCtx.beginPath();
        maskCtx.arc(point.x, point.y, point.radius, 0, Math.PI * 2);
        maskCtx.fill();
        const currentData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const blurredData = blurCtx.getImageData(0, 0, canvas.width, canvas.height);
        const maskData = maskCtx.getImageData(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < currentData.data.length; i += 4) {
          const maskValue = maskData.data[i] / 255;
          currentData.data[i] = currentData.data[i] * (1 - maskValue) + blurredData.data[i] * maskValue;
          currentData.data[i + 1] = currentData.data[i + 1] * (1 - maskValue) + blurredData.data[i + 1] * maskValue;
          currentData.data[i + 2] = currentData.data[i + 2] * (1 - maskValue) + blurredData.data[i + 2] * maskValue;
        }
        ctx.putImageData(currentData, 0, 0);
      }
    }
  }
  return canvas.toDataURL("image/png");
}
function ImportArea($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let title = fallback($$props["title"], "Import an image");
    let hint = fallback($$props["hint"], "Import, drag or paste an image");
    let onImageImport = fallback($$props["onImageImport"], (dataUrl) => {
    });
    let isDragging = false;
    $$renderer2.push(`<div${attr_class("import-area svelte-f1bndr", void 0, { "dragging": isDragging })} role="button" tabindex="0"><p class="import-title svelte-f1bndr">${escape_html(title)}</p> <img src="/icons/icon-upload.svg" alt="" class="import-icon svelte-f1bndr"/> <p class="import-hint svelte-f1bndr">${escape_html(hint)}</p> <button class="btn-paste svelte-f1bndr">Paste</button> <input type="file" accept="image/*" class="sr-only"/></div>`);
    bind_props($$props, { title, hint, onImageImport });
  });
}
function ActionBar($$renderer, $$props) {
  let canUndo = fallback($$props["canUndo"], false);
  let canRedo = fallback($$props["canRedo"], false);
  let onUndo = fallback($$props["onUndo"], () => {
  });
  let onRedo = fallback($$props["onRedo"], () => {
  });
  let onStartAgain = fallback($$props["onStartAgain"], () => {
  });
  let onCopy = fallback($$props["onCopy"], () => {
  });
  let onExport = fallback($$props["onExport"], () => {
  });
  $$renderer.push(`<div class="action-bar svelte-96zw02"><div class="action-group svelte-96zw02"><button class="action-btn svelte-96zw02"${attr("disabled", !canUndo, true)} aria-label="Undo"><img src="/icons/icon-undo.svg" alt="" class="action-icon svelte-96zw02"/></button> <button class="action-btn svelte-96zw02"${attr("disabled", !canRedo, true)} aria-label="Redo"><img src="/icons/icon-redo.svg" alt="" class="action-icon svelte-96zw02"/></button></div> <div class="action-group svelte-96zw02"><button class="action-btn svelte-96zw02" aria-label="Start again"><img src="/icons/icon-startagain.svg" alt="" class="action-icon svelte-96zw02"/></button> <button class="action-btn svelte-96zw02" aria-label="Copy to clipboard"><img src="/icons/icon-copy.svg" alt="" class="action-icon svelte-96zw02"/></button> <button class="action-btn svelte-96zw02" aria-label="Export"><img src="/icons/icon-export.svg" alt="" class="action-icon svelte-96zw02"/></button></div></div>`);
  bind_props($$props, {
    canUndo,
    canRedo,
    onUndo,
    onRedo,
    onStartAgain,
    onCopy,
    onExport
  });
}
function SubMenuTabs($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let tabs = fallback($$props["tabs"], () => [], true);
    let activeTab2 = fallback($$props["activeTab"], "");
    let onTabChange = fallback($$props["onTabChange"], (tab) => {
    });
    $$renderer2.push(`<div class="sub-menu-tabs svelte-tv6tw8"><!--[-->`);
    const each_array = ensure_array_like(tabs);
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let tab = each_array[$$index];
      $$renderer2.push(`<button${attr_class("sub-menu-tab svelte-tv6tw8", void 0, { "active": activeTab2 === tab.id })}>${escape_html(tab.label)}</button>`);
    }
    $$renderer2.push(`<!--]--></div>`);
    bind_props($$props, { tabs, activeTab: activeTab2, onTabChange });
  });
}
function ConfirmModal($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let message = fallback($$props["message"], "");
    let confirmText = fallback($$props["confirmText"], "Yes");
    let cancelText = fallback($$props["cancelText"], "Cancel");
    let onConfirm = fallback($$props["onConfirm"], () => {
    });
    let onCancel = fallback($$props["onCancel"], () => {
    });
    $$renderer2.push(`<div class="modal-overlay svelte-qik81a" role="dialog" aria-modal="true" tabindex="-1"><div class="modal svelte-qik81a" role="document"><p class="modal-message svelte-qik81a">${escape_html(message)}</p> <div class="modal-actions svelte-qik81a"><button class="btn-text svelte-qik81a">${escape_html(cancelText)}</button> <button class="btn-text btn-confirm svelte-qik81a">${escape_html(confirmText)}</button></div></div></div>`);
    bind_props($$props, { message, confirmText, cancelText, onConfirm, onCancel });
  });
}
function CropCanvas($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let displayWidth, displayHeight, brushDisplaySize, cropPixels;
    let imageSrc = fallback($$props["imageSrc"], "");
    let cropBox = fallback($$props["cropBox"], () => ({ x: 10, y: 10, width: 80, height: 80 }), true);
    let isCropping = fallback($$props["isCropping"], false);
    let scale = fallback($$props["scale"], 1);
    let offsetX = fallback($$props["offsetX"], 0);
    let offsetY = fallback($$props["offsetY"], 0);
    let imageWidth = fallback($$props["imageWidth"], 0);
    let imageHeight = fallback($$props["imageHeight"], 0);
    let editFilters = fallback($$props["editFilters"], "");
    let blurEnabled = fallback($$props["blurEnabled"], false);
    let blurBrushSize = fallback($$props["blurBrushSize"], 50);
    let blurStrength = fallback($$props["blurStrength"], 50);
    let blurSoften = fallback($$props["blurSoften"], 50);
    let blurInvert = fallback($$props["blurInvert"], false);
    let blurMask = fallback($$props["blurMask"], () => [], true);
    let showBrushPreview = fallback($$props["showBrushPreview"], false);
    let blurCanvasEl;
    let containerRect = { width: 0 };
    displayWidth = containerRect.width;
    displayHeight = imageHeight && imageWidth ? displayWidth * imageHeight / imageWidth : 0;
    brushDisplaySize = blurBrushSize / 100 * Math.min(displayWidth, displayHeight) * 0.3;
    if (blurMask && Array.isArray(blurMask) && blurMask.length > 0 && blurCanvasEl) ;
    cropPixels = {
      x: cropBox.x / 100 * displayWidth,
      y: cropBox.y / 100 * displayHeight,
      width: cropBox.width / 100 * displayWidth,
      height: cropBox.height / 100 * displayHeight
    };
    $$renderer2.push(`<div class="crop-canvas svelte-pjowa5" role="application" aria-label="Image crop canvas"><div class="image-wrapper svelte-pjowa5"${attr_style(`transform: scale(${stringify(scale)}) translate(${stringify(offsetX)}px, ${stringify(offsetY)}px);`)}><img${attr("src", imageSrc)} alt="Crop preview" class="canvas-image svelte-pjowa5"${attr_style(`filter: ${stringify(editFilters)};`)} draggable="false"/> `);
    if (blurEnabled && displayWidth > 0 && displayHeight > 0) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<canvas class="blur-canvas svelte-pjowa5"${attr("width", displayWidth)}${attr("height", displayHeight)}${attr_style(`filter: ${stringify(editFilters)};`)}></canvas>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></div> `);
    {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> `);
    if (showBrushPreview && displayWidth > 0 && displayHeight > 0) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="blur-brush-preview svelte-pjowa5"${attr_style(` left: ${stringify(displayWidth / 2)}px; top: ${stringify(displayHeight / 2)}px; width: ${stringify(brushDisplaySize)}px; height: ${stringify(brushDisplaySize)}px; `)}></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> `);
    if (isCropping && displayHeight > 0) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="crop-overlay svelte-pjowa5"><div class="overlay-top svelte-pjowa5"${attr_style(`height: ${stringify(cropPixels.y)}px;`)}></div> <div class="overlay-bottom svelte-pjowa5"${attr_style(`top: ${stringify(cropPixels.y + cropPixels.height)}px; height: ${stringify(displayHeight - cropPixels.y - cropPixels.height)}px;`)}></div> <div class="overlay-left svelte-pjowa5"${attr_style(`top: ${stringify(cropPixels.y)}px; height: ${stringify(cropPixels.height)}px; width: ${stringify(cropPixels.x)}px;`)}></div> <div class="overlay-right svelte-pjowa5"${attr_style(`top: ${stringify(cropPixels.y)}px; height: ${stringify(cropPixels.height)}px; left: ${stringify(cropPixels.x + cropPixels.width)}px; width: ${stringify(displayWidth - cropPixels.x - cropPixels.width)}px;`)}></div> <div class="crop-box svelte-pjowa5"${attr_style(`left: ${stringify(cropPixels.x)}px; top: ${stringify(cropPixels.y)}px; width: ${stringify(cropPixels.width)}px; height: ${stringify(cropPixels.height)}px;`)} role="button" aria-label="Drag to move crop area" tabindex="0"><div class="crop-border svelte-pjowa5"></div> <div class="corner-handle top-left svelte-pjowa5" role="button" aria-label="Resize top-left corner" tabindex="0"></div> <div class="corner-handle top-right svelte-pjowa5" role="button" aria-label="Resize top-right corner" tabindex="0"></div> <div class="corner-handle bottom-left svelte-pjowa5" role="button" aria-label="Resize bottom-left corner" tabindex="0"></div> <div class="corner-handle bottom-right svelte-pjowa5" role="button" aria-label="Resize bottom-right corner" tabindex="0"></div></div></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></div>`);
    bind_props($$props, {
      imageSrc,
      cropBox,
      isCropping,
      scale,
      offsetX,
      offsetY,
      imageWidth,
      imageHeight,
      editFilters,
      blurEnabled,
      blurBrushSize,
      blurStrength,
      blurSoften,
      blurInvert,
      blurMask,
      showBrushPreview
    });
  });
}
function ToggleButtonGroup($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let options = fallback($$props["options"], () => [], true);
    let value = fallback($$props["value"], "");
    let onChange = fallback($$props["onChange"], (val) => {
    });
    let showLabels = fallback($$props["showLabels"], true);
    let centered = fallback($$props["centered"], false);
    $$renderer2.push(`<div${attr_class("toggle-group svelte-1gdqxne", void 0, { "centered": centered })}><!--[-->`);
    const each_array = ensure_array_like(options);
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let option = each_array[$$index];
      $$renderer2.push(`<div${attr_class("toggle-item svelte-1gdqxne", void 0, { "active": value === option.id })}><button${attr_class("toggle-btn svelte-1gdqxne", void 0, { "active": value === option.id })}${attr("aria-label", option.label)}>`);
      if (option.icon) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<img${attr("src", `/icons/${stringify(option.icon)}.svg`)} alt="" class="toggle-icon svelte-1gdqxne"/>`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--></button> `);
      if (showLabels && option.label) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<span class="toggle-label svelte-1gdqxne">${escape_html(option.label)}</span>`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--></div>`);
    }
    $$renderer2.push(`<!--]--></div>`);
    bind_props($$props, { options, value, onChange, showLabels, centered });
  });
}
function InputField($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let label = fallback($$props["label"], "");
    let value = fallback($$props["value"], "");
    let type = fallback($$props["type"], "text");
    let placeholder = fallback($$props["placeholder"], "");
    let disabled = fallback($$props["disabled"], false);
    let onChange = fallback($$props["onChange"], (val) => {
    });
    $$renderer2.push(`<div class="input-field svelte-1r47u3b">`);
    if (label) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<label class="input-label svelte-1r47u3b">${escape_html(label)} <input class="input svelte-1r47u3b"${attr("type", type)}${attr("value", value)}${attr("placeholder", placeholder)}${attr("disabled", disabled, true)}/></label>`);
    } else {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push(`<input class="input svelte-1r47u3b"${attr("type", type)}${attr("value", value)}${attr("placeholder", placeholder)}${attr("disabled", disabled, true)}/>`);
    }
    $$renderer2.push(`<!--]--></div>`);
    bind_props($$props, { label, value, type, placeholder, disabled, onChange });
  });
}
function Slider($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let label = fallback($$props["label"], "");
    let min = fallback($$props["min"], 0);
    let max = fallback($$props["max"], 100);
    let value = fallback($$props["value"], 50);
    let step = fallback($$props["step"], 1);
    let showValue = fallback($$props["showValue"], false);
    let onChange = fallback($$props["onChange"], (val) => {
    });
    let onInteractionStart = fallback($$props["onInteractionStart"], () => {
    });
    let onInteractionEnd = fallback($$props["onInteractionEnd"], () => {
    });
    $$renderer2.push(`<div class="slider-container svelte-jchife">`);
    if (label) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="slider-header svelte-jchife"><span class="slider-label svelte-jchife">${escape_html(label)}</span> `);
      if (showValue) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<span class="slider-value svelte-jchife">${escape_html(value)}</span>`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> <input type="range" class="slider svelte-jchife"${attr("min", min)}${attr("max", max)}${attr("step", step)}${attr("value", value)}/></div>`);
    bind_props($$props, {
      label,
      min,
      max,
      value,
      step,
      showValue,
      onChange,
      onInteractionStart,
      onInteractionEnd
    });
  });
}
function CropControls($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let aspectRatio = fallback($$props["aspectRatio"], "9:16");
    let cropWidth = fallback($$props["cropWidth"], 1080);
    let cropHeight = fallback($$props["cropHeight"], 1920);
    let ratioLocked = fallback($$props["ratioLocked"], true);
    let scale = fallback($$props["scale"], 100);
    let cropPending = fallback($$props["cropPending"], false);
    let onRatioChange = fallback($$props["onRatioChange"], (ratio) => {
    });
    let onDimensionsChange = fallback($$props["onDimensionsChange"], ({ width, height }) => {
    });
    let onLockToggle = fallback($$props["onLockToggle"], () => {
    });
    let onFlip = fallback($$props["onFlip"], () => {
    });
    let onRotate = fallback($$props["onRotate"], () => {
    });
    let onScaleChange = fallback($$props["onScaleChange"], (scale2) => {
    });
    let onApply = fallback($$props["onApply"], () => {
    });
    const ratioOptions = [
      { id: "9:16", label: "9:16", icon: "icon-vertical" },
      { id: "1:1", label: "1:1", icon: "icon-square" },
      { id: "16:9", label: "16:9", icon: "icon-horizontal" },
      { id: "custom", label: "Custom", icon: "icon-custom" }
    ];
    function handleWidthChange(val) {
      const newWidth = parseInt(val) || 0;
      onDimensionsChange({ width: newWidth, height: cropHeight });
    }
    function handleHeightChange(val) {
      const newHeight = parseInt(val) || 0;
      onDimensionsChange({ width: cropWidth, height: newHeight });
    }
    $$renderer2.push(`<div class="crop-controls svelte-17iy3mz">`);
    ToggleButtonGroup($$renderer2, {
      options: ratioOptions,
      value: aspectRatio,
      onChange: onRatioChange,
      showLabels: true
    });
    $$renderer2.push(`<!----> <div class="dimensions-row svelte-17iy3mz"><div class="dimension-input svelte-17iy3mz">`);
    InputField($$renderer2, {
      label: "Width",
      type: "number",
      value: cropWidth.toString(),
      onChange: handleWidthChange
    });
    $$renderer2.push(`<!----></div> <button class="icon-btn svelte-17iy3mz"${attr("aria-label", ratioLocked ? "Unlock aspect ratio" : "Lock aspect ratio")}><img${attr("src", `/icons/${stringify(ratioLocked ? "icon-lock" : "icon-unlock")}.svg`)} alt="" class="icon-btn-img svelte-17iy3mz"/></button> <div class="dimension-input svelte-17iy3mz">`);
    InputField($$renderer2, {
      label: "Height",
      type: "number",
      value: cropHeight.toString(),
      onChange: handleHeightChange
    });
    $$renderer2.push(`<!----></div> <button class="icon-btn svelte-17iy3mz" aria-label="Flip horizontal"><img src="/icons/icon-flip-horizontal.svg" alt="" class="icon-btn-img svelte-17iy3mz"/></button> <button class="icon-btn svelte-17iy3mz" aria-label="Rotate"><img src="/icons/icon-rotate.svg" alt="" class="icon-btn-img svelte-17iy3mz"/></button></div> `);
    Slider($$renderer2, {
      label: "Scale",
      min: 50,
      max: 200,
      value: scale,
      step: 1,
      showValue: true,
      onChange: onScaleChange
    });
    $$renderer2.push(`<!----> `);
    if (cropPending) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="apply-row svelte-17iy3mz"><button class="btn-apply svelte-17iy3mz">Apply</button></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></div>`);
    bind_props($$props, {
      aspectRatio,
      cropWidth,
      cropHeight,
      ratioLocked,
      scale,
      cropPending,
      onRatioChange,
      onDimensionsChange,
      onLockToggle,
      onFlip,
      onRotate,
      onScaleChange,
      onApply
    });
  });
}
function EditControls($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let currentValue, sliderMin, sliderMax, currentBlurValue, blurSliderMin, blurSliderMax;
    let brightness = fallback($$props["brightness"], 0);
    let shadows = fallback($$props["shadows"], 0);
    let contrast = fallback($$props["contrast"], 0);
    let hdr = fallback($$props["hdr"], 0);
    let blurBrushSize = fallback($$props["blurBrushSize"], 50);
    let blurStrength = fallback($$props["blurStrength"], 50);
    let blurSoften = fallback($$props["blurSoften"], 50);
    let blurInvert = fallback($$props["blurInvert"], false);
    let zoomLevel = fallback($$props["zoomLevel"], 1);
    let blurEnabled = fallback($$props["blurEnabled"], false);
    let onBrightnessChange = fallback($$props["onBrightnessChange"], (val) => {
    });
    let onShadowsChange = fallback($$props["onShadowsChange"], (val) => {
    });
    let onContrastChange = fallback($$props["onContrastChange"], (val) => {
    });
    let onHdrChange = fallback($$props["onHdrChange"], (val) => {
    });
    let onBlurBrushSizeChange = fallback($$props["onBlurBrushSizeChange"], (size) => {
    });
    let onBlurStrengthChange = fallback($$props["onBlurStrengthChange"], (val) => {
    });
    let onBlurSoftenChange = fallback($$props["onBlurSoftenChange"], (val) => {
    });
    let onBlurInvertChange = fallback($$props["onBlurInvertChange"], (val) => {
    });
    let onZoomChange = fallback($$props["onZoomChange"], (level) => {
    });
    let onNudge = fallback($$props["onNudge"], (direction) => {
    });
    let onResetZoom = fallback($$props["onResetZoom"], () => {
    });
    let onBlurToggle = fallback($$props["onBlurToggle"], (enabled) => {
    });
    let onBrushPreviewChange = fallback($$props["onBrushPreviewChange"], (visible) => {
    });
    let onEditEnd = fallback($$props["onEditEnd"], () => {
    });
    let activeEnhancement = "brightness";
    let blurExpanded = blurEnabled;
    let activeBlurControl = "brushSize";
    const enhancements = [
      { id: "brightness", label: "Brightness" },
      { id: "shadows", label: "Shadows" },
      { id: "contrast", label: "Contrast" },
      { id: "hdr", label: "HDR" }
    ];
    const blurControls = [
      { id: "brushSize", label: "Brush size" },
      { id: "strength", label: "Strength" },
      { id: "soften", label: "Soften edges" }
    ];
    function handleEnhancementChange(val) {
      switch (activeEnhancement) {
        case "brightness":
          onBrightnessChange(val);
          break;
        case "shadows":
          onShadowsChange(val);
          break;
        case "contrast":
          onContrastChange(val);
          break;
        case "hdr":
          onHdrChange(val);
          break;
      }
    }
    function handleBlurControlChange(val) {
      switch (activeBlurControl) {
        case "brushSize":
          onBlurBrushSizeChange(val);
          break;
        case "strength":
          onBlurStrengthChange(val);
          break;
        case "soften":
          onBlurSoftenChange(val);
          break;
      }
    }
    function handleEnhancementSliderEnd() {
      onEditEnd();
    }
    function handleBrushSliderStart() {
      {
        onBrushPreviewChange(true);
      }
    }
    function handleBrushSliderEnd() {
      onBrushPreviewChange(false);
      onEditEnd();
    }
    currentValue = (() => {
      switch (activeEnhancement) {
        case "brightness":
          return brightness;
        case "shadows":
          return shadows;
        case "contrast":
          return contrast;
        case "hdr":
          return hdr;
        default:
          return 0;
      }
    })();
    sliderMin = -100;
    sliderMax = 100;
    currentBlurValue = (() => {
      switch (activeBlurControl) {
        case "brushSize":
          return blurBrushSize;
        case "strength":
          return blurStrength;
        case "soften":
          return blurSoften;
        default:
          return 50;
      }
    })();
    blurSliderMin = 1;
    blurSliderMax = 100;
    $$renderer2.push(`<div class="edit-controls svelte-1e1k0ax"><div class="enhancement-row svelte-1e1k0ax"><!--[-->`);
    const each_array = ensure_array_like(enhancements);
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let item = each_array[$$index];
      $$renderer2.push(`<button${attr_class("enhancement-btn svelte-1e1k0ax", void 0, { "active": activeEnhancement === item.id })}>${escape_html(item.label)}</button>`);
    }
    $$renderer2.push(`<!--]--></div> <div class="slider-row svelte-1e1k0ax"><div class="slider-track svelte-1e1k0ax">`);
    Slider($$renderer2, {
      min: sliderMin,
      max: sliderMax,
      value: currentValue,
      step: 1,
      onChange: handleEnhancementChange,
      onInteractionEnd: handleEnhancementSliderEnd
    });
    $$renderer2.push(`<!----></div> <button class="reset-btn svelte-1e1k0ax" aria-label="Reset"><img src="/icons/icon-reset.svg" alt="" class="reset-icon svelte-1e1k0ax"/></button></div> <div class="blur-section svelte-1e1k0ax"><div class="blur-header svelte-1e1k0ax"><button class="chevron-btn svelte-1e1k0ax"${attr("disabled", !blurEnabled, true)}${attr("aria-label", blurExpanded ? "Collapse" : "Expand")}><img${attr("src", `/icons/${stringify(blurExpanded ? "icon-collapse" : "icon-expand")}.svg`)} alt=""${attr_class("chevron-icon svelte-1e1k0ax", void 0, { "disabled": !blurEnabled })}/></button> <span class="blur-label svelte-1e1k0ax">Blur</span> <button${attr_class("toggle-switch svelte-1e1k0ax", void 0, { "active": blurEnabled })}${attr("aria-label", blurEnabled ? "Disable blur" : "Enable blur")}><span class="toggle-thumb svelte-1e1k0ax"></span></button></div> `);
    if (blurExpanded && blurEnabled) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="blur-controls svelte-1e1k0ax"><div class="blur-control-row svelte-1e1k0ax"><!--[-->`);
      const each_array_1 = ensure_array_like(blurControls);
      for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
        let item = each_array_1[$$index_1];
        $$renderer2.push(`<button${attr_class("blur-control-btn svelte-1e1k0ax", void 0, { "active": activeBlurControl === item.id })}>${escape_html(item.label)}</button>`);
      }
      $$renderer2.push(`<!--]--> <label class="invert-checkbox svelte-1e1k0ax"><input type="checkbox"${attr("checked", blurInvert, true)} class="svelte-1e1k0ax"/> <span class="checkbox-label svelte-1e1k0ax">Invert</span></label></div> <div class="slider-row svelte-1e1k0ax"><div class="slider-track svelte-1e1k0ax">`);
      Slider($$renderer2, {
        min: blurSliderMin,
        max: blurSliderMax,
        value: currentBlurValue,
        step: 1,
        onChange: handleBlurControlChange,
        onInteractionStart: handleBrushSliderStart,
        onInteractionEnd: handleBrushSliderEnd
      });
      $$renderer2.push(`<!----></div> <button class="reset-btn svelte-1e1k0ax" aria-label="Reset"><img src="/icons/icon-reset.svg" alt="" class="reset-icon svelte-1e1k0ax"/></button></div> <div class="zoom-row svelte-1e1k0ax"><span class="zoom-label svelte-1e1k0ax">Zoom in</span> <div class="zoom-slider-row svelte-1e1k0ax"><div class="slider-track svelte-1e1k0ax">`);
      Slider($$renderer2, {
        min: 1,
        max: 3,
        step: 0.1,
        value: zoomLevel,
        onChange: onZoomChange
      });
      $$renderer2.push(`<!----></div> <button class="reset-btn svelte-1e1k0ax" aria-label="Reset zoom"><img src="/icons/icon-reset.svg" alt="" class="reset-icon svelte-1e1k0ax"/></button></div></div> <div class="nudge-row svelte-1e1k0ax"><button class="nudge-btn svelte-1e1k0ax" aria-label="Nudge up"><img src="/icons/icon-nudge-up.svg" alt="" class="svelte-1e1k0ax"/></button> <button class="nudge-btn svelte-1e1k0ax" aria-label="Nudge down"><img src="/icons/icon-nudge-down.svg" alt="" class="svelte-1e1k0ax"/></button> <button class="nudge-btn svelte-1e1k0ax" aria-label="Nudge left"><img src="/icons/icon-nudge-left.svg" alt="" class="svelte-1e1k0ax"/></button> <button class="nudge-btn svelte-1e1k0ax" aria-label="Nudge right"><img src="/icons/icon-nudge-right.svg" alt="" class="svelte-1e1k0ax"/></button></div></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></div></div>`);
    bind_props($$props, {
      brightness,
      shadows,
      contrast,
      hdr,
      blurBrushSize,
      blurStrength,
      blurSoften,
      blurInvert,
      zoomLevel,
      blurEnabled,
      onBrightnessChange,
      onShadowsChange,
      onContrastChange,
      onHdrChange,
      onBlurBrushSizeChange,
      onBlurStrengthChange,
      onBlurSoftenChange,
      onBlurInvertChange,
      onZoomChange,
      onNudge,
      onResetZoom,
      onBlurToggle,
      onBrushPreviewChange,
      onEditEnd
    });
  });
}
function FilterGrid($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let filters = fallback($$props["filters"], () => [], true);
    let value = fallback($$props["value"], "original");
    let imageUrl = fallback($$props["imageUrl"], "");
    let onChange = fallback($$props["onChange"], (filter) => {
    });
    $$renderer2.push(`<div class="filter-grid svelte-183y0dt"><!--[-->`);
    const each_array = ensure_array_like(filters);
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let filter = each_array[$$index];
      $$renderer2.push(`<button${attr_class("filter-card svelte-183y0dt", void 0, { "active": value === filter.id })}><div class="filter-preview svelte-183y0dt"${attr_style(` background-image: url(${stringify(imageUrl)}); filter: ${stringify(filter.css || "none")}; `)}></div> <span${attr_class("filter-label svelte-183y0dt", void 0, { "active": value === filter.id })}>${escape_html(filter.label)}</span></button>`);
    }
    $$renderer2.push(`<!--]--></div>`);
    bind_props($$props, { filters, value, imageUrl, onChange });
  });
}
function FilterControls($$renderer, $$props) {
  let isOriginal;
  let imageUrl = fallback($$props["imageUrl"], "");
  let activeFilter = fallback($$props["activeFilter"], "original");
  let filterStrength = fallback($$props["filterStrength"], 50);
  let onFilterChange = fallback($$props["onFilterChange"], (filterId) => {
  });
  let onStrengthChange = fallback($$props["onStrengthChange"], (value) => {
  });
  let onReset = fallback($$props["onReset"], () => {
  });
  const filters = [
    { id: "original", label: "Original", css: "none" },
    { id: "greyscale", label: "Greyscale", css: "grayscale(100%)" },
    { id: "sepia", label: "Sepia", css: "sepia(100%)" },
    {
      id: "sunset",
      label: "Sunset",
      css: "sepia(30%) saturate(140%) brightness(110%) hue-rotate(-10deg)"
    },
    {
      id: "azure",
      label: "Azure",
      css: "saturate(120%) brightness(105%) hue-rotate(180deg)"
    },
    {
      id: "teal",
      label: "Teal",
      css: "saturate(130%) hue-rotate(140deg)"
    }
  ];
  isOriginal = activeFilter === "original";
  $$renderer.push(`<div class="filter-controls svelte-1274k9v">`);
  FilterGrid($$renderer, {
    filters,
    value: activeFilter,
    imageUrl,
    onChange: onFilterChange
  });
  $$renderer.push(`<!----> <div${attr_class("slider-row svelte-1274k9v", void 0, { "disabled": isOriginal })}><div class="slider-track svelte-1274k9v">`);
  Slider($$renderer, {
    label: "Strength",
    min: 0,
    max: 100,
    value: filterStrength,
    onChange: isOriginal ? () => {
    } : onStrengthChange
  });
  $$renderer.push(`<!----></div> <button class="reset-btn svelte-1274k9v" aria-label="Reset filter"><img src="/icons/icon-reset.svg" alt="" class="reset-icon svelte-1274k9v"/></button></div></div>`);
  bind_props($$props, {
    imageUrl,
    activeFilter,
    filterStrength,
    onFilterChange,
    onStrengthChange,
    onReset
  });
}
const FILTER_DEFINITIONS = [
  { id: "original", label: "Original", css: "none" },
  { id: "greyscale", label: "Greyscale", css: "grayscale(100%)" },
  { id: "sepia", label: "Sepia", css: "sepia(100%)" },
  { id: "sunset", label: "Sunset", css: "sepia(30%) saturate(140%) brightness(110%) hue-rotate(-10deg)" },
  { id: "azure", label: "Azure", css: "saturate(120%) brightness(105%) hue-rotate(180deg)" },
  { id: "teal", label: "Teal", css: "saturate(130%) hue-rotate(140deg)" }
];
function createHistoryStore$1(initialState) {
  const history = [initialState];
  let currentIndex = 0;
  let baseIndex = 0;
  const undoState = writable({ canUndo: false, canRedo: false });
  const { subscribe, set, update } = writable(initialState);
  function updateUndoState() {
    undoState.set({
      canUndo: currentIndex > baseIndex,
      canRedo: currentIndex < history.length - 1
    });
  }
  return {
    subscribe,
    undoState,
    set: (value) => {
      history.splice(currentIndex + 1);
      history.push(value);
      currentIndex = history.length - 1;
      set(value);
      updateUndoState();
    },
    update: (fn) => {
      update((currentValue) => {
        const newValue = fn(currentValue);
        history.splice(currentIndex + 1);
        history.push(newValue);
        currentIndex = history.length - 1;
        updateUndoState();
        return newValue;
      });
    },
    silentUpdate: (fn) => {
      update(fn);
    },
    setBaseState: () => {
      baseIndex = currentIndex;
      updateUndoState();
    },
    undo: () => {
      if (currentIndex > baseIndex) {
        currentIndex--;
        set(history[currentIndex]);
        updateUndoState();
      }
    },
    redo: () => {
      if (currentIndex < history.length - 1) {
        currentIndex++;
        set(history[currentIndex]);
        updateUndoState();
      }
    },
    canUndo: () => currentIndex > baseIndex,
    canRedo: () => currentIndex < history.length - 1,
    reset: () => {
      history.length = 0;
      history.push(initialState);
      currentIndex = 0;
      baseIndex = 0;
      set(initialState);
      updateUndoState();
    }
  };
}
const initialCropState = {
  originalImage: null,
  currentImage: null,
  aspectRatio: "custom",
  width: 0,
  height: 0,
  ratioLocked: false,
  scale: 1,
  offsetX: 0,
  offsetY: 0,
  brightness: 0,
  contrast: 0,
  shadows: 0,
  hdr: 0,
  activeFilter: "original",
  filterStrength: 50,
  cropBox: { x: 0, y: 0, width: 0, height: 0 },
  isCropping: false,
  cropPending: false,
  imageWidth: 0,
  imageHeight: 0,
  blurEnabled: false,
  blurBrushSize: 50,
  blurStrength: 50,
  blurSoften: 50,
  blurInvert: false,
  blurMask: null,
  showBrushPreview: false,
  zoomLevel: 1,
  zoomOffsetX: 0,
  zoomOffsetY: 0
};
const cropState = createHistoryStore$1(initialCropState);
const activeSubMenu = writable("none");
const hasImage = derived(cropState, ($state) => $state.currentImage !== null);
function resetCropState() {
  cropState.reset();
  activeSubMenu.set("none");
}
function CropTab($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let cropWidth, cropHeight, editFilterCss;
    const undoState = cropState.undoState;
    const subMenuTabs = [
      { id: "crop", label: "Crop" },
      { id: "edit", label: "Edit" },
      { id: "filter", label: "Filter" }
    ];
    let modalType = null;
    let pendingAction = null;
    async function handleImageImport(dataUrl) {
      const dims = await getImageDimensions(dataUrl);
      cropState.set({
        ...store_get($$store_subs ??= {}, "$cropState", cropState),
        originalImage: dataUrl,
        currentImage: dataUrl,
        imageWidth: dims.width,
        imageHeight: dims.height,
        width: dims.width,
        height: dims.height,
        cropBox: { x: 0, y: 0, width: 100, height: 100 },
        isCropping: true,
        cropPending: false,
        aspectRatio: "custom",
        ratioLocked: false
      });
      cropState.setBaseState();
      activeSubMenu.set("crop");
    }
    function handleSubMenuChange(tab) {
      if (store_get($$store_subs ??= {}, "$cropState", cropState).cropPending && store_get($$store_subs ??= {}, "$activeSubMenu", activeSubMenu) === "crop" && tab !== "crop") {
        pendingAction = () => {
          activeSubMenu.set(tab);
          cropState.silentUpdate((state) => ({ ...state, isCropping: false }));
        };
        modalType = "save";
        return;
      }
      if (tab === "crop") {
        cropState.silentUpdate((state) => ({ ...state, isCropping: true }));
      } else {
        cropState.silentUpdate((state) => ({ ...state, isCropping: false }));
      }
      activeSubMenu.set(store_get($$store_subs ??= {}, "$activeSubMenu", activeSubMenu) === tab ? "none" : tab);
    }
    async function getFinalImage() {
      const finalImage = await renderFinalImage(store_get($$store_subs ??= {}, "$cropState", cropState).currentImage, editFilterCss, store_get($$store_subs ??= {}, "$cropState", cropState).blurMask);
      return finalImage;
    }
    async function handleCopy() {
      if (store_get($$store_subs ??= {}, "$cropState", cropState).cropPending) {
        pendingAction = async () => {
          const finalImage = await getFinalImage();
          await copyImageToClipboard(finalImage);
        };
        modalType = "save";
        return;
      }
      if (store_get($$store_subs ??= {}, "$cropState", cropState).currentImage) {
        const finalImage = await getFinalImage();
        await copyImageToClipboard(finalImage);
      }
    }
    async function handleExport() {
      if (store_get($$store_subs ??= {}, "$cropState", cropState).cropPending) {
        pendingAction = async () => {
          const finalImage = await getFinalImage();
          downloadImage(finalImage, "picflam-export.png");
        };
        modalType = "save";
        return;
      }
      if (store_get($$store_subs ??= {}, "$cropState", cropState).currentImage) {
        const finalImage = await getFinalImage();
        downloadImage(finalImage, "picflam-export.png");
      }
    }
    function handleStartAgain() {
      modalType = "startAgain";
    }
    function handleUndo() {
      cropState.undo();
    }
    function handleRedo() {
      cropState.redo();
    }
    async function handleSaveConfirm() {
      modalType = null;
      await applyPendingCrop();
      if (pendingAction) {
        await pendingAction();
        pendingAction = null;
      }
    }
    function handleSaveCancel() {
      modalType = null;
      pendingAction = null;
    }
    function handleStartAgainConfirm() {
      modalType = null;
      resetCropState();
    }
    function handleStartAgainCancel() {
      modalType = null;
    }
    async function applyPendingCrop() {
      const state = store_get($$store_subs ??= {}, "$cropState", cropState);
      if (!state.currentImage || !state.cropPending) return;
      const croppedImage = await applyCrop(state.currentImage, state.cropBox, state.imageWidth, state.imageHeight);
      const dims = await getImageDimensions(croppedImage);
      cropState.set({
        ...state,
        currentImage: croppedImage,
        imageWidth: dims.width,
        imageHeight: dims.height,
        width: dims.width,
        height: dims.height,
        cropBox: { x: 0, y: 0, width: 100, height: 100 },
        cropPending: false
      });
    }
    function handleRatioChange(ratio) {
      if (ratio === "custom") {
        cropState.silentUpdate((state) => ({
          ...state,
          aspectRatio: "custom",
          cropBox: { x: 0, y: 0, width: 100, height: 100 },
          ratioLocked: false,
          cropPending: false
        }));
        return;
      }
      const aspectRatios = { "9:16": 9 / 16, "1:1": 1, "16:9": 16 / 9 };
      const targetRatio = aspectRatios[ratio];
      const imageRatio = store_get($$store_subs ??= {}, "$cropState", cropState).imageWidth / store_get($$store_subs ??= {}, "$cropState", cropState).imageHeight;
      let newCropBox;
      if (ratio === "9:16") {
        const cropHeight2 = 100;
        const cropWidth2 = targetRatio / imageRatio * 100;
        if (cropWidth2 <= 100) {
          newCropBox = {
            x: (100 - cropWidth2) / 2,
            y: 0,
            width: cropWidth2,
            height: cropHeight2
          };
        } else {
          const adjustedHeight = imageRatio / targetRatio * 100;
          newCropBox = {
            x: 0,
            y: (100 - adjustedHeight) / 2,
            width: 100,
            height: adjustedHeight
          };
        }
      } else if (ratio === "16:9") {
        const cropWidth2 = 100;
        const cropHeight2 = imageRatio / targetRatio * 100;
        if (cropHeight2 <= 100) {
          newCropBox = {
            x: 0,
            y: (100 - cropHeight2) / 2,
            width: cropWidth2,
            height: cropHeight2
          };
        } else {
          const adjustedWidth = targetRatio / imageRatio * 100;
          newCropBox = {
            x: (100 - adjustedWidth) / 2,
            y: 0,
            width: adjustedWidth,
            height: 100
          };
        }
      } else if (ratio === "1:1") {
        if (imageRatio > 1) {
          const cropWidth2 = 100 / imageRatio;
          newCropBox = {
            x: (100 - cropWidth2) / 2,
            y: 0,
            width: cropWidth2,
            height: 100
          };
        } else {
          const cropHeight2 = 100 * imageRatio;
          newCropBox = {
            x: 0,
            y: (100 - cropHeight2) / 2,
            width: 100,
            height: cropHeight2
          };
        }
      }
      cropState.silentUpdate((state) => ({
        ...state,
        aspectRatio: ratio,
        cropBox: newCropBox,
        cropPending: true,
        isCropping: true,
        ratioLocked: true
      }));
    }
    function handleDimensionsChange({ width: newWidth, height: newHeight }) {
      const maxWidth = store_get($$store_subs ??= {}, "$cropState", cropState).imageWidth;
      const maxHeight = store_get($$store_subs ??= {}, "$cropState", cropState).imageHeight;
      const clampedWidth = Math.min(Math.max(1, newWidth), maxWidth);
      const clampedHeight = Math.min(Math.max(1, newHeight), maxHeight);
      const widthPercent = clampedWidth / maxWidth * 100;
      const heightPercent = clampedHeight / maxHeight * 100;
      let newCropBox;
      if (store_get($$store_subs ??= {}, "$cropState", cropState).ratioLocked) {
        const currentRatio = cropWidth / cropHeight;
        if (newWidth !== cropWidth) {
          const adjustedHeight = clampedWidth / currentRatio;
          const adjustedHeightPercent = adjustedHeight / maxHeight * 100;
          newCropBox = {
            x: (100 - widthPercent) / 2,
            y: (100 - Math.min(100, adjustedHeightPercent)) / 2,
            width: widthPercent,
            height: Math.min(100, adjustedHeightPercent)
          };
        } else {
          const adjustedWidth = clampedHeight * currentRatio;
          const adjustedWidthPercent = adjustedWidth / maxWidth * 100;
          newCropBox = {
            x: (100 - Math.min(100, adjustedWidthPercent)) / 2,
            y: (100 - heightPercent) / 2,
            width: Math.min(100, adjustedWidthPercent),
            height: heightPercent
          };
        }
      } else {
        newCropBox = {
          x: (100 - widthPercent) / 2,
          y: (100 - heightPercent) / 2,
          width: widthPercent,
          height: heightPercent
        };
      }
      cropState.silentUpdate((state) => ({ ...state, cropBox: newCropBox, cropPending: true }));
    }
    function handleLockToggle() {
      cropState.silentUpdate((state) => ({ ...state, ratioLocked: !state.ratioLocked }));
    }
    async function handleFlip() {
      const flipped = await flipImage(store_get($$store_subs ??= {}, "$cropState", cropState).currentImage);
      cropState.set({
        ...store_get($$store_subs ??= {}, "$cropState", cropState),
        currentImage: flipped
      });
    }
    async function handleRotate() {
      const rotated = await rotateImage(store_get($$store_subs ??= {}, "$cropState", cropState).currentImage, 90);
      const dims = await getImageDimensions(rotated);
      cropState.set({
        ...store_get($$store_subs ??= {}, "$cropState", cropState),
        currentImage: rotated,
        imageWidth: dims.width,
        imageHeight: dims.height,
        cropBox: { x: 0, y: 0, width: 100, height: 100 },
        cropPending: false
      });
    }
    function handleScaleChange(scale) {
      cropState.silentUpdate((state) => ({ ...state, scale: scale / 100 }));
    }
    function handleApplyCrop() {
      applyPendingCrop();
    }
    let editStateBeforeChange = null;
    function captureEditState() {
      if (editStateBeforeChange === null) {
        editStateBeforeChange = { ...store_get($$store_subs ??= {}, "$cropState", cropState) };
      }
    }
    function commitEditChange() {
      if (editStateBeforeChange !== null) {
        cropState.set(store_get($$store_subs ??= {}, "$cropState", cropState));
        editStateBeforeChange = null;
      }
    }
    function handleBrightnessChange(val) {
      captureEditState();
      cropState.silentUpdate((state) => ({ ...state, brightness: val }));
    }
    function handleShadowsChange(val) {
      captureEditState();
      cropState.silentUpdate((state) => ({ ...state, shadows: val }));
    }
    function handleContrastChange(val) {
      captureEditState();
      cropState.silentUpdate((state) => ({ ...state, contrast: val }));
    }
    function handleHdrChange(val) {
      captureEditState();
      cropState.silentUpdate((state) => ({ ...state, hdr: val }));
    }
    function handleBlurToggle(enabled) {
      cropState.set({
        ...store_get($$store_subs ??= {}, "$cropState", cropState),
        blurEnabled: enabled
      });
    }
    function handleBlurBrushSizeChange(size) {
      captureEditState();
      cropState.silentUpdate((state) => ({ ...state, blurBrushSize: size }));
    }
    function handleBlurStrengthChange(val) {
      captureEditState();
      cropState.silentUpdate((state) => ({ ...state, blurStrength: val }));
    }
    function handleBlurSoftenChange(val) {
      captureEditState();
      cropState.silentUpdate((state) => ({ ...state, blurSoften: val }));
    }
    function handleBlurInvertChange(val) {
      cropState.set({
        ...store_get($$store_subs ??= {}, "$cropState", cropState),
        blurInvert: val
      });
    }
    function handleBrushPreviewChange(visible) {
      cropState.silentUpdate((state) => ({ ...state, showBrushPreview: visible }));
    }
    function handleEditEnd() {
      commitEditChange();
    }
    function handleZoomChange(level) {
      cropState.silentUpdate((state) => ({ ...state, zoomLevel: level }));
    }
    function handleNudge(direction) {
      const nudgeAmount = 20;
      cropState.silentUpdate((state) => {
        let { zoomOffsetX, zoomOffsetY } = state;
        switch (direction) {
          case "up":
            zoomOffsetY -= nudgeAmount;
            break;
          case "down":
            zoomOffsetY += nudgeAmount;
            break;
          case "left":
            zoomOffsetX -= nudgeAmount;
            break;
          case "right":
            zoomOffsetX += nudgeAmount;
            break;
        }
        return { ...state, zoomOffsetX, zoomOffsetY };
      });
    }
    function handleResetZoom() {
      cropState.silentUpdate((state) => ({ ...state, zoomLevel: 1, zoomOffsetX: 0, zoomOffsetY: 0 }));
    }
    function handleFilterChange(filterId) {
      cropState.silentUpdate((state) => ({ ...state, activeFilter: filterId }));
    }
    function handleStrengthChange(value) {
      captureEditState();
      cropState.silentUpdate((state) => ({ ...state, filterStrength: value }));
    }
    function handleFilterReset() {
      cropState.set({
        ...store_get($$store_subs ??= {}, "$cropState", cropState),
        activeFilter: "original",
        filterStrength: 50
      });
    }
    cropWidth = Math.round(store_get($$store_subs ??= {}, "$cropState", cropState).imageWidth * store_get($$store_subs ??= {}, "$cropState", cropState).cropBox.width / 100);
    cropHeight = Math.round(store_get($$store_subs ??= {}, "$cropState", cropState).imageHeight * store_get($$store_subs ??= {}, "$cropState", cropState).cropBox.height / 100);
    editFilterCss = (() => {
      let filters = [];
      if (store_get($$store_subs ??= {}, "$cropState", cropState).brightness !== 0) {
        filters.push(`brightness(${1 + store_get($$store_subs ??= {}, "$cropState", cropState).brightness / 100})`);
      }
      if (store_get($$store_subs ??= {}, "$cropState", cropState).contrast !== 0) {
        filters.push(`contrast(${1 + store_get($$store_subs ??= {}, "$cropState", cropState).contrast / 100})`);
      }
      if (store_get($$store_subs ??= {}, "$cropState", cropState).shadows !== 0) {
        const shadowAdjust = 1 + store_get($$store_subs ??= {}, "$cropState", cropState).shadows / 200;
        filters.push(`brightness(${shadowAdjust})`);
      }
      if (store_get($$store_subs ??= {}, "$cropState", cropState).hdr !== 0) {
        const saturation = 1 + store_get($$store_subs ??= {}, "$cropState", cropState).hdr / 100 * 0.3;
        const contrast = 1 + store_get($$store_subs ??= {}, "$cropState", cropState).hdr / 100 * 0.2;
        filters.push(`saturate(${saturation}) contrast(${contrast})`);
      }
      if (store_get($$store_subs ??= {}, "$cropState", cropState).activeFilter !== "original") {
        const filterDef = FILTER_DEFINITIONS.find((f) => f.id === store_get($$store_subs ??= {}, "$cropState", cropState).activeFilter);
        if (filterDef && filterDef.css !== "none") {
          const strength = store_get($$store_subs ??= {}, "$cropState", cropState).filterStrength / 100;
          const adjustedCss = filterDef.css.replace(/(\d+)%/g, (match, p1) => {
            return `${Math.round(parseInt(p1) * strength)}%`;
          });
          filters.push(adjustedCss);
        }
      }
      return filters.length > 0 ? filters.join(" ") : "none";
    })();
    $$renderer2.push(`<div class="crop-tab svelte-c9tnuw">`);
    if (!store_get($$store_subs ??= {}, "$hasImage", hasImage)) {
      $$renderer2.push("<!--[-->");
      ImportArea($$renderer2, {
        title: "Crop, edit and add filters to photos",
        hint: "Import, drag or paste an image",
        onImageImport: handleImageImport
      });
    } else {
      $$renderer2.push("<!--[!-->");
      ActionBar($$renderer2, {
        canUndo: store_get($$store_subs ??= {}, "$undoState", undoState).canUndo,
        canRedo: store_get($$store_subs ??= {}, "$undoState", undoState).canRedo,
        onUndo: handleUndo,
        onRedo: handleRedo,
        onStartAgain: handleStartAgain,
        onCopy: handleCopy,
        onExport: handleExport
      });
      $$renderer2.push(`<!----> `);
      CropCanvas($$renderer2, {
        imageSrc: store_get($$store_subs ??= {}, "$cropState", cropState).currentImage,
        cropBox: store_get($$store_subs ??= {}, "$cropState", cropState).cropBox,
        isCropping: store_get($$store_subs ??= {}, "$cropState", cropState).isCropping,
        scale: store_get($$store_subs ??= {}, "$activeSubMenu", activeSubMenu) === "edit" ? store_get($$store_subs ??= {}, "$cropState", cropState).zoomLevel : store_get($$store_subs ??= {}, "$cropState", cropState).scale,
        offsetX: store_get($$store_subs ??= {}, "$activeSubMenu", activeSubMenu) === "edit" ? store_get($$store_subs ??= {}, "$cropState", cropState).zoomOffsetX : store_get($$store_subs ??= {}, "$cropState", cropState).offsetX,
        offsetY: store_get($$store_subs ??= {}, "$activeSubMenu", activeSubMenu) === "edit" ? store_get($$store_subs ??= {}, "$cropState", cropState).zoomOffsetY : store_get($$store_subs ??= {}, "$cropState", cropState).offsetY,
        imageWidth: store_get($$store_subs ??= {}, "$cropState", cropState).imageWidth,
        imageHeight: store_get($$store_subs ??= {}, "$cropState", cropState).imageHeight,
        editFilters: editFilterCss,
        blurEnabled: store_get($$store_subs ??= {}, "$cropState", cropState).blurEnabled,
        blurBrushSize: store_get($$store_subs ??= {}, "$cropState", cropState).blurBrushSize,
        blurStrength: store_get($$store_subs ??= {}, "$cropState", cropState).blurStrength,
        blurSoften: store_get($$store_subs ??= {}, "$cropState", cropState).blurSoften,
        blurInvert: store_get($$store_subs ??= {}, "$cropState", cropState).blurInvert,
        blurMask: store_get($$store_subs ??= {}, "$cropState", cropState).blurMask || [],
        showBrushPreview: store_get($$store_subs ??= {}, "$cropState", cropState).showBrushPreview
      });
      $$renderer2.push(`<!----> `);
      SubMenuTabs($$renderer2, {
        tabs: subMenuTabs,
        activeTab: store_get($$store_subs ??= {}, "$activeSubMenu", activeSubMenu),
        onTabChange: handleSubMenuChange
      });
      $$renderer2.push(`<!----> `);
      if (store_get($$store_subs ??= {}, "$activeSubMenu", activeSubMenu) === "crop") {
        $$renderer2.push("<!--[-->");
        CropControls($$renderer2, {
          aspectRatio: store_get($$store_subs ??= {}, "$cropState", cropState).aspectRatio,
          cropWidth,
          cropHeight,
          ratioLocked: store_get($$store_subs ??= {}, "$cropState", cropState).ratioLocked,
          scale: Math.round(store_get($$store_subs ??= {}, "$cropState", cropState).scale * 100),
          cropPending: store_get($$store_subs ??= {}, "$cropState", cropState).cropPending,
          onRatioChange: handleRatioChange,
          onDimensionsChange: handleDimensionsChange,
          onLockToggle: handleLockToggle,
          onFlip: handleFlip,
          onRotate: handleRotate,
          onScaleChange: handleScaleChange,
          onApply: handleApplyCrop
        });
      } else {
        $$renderer2.push("<!--[!-->");
        if (store_get($$store_subs ??= {}, "$activeSubMenu", activeSubMenu) === "edit") {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<div class="controls-panel svelte-c9tnuw">`);
          EditControls($$renderer2, {
            brightness: store_get($$store_subs ??= {}, "$cropState", cropState).brightness,
            shadows: store_get($$store_subs ??= {}, "$cropState", cropState).shadows,
            contrast: store_get($$store_subs ??= {}, "$cropState", cropState).contrast,
            hdr: store_get($$store_subs ??= {}, "$cropState", cropState).hdr,
            blurEnabled: store_get($$store_subs ??= {}, "$cropState", cropState).blurEnabled,
            blurBrushSize: store_get($$store_subs ??= {}, "$cropState", cropState).blurBrushSize,
            blurStrength: store_get($$store_subs ??= {}, "$cropState", cropState).blurStrength,
            blurSoften: store_get($$store_subs ??= {}, "$cropState", cropState).blurSoften,
            blurInvert: store_get($$store_subs ??= {}, "$cropState", cropState).blurInvert,
            zoomLevel: store_get($$store_subs ??= {}, "$cropState", cropState).zoomLevel,
            onBrightnessChange: handleBrightnessChange,
            onShadowsChange: handleShadowsChange,
            onContrastChange: handleContrastChange,
            onHdrChange: handleHdrChange,
            onBlurToggle: handleBlurToggle,
            onBlurBrushSizeChange: handleBlurBrushSizeChange,
            onBlurStrengthChange: handleBlurStrengthChange,
            onBlurSoftenChange: handleBlurSoftenChange,
            onBlurInvertChange: handleBlurInvertChange,
            onZoomChange: handleZoomChange,
            onNudge: handleNudge,
            onResetZoom: handleResetZoom,
            onBrushPreviewChange: handleBrushPreviewChange,
            onEditEnd: handleEditEnd
          });
          $$renderer2.push(`<!----></div>`);
        } else {
          $$renderer2.push("<!--[!-->");
          if (store_get($$store_subs ??= {}, "$activeSubMenu", activeSubMenu) === "filter") {
            $$renderer2.push("<!--[-->");
            $$renderer2.push(`<div class="controls-panel svelte-c9tnuw">`);
            FilterControls($$renderer2, {
              imageUrl: store_get($$store_subs ??= {}, "$cropState", cropState).currentImage,
              activeFilter: store_get($$store_subs ??= {}, "$cropState", cropState).activeFilter,
              filterStrength: store_get($$store_subs ??= {}, "$cropState", cropState).filterStrength,
              onFilterChange: handleFilterChange,
              onStrengthChange: handleStrengthChange,
              onReset: handleFilterReset
            });
            $$renderer2.push(`<!----></div>`);
          } else {
            $$renderer2.push("<!--[!-->");
          }
          $$renderer2.push(`<!--]-->`);
        }
        $$renderer2.push(`<!--]-->`);
      }
      $$renderer2.push(`<!--]-->`);
    }
    $$renderer2.push(`<!--]--> `);
    if (modalType === "save") {
      $$renderer2.push("<!--[-->");
      ConfirmModal($$renderer2, {
        message: "Save changes?",
        confirmText: "Yes",
        cancelText: "Cancel",
        onConfirm: handleSaveConfirm,
        onCancel: handleSaveCancel
      });
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> `);
    if (modalType === "startAgain") {
      $$renderer2.push("<!--[-->");
      ConfirmModal($$renderer2, {
        message: "Start again? Your changes will be lost.",
        confirmText: "Yes",
        cancelText: "Cancel",
        onConfirm: handleStartAgainConfirm,
        onCancel: handleStartAgainCancel
      });
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
function BeforeAfterSlider($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let beforeImage = fallback($$props["beforeImage"], "");
    let afterImage = fallback($$props["afterImage"], "");
    let position = fallback($$props["position"], 50);
    let onChange = fallback($$props["onChange"], () => {
    });
    $$renderer2.push(`<div class="before-after-container svelte-1i0ztfp" role="slider" aria-label="Before and after comparison" tabindex="0"><div class="before-image svelte-1i0ztfp"><img${attr("src", beforeImage)} alt="Before" class="svelte-1i0ztfp"/></div> <div class="after-image svelte-1i0ztfp"${attr_style(`clip-path: inset(0 ${stringify(100 - position)}% 0 0)`)}><img${attr("src", afterImage)} alt="After" class="svelte-1i0ztfp"/></div> <div class="slider-handle svelte-1i0ztfp"${attr_style(`left: ${stringify(position)}%`)} role="presentation"><div class="slider-line svelte-1i0ztfp"></div> <div class="slider-thumb svelte-1i0ztfp"><img src="/icons/icon-ai-slider.svg" alt="" class="slider-icon svelte-1i0ztfp"/></div></div></div>`);
    bind_props($$props, { beforeImage, afterImage, position, onChange });
  });
}
const initialAiState = {
  originalImage: null,
  currentImage: null,
  processedImage: null,
  isProcessing: false,
  processingType: null,
  upscaleFactor: 1,
  showComparison: false,
  comparisonPosition: 50
};
function createStore() {
  const { subscribe, set, update } = writable(initialAiState);
  return {
    subscribe,
    setImage: (imageData) => update((state) => ({
      ...state,
      originalImage: imageData,
      currentImage: imageData,
      processedImage: null
    })),
    startProcessing: (type) => update((state) => ({
      ...state,
      isProcessing: true,
      processingType: type
    })),
    finishProcessing: (result) => update((state) => ({
      ...state,
      isProcessing: false,
      processingType: null,
      processedImage: result,
      currentImage: result,
      showComparison: true
    })),
    cancelProcessing: () => update((state) => ({
      ...state,
      isProcessing: false,
      processingType: null
    })),
    setUpscaleFactor: (factor) => update((state) => ({
      ...state,
      upscaleFactor: factor
    })),
    setComparisonPosition: (position) => update((state) => ({
      ...state,
      comparisonPosition: position
    })),
    reset: () => set(initialAiState)
  };
}
const aiState = createStore();
const activeAiMenu = writable("enhance");
const hasAiImage = derived(aiState, ($state) => $state.currentImage !== null);
function UpscaleControls($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    const scaleFactor = 4;
    let outputDimensions = null;
    async function updateOutputDimensions() {
      try {
        const img = await loadImage(store_get($$store_subs ??= {}, "$aiState", aiState).originalImage);
        const width = Math.round(img.naturalWidth * scaleFactor);
        const height = Math.round(img.naturalHeight * scaleFactor);
        outputDimensions = `${width} x ${height}`;
      } catch (err) {
        console.error("Failed to get image dimensions:", err);
      }
    }
    if (store_get($$store_subs ??= {}, "$aiState", aiState).originalImage) {
      updateOutputDimensions();
    }
    $$renderer2.push(`<div class="upscale-controls svelte-1rgvkgu"><div class="controls-content svelte-1rgvkgu">`);
    if (outputDimensions) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="size-display svelte-1rgvkgu">Output: ${escape_html(outputDimensions)}</div>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> `);
    {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push(`<button class="upscale-btn svelte-1rgvkgu"><img src="/icons/icon-ai.svg" alt="" class="btn-icon svelte-1rgvkgu"/> Upscale image</button> <p class="hint svelte-1rgvkgu">Upscales, sharpens and enhances images</p>`);
    }
    $$renderer2.push(`<!--]--> `);
    {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></div></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
function RemoveBackgroundControls($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let hasProcessedImage;
    hasProcessedImage = store_get($$store_subs ??= {}, "$aiState", aiState).showComparison && store_get($$store_subs ??= {}, "$aiState", aiState).processedImage;
    $$renderer2.push(`<div class="background-controls svelte-1wdmsm1"><div class="controls-content svelte-1wdmsm1">`);
    {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push(`<button class="remove-btn svelte-1wdmsm1"><img src="/icons/icon-ai.svg" alt="" class="btn-icon svelte-1wdmsm1"/> Remove background</button> <p class="hint svelte-1wdmsm1">Remove image background with AI</p> <button class="erase-btn svelte-1wdmsm1"${attr("disabled", !hasProcessedImage, true)}><img src="/icons/icon-erase.svg" alt="" class="btn-icon svelte-1wdmsm1"/> Erase and restore</button> <p class="hint svelte-1wdmsm1">Manually clean up background</p>`);
    }
    $$renderer2.push(`<!--]--> `);
    {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></div> `);
    {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
function AiTab($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let comparisonPosition = 50;
    function handleComparisonChange(newPosition) {
      comparisonPosition = newPosition;
      aiState.setComparisonPosition(newPosition);
    }
    const subMenuTabs = [
      { id: "upscale", label: "Upscale" },
      { id: "background", label: "Remove background" }
    ];
    function handleImageImport(dataUrl) {
      aiState.setImage(dataUrl);
    }
    function handleSubMenuChange(tab) {
      activeAiMenu.set(tab);
    }
    async function handleCopy() {
      if (store_get($$store_subs ??= {}, "$aiState", aiState).currentImage) {
        await copyImageToClipboard(store_get($$store_subs ??= {}, "$aiState", aiState).currentImage);
      }
    }
    function handleExport() {
      if (store_get($$store_subs ??= {}, "$aiState", aiState).currentImage) {
        downloadImage(store_get($$store_subs ??= {}, "$aiState", aiState).currentImage, "picflam-ai.png");
      }
    }
    $$renderer2.push(`<div class="ai-tab svelte-17agwu4">`);
    if (!store_get($$store_subs ??= {}, "$hasAiImage", hasAiImage)) {
      $$renderer2.push("<!--[-->");
      ImportArea($$renderer2, {
        title: "Upscale and remove backgrounds using AI power",
        hint: "Import, drag or paste an image",
        onImageImport: handleImageImport
      });
    } else {
      $$renderer2.push("<!--[!-->");
      ActionBar($$renderer2, {
        canUndo: false,
        canRedo: false,
        onUndo: () => {
        },
        onRedo: () => {
        },
        onStartAgain: () => aiState.reset(),
        onCopy: handleCopy,
        onExport: handleExport
      });
      $$renderer2.push(`<!----> <div class="image-container svelte-17agwu4">`);
      if (store_get($$store_subs ??= {}, "$aiState", aiState).showComparison && store_get($$store_subs ??= {}, "$aiState", aiState).processedImage) {
        $$renderer2.push("<!--[-->");
        BeforeAfterSlider($$renderer2, {
          beforeImage: store_get($$store_subs ??= {}, "$aiState", aiState).originalImage,
          afterImage: store_get($$store_subs ??= {}, "$aiState", aiState).processedImage,
          position: comparisonPosition,
          onChange: handleComparisonChange
        });
      } else {
        $$renderer2.push("<!--[!-->");
        $$renderer2.push(`<img${attr("src", store_get($$store_subs ??= {}, "$aiState", aiState).currentImage)} alt="Working image" class="working-image svelte-17agwu4"/>`);
      }
      $$renderer2.push(`<!--]--></div> `);
      SubMenuTabs($$renderer2, {
        tabs: subMenuTabs,
        activeTab: store_get($$store_subs ??= {}, "$activeAiMenu", activeAiMenu),
        onTabChange: handleSubMenuChange
      });
      $$renderer2.push(`<!----> `);
      if (store_get($$store_subs ??= {}, "$activeAiMenu", activeAiMenu) === "upscale") {
        $$renderer2.push("<!--[-->");
        UpscaleControls($$renderer2);
      } else {
        $$renderer2.push("<!--[!-->");
        if (store_get($$store_subs ??= {}, "$activeAiMenu", activeAiMenu) === "background") {
          $$renderer2.push("<!--[-->");
          RemoveBackgroundControls($$renderer2);
        } else {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]-->`);
      }
      $$renderer2.push(`<!--]-->`);
    }
    $$renderer2.push(`<!--]--></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
function SizeControls($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let canvasSize = fallback($$props["canvasSize"], "1/1");
    let onSizeChange = fallback($$props["onSizeChange"], (size) => {
    });
    const sizeOptions = [
      { id: "9/16", label: "9:16", icon: "icon-vertical" },
      { id: "1/1", label: "1:1", icon: "icon-square" },
      { id: "16/9", label: "16:9", icon: "icon-horizontal" }
    ];
    function handleChange(id) {
      onSizeChange(id);
    }
    $$renderer2.push(`<div class="size-controls svelte-1l8e210">`);
    ToggleButtonGroup($$renderer2, {
      options: sizeOptions,
      value: canvasSize,
      onChange: handleChange,
      showLabels: true,
      centered: true
    });
    $$renderer2.push(`<!----></div>`);
    bind_props($$props, { canvasSize, onSizeChange });
  });
}
function ColorSwatch($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let colors = fallback($$props["colors"], () => [], true);
    let value = fallback($$props["value"], "");
    let onChange = fallback($$props["onChange"], (color) => {
    });
    let showRainbow = fallback($$props["showRainbow"], true);
    $$renderer2.push(`<div class="color-swatches svelte-x97jji"><!--[-->`);
    const each_array = ensure_array_like(colors);
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let color = each_array[$$index];
      $$renderer2.push(`<button${attr_class("swatch svelte-x97jji", void 0, { "active": value === color, "white": color === "#FFFFFF" })}${attr_style(`background-color: ${stringify(color)};`)}${attr("aria-label", `Select color ${stringify(color)}`)}></button>`);
    }
    $$renderer2.push(`<!--]--> `);
    if (showRainbow) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<button${attr_class("swatch rainbow svelte-x97jji", void 0, { "active": !colors.includes(value) && value !== "transparent" })} aria-label="Custom color"></button> `);
      {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]-->`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></div>`);
    bind_props($$props, { colors, value, onChange, showRainbow });
  });
}
const CANVAS_COLORS = {
  solids: ["#FFFFFF", "#000000", "#007C1F", "#00679D", "#B20715"],
  gradients: [
    "linear-gradient(135deg, #5422b0 0%, #4B0082 100%)",
    "linear-gradient(135deg, #15509B 0%, #20244F 100%)",
    "linear-gradient(135deg, #A8076B 0%, #62045F 100%)",
    "linear-gradient(135deg, #EA5C56 0%, #3C0C40 100%)",
    "linear-gradient(135deg, #0A8F9D 0%, #202B54 100%)",
    "linear-gradient(135deg, #D17A29 0%, #41363C 100%)"
  ]
};
const GRADIENT_DIRECTIONS = {
  up: "to top",
  down: "to bottom",
  left: "to left",
  right: "to right"
};
const initialSlideState = {
  canvasSize: "1/1",
  background: { type: "solid", value: "#FFFFFF", direction: "down", gradientColors: ["#5422b0", "#4B0082"] },
  text1: "",
  text1Font: "Inter",
  text1Size: 5,
  text1YPosition: 3,
  text1LineSpacing: 5,
  text1Color: "#000000",
  text1HighlightColor: "transparent",
  text1IsBold: true,
  text1Align: "center",
  text1QuoteStyle: "none",
  text1QuoteSize: 5,
  text2: "",
  text2Font: "Inter",
  text2Size: 3,
  text2YPosition: 8,
  text2LineSpacing: 5,
  text2Color: "#000000",
  text2LabelColor: "transparent",
  text2IsBold: false,
  text2Align: "center",
  overlay: null,
  overlaySize: 50,
  overlayOpacity: 100,
  overlayX: 50,
  overlayY: 50,
  overlayMask: "none",
  overlayLayer: "above",
  overlayBorderWidth: 0,
  overlayBorderColor: "#FFFFFF",
  overlayNaturalWidth: 0,
  overlayNaturalHeight: 0
};
function createHistoryStore(initialState) {
  const history = [JSON.parse(JSON.stringify(initialState))];
  let currentIndex = 0;
  const { subscribe, set, update } = writable(initialState);
  return {
    subscribe,
    set: (value) => {
      history.splice(currentIndex + 1);
      history.push(JSON.parse(JSON.stringify(value)));
      currentIndex = history.length - 1;
      set(value);
    },
    update: (fn) => {
      update((state) => {
        const newState = fn(state);
        history.splice(currentIndex + 1);
        history.push(JSON.parse(JSON.stringify(newState)));
        currentIndex = history.length - 1;
        return newState;
      });
    },
    undo: () => {
      if (currentIndex > 0) {
        currentIndex--;
        set(JSON.parse(JSON.stringify(history[currentIndex])));
        return true;
      }
      return false;
    },
    redo: () => {
      if (currentIndex < history.length - 1) {
        currentIndex++;
        set(JSON.parse(JSON.stringify(history[currentIndex])));
        return true;
      }
      return false;
    },
    canUndo: () => currentIndex > 0,
    canRedo: () => currentIndex < history.length - 1,
    reset: () => {
      const fresh = JSON.parse(JSON.stringify(initialState));
      history.length = 0;
      history.push(fresh);
      currentIndex = 0;
      set(fresh);
    }
  };
}
const slideState = createHistoryStore(initialSlideState);
const showTemplatePicker = writable(true);
const activeDesignMenu = writable("none");
derived(
  slideState,
  ($state) => $state.text1 || $state.text2 || $state.overlay || $state.background.value !== "#FFFFFF"
);
function resetDesignState() {
  slideState.reset();
  showTemplatePicker.set(true);
  activeDesignMenu.set("none");
}
function BackgroundControls($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let currentGradientValue;
    let background = fallback(
      $$props["background"],
      () => ({
        type: "solid",
        value: "#FFFFFF",
        direction: "down",
        gradientColors: ["#5422b0", "#4B0082"]
      }),
      true
    );
    let onBackgroundChange = fallback($$props["onBackgroundChange"], (bg) => {
    });
    const gradientPresets = CANVAS_COLORS.gradients.map((g) => {
      const match = g.match(/#[A-Fa-f0-9]{6}/g);
      return match ? [match[0], match[1]] : ["#5422b0", "#4B0082"];
    });
    function selectSolidColor(color) {
      onBackgroundChange({ ...background, type: "solid", value: color });
    }
    currentGradientValue = background.type === "gradient" ? `linear-gradient(${GRADIENT_DIRECTIONS[background.direction] || "to bottom"}, ${background.gradientColors?.[0] || "#5422b0"} 0%, ${background.gradientColors?.[1] || "#4B0082"} 100%)` : `linear-gradient(to bottom, ${gradientPresets[0][0]} 0%, ${gradientPresets[0][1]} 100%)`;
    $$renderer2.push(`<div class="background-controls svelte-18tfgkp"><div class="section svelte-18tfgkp"><div class="color-row svelte-18tfgkp">`);
    ColorSwatch($$renderer2, {
      colors: CANVAS_COLORS.solids,
      value: background.type === "solid" ? background.value : "",
      onChange: selectSolidColor,
      showRainbow: true
    });
    $$renderer2.push(`<!----></div></div> <div class="section svelte-18tfgkp"><div class="gradient-row svelte-18tfgkp"><!--[-->`);
    const each_array = ensure_array_like(gradientPresets);
    for (let index = 0, $$length = each_array.length; index < $$length; index++) {
      let colors = each_array[index];
      $$renderer2.push(`<button${attr_class("gradient-swatch svelte-18tfgkp", void 0, {
        "active": background.type === "gradient" && background.gradientColors?.[0] === colors[0] && background.gradientColors?.[1] === colors[1]
      })}${attr_style(`background: linear-gradient(135deg, ${stringify(colors[0])} 0%, ${stringify(colors[1])} 100%);`)} aria-label="Select gradient"></button>`);
    }
    $$renderer2.push(`<!--]--></div></div> <div class="section svelte-18tfgkp"><div class="gradient-preview-row svelte-18tfgkp"><button class="gradient-endpoint svelte-18tfgkp"${attr_style(`background-color: ${stringify(background.gradientColors?.[0] || "#5422b0")};`)} aria-label="Edit start color"></button> <div class="gradient-preview svelte-18tfgkp"${attr_style(`background: ${stringify(currentGradientValue)};`)}></div> <button class="gradient-endpoint svelte-18tfgkp"${attr_style(`background-color: ${stringify(background.gradientColors?.[1] || "#4B0082")};`)} aria-label="Edit end color"></button></div></div> <div class="section svelte-18tfgkp"><div${attr_class("direction-row svelte-18tfgkp", void 0, { "inactive": background.type !== "gradient" })}><button${attr_class("direction-btn svelte-18tfgkp", void 0, { "active": background.direction === "up" })} aria-label="Gradient direction up"><img src="/icons/icon-nudge-up.svg" alt="" class="direction-icon svelte-18tfgkp"/></button> <button${attr_class("direction-btn svelte-18tfgkp", void 0, { "active": background.direction === "down" })} aria-label="Gradient direction down"><img src="/icons/icon-nudge-down.svg" alt="" class="direction-icon svelte-18tfgkp"/></button> <button${attr_class("direction-btn svelte-18tfgkp", void 0, { "active": background.direction === "left" })} aria-label="Gradient direction left"><img src="/icons/icon-nudge-left.svg" alt="" class="direction-icon svelte-18tfgkp"/></button> <button${attr_class("direction-btn svelte-18tfgkp", void 0, { "active": background.direction === "right" })} aria-label="Gradient direction right"><img src="/icons/icon-nudge-right.svg" alt="" class="direction-icon svelte-18tfgkp"/></button></div></div></div>`);
    bind_props($$props, { background, onBackgroundChange });
  });
}
function Text1Controls($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let text1 = fallback($$props["text1"], "");
    let text1Font = fallback($$props["text1Font"], "Inter");
    let text1Size = fallback($$props["text1Size"], 5);
    let text1YPosition = fallback($$props["text1YPosition"], 3);
    let text1LineSpacing = fallback($$props["text1LineSpacing"], 5);
    let text1Color = fallback($$props["text1Color"], "#000000");
    let text1HighlightColor = fallback($$props["text1HighlightColor"], "transparent");
    let text1IsBold = fallback($$props["text1IsBold"], true);
    let text1Align = fallback($$props["text1Align"], "center");
    let onChange = fallback($$props["onChange"], (key, value) => {
    });
    const TEXT_COLORS = CANVAS_COLORS.solids;
    const HIGHLIGHT_COLORS = ["#FFD700", "#000000", "#007C1F", "#00679D", "#B20715"];
    function handleClickOutside(event) {
    }
    onDestroy(() => {
      document.removeEventListener("click", handleClickOutside);
    });
    function handleColorChange(color) {
      onChange("text1Color", color);
    }
    function handleHighlightChange(color) {
      onChange("text1HighlightColor", color === text1HighlightColor ? "transparent" : color);
    }
    $$renderer2.push(`<div class="text1-controls svelte-fspusj"><div class="text-input-container svelte-fspusj"><textarea class="text-input svelte-fspusj" placeholder="How to ==highlight== text">`);
    const $$body = escape_html(text1);
    if ($$body) {
      $$renderer2.push(`${$$body}`);
    }
    $$renderer2.push(`</textarea> <div class="resize-handle svelte-fspusj"></div></div> <div class="font-row svelte-fspusj"><span class="row-label svelte-fspusj">Font</span> <div class="font-dropdown-wrapper svelte-fspusj"><button class="font-dropdown-trigger svelte-fspusj"${attr_style(`font-family: '${stringify(text1Font)}'`)}>${escape_html(text1Font === "Inter" ? "Inter (Default)" : text1Font)} <span class="dropdown-arrow svelte-fspusj">▾</span></button> `);
    {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></div> <button${attr_class("icon-btn svelte-fspusj", void 0, { "active": text1IsBold })} aria-label="Bold"><img src="/icons/icon-bold.svg" alt="" class="btn-icon svelte-fspusj"/></button> <button class="icon-btn svelte-fspusj"${attr("aria-label", `Align ${stringify(text1Align)}`)}><img${attr("src", `/icons/icon-align-${stringify(text1Align)}.svg`)} alt="" class="btn-icon svelte-fspusj"/></button></div> <div class="slider-row svelte-fspusj">`);
    Slider($$renderer2, {
      label: "Size",
      min: 1,
      max: 10,
      value: text1Size,
      onChange: (val) => onChange("text1Size", val)
    });
    $$renderer2.push(`<!----> <button class="reset-btn svelte-fspusj" aria-label="Reset size"><img src="/icons/icon-reset.svg" alt="" class="reset-icon svelte-fspusj"/></button></div> <div class="slider-row svelte-fspusj">`);
    Slider($$renderer2, {
      label: "Position",
      min: 0,
      max: 10,
      value: text1YPosition,
      onChange: (val) => onChange("text1YPosition", val)
    });
    $$renderer2.push(`<!----> <button class="reset-btn svelte-fspusj" aria-label="Reset position"><img src="/icons/icon-reset.svg" alt="" class="reset-icon svelte-fspusj"/></button></div> <div class="slider-row svelte-fspusj">`);
    Slider($$renderer2, {
      label: "Line spacing",
      min: 1,
      max: 10,
      value: text1LineSpacing,
      onChange: (val) => onChange("text1LineSpacing", val)
    });
    $$renderer2.push(`<!----> <button class="reset-btn svelte-fspusj" aria-label="Reset line spacing"><img src="/icons/icon-reset.svg" alt="" class="reset-icon svelte-fspusj"/></button></div> <div class="color-section svelte-fspusj"><span class="section-label svelte-fspusj">Text colour</span> `);
    ColorSwatch($$renderer2, {
      colors: TEXT_COLORS,
      value: text1Color,
      onChange: handleColorChange,
      showRainbow: true
    });
    $$renderer2.push(`<!----></div> <div class="color-section svelte-fspusj"><span class="section-label svelte-fspusj">Highlight colour</span> `);
    ColorSwatch($$renderer2, {
      colors: HIGHLIGHT_COLORS,
      value: text1HighlightColor,
      onChange: handleHighlightChange,
      showRainbow: true
    });
    $$renderer2.push(`<!----></div></div>`);
    bind_props($$props, {
      text1,
      text1Font,
      text1Size,
      text1YPosition,
      text1LineSpacing,
      text1Color,
      text1HighlightColor,
      text1IsBold,
      text1Align,
      onChange
    });
  });
}
function Text2Controls($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let text2 = fallback($$props["text2"], "");
    let text2Font = fallback($$props["text2Font"], "Inter");
    let text2Size = fallback($$props["text2Size"], 3);
    let text2YPosition = fallback($$props["text2YPosition"], 8);
    let text2LineSpacing = fallback($$props["text2LineSpacing"], 5);
    let text2Color = fallback($$props["text2Color"], "#000000");
    let text2LabelColor = fallback($$props["text2LabelColor"], "transparent");
    let text2IsBold = fallback($$props["text2IsBold"], false);
    let text2Align = fallback($$props["text2Align"], "center");
    let onChange = fallback($$props["onChange"], (key, value) => {
    });
    const TEXT_COLORS = CANVAS_COLORS.solids;
    const HIGHLIGHT_COLORS = ["#FFD700", "#000000", "#007C1F", "#00679D", "#B20715"];
    function handleClickOutside(event) {
    }
    onDestroy(() => {
      document.removeEventListener("click", handleClickOutside);
    });
    function handleColorChange(color) {
      onChange("text2Color", color);
    }
    function handleHighlightChange(color) {
      onChange("text2LabelColor", color === text2LabelColor ? "transparent" : color);
    }
    $$renderer2.push(`<div class="text2-controls svelte-n6z268"><div class="text-input-container svelte-n6z268"><textarea class="text-input svelte-n6z268" placeholder="How to ==highlight== text">`);
    const $$body = escape_html(text2);
    if ($$body) {
      $$renderer2.push(`${$$body}`);
    }
    $$renderer2.push(`</textarea> <div class="resize-handle svelte-n6z268"></div></div> <div class="font-row svelte-n6z268"><span class="row-label svelte-n6z268">Font</span> <div class="font-dropdown-wrapper svelte-n6z268"><button class="font-dropdown-trigger svelte-n6z268"${attr_style(`font-family: '${stringify(text2Font)}'`)}>${escape_html(text2Font === "Inter" ? "Inter (Default)" : text2Font)} <span class="dropdown-arrow svelte-n6z268">▾</span></button> `);
    {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></div> <button${attr_class("icon-btn svelte-n6z268", void 0, { "active": text2IsBold })} aria-label="Bold"><img src="/icons/icon-bold.svg" alt="" class="btn-icon svelte-n6z268"/></button> <button class="icon-btn svelte-n6z268"${attr("aria-label", `Align ${stringify(text2Align)}`)}><img${attr("src", `/icons/icon-align-${stringify(text2Align)}.svg`)} alt="" class="btn-icon svelte-n6z268"/></button></div> <div class="slider-row svelte-n6z268">`);
    Slider($$renderer2, {
      label: "Size",
      min: 1,
      max: 10,
      value: text2Size,
      onChange: (val) => onChange("text2Size", val)
    });
    $$renderer2.push(`<!----> <button class="reset-btn svelte-n6z268" aria-label="Reset size"><img src="/icons/icon-reset.svg" alt="" class="reset-icon svelte-n6z268"/></button></div> <div class="slider-row svelte-n6z268">`);
    Slider($$renderer2, {
      label: "Position",
      min: 0,
      max: 10,
      value: text2YPosition,
      onChange: (val) => onChange("text2YPosition", val)
    });
    $$renderer2.push(`<!----> <button class="reset-btn svelte-n6z268" aria-label="Reset position"><img src="/icons/icon-reset.svg" alt="" class="reset-icon svelte-n6z268"/></button></div> <div class="slider-row svelte-n6z268">`);
    Slider($$renderer2, {
      label: "Line spacing",
      min: 1,
      max: 10,
      value: text2LineSpacing,
      onChange: (val) => onChange("text2LineSpacing", val)
    });
    $$renderer2.push(`<!----> <button class="reset-btn svelte-n6z268" aria-label="Reset line spacing"><img src="/icons/icon-reset.svg" alt="" class="reset-icon svelte-n6z268"/></button></div> <div class="color-section svelte-n6z268"><span class="section-label svelte-n6z268">Text colour</span> `);
    ColorSwatch($$renderer2, {
      colors: TEXT_COLORS,
      value: text2Color,
      onChange: handleColorChange,
      showRainbow: true
    });
    $$renderer2.push(`<!----></div> <div class="color-section svelte-n6z268"><span class="section-label svelte-n6z268">Highlight colour</span> `);
    ColorSwatch($$renderer2, {
      colors: HIGHLIGHT_COLORS,
      value: text2LabelColor,
      onChange: handleHighlightChange,
      showRainbow: true
    });
    $$renderer2.push(`<!----></div></div>`);
    bind_props($$props, {
      text2,
      text2Font,
      text2Size,
      text2YPosition,
      text2LineSpacing,
      text2Color,
      text2LabelColor,
      text2IsBold,
      text2Align,
      onChange
    });
  });
}
function QuoteControls($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let quoteStyle = fallback($$props["quoteStyle"], "none");
    let quoteSize = fallback($$props["quoteSize"], 5);
    let onChange = fallback($$props["onChange"], (key, value) => {
    });
    const QUOTE_STYLES = [
      { id: "none", icon: "/icons/icon-none.svg", label: "No quote" },
      {
        id: "serif",
        icon: "/icons/icon-quote-serif.svg",
        label: "Serif quote"
      },
      {
        id: "slab",
        icon: "/icons/icon-quote-slab.svg",
        label: "Slab quote"
      }
    ];
    $$renderer2.push(`<div class="quote-controls svelte-4vqdnp"><div class="style-row svelte-4vqdnp"><!--[-->`);
    const each_array = ensure_array_like(QUOTE_STYLES);
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let style = each_array[$$index];
      $$renderer2.push(`<button${attr_class("style-btn svelte-4vqdnp", void 0, {
        "active": quoteStyle === style.id,
        "is-none": style.id === "none"
      })}${attr("aria-label", style.label)}><img${attr("src", style.icon)} alt="" class="style-icon svelte-4vqdnp"/></button>`);
    }
    $$renderer2.push(`<!--]--></div> <div${attr_class("slider-row svelte-4vqdnp", void 0, { "disabled": quoteStyle === "none" })}>`);
    Slider($$renderer2, {
      label: "Size",
      min: 1,
      max: 10,
      value: quoteSize,
      onChange: (val) => quoteStyle !== "none" && onChange("text1QuoteSize", val)
    });
    $$renderer2.push(`<!----> <button class="reset-btn svelte-4vqdnp" aria-label="Reset size"${attr("disabled", quoteStyle === "none", true)}><img src="/icons/icon-reset.svg" alt="" class="reset-icon svelte-4vqdnp"/></button></div></div>`);
    bind_props($$props, { quoteStyle, quoteSize, onChange });
  });
}
function OverlayControls($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let overlay = fallback($$props["overlay"], null);
    let overlaySize = fallback($$props["overlaySize"], 50);
    let overlayOpacity = fallback($$props["overlayOpacity"], 100);
    let overlayMask = fallback($$props["overlayMask"], "none");
    let overlayLayer = fallback($$props["overlayLayer"], "above");
    let overlayBorderWidth = fallback($$props["overlayBorderWidth"], 0);
    let overlayBorderColor = fallback($$props["overlayBorderColor"], "#FFFFFF");
    let onChange = fallback($$props["onChange"], (key, value) => {
    });
    const BORDER_COLORS = CANVAS_COLORS.solids;
    const BORDER_STOPS = [0, 1, 2, 3];
    function handleBorderWidthChange(val) {
      const snapped = BORDER_STOPS.reduce((prev, curr) => Math.abs(curr - val) < Math.abs(prev - val) ? curr : prev);
      onChange("overlayBorderWidth", snapped);
    }
    $$renderer2.push(`<div class="overlay-controls svelte-qirtgp">`);
    if (!overlay) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="import-box svelte-qirtgp" role="button" tabindex="0"><label class="import-area svelte-qirtgp"><input type="file" accept="image/*" class="file-input svelte-qirtgp"/> <img src="/icons/icon-upload.svg" alt="" class="upload-icon svelte-qirtgp"/> <span class="import-text svelte-qirtgp">Import, drag or<br/>paste an image</span></label> <button class="paste-btn svelte-qirtgp">Paste</button></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push(`<div class="slider-row svelte-qirtgp">`);
      Slider($$renderer2, {
        label: "Size",
        min: 10,
        max: 100,
        value: overlaySize,
        onChange: (val) => onChange("overlaySize", val)
      });
      $$renderer2.push(`<!----></div> <div class="slider-row svelte-qirtgp">`);
      Slider($$renderer2, {
        label: "Opacity",
        min: 0,
        max: 100,
        value: overlayOpacity,
        onChange: (val) => onChange("overlayOpacity", val)
      });
      $$renderer2.push(`<!----></div> <div class="mask-row svelte-qirtgp"><span class="row-label svelte-qirtgp">Mask</span> <div class="mask-buttons svelte-qirtgp"><button${attr_class("mask-btn svelte-qirtgp", void 0, { "active": overlayMask === "none" })} aria-label="No mask"><img src="/icons/icon-none.svg" alt="" class="mask-icon svelte-qirtgp"/></button> <button${attr_class("mask-btn svelte-qirtgp", void 0, { "active": overlayMask === "rounded" })} aria-label="Rounded mask"><img src="/icons/icon-square.svg" alt="" class="mask-icon svelte-qirtgp"/></button> <button${attr_class("mask-btn svelte-qirtgp", void 0, { "active": overlayMask === "circle" })} aria-label="Circle mask"><div class="circle-icon svelte-qirtgp"></div></button></div> <span class="row-label layer-label svelte-qirtgp">Layers</span> <div class="layer-buttons svelte-qirtgp"><button${attr_class("layer-btn svelte-qirtgp", void 0, { "active": overlayLayer === "above" })} aria-label="Overlay above text"><img src="/icons/icon-layer-above.svg" alt="" class="layer-icon svelte-qirtgp"/></button> <button${attr_class("layer-btn svelte-qirtgp", void 0, { "active": overlayLayer === "below" })} aria-label="Overlay below text"><img src="/icons/icon-layer-below.svg" alt="" class="layer-icon svelte-qirtgp"/></button></div></div> <div class="slider-row svelte-qirtgp">`);
      Slider($$renderer2, {
        label: "Border width",
        min: 0,
        max: 3,
        step: 1,
        value: overlayBorderWidth,
        onChange: handleBorderWidthChange
      });
      $$renderer2.push(`<!----></div> <div class="color-section svelte-qirtgp"><span class="section-label svelte-qirtgp">Border colour</span> `);
      ColorSwatch($$renderer2, {
        colors: BORDER_COLORS,
        value: overlayBorderColor,
        onChange: (color) => onChange("overlayBorderColor", color),
        showRainbow: true
      });
      $$renderer2.push(`<!----></div>`);
    }
    $$renderer2.push(`<!--]--></div>`);
    bind_props($$props, {
      overlay,
      overlaySize,
      overlayOpacity,
      overlayMask,
      overlayLayer,
      overlayBorderWidth,
      overlayBorderColor,
      onChange
    });
  });
}
function DesignTab($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let overlayDimensions;
    let canvasMinDim = 300;
    onDestroy(() => {
    });
    const subMenuTabs = [
      { id: "size", label: "Size" },
      { id: "background", label: "Background" },
      { id: "text1", label: "Text 1" },
      { id: "text2", label: "Text 2" },
      { id: "quote", label: "Quote" },
      { id: "overlay", label: "Overlay" }
    ];
    function handleSubMenuChange(tab) {
      activeDesignMenu.set(store_get($$store_subs ??= {}, "$activeDesignMenu", activeDesignMenu) === tab ? "none" : tab);
    }
    async function handleCopy() {
    }
    function handleExport() {
    }
    function handleSizeChange(size) {
      slideState.update((state) => ({ ...state, canvasSize: size }));
    }
    function handleBackgroundChange(bg) {
      slideState.update((state) => ({ ...state, background: bg }));
    }
    function handleText1Change(key, value) {
      slideState.update((state) => ({ ...state, [key]: value }));
    }
    function handleText2Change(key, value) {
      slideState.update((state) => ({ ...state, [key]: value }));
    }
    function handleQuoteChange(key, value) {
      slideState.update((state) => ({ ...state, [key]: value }));
    }
    function handleOverlayChange(key, value) {
      if (key === "overlay" && value) {
        const img = new Image();
        img.onload = () => {
          slideState.update((state) => ({
            ...state,
            overlay: value,
            overlayNaturalWidth: img.naturalWidth,
            overlayNaturalHeight: img.naturalHeight,
            overlayX: 50,
            overlayY: 50
          }));
          activeDesignMenu.set("overlay");
        };
        img.src = value;
      } else if (key === "overlayLayer") {
        slideState.update((state) => ({ ...state, [key]: value }));
        activeDesignMenu.set("none");
      } else {
        slideState.update((state) => ({ ...state, [key]: value }));
      }
    }
    function handleDeleteOverlay() {
      slideState.update((state) => ({
        ...state,
        overlay: null,
        overlayNaturalWidth: 0,
        overlayNaturalHeight: 0
      }));
      activeDesignMenu.set("none");
    }
    function calculateOverlayDimensions(state) {
      if (!state.overlay || !state.overlayNaturalWidth) return null;
      const aspectRatio = state.overlayNaturalWidth / state.overlayNaturalHeight;
      const maxWidth = state.overlaySize / 100 * 100;
      let width, height;
      if (aspectRatio >= 1) {
        width = maxWidth;
        height = maxWidth / aspectRatio;
      } else {
        height = maxWidth;
        width = maxWidth * aspectRatio;
      }
      return { width, height };
    }
    overlayDimensions = calculateOverlayDimensions(store_get($$store_subs ??= {}, "$slideState", slideState));
    $$renderer2.push(`<div class="design-tab svelte-fxk5n4">`);
    if (store_get($$store_subs ??= {}, "$showTemplatePicker", showTemplatePicker)) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="template-picker svelte-fxk5n4"><p class="picker-title svelte-fxk5n4">Create quotes and cards. Start with a template or blank canvas</p> <button class="blank-canvas-btn svelte-fxk5n4"><img src="/icons/icon-add.svg" alt="" class="add-icon svelte-fxk5n4"/></button> <div class="template-grid svelte-fxk5n4"><!--[-->`);
      const each_array = ensure_array_like([1, 2, 3, 4, 5, 6]);
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let templateNum = each_array[$$index];
        $$renderer2.push(`<button class="template-card svelte-fxk5n4"><div class="template-placeholder svelte-fxk5n4">Template ${escape_html(templateNum)}</div></button>`);
      }
      $$renderer2.push(`<!--]--></div></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
      ActionBar($$renderer2, {
        canUndo: slideState.canUndo(),
        canRedo: slideState.canRedo(),
        onUndo: () => slideState.undo(),
        onRedo: () => slideState.redo(),
        onStartAgain: resetDesignState,
        onCopy: handleCopy,
        onExport: handleExport
      });
      $$renderer2.push(`<!----> <div class="canvas-container svelte-fxk5n4"><div class="design-canvas svelte-fxk5n4"${attr_style(` aspect-ratio: ${stringify(store_get($$store_subs ??= {}, "$slideState", slideState).canvasSize)}; background: ${stringify(store_get($$store_subs ??= {}, "$slideState", slideState).background.type === "solid" ? store_get($$store_subs ??= {}, "$slideState", slideState).background.value : store_get($$store_subs ??= {}, "$slideState", slideState).background.value)}; `)} role="button" tabindex="0">`);
      if (store_get($$store_subs ??= {}, "$slideState", slideState).text1) {
        $$renderer2.push("<!--[-->");
        const textFontSizePx = canvasMinDim * 0.1 * store_get($$store_subs ??= {}, "$slideState", slideState).text1Size / 5;
        const textLineHeightPx = textFontSizePx * (1 + store_get($$store_subs ??= {}, "$slideState", slideState).text1LineSpacing * 0.1);
        const gapPx = textLineHeightPx * (store_get($$store_subs ??= {}, "$slideState", slideState).text1QuoteStyle === "slab" ? 0.35 : 0.4);
        const quoteFontSizePx = canvasMinDim * 0.08 * store_get($$store_subs ??= {}, "$slideState", slideState).text1QuoteSize;
        const quoteOffsetTopPx = -(quoteFontSizePx + gapPx);
        $$renderer2.push(`<div class="text1-wrapper svelte-fxk5n4"${attr_style(`top: ${stringify(store_get($$store_subs ??= {}, "$slideState", slideState).text1YPosition * 10)}%;`)}>`);
        if (store_get($$store_subs ??= {}, "$slideState", slideState).text1QuoteStyle !== "none") {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<div class="canvas-quote svelte-fxk5n4"${attr_style(` top: ${stringify(quoteOffsetTopPx)}px; font-family: ${stringify(store_get($$store_subs ??= {}, "$slideState", slideState).text1QuoteStyle === "serif" ? '"Playfair Display", serif' : '"Alfa Slab One", cursive')}; font-size: ${stringify(quoteFontSizePx)}px; font-weight: ${stringify(store_get($$store_subs ??= {}, "$slideState", slideState).text1QuoteStyle === "serif" ? "bold" : "normal")}; color: ${stringify(store_get($$store_subs ??= {}, "$slideState", slideState).text1Color)}; `)}>“</div>`);
        } else {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]--> <div class="canvas-text text1 svelte-fxk5n4"${attr_style(` font-family: '${stringify(store_get($$store_subs ??= {}, "$slideState", slideState).text1Font)}'; font-size: ${stringify(store_get($$store_subs ??= {}, "$slideState", slideState).text1Size * 0.5)}em; font-weight: ${stringify(store_get($$store_subs ??= {}, "$slideState", slideState).text1IsBold ? "bold" : "normal")}; color: ${stringify(store_get($$store_subs ??= {}, "$slideState", slideState).text1Color)}; text-align: ${stringify(store_get($$store_subs ??= {}, "$slideState", slideState).text1Align)}; line-height: ${stringify(1 + store_get($$store_subs ??= {}, "$slideState", slideState).text1LineSpacing * 0.1)}; `)}>${html(store_get($$store_subs ??= {}, "$slideState", slideState).text1.replace(/==(.+?)==/g, `<span style="color: ${store_get($$store_subs ??= {}, "$slideState", slideState).text1HighlightColor};">$1</span>`).replace(/\n/g, "<br>"))}</div></div>`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--> `);
      if (store_get($$store_subs ??= {}, "$slideState", slideState).text2) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div class="canvas-text text2 svelte-fxk5n4"${attr_style(` font-family: '${stringify(store_get($$store_subs ??= {}, "$slideState", slideState).text2Font)}'; font-size: ${stringify(store_get($$store_subs ??= {}, "$slideState", slideState).text2Size * 0.5)}em; font-weight: ${stringify(store_get($$store_subs ??= {}, "$slideState", slideState).text2IsBold ? "bold" : "normal")}; color: ${stringify(store_get($$store_subs ??= {}, "$slideState", slideState).text2Color)}; text-align: ${stringify(store_get($$store_subs ??= {}, "$slideState", slideState).text2Align)}; top: ${stringify(store_get($$store_subs ??= {}, "$slideState", slideState).text2YPosition * 10)}%; line-height: ${stringify(1 + store_get($$store_subs ??= {}, "$slideState", slideState).text2LineSpacing * 0.1)}; `)}>${html(store_get($$store_subs ??= {}, "$slideState", slideState).text2.replace(/==(.+?)==/g, `<span style="color: ${store_get($$store_subs ??= {}, "$slideState", slideState).text2LabelColor};">$1</span>`).replace(/\n/g, "<br>"))}</div>`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--> `);
      if (store_get($$store_subs ??= {}, "$slideState", slideState).overlay && overlayDimensions) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div${attr_class("overlay-wrapper svelte-fxk5n4", void 0, {
          "active": store_get($$store_subs ??= {}, "$activeDesignMenu", activeDesignMenu) === "overlay"
        })}${attr_style(` left: ${stringify(store_get($$store_subs ??= {}, "$slideState", slideState).overlayX)}%; top: ${stringify(store_get($$store_subs ??= {}, "$slideState", slideState).overlayY)}%; width: ${stringify(overlayDimensions.width)}%; opacity: ${stringify(store_get($$store_subs ??= {}, "$slideState", slideState).overlayOpacity / 100)}; z-index: ${stringify(store_get($$store_subs ??= {}, "$activeDesignMenu", activeDesignMenu) === "overlay" ? 11 : store_get($$store_subs ??= {}, "$slideState", slideState).overlayLayer === "below" ? 1 : 10)}; `)} role="button" tabindex="0"><div${attr_class("overlay-bounding-box svelte-fxk5n4", void 0, {
          "mask-none": store_get($$store_subs ??= {}, "$slideState", slideState).overlayMask === "none",
          "mask-rounded": store_get($$store_subs ??= {}, "$slideState", slideState).overlayMask === "rounded",
          "mask-circle": store_get($$store_subs ??= {}, "$slideState", slideState).overlayMask === "circle"
        })}${attr_style(` border-width: ${stringify(store_get($$store_subs ??= {}, "$slideState", slideState).overlayBorderWidth * 2)}px; border-color: ${stringify(store_get($$store_subs ??= {}, "$slideState", slideState).overlayBorderColor)}; `)}><button class="delete-btn svelte-fxk5n4" aria-label="Delete overlay"><img src="/icons/icon-close.svg" alt="" class="delete-icon svelte-fxk5n4"/></button> <div${attr_class("overlay-image-container svelte-fxk5n4", void 0, {
          "mask-rounded": store_get($$store_subs ??= {}, "$slideState", slideState).overlayMask === "rounded",
          "mask-circle": store_get($$store_subs ??= {}, "$slideState", slideState).overlayMask === "circle"
        })}><img${attr("src", store_get($$store_subs ??= {}, "$slideState", slideState).overlay)} alt="Overlay" class="overlay-image svelte-fxk5n4" draggable="false"/></div></div></div>`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--></div></div> `);
      SubMenuTabs($$renderer2, {
        tabs: subMenuTabs,
        activeTab: store_get($$store_subs ??= {}, "$activeDesignMenu", activeDesignMenu),
        onTabChange: handleSubMenuChange
      });
      $$renderer2.push(`<!----> <div class="controls-panel svelte-fxk5n4">`);
      if (store_get($$store_subs ??= {}, "$activeDesignMenu", activeDesignMenu) === "overlay" || store_get($$store_subs ??= {}, "$activeDesignMenu", activeDesignMenu) === "none" && store_get($$store_subs ??= {}, "$slideState", slideState).overlay) {
        $$renderer2.push("<!--[-->");
        OverlayControls($$renderer2, {
          overlay: store_get($$store_subs ??= {}, "$slideState", slideState).overlay,
          overlaySize: store_get($$store_subs ??= {}, "$slideState", slideState).overlaySize,
          overlayOpacity: store_get($$store_subs ??= {}, "$slideState", slideState).overlayOpacity,
          overlayMask: store_get($$store_subs ??= {}, "$slideState", slideState).overlayMask,
          overlayLayer: store_get($$store_subs ??= {}, "$slideState", slideState).overlayLayer,
          overlayBorderWidth: store_get($$store_subs ??= {}, "$slideState", slideState).overlayBorderWidth,
          overlayBorderColor: store_get($$store_subs ??= {}, "$slideState", slideState).overlayBorderColor,
          onChange: handleOverlayChange,
          onDelete: handleDeleteOverlay
        });
      } else {
        $$renderer2.push("<!--[!-->");
        if (store_get($$store_subs ??= {}, "$activeDesignMenu", activeDesignMenu) === "size") {
          $$renderer2.push("<!--[-->");
          SizeControls($$renderer2, {
            canvasSize: store_get($$store_subs ??= {}, "$slideState", slideState).canvasSize,
            onSizeChange: handleSizeChange
          });
        } else {
          $$renderer2.push("<!--[!-->");
          if (store_get($$store_subs ??= {}, "$activeDesignMenu", activeDesignMenu) === "background") {
            $$renderer2.push("<!--[-->");
            BackgroundControls($$renderer2, {
              background: store_get($$store_subs ??= {}, "$slideState", slideState).background,
              onBackgroundChange: handleBackgroundChange
            });
          } else {
            $$renderer2.push("<!--[!-->");
            if (store_get($$store_subs ??= {}, "$activeDesignMenu", activeDesignMenu) === "text1") {
              $$renderer2.push("<!--[-->");
              Text1Controls($$renderer2, {
                text1: store_get($$store_subs ??= {}, "$slideState", slideState).text1,
                text1Font: store_get($$store_subs ??= {}, "$slideState", slideState).text1Font,
                text1Size: store_get($$store_subs ??= {}, "$slideState", slideState).text1Size,
                text1YPosition: store_get($$store_subs ??= {}, "$slideState", slideState).text1YPosition,
                text1LineSpacing: store_get($$store_subs ??= {}, "$slideState", slideState).text1LineSpacing,
                text1Color: store_get($$store_subs ??= {}, "$slideState", slideState).text1Color,
                text1HighlightColor: store_get($$store_subs ??= {}, "$slideState", slideState).text1HighlightColor,
                text1IsBold: store_get($$store_subs ??= {}, "$slideState", slideState).text1IsBold,
                text1Align: store_get($$store_subs ??= {}, "$slideState", slideState).text1Align,
                onChange: handleText1Change
              });
            } else {
              $$renderer2.push("<!--[!-->");
              if (store_get($$store_subs ??= {}, "$activeDesignMenu", activeDesignMenu) === "text2") {
                $$renderer2.push("<!--[-->");
                Text2Controls($$renderer2, {
                  text2: store_get($$store_subs ??= {}, "$slideState", slideState).text2,
                  text2Font: store_get($$store_subs ??= {}, "$slideState", slideState).text2Font,
                  text2Size: store_get($$store_subs ??= {}, "$slideState", slideState).text2Size,
                  text2YPosition: store_get($$store_subs ??= {}, "$slideState", slideState).text2YPosition,
                  text2LineSpacing: store_get($$store_subs ??= {}, "$slideState", slideState).text2LineSpacing,
                  text2Color: store_get($$store_subs ??= {}, "$slideState", slideState).text2Color,
                  text2LabelColor: store_get($$store_subs ??= {}, "$slideState", slideState).text2LabelColor,
                  text2IsBold: store_get($$store_subs ??= {}, "$slideState", slideState).text2IsBold,
                  text2Align: store_get($$store_subs ??= {}, "$slideState", slideState).text2Align,
                  onChange: handleText2Change
                });
              } else {
                $$renderer2.push("<!--[!-->");
                if (store_get($$store_subs ??= {}, "$activeDesignMenu", activeDesignMenu) === "quote") {
                  $$renderer2.push("<!--[-->");
                  QuoteControls($$renderer2, {
                    quoteStyle: store_get($$store_subs ??= {}, "$slideState", slideState).text1QuoteStyle,
                    quoteSize: store_get($$store_subs ??= {}, "$slideState", slideState).text1QuoteSize,
                    onChange: handleQuoteChange
                  });
                } else {
                  $$renderer2.push("<!--[!-->");
                }
                $$renderer2.push(`<!--]-->`);
              }
              $$renderer2.push(`<!--]-->`);
            }
            $$renderer2.push(`<!--]-->`);
          }
          $$renderer2.push(`<!--]-->`);
        }
        $$renderer2.push(`<!--]-->`);
      }
      $$renderer2.push(`<!--]--></div>`);
    }
    $$renderer2.push(`<!--]--></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
const activeTab = writable("crop");
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let showSaveModal = false;
    let pendingTab = null;
    function handleTabChange(tab) {
      if (store_get($$store_subs ??= {}, "$activeTab", activeTab) === "crop" && store_get($$store_subs ??= {}, "$cropState", cropState).cropPending && tab !== "crop") {
        pendingTab = tab;
        showSaveModal = true;
        return;
      }
      activeTab.set(tab);
    }
    async function handleSaveConfirm() {
      showSaveModal = false;
      const state = store_get($$store_subs ??= {}, "$cropState", cropState);
      if (state.currentImage && state.cropPending) {
        const croppedImage = await applyCrop(state.currentImage, state.cropBox, state.imageWidth, state.imageHeight);
        const dims = await getImageDimensions(croppedImage);
        cropState.set({
          ...state,
          currentImage: croppedImage,
          imageWidth: dims.width,
          imageHeight: dims.height,
          cropBox: { x: 0, y: 0, width: 100, height: 100 },
          cropPending: false,
          isCropping: false
        });
      }
      if (pendingTab) {
        activeTab.set(pendingTab);
        pendingTab = null;
      }
    }
    function handleSaveCancel() {
      showSaveModal = false;
      pendingTab = null;
    }
    Header($$renderer2, {
      activeTab: store_get($$store_subs ??= {}, "$activeTab", activeTab),
      onTabChange: handleTabChange
    });
    $$renderer2.push(`<!----> <main class="main svelte-1uha8ag">`);
    if (store_get($$store_subs ??= {}, "$activeTab", activeTab) === "crop") {
      $$renderer2.push("<!--[-->");
      CropTab($$renderer2);
    } else {
      $$renderer2.push("<!--[!-->");
      if (store_get($$store_subs ??= {}, "$activeTab", activeTab) === "ai") {
        $$renderer2.push("<!--[-->");
        AiTab($$renderer2);
      } else {
        $$renderer2.push("<!--[!-->");
        if (store_get($$store_subs ??= {}, "$activeTab", activeTab) === "design") {
          $$renderer2.push("<!--[-->");
          DesignTab($$renderer2);
        } else {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]-->`);
      }
      $$renderer2.push(`<!--]-->`);
    }
    $$renderer2.push(`<!--]--></main> `);
    if (showSaveModal) {
      $$renderer2.push("<!--[-->");
      ConfirmModal($$renderer2, {
        message: "Save changes?",
        confirmText: "Yes",
        cancelText: "Cancel",
        onConfirm: handleSaveConfirm,
        onCancel: handleSaveCancel
      });
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]-->`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
export {
  _page as default
};
