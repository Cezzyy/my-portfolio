<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { fadeInUp, fadeInLeft, fadeInRight } from '../../../lib/gsap/scrollAnimations';

const root = ref<HTMLElement | null>(null);

onMounted(() => {
  // Wait for DOM to be fully ready and ensure elements exist
  const initAnimations = () => {
    const title = document.querySelector('.about-title');
    const underline = document.querySelector('.about-underline');
    const content = document.querySelector('.about-content');
    const profileImage = document.querySelector('.profile-image');

    if (title && underline && content && profileImage) {
      fadeInUp('.about-title');
      fadeInUp('.about-underline', { start: 'top 75%' });
      fadeInLeft('.about-content');
      fadeInRight('.profile-image');
    } else {
      // Retry if elements aren't ready yet
      console.warn('About section elements not ready, retrying...');
      setTimeout(initAnimations, 100);
    }
  };

  // Start after a small delay to ensure slot content is rendered
  setTimeout(initAnimations, 150);
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
