<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from "vue";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Reactive DOM references
const root = ref<HTMLElement | null>(null);
const contactSection = ref<HTMLElement | null>(null);

// Reactive animation state
const animationState = reactive({
  isAnimating: false,
  scrollTriggerInstance: null as ScrollTrigger | null,
  elementsReady: false,
  retryCount: 0,
  maxRetries: 10,
});

// Reactive DOM element references
const elements = reactive({
  title: null as Element | null,
  underline: null as Element | null,
  subtitle: null as Element | null,
  formCard: null as Element | null,
  infoSide: null as Element | null,
  infoItems: [] as Element[],
  socialLinks: [] as Element[],
  floatingShapes: [] as Element[],
});

// Populate reactive element references from DOM
const populateElements = () => {
  const section = document.querySelector("section#contact");
  if (!section) {
    if (animationState.retryCount < animationState.maxRetries) {
      animationState.retryCount++;
      setTimeout(populateElements, 100);
    }
    return;
  }

  contactSection.value = section as HTMLElement;

  // Populate all reactive element references
  elements.title = section.querySelector(".contact-title");
  elements.underline = section.querySelector(".contact-underline");
  elements.subtitle = section.querySelector(".contact-subtitle");
  elements.formCard = section.querySelector(".contact-form-card");
  elements.infoSide = section.querySelector(".contact-info-side");
  elements.infoItems = Array.from(section.querySelectorAll(".contact-info-item"));
  elements.socialLinks = Array.from(section.querySelectorAll(".contact-social-link"));
  elements.floatingShapes = Array.from(section.querySelectorAll(".contact-shape"));

  if (elements.title && elements.underline) {
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
const animateContactElements = () => {
  if (elements.title) {
    gsap.fromTo(
      elements.title,
      { opacity: 0, y: 30, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "back.out(1.2)" }
    );
  }

  if (elements.underline) {
    gsap.fromTo(
      elements.underline,
      { opacity: 0, scaleX: 0 },
      { opacity: 1, scaleX: 1, duration: 0.8, delay: 0.2, ease: "power2.out" }
    );
  }

  if (elements.subtitle) {
    gsap.fromTo(
      elements.subtitle,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, delay: 0.3, ease: "power2.out" }
    );
  }

  // Animate info side
  if (elements.infoSide) {
    gsap.fromTo(
      elements.infoSide,
      { opacity: 0, x: -40 },
      {
        opacity: 1,
        x: 0,
        duration: 0.8,
        delay: 0.4,
        ease: "power2.out",
      }
    );
  }

  // Animate info items with stagger
  elements.infoItems.forEach((item, index) => {
    gsap.fromTo(
      item,
      { opacity: 0, x: -20 },
      {
        opacity: 1,
        x: 0,
        duration: 0.6,
        delay: 0.5 + index * 0.1,
        ease: "power2.out",
      }
    );
  });

  // Animate form card
  if (elements.formCard) {
    gsap.fromTo(
      elements.formCard,
      { opacity: 0, y: 60, scale: 0.9 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.9,
        delay: 0.6,
        ease: "back.out(1.2)",
      }
    );
  }

  // Animate social links
  elements.socialLinks.forEach((link, index) => {
    gsap.fromTo(
      link,
      { opacity: 0, scale: 0.5, y: 10 },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.5,
        delay: 1.0 + index * 0.1,
        ease: "elastic.out(1, 0.5)",
      }
    );
  });
};

// Initialize animations
const initAnimations = () => {
  if (!animationState.elementsReady || !contactSection.value) return;

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: contactSection.value,
      start: "top 70%",
      end: "bottom 30%",
      toggleActions: "play none none reverse",
      onEnter: () => {
        animationState.isAnimating = true;
        animateContactElements();
      },
      onLeave: () => {
        animationState.isAnimating = false;
      },
      onEnterBack: () => {
        animationState.isAnimating = true;
        animateContactElements();
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
        trigger: contactSection.value,
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

  if (tl.scrollTrigger) {
    animationState.scrollTriggerInstance = tl.scrollTrigger;
  }
};

onMounted(() => {
  setTimeout(populateElements, 200);
});

onUnmounted(() => {
  if (animationState.scrollTriggerInstance) {
    animationState.scrollTriggerInstance.kill();
  }

  ScrollTrigger.getAll().forEach((st) => st.kill());

  animationState.isAnimating = false;
  animationState.elementsReady = false;
  animationState.retryCount = 0;
});
</script>

<template>
  <div ref="root" class="contact-section-wrapper">
    <slot />
  </div>
</template>

<style scoped>
.contact-section-wrapper {
  display: contents;
}
</style>
