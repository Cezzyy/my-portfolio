<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted, watch } from "vue";
import {
  fadeInUp,
  fadeInLeft,
  fadeInRight,
} from "../../../lib/gsap/scrollAnimations";

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

// Computed property for checking if all elements are available
const allElementsAvailable = computed(() => {
  return !!(
    elements.title &&
    elements.underline &&
    elements.subtitle &&
    elements.projectCards.length > 0
  );
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

  if (allElementsAvailable.value) {
    animationState.elementsReady = true;
    initAnimations();
  } else {
    if (animationState.retryCount < animationState.maxRetries) {
      animationState.retryCount++;
      setTimeout(populateElements, 100);
    }
  }
};

// Initialize animations using reactive elements
const initAnimations = () => {
  if (!animationState.elementsReady || !allElementsAvailable.value) {
    return;
  }

  animationState.isAnimating = true;

  // Animate section header elements
  fadeInUp(".projects-title");
  fadeInUp(".projects-underline", { start: "top 75%" });
  fadeInUp(".projects-subtitle", { start: "top 75%" });

  // Animate individual project cards with alternating directions
  fadeInLeft(".project-card-0", { start: "top 85%" });
  fadeInRight(".project-card-1", { start: "top 85%" });
  fadeInLeft(".project-card-2", { start: "top 85%" });
};

// Watch for elements ready state
watch(
  () => animationState.elementsReady,
  (isReady) => {
    if (isReady) {
      // Elements are ready
    }
  },
);

// Watch all elements availability
watch(allElementsAvailable, (available) => {
  if (available) {
    // All elements are available
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
  <div ref="root" class="projects-section-wrapper">
    <slot />
  </div>
</template>

<style scoped>
.projects-section-wrapper {
  display: contents;
}
</style>
