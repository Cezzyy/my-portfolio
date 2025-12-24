<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from "vue";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Reactive DOM references
const root = ref<HTMLElement | null>(null);
const projectsSection = ref<HTMLElement | null>(null);

// Reactive animation state
const animationState = reactive({
  isAnimating: false,
  elementsReady: false,
  retryCount: 0,
  maxRetries: 10,
});

// Reactive DOM element references
const elements = reactive({
  title: null as Element | null,
  underline: null as Element | null,
  subtitle: null as Element | null,
  projectCards: [] as Element[],
});

// Populate reactive element references from DOM
const populateElements = () => {
  const section = document.querySelector("section#projects");
  if (!section) {
    if (animationState.retryCount < animationState.maxRetries) {
      animationState.retryCount++;
      setTimeout(populateElements, 100);
    }
    return;
  }

  projectsSection.value = section as HTMLElement;

  // Populate all reactive element references
  elements.title = section.querySelector(".projects-title");
  elements.underline = section.querySelector(".projects-underline");
  elements.subtitle = section.querySelector(".projects-subtitle");
  elements.projectCards = Array.from(section.querySelectorAll(".project-card"));

  if (elements.title && elements.underline && elements.subtitle && elements.projectCards.length > 0) {
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
const animateProjectElements = () => {
  gsap.fromTo('.projects-title', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' });
  gsap.fromTo('.projects-underline', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out', delay: 0.2 });
  gsap.fromTo('.projects-subtitle', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out', delay: 0.3 });
  gsap.fromTo('.project-card-0', { opacity: 0, x: -100 }, { opacity: 1, x: 0, duration: 1, ease: 'power3.out', delay: 0.4 });
  gsap.fromTo('.project-card-1', { opacity: 0, x: 100 }, { opacity: 1, x: 0, duration: 1, ease: 'power3.out', delay: 0.5 });
  gsap.fromTo('.project-card-2', { opacity: 0, x: -100 }, { opacity: 1, x: 0, duration: 1, ease: 'power3.out', delay: 0.6 });
};

// Initialize animations using reactive elements
const initAnimations = () => {
  if (!animationState.elementsReady || !projectsSection.value) {
    return;
  }

  // Create GSAP timeline with ScrollTrigger
  gsap.timeline({
    scrollTrigger: {
      trigger: projectsSection.value,
      start: 'top 80%',
      end: 'bottom 20%',
      toggleActions: 'play none none reverse',
      onEnter: () => {
        animationState.isAnimating = true;
        animateProjectElements();
      },
      onEnterBack: () => {
        animationState.isAnimating = true;
        animateProjectElements();
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
  <div ref="root" class="projects-section-wrapper">
    <slot />
  </div>
</template>

<style scoped>
.projects-section-wrapper {
  display: contents;
}
</style>
