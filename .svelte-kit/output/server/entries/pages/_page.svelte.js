import { a as attr_class, b as bind_props, c as attr, e as ensure_array_like, d as store_get, u as unsubscribe_stores, f as attr_style, g as stringify } from "../../chunks/index2.js";
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
function createHistoryStore$1(initialState) {
  const history = [initialState];
  let currentIndex = 0;
  const { subscribe, set, update } = writable(initialState);
  return {
    subscribe,
    set: (value) => {
      history.splice(currentIndex + 1);
      history.push(value);
      currentIndex = history.length - 1;
      set(value);
    },
    undo: () => {
      if (currentIndex > 0) {
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
    canUndo: () => currentIndex > 0,
    canRedo: () => currentIndex < history.length - 1,
    reset: () => {
      history.length = 0;
      history.push(initialState);
      currentIndex = 0;
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
  filterStrength: 50
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
    const subMenuTabs = [
      { id: "crop", label: "Crop" },
      { id: "edit", label: "Edit" },
      { id: "filter", label: "Filter" }
    ];
    function handleImageImport(dataUrl) {
      cropState.set({
        ...store_get($$store_subs ??= {}, "$cropState", cropState),
        originalImage: dataUrl,
        currentImage: dataUrl
      });
    }
    function handleSubMenuChange(tab) {
      activeSubMenu.set(store_get($$store_subs ??= {}, "$activeSubMenu", activeSubMenu) === tab ? "none" : tab);
    }
    async function handleCopy() {
      if (store_get($$store_subs ??= {}, "$cropState", cropState).currentImage) {
        await copyImageToClipboard(store_get($$store_subs ??= {}, "$cropState", cropState).currentImage);
      }
    }
    function handleExport() {
      if (store_get($$store_subs ??= {}, "$cropState", cropState).currentImage) {
        downloadImage(store_get($$store_subs ??= {}, "$cropState", cropState).currentImage, "picflam-crop.png");
      }
    }
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
        onUndo: () => cropState.undo(),
        onRedo: () => cropState.redo(),
        onStartAgain: resetCropState,
        onCopy: handleCopy,
        onExport: handleExport
      });
      $$renderer2.push(`<!----> <div class="image-container svelte-c9tnuw"><img${attr("src", store_get($$store_subs ??= {}, "$cropState", cropState).currentImage)} alt="Working image" class="working-image svelte-c9tnuw"/></div> `);
      SubMenuTabs($$renderer2, {
        tabs: subMenuTabs,
        activeTab: store_get($$store_subs ??= {}, "$activeSubMenu", activeSubMenu),
        onTabChange: handleSubMenuChange
      });
      $$renderer2.push(`<!----> `);
      if (store_get($$store_subs ??= {}, "$activeSubMenu", activeSubMenu) === "crop") {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div class="controls-panel svelte-c9tnuw"><p class="placeholder svelte-c9tnuw">Crop controls coming in Phase 3</p></div>`);
      } else {
        $$renderer2.push("<!--[!-->");
        if (store_get($$store_subs ??= {}, "$activeSubMenu", activeSubMenu) === "edit") {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<div class="controls-panel svelte-c9tnuw"><p class="placeholder svelte-c9tnuw">Edit controls coming in Phase 3</p></div>`);
        } else {
          $$renderer2.push("<!--[!-->");
          if (store_get($$store_subs ??= {}, "$activeSubMenu", activeSubMenu) === "filter") {
            $$renderer2.push("<!--[-->");
            $$renderer2.push(`<div class="controls-panel svelte-c9tnuw"><p class="placeholder svelte-c9tnuw">Filter controls coming in Phase 3</p></div>`);
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
    function handleTabChange(tab) {
      activeTab.set(tab);
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
    $$renderer2.push(`<!--]--></main>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
export {
  _page as default
};
