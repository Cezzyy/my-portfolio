<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted, watch } from "vue";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Reactive DOM references
const root = ref<HTMLElement | null>(null);
const heroSection = ref<HTMLElement | null>(null);

// Reactive animation state
const animationState = reactive({
  isAnimating: false,
  isTyping: false,
  typingInterval: null as number | null,
  scrollTriggerInstance: null as ScrollTrigger | null,
  elementsReady: false,
});

// Typing animation reactive state
const typingState = reactive({
  roles: [
    "Computer Science Student",
    "Aspiring Mobile Developer",
    "Flutter Enthusiast",
    "Problem Solver",
  ],
  roleIndex: 0,
  charIndex: 0,
  isDeleting: false,
  currentText: "",
});

// Computed properties
const currentRole = computed(() => typingState.roles[typingState.roleIndex]);
const typeSpeed = computed(() => (typingState.isDeleting ? 50 : 100));

// Reactive DOM element references
const elements = reactive({
  typingText: null as HTMLElement | null,
  typingLines: [] as Element[],
  heroContent: null as HTMLElement | null,
  heroVisual: null as HTMLElement | null,
  floatingShapes: [] as Element[],
  scrollIndicator: null as HTMLElement | null,
  heroTitle: null as Element | null,
  heroSubtitle: null as Element | null,
  heroLocation: null as Element | null,
  heroDescription: null as Element | null,
  heroButtons: null as Element | null,
  heroSocial: null as Element | null,
});

// Reactive typing function using Vue's reactivity
const typeRole = () => {
  if (!elements.typingText || !animationState.isTyping) return;

  if (typingState.isDeleting) {
    typingState.currentText = currentRole.value.substring(
      0,
      typingState.charIndex - 1,
    );
    typingState.charIndex--;
  } else {
    typingState.currentText = currentRole.value.substring(
      0,
      typingState.charIndex + 1,
    );
    typingState.charIndex++;
  }

  // Update DOM with reactive state
  elements.typingText.textContent = typingState.currentText;

  let speed = typeSpeed.value;

  if (
    !typingState.isDeleting &&
    typingState.charIndex === currentRole.value.length
  ) {
    speed = 2000;
    typingState.isDeleting = true;
  } else if (typingState.isDeleting && typingState.charIndex === 0) {
    typingState.isDeleting = false;
    typingState.roleIndex =
      (typingState.roleIndex + 1) % typingState.roles.length;
    speed = 500;
  }

  animationState.typingInterval = window.setTimeout(typeRole, speed);
};

// Reset typing state
const resetTypingState = () => {
  typingState.roleIndex = 0;
  typingState.charIndex = 0;
  typingState.isDeleting = false;
  typingState.currentText = "";
  if (elements.typingText) {
    elements.typingText.textContent = "";
  }
};

// Clear typing interval
const clearTypingInterval = () => {
  if (animationState.typingInterval) {
    clearTimeout(animationState.typingInterval);
    animationState.typingInterval = null;
  }
  animationState.isTyping = false;
};

// Start typing animation
const startTyping = () => {
  if (!elements.typingText) return;
  resetTypingState();
  animationState.isTyping = true;
  typeRole();
};

// Populate reactive element references from DOM
const populateElements = () => {
  const section = document.querySelector("section.hero-section");
  if (!section) {
    setTimeout(populateElements, 100);
    return;
  }

  heroSection.value = section as HTMLElement;

  // Populate all reactive element references
  elements.typingText = section.querySelector(".typing-text") as HTMLElement;
  elements.typingLines = Array.from(section.querySelectorAll(".typing-line"));
  elements.heroContent = section.querySelector(".hero-content") as HTMLElement;
  elements.heroVisual = section.querySelector(".hero-visual") as HTMLElement;
  elements.floatingShapes = Array.from(
    section.querySelectorAll(".floating-shape"),
  );
  elements.scrollIndicator = section.querySelector(
    ".scroll-indicator",
  ) as HTMLElement;
  elements.heroTitle = section.querySelector(".hero-content h1");
  elements.heroSubtitle = section.querySelector(".hero-content .hero-subtitle");
  elements.heroLocation = section.querySelector(".hero-content .hero-location");
  elements.heroDescription = section.querySelector(
    ".hero-content .hero-description",
  );
  elements.heroButtons = section.querySelector(".hero-content .hero-buttons");
  elements.heroSocial = section.querySelector(".hero-content .hero-social");

  animationState.elementsReady = true;
  initAnimations();
};

const initAnimations = () => {
  if (!animationState.elementsReady || !heroSection.value) return;

  // Clear any existing animations
  clearTypingInterval();

  // Animation function for hero content using reactive elements
  const animateHeroContent = () => {
    const contentElements = [
      elements.heroTitle,
      elements.heroSubtitle,
      elements.heroLocation,
      elements.heroDescription,
      elements.heroButtons,
      elements.heroSocial,
    ].filter((el) => el);

    contentElements.forEach((element, index) => {
      gsap.fromTo(
        element,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          delay: index * 0.15,
          ease: "power2.out",
        },
      );
    });
  };

  // Create GSAP timeline with ScrollTrigger using reactive state
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: heroSection.value,
      start: "top 80%",
      end: "bottom 20%",
      toggleActions: "play none none reverse",
      onEnter: () => {
        animationState.isAnimating = true;

        // Animate hero content
        animateHeroContent();

        // Start typing animation using reactive method
        startTyping();

        // Animate code editor lines using reactive elements
        elements.typingLines.forEach((line, index) => {
          gsap.to(line, {
            opacity: 1,
            x: 0,
            duration: 0.3,
            delay: index * 0.15,
            ease: "power2.out",
          });
        });

        // Animate hero visual using reactive elements
        if (elements.heroVisual) {
          gsap.fromTo(
            elements.heroVisual,
            { opacity: 0, scale: 0.9 },
            { opacity: 1, scale: 1, duration: 0.8, ease: "back.out(1.2)" },
          );
        }
      },
      onLeave: () => {
        // Clear typing animation when leaving using reactive method
        clearTypingInterval();
        animationState.isAnimating = false;
      },
      onEnterBack: () => {
        animationState.isAnimating = true;

        // Re-animate hero content
        animateHeroContent();

        // Restart typing animation using reactive method
        startTyping();

        // Re-animate code editor lines using reactive elements
        elements.typingLines.forEach((line, index) => {
          gsap.fromTo(
            line,
            { opacity: 0, x: -10 },
            {
              opacity: 1,
              x: 0,
              duration: 0.3,
              delay: index * 0.15,
              ease: "power2.out",
            },
          );
        });

        // Re-animate hero visual using reactive elements
        if (elements.heroVisual) {
          gsap.fromTo(
            elements.heroVisual,
            { opacity: 0, scale: 0.9 },
            { opacity: 1, scale: 1, duration: 0.8, ease: "back.out(1.2)" },
          );
        }
      },
      onLeaveBack: () => {
        // Clear typing animation when leaving backwards using reactive method
        clearTypingInterval();
        animationState.isAnimating = false;
      },
    },
  });

  // Animate floating shapes using reactive elements
  elements.floatingShapes.forEach((shape, index) => {
    gsap.to(shape, {
      scrollTrigger: {
        trigger: heroSection.value,
        start: "top 80%",
        toggleActions: "play none none reverse",
      },
      opacity: 1,
      scale: 1,
      duration: 1,
      delay: index * 0.1,
      ease: "power2.out",
    });
  });

  // Animate scroll indicator using reactive elements
  if (elements.scrollIndicator) {
    gsap.fromTo(
      elements.scrollIndicator,
      { opacity: 0, y: -20 },
      {
        scrollTrigger: {
          trigger: heroSection.value,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
        opacity: 1,
        y: 0,
        duration: 0.6,
        delay: 1.2,
        ease: "power2.out",
      },
    );
  }

  // Store the ScrollTrigger instance in reactive state
  if (tl.scrollTrigger) {
    animationState.scrollTriggerInstance = tl.scrollTrigger;
  }
};

// Watch for elements ready state
watch(
  () => animationState.elementsReady,
  (isReady) => {
    if (isReady) {
      console.log(
        "[HeroSectionAnimator] Elements populated and ready for animations",
      );
    }
  },
);

onMounted(() => {
  setTimeout(populateElements, 200);
});

onUnmounted(() => {
  // Clean up using reactive state
  clearTypingInterval();

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
  <div ref="root" class="hero-section-wrapper">
    <slot />
  </div>
</template>

<style scoped>
.hero-section-wrapper {
  display: contents;
}
</style>
