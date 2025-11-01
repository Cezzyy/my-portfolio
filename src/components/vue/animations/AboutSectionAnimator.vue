<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted, watch } from 'vue';
import { fadeInUp, fadeInLeft, fadeInRight } from '../../../lib/gsap/scrollAnimations';

// Reactive DOM references
const root = ref<HTMLElement | null>(null);
const aboutSection = ref<HTMLElement | null>(null);

// Reactive animation state
const animationState = reactive({
  isAnimating: false,
  elementsReady: false,
  retryCount: 0,
  maxRetries: 10
});

// Reactive DOM element references
const elements = reactive({
  title: null as Element | null,
  underline: null as Element | null,
  content: null as Element | null,
  profileImage: null as Element | null
});

// Computed property for checking if all elements are available
const allElementsAvailable = computed(() => {
  return !!(elements.title && elements.underline && elements.content && elements.profileImage);
});

// Populate reactive element references from DOM
const populateElements = () => {
  const section = document.querySelector('section#about');
  if (!section) {
    if (animationState.retryCount < animationState.maxRetries) {
      animationState.retryCount++;
      console.warn(`[AboutSectionAnimator] About section not found, retry ${animationState.retryCount}/${animationState.maxRetries}`);
      setTimeout(populateElements, 100);
    } else {
      console.error('[AboutSectionAnimator] About section not found after max retries');
    }
    return;
  }

  aboutSection.value = section as HTMLElement;

  // Populate all reactive element references
  elements.title = section.querySelector('.about-title');
  elements.underline = section.querySelector('.about-underline');
  elements.content = section.querySelector('.about-content');
  elements.profileImage = section.querySelector('.profile-image');

  if (allElementsAvailable.value) {
    animationState.elementsReady = true;
    initAnimations();
  } else {
    if (animationState.retryCount < animationState.maxRetries) {
      animationState.retryCount++;
      console.warn(`[AboutSectionAnimator] Elements not ready, retry ${animationState.retryCount}/${animationState.maxRetries}`);
      setTimeout(populateElements, 100);
    } else {
      console.error('[AboutSectionAnimator] Elements not ready after max retries');
    }
  }
};

// Initialize animations using reactive elements
const initAnimations = () => {
  if (!animationState.elementsReady || !allElementsAvailable.value) {
    console.warn('[AboutSectionAnimator] Cannot init animations, elements not ready');
    return;
  }

  animationState.isAnimating = true;

  // Use GSAP animations with reactive elements
  fadeInUp('.about-title');
  fadeInUp('.about-underline', { start: 'top 75%' });
  fadeInLeft('.about-content');
  fadeInRight('.profile-image');

  console.log('[AboutSectionAnimator] Animations initialized successfully');
};

// Watch for elements ready state
watch(() => animationState.elementsReady, (isReady) => {
  if (isReady) {
    console.log('[AboutSectionAnimator] All elements populated and ready for animations');
  }
});

// Watch all elements availability
watch(allElementsAvailable, (available) => {
  if (available) {
    console.log('[AboutSectionAnimator] All required elements are now available');
  }
});

onMounted(() => {
  setTimeout(populateElements, 150);
});

onUnmounted(() => {
  // Reset reactive state on cleanup
  animationState.isAnimating = false;
  animationState.elementsReady = false;
  animationState.retryCount = 0;
});
</script>

<template>
  <div ref="root" class="about-section-wrapper">
    <slot />
  </div>
</template>

<style scoped>
.about-section-wrapper {
  display: contents;
}
</style>
