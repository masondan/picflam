import { a as attr_class, b as bind_props, c as attr, e as ensure_array_like, d as attr_style, f as stringify, s as slot, g as store_get, u as unsubscribe_stores } from "../../chunks/index2.js";
import { a1 as fallback, a0 as escape_html } from "../../chunks/context.js";
import { d as derived, w as writable } from "../../chunks/index.js";
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
    let displayWidth, displayHeight, cropPixels;
    let imageSrc = fallback($$props["imageSrc"], "");
    let cropBox = fallback($$props["cropBox"], () => ({ x: 10, y: 10, width: 80, height: 80 }), true);
    let isCropping = fallback($$props["isCropping"], false);
    let scale = fallback($$props["scale"], 1);
    let offsetX = fallback($$props["offsetX"], 0);
    let offsetY = fallback($$props["offsetY"], 0);
    let imageWidth = fallback($$props["imageWidth"], 0);
    let imageHeight = fallback($$props["imageHeight"], 0);
    let editFilters = fallback($$props["editFilters"], "");
    let containerRect = { width: 0 };
    displayWidth = containerRect.width;
    displayHeight = imageHeight && imageWidth ? displayWidth * imageHeight / imageWidth : 0;
    cropPixels = {
      x: cropBox.x / 100 * displayWidth,
      y: cropBox.y / 100 * displayHeight,
      width: cropBox.width / 100 * displayWidth,
      height: cropBox.height / 100 * displayHeight
    };
    $$renderer2.push(`<div class="crop-canvas svelte-pjowa5" role="application" aria-label="Image crop canvas"><div class="image-wrapper svelte-pjowa5"${attr_style(`transform: scale(${stringify(scale)}) translate(${stringify(offsetX)}px, ${stringify(offsetY)}px);`)}><img${attr("src", imageSrc)} alt="Crop preview" class="canvas-image svelte-pjowa5"${attr_style(`filter: ${stringify(editFilters)};`)} draggable="false"/></div> `);
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
      editFilters
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
    $$renderer2.push(`<div class="toggle-group svelte-1gdqxne"><!--[-->`);
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
    bind_props($$props, { options, value, onChange, showLabels });
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
    bind_props($$props, { label, min, max, value, step, showValue, onChange });
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
function Button($$renderer, $$props) {
  let variant = fallback($$props["variant"], "secondary");
  let disabled = fallback($$props["disabled"], false);
  let icon = fallback($$props["icon"], null);
  let fullWidth = fallback($$props["fullWidth"], false);
  $$renderer.push(`<button${attr_class(`btn btn-${stringify(variant)}`, "svelte-1xko78n", { "full-width": fullWidth })}${attr("disabled", disabled, true)}>`);
  if (icon) {
    $$renderer.push("<!--[-->");
    $$renderer.push(`<img${attr("src", `/icons/${stringify(icon)}.svg`)} alt="" class="btn-icon svelte-1xko78n"/>`);
  } else {
    $$renderer.push("<!--[!-->");
  }
  $$renderer.push(`<!--]--> <!--[-->`);
  slot($$renderer, $$props, "default", {});
  $$renderer.push(`<!--]--></button>`);
  bind_props($$props, { variant, disabled, icon, fullWidth });
}
function EditControls($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let brightness = fallback($$props["brightness"], 0);
    let shadows = fallback($$props["shadows"], 0);
    let contrast = fallback($$props["contrast"], 0);
    let hdr = fallback($$props["hdr"], 0);
    let blurBrushSize = fallback($$props["blurBrushSize"], 50);
    let zoomLevel = fallback($$props["zoomLevel"], 1);
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
    let onZoomChange = fallback($$props["onZoomChange"], (level) => {
    });
    let onNudge = fallback($$props["onNudge"], (direction) => {
    });
    let onResetZoom = fallback($$props["onResetZoom"], () => {
    });
    $$renderer2.push(`<div class="edit-controls svelte-1e1k0ax"><div class="section svelte-1e1k0ax">`);
    Slider($$renderer2, {
      label: "Brightness",
      min: -100,
      max: 100,
      value: brightness,
      showValue: true,
      onChange: onBrightnessChange
    });
    $$renderer2.push(`<!----></div> <div class="section svelte-1e1k0ax">`);
    Slider($$renderer2, {
      label: "Shadows",
      min: -100,
      max: 100,
      value: shadows,
      showValue: true,
      onChange: onShadowsChange
    });
    $$renderer2.push(`<!----></div> <div class="section svelte-1e1k0ax">`);
    Slider($$renderer2, {
      label: "Contrast",
      min: -100,
      max: 100,
      value: contrast,
      showValue: true,
      onChange: onContrastChange
    });
    $$renderer2.push(`<!----></div> <div class="section svelte-1e1k0ax">`);
    Slider($$renderer2, {
      label: "HDR",
      min: 0,
      max: 100,
      value: hdr,
      showValue: true,
      onChange: onHdrChange
    });
    $$renderer2.push(`<!----></div> <div class="section svelte-1e1k0ax"><h3 class="section-header svelte-1e1k0ax">Blur Brush</h3> `);
    Slider($$renderer2, {
      label: "Size",
      min: 10,
      max: 100,
      value: blurBrushSize,
      showValue: true,
      onChange: onBlurBrushSizeChange
    });
    $$renderer2.push(`<!----></div> <div class="section svelte-1e1k0ax"><h3 class="section-header svelte-1e1k0ax">Zoom</h3> `);
    Slider($$renderer2, {
      label: "Zoom In",
      min: 1,
      max: 3,
      step: 0.1,
      value: zoomLevel,
      showValue: true,
      onChange: onZoomChange
    });
    $$renderer2.push(`<!----> <div class="nudge-row svelte-1e1k0ax"><button class="nudge-btn svelte-1e1k0ax" aria-label="Nudge up"><img src="/icons/icon-nudge-up.svg" alt="" class="svelte-1e1k0ax"/></button> <button class="nudge-btn svelte-1e1k0ax" aria-label="Nudge down"><img src="/icons/icon-nudge-down.svg" alt="" class="svelte-1e1k0ax"/></button> <button class="nudge-btn svelte-1e1k0ax" aria-label="Nudge left"><img src="/icons/icon-nudge-left.svg" alt="" class="svelte-1e1k0ax"/></button> <button class="nudge-btn svelte-1e1k0ax" aria-label="Nudge right"><img src="/icons/icon-nudge-right.svg" alt="" class="svelte-1e1k0ax"/></button></div> `);
    Button($$renderer2, {
      variant: "secondary",
      fullWidth: true,
      children: ($$renderer3) => {
        $$renderer3.push(`<!---->Reset`);
      },
      $$slots: { default: true }
    });
    $$renderer2.push(`<!----></div></div>`);
    bind_props($$props, {
      brightness,
      shadows,
      contrast,
      hdr,
      blurBrushSize,
      zoomLevel,
      onBrightnessChange,
      onShadowsChange,
      onContrastChange,
      onHdrChange,
      onBlurBrushSizeChange,
      onZoomChange,
      onNudge,
      onResetZoom
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
  let showStrengthSlider;
  let imageUrl = fallback($$props["imageUrl"], "");
  let activeFilter = fallback($$props["activeFilter"], "original");
  let filterStrength = fallback($$props["filterStrength"], 50);
  let onFilterChange = fallback($$props["onFilterChange"], (filterId) => {
  });
  let onStrengthChange = fallback($$props["onStrengthChange"], (value) => {
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
  showStrengthSlider = activeFilter !== "original";
  $$renderer.push(`<div class="filter-controls svelte-1274k9v">`);
  FilterGrid($$renderer, {
    filters,
    value: activeFilter,
    imageUrl,
    onChange: onFilterChange
  });
  $$renderer.push(`<!----> `);
  if (showStrengthSlider) {
    $$renderer.push("<!--[-->");
    $$renderer.push(`<div class="strength-slider svelte-1274k9v">`);
    Slider($$renderer, {
      label: "Strength",
      min: 0,
      max: 100,
      value: filterStrength,
      onChange: onStrengthChange
    });
    $$renderer.push(`<!----></div>`);
  } else {
    $$renderer.push("<!--[!-->");
  }
  $$renderer.push(`<!--]--></div>`);
  bind_props($$props, {
    imageUrl,
    activeFilter,
    filterStrength,
    onFilterChange,
    onStrengthChange
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
  const { subscribe, set, update } = writable(initialState);
  return {
    subscribe,
    set: (value) => {
      history.splice(currentIndex + 1);
      history.push(value);
      currentIndex = history.length - 1;
      set(value);
    },
    update: (fn) => {
      update((currentValue) => {
        const newValue = fn(currentValue);
        history.splice(currentIndex + 1);
        history.push(newValue);
        currentIndex = history.length - 1;
        return newValue;
      });
    },
    silentUpdate: (fn) => {
      update(fn);
    },
    setBaseState: () => {
      baseIndex = currentIndex;
    },
    undo: () => {
      if (currentIndex > baseIndex) {
        currentIndex--;
        set(history[currentIndex]);
      }
    },
    redo: () => {
      if (currentIndex < history.length - 1) {
        currentIndex++;
        set(history[currentIndex]);
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
  blurBrushSize: 20,
  activeFilter: "original",
  filterStrength: 50,
  cropBox: { x: 0, y: 0, width: 0, height: 0 },
  isCropping: false,
  cropPending: false,
  imageWidth: 0,
  imageHeight: 0,
  blurMask: null,
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
    async function handleCopy() {
      if (store_get($$store_subs ??= {}, "$cropState", cropState).cropPending) {
        pendingAction = async () => {
          await copyImageToClipboard(store_get($$store_subs ??= {}, "$cropState", cropState).currentImage);
        };
        modalType = "save";
        return;
      }
      if (store_get($$store_subs ??= {}, "$cropState", cropState).currentImage) {
        await copyImageToClipboard(store_get($$store_subs ??= {}, "$cropState", cropState).currentImage);
      }
    }
    function handleExport() {
      if (store_get($$store_subs ??= {}, "$cropState", cropState).cropPending) {
        pendingAction = () => {
          downloadImage(store_get($$store_subs ??= {}, "$cropState", cropState).currentImage, "picflam-crop.png");
        };
        modalType = "save";
        return;
      }
      if (store_get($$store_subs ??= {}, "$cropState", cropState).currentImage) {
        downloadImage(store_get($$store_subs ??= {}, "$cropState", cropState).currentImage, "picflam-crop.png");
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
    function handleBrightnessChange(val) {
      cropState.silentUpdate((state) => ({ ...state, brightness: val }));
    }
    function handleShadowsChange(val) {
      cropState.silentUpdate((state) => ({ ...state, shadows: val }));
    }
    function handleContrastChange(val) {
      cropState.silentUpdate((state) => ({ ...state, contrast: val }));
    }
    function handleHdrChange(val) {
      cropState.silentUpdate((state) => ({ ...state, hdr: val }));
    }
    function handleBlurBrushSizeChange(size) {
      cropState.silentUpdate((state) => ({ ...state, blurBrushSize: size }));
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
      cropState.silentUpdate((state) => ({ ...state, filterStrength: value }));
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
      if (store_get($$store_subs ??= {}, "$cropState", cropState).activeFilter !== "original") {
        const filterDef = FILTER_DEFINITIONS.find((f) => f.id === store_get($$store_subs ??= {}, "$cropState", cropState).activeFilter);
        if (filterDef && filterDef.css !== "none") {
          filters.push(filterDef.css);
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
        canUndo: cropState.canUndo(),
        canRedo: cropState.canRedo(),
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
        editFilters: editFilterCss
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
            blurBrushSize: store_get($$store_subs ??= {}, "$cropState", cropState).blurBrushSize,
            zoomLevel: store_get($$store_subs ??= {}, "$cropState", cropState).zoomLevel,
            onBrightnessChange: handleBrightnessChange,
            onShadowsChange: handleShadowsChange,
            onContrastChange: handleContrastChange,
            onHdrChange: handleHdrChange,
            onBlurBrushSizeChange: handleBlurBrushSizeChange,
            onZoomChange: handleZoomChange,
            onNudge: handleNudge,
            onResetZoom: handleResetZoom
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
              onStrengthChange: handleStrengthChange
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
function AiTab($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    const subMenuTabs = [
      { id: "enhance", label: "Enhance" },
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
        title: "Enhance, upscale and remove backgrounds using AI power",
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
      $$renderer2.push(`<!----> <div class="image-container svelte-17agwu4"><img${attr("src", store_get($$store_subs ??= {}, "$aiState", aiState).currentImage)} alt="Working image" class="working-image svelte-17agwu4"/></div> `);
      SubMenuTabs($$renderer2, {
        tabs: subMenuTabs,
        activeTab: store_get($$store_subs ??= {}, "$activeAiMenu", activeAiMenu),
        onTabChange: handleSubMenuChange
      });
      $$renderer2.push(`<!----> `);
      if (store_get($$store_subs ??= {}, "$activeAiMenu", activeAiMenu) === "enhance") {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div class="controls-panel svelte-17agwu4"><button class="ai-action-btn svelte-17agwu4"><img src="/icons/icon-ai.svg" alt="" class="ai-icon svelte-17agwu4"/> Enhance image</button> <p class="ai-hint svelte-17agwu4">Sharpens and enhances images at the same size</p></div>`);
      } else {
        $$renderer2.push("<!--[!-->");
        if (store_get($$store_subs ??= {}, "$activeAiMenu", activeAiMenu) === "upscale") {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<div class="controls-panel svelte-17agwu4"><p class="placeholder svelte-17agwu4">Upscale controls coming in Phase 4</p></div>`);
        } else {
          $$renderer2.push("<!--[!-->");
          if (store_get($$store_subs ??= {}, "$activeAiMenu", activeAiMenu) === "background") {
            $$renderer2.push("<!--[-->");
            $$renderer2.push(`<div class="controls-panel svelte-17agwu4"><p class="placeholder svelte-17agwu4">Background removal coming in Phase 4</p></div>`);
          } else {
            $$renderer2.push("<!--[!-->");
          }
          $$renderer2.push(`<!--]-->`);
        }
        $$renderer2.push(`<!--]-->`);
      }
      $$renderer2.push(`<!--]-->`);
    }
    $$renderer2.push(`<!--]--></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
const initialSlideState = {
  canvasSize: "1/1",
  background: { type: "solid", value: "#FFFFFF" },
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
  overlayScale: 1,
  overlayOpacity: 1,
  overlayX: 0,
  overlayY: 0,
  overlayMask: "none",
  overlayWrap: false,
  overlayBorderWidth: 0,
  overlayBorderColor: "#FFFFFF"
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
function DesignTab($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
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
      $$renderer2.push(`<!----> <div class="canvas-container svelte-fxk5n4"><div class="design-canvas svelte-fxk5n4"${attr_style(` aspect-ratio: ${stringify(store_get($$store_subs ??= {}, "$slideState", slideState).canvasSize)}; background: ${stringify(store_get($$store_subs ??= {}, "$slideState", slideState).background.type === "solid" ? store_get($$store_subs ??= {}, "$slideState", slideState).background.value : store_get($$store_subs ??= {}, "$slideState", slideState).background.value)}; `)}></div></div> `);
      SubMenuTabs($$renderer2, {
        tabs: subMenuTabs,
        activeTab: store_get($$store_subs ??= {}, "$activeDesignMenu", activeDesignMenu),
        onTabChange: handleSubMenuChange
      });
      $$renderer2.push(`<!----> <div class="controls-panel svelte-fxk5n4">`);
      if (store_get($$store_subs ??= {}, "$activeDesignMenu", activeDesignMenu) === "size") {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<p class="placeholder svelte-fxk5n4">Size controls coming in Phase 5</p>`);
      } else {
        $$renderer2.push("<!--[!-->");
        if (store_get($$store_subs ??= {}, "$activeDesignMenu", activeDesignMenu) === "background") {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<p class="placeholder svelte-fxk5n4">Background controls coming in Phase 5</p>`);
        } else {
          $$renderer2.push("<!--[!-->");
          if (store_get($$store_subs ??= {}, "$activeDesignMenu", activeDesignMenu) === "text1") {
            $$renderer2.push("<!--[-->");
            $$renderer2.push(`<p class="placeholder svelte-fxk5n4">Text 1 controls coming in Phase 5</p>`);
          } else {
            $$renderer2.push("<!--[!-->");
            if (store_get($$store_subs ??= {}, "$activeDesignMenu", activeDesignMenu) === "text2") {
              $$renderer2.push("<!--[-->");
              $$renderer2.push(`<p class="placeholder svelte-fxk5n4">Text 2 controls coming in Phase 5</p>`);
            } else {
              $$renderer2.push("<!--[!-->");
              if (store_get($$store_subs ??= {}, "$activeDesignMenu", activeDesignMenu) === "quote") {
                $$renderer2.push("<!--[-->");
                $$renderer2.push(`<p class="placeholder svelte-fxk5n4">Quote controls coming in Phase 5</p>`);
              } else {
                $$renderer2.push("<!--[!-->");
                if (store_get($$store_subs ??= {}, "$activeDesignMenu", activeDesignMenu) === "overlay") {
                  $$renderer2.push("<!--[-->");
                  $$renderer2.push(`<p class="placeholder svelte-fxk5n4">Overlay controls coming in Phase 5</p>`);
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
