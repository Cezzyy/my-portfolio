<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from "vue";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Reactive DOM references
const root = ref<HTMLElement | null>(null);
const skillsSection = ref<HTMLElement | null>(null);

// Reactive animation state
const animationState = reactive({
  isAnimating: false,
  scrollTriggerInstance: null as ScrollTrigger | null,
  elementsReady: false,
});

// Reactive DOM element references
const elements = reactive({
  skillsTitle: null as Element | null,
  skillsSubtitle: null as Element | null,
  skillCategories: [] as Element[],
  skillBadges: [] as Element[],
  currentFocus: null as Element | null,
  focusItems: [] as Element[],
  floatingShapes: [] as Element[],
});

// Animate progress bars with staggered effect
const animateProgressBars = () => {
  elements.skillBadges.forEach((badge, index) => {
    gsap.fromTo(
      badge,
      { opacity: 0, scale: 0.6, y: 10 },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.5,
        delay: index * 0.08,
        ease: "back.out(2)",
      }
    );
  });
};

// Populate reactive element references from DOM
const populateElements = () => {
  const section = document.querySelector("section#skills");
  if (!section) {
    setTimeout(populateElements, 100);
    return;
  }

  skillsSection.value = section as HTMLElement;

  // Populate all reactive element references
  elements.skillsTitle = section.querySelector(".skills-title");
  elements.skillsSubtitle = section.querySelector(".skills-subtitle");
  elements.skillCategories = Array.from(section.querySelectorAll(".skill-category"));
  elements.skillBadges = Array.from(section.querySelectorAll(".skill-badge"));
  elements.currentFocus = section.querySelector(".current-focus");
  elements.focusItems = Array.from(section.querySelectorAll(".focus-item"));
  elements.floatingShapes = Array.from(section.querySelectorAll(".skill-shape"));

  animationState.elementsReady = true;
  initAnimations();
};

const initAnimations = () => {
  if (!animationState.elementsReady || !skillsSection.value) return;

  // Create GSAP timeline with ScrollTrigger
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: skillsSection.value,
      start: "top 70%",
      end: "bottom 30%",
      toggleActions: "play none none reverse",
      onEnter: () => {
        animationState.isAnimating = true;

        // Animate header
        if (elements.skillsTitle) {
          gsap.fromTo(
            elements.skillsTitle,
            { opacity: 0, y: 30, scale: 0.95 },
            { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "back.out(1.2)" }
          );
        }

        if (elements.skillsSubtitle) {
          gsap.fromTo(
            elements.skillsSubtitle,
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.8, delay: 0.15, ease: "power2.out" }
          );
        }

        // Animate skill categories with stagger
        elements.skillCategories.forEach((category, index) => {
          gsap.fromTo(
            category,
            { opacity: 0, y: 60, scale: 0.85, rotationX: 20 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              rotationX: 0,
              duration: 0.9,
              delay: 0.4 + index * 0.25,
              ease: "back.out(1.5)",
            }
          );
        });

        // Animate skill badges with stagger after categories start appearing
        setTimeout(() => {
          animateProgressBars();
        }, 500);

        // Animate current focus section
        if (elements.currentFocus) {
          gsap.fromTo(
            elements.currentFocus,
            { opacity: 0, y: 40, scale: 0.9 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.9,
              delay: 1.8,
              ease: "back.out(1.2)",
            }
          );
        }

        // Animate focus items with enhanced effect
        elements.focusItems.forEach((item, index) => {
          gsap.fromTo(
            item,
            { opacity: 0, scale: 0.5, y: 10 },
            {
              opacity: 1,
              scale: 1,
              y: 0,
              duration: 0.6,
              delay: 2.1 + index * 0.12,
              ease: "elastic.out(1, 0.5)",
            }
          );
        });
      },
      onLeave: () => {
        animationState.isAnimating = false;
      },
      onEnterBack: () => {
        animationState.isAnimating = true;
        
        // Re-animate elements when scrolling back
        const allElements = [
          elements.skillsTitle,
          elements.skillsSubtitle,
          ...elements.skillCategories,
          elements.currentFocus,
        ].filter((el) => el);

        allElements.forEach((element, index) => {
          gsap.fromTo(
            element,
            { opacity: 0, y: 20 },
            {
              opacity: 1,
              y: 0,
              duration: 0.4,
              delay: index * 0.1,
              ease: "power2.out",
            }
          );
        });

        // Re-animate progress bars
        setTimeout(() => {
          animateProgressBars();
        }, 500);
      },
      onLeaveBack: () => {
        animationState.isAnimating = false;
      },
    },
  });

  // Animate floating shapes
  elements.floatingShapes.forEach((shape, index) => {
    gsap.to(shape, {
      scrollTrigger: {
        trigger: skillsSection.value,
        start: "top 80%",
        toggleActions: "play none none reverse",
      },
      opacity: 1,
      scale: 1,
      duration: 2,
      delay: index * 0.3,
      ease: "power2.out",
    });
  });

  // Store the ScrollTrigger instance
  if (tl.scrollTrigger) {
    animationState.scrollTriggerInstance = tl.scrollTrigger;
  }
};

onMounted(() => {
  setTimeout(populateElements, 200);
});

onUnmounted(() => {
  // Clean up
  if (animationState.scrollTriggerInstance) {
    animationState.scrollTriggerInstance.kill();
  }

  ScrollTrigger.getAll().forEach((st) => st.kill());

  // Reset reactive state
  animationState.isAnimating = false;
  animationState.elementsReady = false;
});
</script>

<template>
  <div ref="root" class="skills-section-wrapper">
    <slot />
  </div>
</template>

<style scoped>
.skills-section-wrapper {
  display: contents;
}
</style>