<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

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

// Populate reactive element references from DOM
const populateElements = () => {
  const section = document.querySelector('section#about');
  if (!section) {
    if (animationState.retryCount < animationState.maxRetries) {
      animationState.retryCount++;
      setTimeout(populateElements, 100);
    }
    return;
  }

  aboutSection.value = section as HTMLElement;

  // Populate all reactive element references
  elements.title = section.querySelector('.about-title');
  elements.underline = section.querySelector('.about-underline');
  elements.content = section.querySelector('.about-content');
  elements.profileImage = section.querySelector('.profile-image');

  if (elements.title && elements.underline && elements.content && elements.profileImage) {
    animationState.elementsReady = true;
    initAnimations();
  } else {
    if (animationState.retryCount < animationState.maxRetries) {
      animationState.retryCount++;
      setTimeout(populateElements, 100);
    }
  }
};

// Animation function
const animateAboutElements = () => {
  gsap.fromTo('.about-title', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' });
  gsap.fromTo('.about-underline', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out', delay: 0.2 });
  gsap.fromTo('.about-content', { opacity: 0, x: -100 }, { opacity: 1, x: 0, duration: 1, ease: 'power3.out', delay: 0.3 });
  gsap.fromTo('.profile-image', { opacity: 0, x: 100 }, { opacity: 1, x: 0, duration: 1, ease: 'power3.out', delay: 0.3 });
};

// Initialize animations using reactive elements
const initAnimations = () => {
  if (!animationState.elementsReady || !aboutSection.value) {
    return;
  }

  // Create GSAP timeline with ScrollTrigger
  gsap.timeline({
    scrollTrigger: {
      trigger: aboutSection.value,
      start: 'top 80%',
      end: 'bottom 20%',
      toggleActions: 'play none none reverse',
      onEnter: () => {
        animationState.isAnimating = true;
        animateAboutElements();
      },
      onEnterBack: () => {
        animationState.isAnimating = true;
        animateAboutElements();
      },
      onLeave: () => {
        animationState.isAnimating = false;
      },
    }
  });
};

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
