import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export interface ScrollAnimationConfig {
  trigger?: string | HTMLElement;
  start?: string;
  end?: string;
  scrub?: boolean | number;
  markers?: boolean;
  toggleActions?: string;
}

export const fadeInUp = (element: string | HTMLElement, config?: ScrollAnimationConfig) => {
  return gsap.from(element, {
    y: 100,
    opacity: 0,
    duration: 1,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: config?.trigger || element,
      start: config?.start || 'top 80%',
      end: config?.end || 'bottom 20%',
      toggleActions: config?.toggleActions || 'play none none reverse',
      markers: config?.markers || false,
    },
  });
};

export const fadeInLeft = (element: string | HTMLElement, config?: ScrollAnimationConfig) => {
  return gsap.from(element, {
    x: -100,
    opacity: 0,
    duration: 1,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: config?.trigger || element,
      start: config?.start || 'top 80%',
      end: config?.end || 'bottom 20%',
      toggleActions: config?.toggleActions || 'play none none reverse',
      markers: config?.markers || false,
    },
  });
};

export const fadeInRight = (element: string | HTMLElement, config?: ScrollAnimationConfig) => {
  return gsap.from(element, {
    x: 100,
    opacity: 0,
    duration: 1,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: config?.trigger || element,
      start: config?.start || 'top 80%',
      end: config?.end || 'bottom 20%',
      toggleActions: config?.toggleActions || 'play none none reverse',
      markers: config?.markers || false,
    },
  });
};

export const scaleIn = (element: string | HTMLElement, config?: ScrollAnimationConfig) => {
  return gsap.from(element, {
    scale: 0.5,
    opacity: 0,
    duration: 1,
    ease: 'back.out(1.7)',
    scrollTrigger: {
      trigger: config?.trigger || element,
      start: config?.start || 'top 80%',
      end: config?.end || 'bottom 20%',
      toggleActions: config?.toggleActions || 'play none none reverse',
      markers: config?.markers || false,
    },
  });
};

export const staggerFadeIn = (elements: string | HTMLElement[], delay: number = 0.2, config?: ScrollAnimationConfig) => {
  return gsap.from(elements, {
    y: 50,
    opacity: 0,
    duration: 0.8,
    stagger: delay,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: config?.trigger || elements,
      start: config?.start || 'top 80%',
      end: config?.end || 'bottom 20%',
      toggleActions: config?.toggleActions || 'play none none reverse',
      markers: config?.markers || false,
    },
  });
};

export const parallax = (element: string | HTMLElement, speed: number = 0.5, config?: ScrollAnimationConfig) => {
  return gsap.to(element, {
    y: () => -(window.innerHeight * speed),
    ease: 'none',
    scrollTrigger: {
      trigger: config?.trigger || element,
      start: config?.start || 'top bottom',
      end: config?.end || 'bottom top',
      scrub: config?.scrub !== undefined ? config?.scrub : true,
      markers: config?.markers || false,
    },
  });
};

export { gsap, ScrollTrigger };
