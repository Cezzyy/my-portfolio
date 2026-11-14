/**
 * Scroll-driven reveals shared by every section.
 *
 *   data-reveal           fade and rise once, when the element scrolls in
 *   data-reveal-delay     seconds to wait first (on a data-reveal element)
 *   data-rule             a line inside a data-reveal element that draws in from the left
 *   data-stagger          reveal the element's direct children one after another
 *   data-split            heading whose lines rise out of a mask
 *   data-scrub-words      paragraph whose words fill in as you scroll through it
 *   data-rise             element that slides up as it enters, tied to scroll (value = start yPercent)
 *   data-magnetic         element that leans toward the pointer (value = strength, default 0.3)
 */
import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';

const once = (trigger: Element, start = 'top 88%') => ({ trigger, start, once: true });

export function reveals() {
  gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
    const delay = Number(el.dataset.revealDelay ?? 0);
    gsap.from(el, { autoAlpha: 0, y: 28, duration: 0.9, ease: 'power3.out', delay, scrollTrigger: once(el) });

    const rule = el.querySelector('[data-rule]');
    if (rule) {
      gsap.from(rule, {
        scaleX: 0,
        transformOrigin: 'left center',
        duration: 0.9,
        ease: 'expo.out',
        delay: delay + 0.2,
        scrollTrigger: once(el),
      });
    }
  });

  gsap.utils.toArray<HTMLElement>('[data-stagger]').forEach((el) => {
    gsap.from(el.children, {
      autoAlpha: 0,
      y: 20,
      duration: 0.7,
      ease: 'power3.out',
      stagger: 0.07,
      scrollTrigger: once(el),
    });
  });

  gsap.utils.toArray<HTMLElement>('[data-split]').forEach((el) => {
    SplitText.create(el, {
      type: 'lines',
      mask: 'lines',
      linesClass: 'split-line',
      autoSplit: true,
      onSplit(self) {
        gsap.set(el, { visibility: 'visible' });
        return gsap.from(self.lines, {
          yPercent: 115,
          duration: 1.1,
          ease: 'expo.out',
          stagger: 0.09,
          scrollTrigger: once(el, 'top 90%'),
        });
      },
    });
  });

  gsap.utils.toArray<HTMLElement>('[data-scrub-words]').forEach((el) => {
    SplitText.create(el, {
      type: 'words',
      autoSplit: true,
      onSplit(self) {
        return gsap.fromTo(
          self.words,
          { opacity: 0.16 },
          {
            opacity: 1,
            ease: 'none',
            stagger: 0.1,
            scrollTrigger: { trigger: el, start: 'top 78%', end: 'bottom 50%', scrub: 0.5 },
          },
        );
      },
    });
  });

  // Tied to the enclosing section, whose bottom is always reachable (the element may not be).
  gsap.utils.toArray<HTMLElement>('[data-rise]').forEach((el) => {
    gsap.from(el, {
      yPercent: Number(el.dataset.rise) || 40,
      ease: 'none',
      scrollTrigger: { trigger: el.closest('section, footer') ?? el, start: 'top bottom', end: 'bottom bottom', scrub: true },
    });
  });
}

export function magnetic(signal: AbortSignal) {
  gsap.utils.toArray<HTMLElement>('[data-magnetic]').forEach((el) => {
    const strength = Number(el.dataset.magnetic) || 0.3;
    const xTo = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3.out' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3.out' });

    el.addEventListener(
      'pointermove',
      (e) => {
        const box = el.getBoundingClientRect();
        xTo((e.clientX - (box.left + box.width / 2)) * strength);
        yTo((e.clientY - (box.top + box.height / 2)) * strength);
      },
      { signal },
    );
    el.addEventListener(
      'pointerleave',
      () => {
        xTo(0);
        yTo(0);
      },
      { signal },
    );
  });
}
