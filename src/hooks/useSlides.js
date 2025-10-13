import { useState, useCallback } from 'react';

const createDefaultSlide = () => ({
  id: Date.now() + Math.random(), // Unique ID for dnd-kit
  canvasSize: '9/16',
  background: { type: 'gradient', value: 'linear-gradient(135deg, #8A2BE2 0%, #4B0082 100%)' },
  imageLayer: null,
  logoImage: null,
  text1: '',
  text1Size: 4.5,
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
  text2Size: 1.5,
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
  const [slides, setSlides] = useState([createDefaultSlide()]);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  const updateActiveSlide = useCallback((updates) => {
    setSlides(currentSlides =>
      currentSlides.map((slide, index) =>
        index === activeSlideIndex ? { ...slide, ...updates } : slide
      )
    );
  }, [activeSlideIndex]);

  const addSlide = useCallback((index) => {
    const baseAspect = slides[0]?.canvasSize || '9/16';
    const newSlide = { ...createDefaultSlide(), canvasSize: baseAspect };
    setSlides(currentSlides => {
      const newSlides = [...currentSlides];
      newSlides.splice(index + 1, 0, newSlide);
      return newSlides;
    });
    setActiveSlideIndex(index + 1);
  }, [slides]);

  const duplicateSlide = useCallback((index) => {
    const slideToDuplicate = slides[index];
    const newSlide = { ...slideToDuplicate, id: Date.now() + Math.random() };
    setSlides(currentSlides => {
      const newSlides = [...currentSlides];
      newSlides.splice(index + 1, 0, newSlide);
      return newSlides;
    });
    setActiveSlideIndex(index + 1);
  }, [slides]);

  const deleteSlide = useCallback((index) => {
    if (slides.length <= 1) return;
    setSlides(currentSlides => currentSlides.filter((_, i) => i !== index));
    setActiveSlideIndex(Math.max(0, index - 1));
  }, [slides.length]);

  const reorderSlides = useCallback((oldIndex, newIndex) => {
    setSlides(currentSlides => {
      const newSlides = [...currentSlides];
      const [removed] = newSlides.splice(oldIndex, 1);
      newSlides.splice(newIndex, 0, removed);
      return newSlides;
    });
  }, []);

  const resetSlides = useCallback(() => {
    setSlides([createDefaultSlide()]);
    setActiveSlideIndex(0);
  }, []);

  return {
    slides,
    activeSlideIndex,
    activeSlide: slides[activeSlideIndex],
    setActiveSlideIndex,
    updateActiveSlide,
    addSlide,
    duplicateSlide,
    deleteSlide,
    reorderSlides,
    resetSlides,
  };
};
