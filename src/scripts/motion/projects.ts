/**
 * Project cards.
 *
 *   data-stack-card    sticky <li>; on wide screens each card settles back as the next slides over it
 *   data-stack-inner   the card itself (scaled, so the sticky <li> keeps its position)
 *   data-stack-shade   overlay that darkens a covered card
 *   data-mock          device mock; its data-mock-piece children build in when it scrolls into view
 */
import { gsap } from 'gsap';

export function projectStack() {
  const cards = gsap.utils.toArray<HTMLElement>('[data-stack-card]');

  cards.forEach((card, i) => {
    const next = cards[i + 1];
    if (!next) return;

    const scrollTrigger = {
      trigger: next,
      start: 'top bottom',
      // Done when the next card reaches its own sticky offset.
      end: () => `top ${parseFloat(getComputedStyle(next).top) || 0}px`,
      scrub: true,
    };
    gsap.to(card.querySelector('[data-stack-inner]'), {
      scale: 0.94,
      transformOrigin: '50% 0%',
      ease: 'none',
      scrollTrigger,
    });
    gsap.to(card.querySelector('[data-stack-shade]'), { opacity: 0.4, ease: 'none', scrollTrigger: { ...scrollTrigger } });
  });
}

export function projectMocks() {
  gsap.utils.toArray<HTMLElement>('[data-mock]').forEach((mock) => {
    const tl = gsap.timeline({ scrollTrigger: { trigger: mock, start: 'top 85%', once: true } });
    tl.from(mock, { y: 60, opacity: 0, duration: 1.1, ease: 'expo.out' }).from(
      mock.querySelectorAll('[data-mock-piece]'),
      { autoAlpha: 0, y: 14, scale: 0.92, duration: 0.6, ease: 'power3.out', stagger: 0.06 },
      0.25,
    );
  });
}
