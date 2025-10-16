import { useState, useCallback } from 'react';

const createDefaultSlide = () => ({
  canvasSize: '9/16',
  background: { type: 'gradient', value: 'linear-gradient(135deg, #8A2BE2 0%, #4B0082 100%)' },
  imageLayer: null,
  logoImage: null,
  text1: '',
  text1Size: 5,
  text1YPosition: 5,
  text1Font: 'Inter',
  text1Color: '#FFFFFF',
  text1HighlightColor: '#FFD700',
  text1IsBold: true,
  text1IsItalic: false,
  text1Align: 'center',
  text1LineSpacing: 5,
  text1HasShadow: false,
  text1HasOutline: false,
  text1QuoteStyle: 'none',
  text1QuoteSize: 5, // Centered default quote size
  text2: '',
  text2Size: 2.5,
  text2YPosition: 8.5,
  text2Font: 'Inter',
  text2Color: '#FFFFFF',
  text2IsBold: false,
  text2IsItalic: false,
  text2Align: 'center',
  text2LineSpacing: 5,
  text2LabelColor: 'transparent',
  text2LabelTransparency: 5,
});

export const useSlides = () => {
  const [slide, setSlide] = useState(createDefaultSlide());

  const updateSlide = useCallback((updates) => {
    setSlide(currentSlide => ({ ...currentSlide, ...updates }));
  }, []);

  const resetSlide = useCallback(() => {
    setSlide(createDefaultSlide());
  }, []);

  return {
    slide,
    updateSlide,
    resetSlide,
  };
};
